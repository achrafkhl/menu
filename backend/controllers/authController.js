import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MongoClient,ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.URI);
await client.connect();
const db = client.db("testdb");

// Signup controller
export const signup = async (req, res) => {
  const { username, password, email, slug, phone } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    await db.collection("users").insertOne({
      username,
      password: hashedPassword,
      email,
      slug,
      phone,
      avatar: req.file ? `/uploads/${req.file.filename}` : null,
    });
    console.log(`User ${username} signed up successfully`);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login controller
export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  try {
    let user;
    if (!isNaN(username)) {
      user = await db.collection("users").findOne({ phone: username });
    } else {
      user = await db.collection("users").findOne({ email: username });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const id=user._id
    const token = jwt.sign({ id }, process.env.JWT_SECRET);

    console.log(`User ${username} logged in successfully`);
    res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000
});

    res.json({ message: 'Login successful' });
    
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getInfo = async (req, res) => {
  const {userId} = req.query;
  try{
    const user = await db.collection("users").findOne({_id: new ObjectId(String(userId))});
    if(!user){
      res.status(404).json({error:"no user found"})
    }
    res.status(200).json({user})
  } catch (error) {
    console.error("Error during fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}