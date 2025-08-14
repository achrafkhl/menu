import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import pageRoutes from "./routes/pagesRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";
import menuRoute from "./routes/menuRoute.js"; 

dotenv.config();
const app = express();
app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // your React app's URL
  credentials: true 
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", authRoutes);
app.use("/api/main",authMiddleware, pageRoutes);
app.use("/api", menuRoute);

app.get("/", (req, res) => res.send("Welcome to the backend server!"));

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
