import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MongoClient,ObjectId } from "mongodb";
import { sendMail } from "../config/nodemail.js";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.URI);
await client.connect();
const db = client.db("testdb");

// Signup controller
export const signup = async (req, res) => {
  const { username, password, email, slug, phone } = req.body;
  if (!username || !password || !email || !slug || !phone) {
    return res.status(400).json({ error: "required all the inputs" });
  }
  try {
    const checkEmail = await db.collection("users").findOne({email});
    const checkPhone = await db.collection("users").findOne({phone});
    if(checkEmail) return res.status(409).json({ error: "Email found" });
    if(checkPhone) return res.status(409).json({ error: "Phone found" });


    const hashedPassword = bcrypt.hashSync(password, 10);
    await db.collection("users").insertOne({
      username,
      password: hashedPassword,
      email,
      slug,
      phone,
      avatar: req.file ? `/uploads/${req.file.filename}` : null,
      verified:false,
    });
    console.log(`User ${username} signed up successfully`);
    const token = jwt.sign({email} , process.env.JWT_SECRET, { expiresIn: "1h" });
    const verificationLink = `http://192.168.1.5:5000/api/auth/verify?token=${token}`;
    await sendMail(
    email,
    "Verify your account",
    `<h2>Confirm your signup</h2><p>Follow this link to confirm your user:</p><p><a href=${verificationLink}>Confirm your mail</a></p>`
  );
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
    if(user.verified===false){
      return res.status(401).json({error: "User not verified"})
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
  if(!userId) return res.status(400).json({ error: "UserId required" });
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

export const logOut = async(req,res) => {
  const id = req.user.id;
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/"
  });
  console.log(id,`Logged out successfully`)
  res.json({ message: `Logged out successfully` });
}

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Update user to verified = true
    await db.collection("users").updateOne(
      { email: decoded.email },
      { $set: { verified: true } }
    );

    // Redirect to frontend success page
    res.redirect("http://192.168.1.5:5173/verified");
  } catch (err) {
    console.error("Error verifying token:", err);
    res.redirect("http://192.168.1.5:5173/verify-failed");
  }
};

export const deleteUser = async(req,res)=>{
    const {id} = req.body;
    if(!id) return res.status(400).json({error: "id not found"})
    try{
      const result = await db.collection("users").deleteOne({ _id: new ObjectId( String(id)) });
    if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Dish not found" });
        }

        res.status(200).json({ message: "Dish deleted successfully" });

    } catch (error) {
        console.error("Error during deleting dish:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}