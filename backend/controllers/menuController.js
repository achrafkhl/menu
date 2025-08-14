import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const client = new MongoClient(process.env.URI);
await client.connect();
const db = client.db("testdb");

export const getMenu = async(req,res) => {
    const {slug} =req.query;
    if(!slug){
        console.log("you need to enter a slug first");
        res.status(404).json({error:"you need to enter a slug first"});
        return;
    }
    try{
        const user = await db.collection("users").findOne({slug:slug});
        if(!user){
            res.status(404).json({error:"no user found"});
        return;
        }
        const categories = await db.collection("categories").find({userId: user._id.toString()}).toArray();
        let dishes =[];
        if(categories.length===0){
            console.log("no category found");
        } else{
        dishes = await db.collection("dishes").find({userId: user._id.toString()}).toArray();
        if(dishes.length===0){
            console.log("no dish found")
        }}
        res.status(200).json({user,categories,dishes});
    } catch (error) {
        console.error("Error during fetching menu:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}