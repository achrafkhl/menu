import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import fs from 'fs';
import path from "path";

dotenv.config();
const client = new MongoClient(process.env.URI);
await client.connect();
const db = client.db("testdb");

export const createDish = async (req, res) => {
    const { userId, name, categoryId, price } = req.body;

    if (!userId || !name) {
        return res.status(400).json({ error: "UserId and name are required" });
    }

    try {
        const dish = {
            userId,
            name,
            categoryId,
            price,
            avatar: req.file ? `/uploads/${req.file.filename}` : null,
        };

        const result = await db.collection("dishes").insertOne(dish);

        // Add the generated _id to the returned object
        dish._id = result.insertedId;

        res.status(201).json({
            message: "Dish created successfully",
            dish
        });
    } catch (error) {
        console.error("Error during creating dish:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getDish = async (req, res) => {
    const { categoryId } = req.query;
    try {
        const dishes = await db.collection("dishes").find({ categoryId:categoryId }).toArray();

        res.status(200).json({ dishes ,message: dishes.length ? "Dishes fetched successfully" : "No dishes found" });
    } catch (error) {
        console.error("Error during getting dish:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteDish = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: "Dish id is required" });
    }

    try {
        // 1️⃣ Find the dish first
        const dish = await db.collection("dishes").findOne({ _id: new ObjectId( String(id)) });
        if (!dish) {
            return res.status(404).json({ message: "Dish not found" });
        }

        // 2️⃣ If there’s an avatar, delete it from uploads folder
        if (dish.avatar) {
            const filePath = path.join(process.cwd(), "uploads", path.basename(dish.avatar));
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting image:", err);
                } else {
                    console.log("Image deleted:", filePath);
                }
            });
        }

        // 3️⃣ Delete the dish from DB
        const result = await db.collection("dishes").deleteOne({ _id: new ObjectId( String(id)) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Dish not found" });
        }

        res.status(200).json({ message: "Dish deleted successfully" });

    } catch (error) {
        console.error("Error during deleting dish:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateDish = async (req, res) => {
  const { id, price } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Dish id is required" });
  }

  try {
    const result = await db.collection("dishes").updateOne(
      { _id: new ObjectId(String(id)) }, // ✅ ensure it's a string
      { $set: { price } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.status(200).json({ message: "Dish updated successfully" });
  } catch (error) {
    console.error("Error during updating dish:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
