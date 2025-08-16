import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import fs from 'fs';
import path from "path";

dotenv.config();
const client = new MongoClient(process.env.URI);
await client.connect();
const db = client.db("testdb");

export const createCat = async (req, res) => {
    const { userId, name } = req.body;

    if (!userId || !name) {
        return res.status(400).json({ error: "UserId and name are required" });
    }

    try {
        const category = {
            userId,
            name,
            avatar: req.file ? `/uploads/${req.file.filename}` : null,
        };

        const result = await db.collection("categories").insertOne(category);

        category._id = result.insertedId;

        res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.error("Error during creating category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const getCat = async (req, res) => {
    const {userId} =req.query;
    if(!userId){
        console.log("you need to enter a userId first");
        res.status(404).json({error:"you need to enter a userId first"});
        return;
    }
  try {
    const categories = await db.collection("categories").find({userId}).toArray();

    res.status(200).json({ categories, message: categories.length ? "categories fetched successfully" : "No categories found" });
  } catch (error) {
    console.error("Error during getting category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteCat = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: "Category id is required" });
    }

    try {
        // 1️⃣ Find the category
        const category = await db.collection("categories").findOne({ _id: new ObjectId(String(id)) });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        // 2️⃣ Find all dishes linked to this category
        const dishes = await db.collection("dishes").find({ categoryId: id }).toArray();

        // 3️⃣ Delete each dish’s image
        for (const dish of dishes) {
            if (dish.avatar) {
                const dishImgPath = path.join(process.cwd(), "uploads", path.basename(dish.avatar));
                fs.unlink(dishImgPath, (err) => {
                    if (err) console.error("Error deleting dish image:", err);
                    else console.log("Deleted dish image:", dishImgPath);
                });
            }
        }

        // 4️⃣ Delete all dishes from DB
        await db.collection("dishes").deleteMany({ categoryId: id });

        // 5️⃣ Delete category’s image
        if (category.avatar) {
            const catImgPath = path.join(process.cwd(), "uploads", path.basename(category.avatar));
            fs.unlink(catImgPath, (err) => {
                if (err) console.error("Error deleting category image:", err);
                else console.log("Deleted category image:", catImgPath);
            });
        }

        // 6️⃣ Delete the category itself
        const result = await db.collection("categories").deleteOne({ _id: new ObjectId(String(id)) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json({ message: "Category and related dishes deleted successfully" });

    } catch (error) {
        console.error("Error during deleting category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
