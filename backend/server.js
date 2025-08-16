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
  origin: ['http://localhost:5173', // your React app's URL
  'http://192.168.1.5:5173'],
  credentials: true 
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  // Remove IPv6 prefix if present
  const ip = req.ip.replace("::ffff:", "");

  // Allow localhost and LAN
  if (
    ip === "127.0.0.1" || // localhost
    ip === "::1" ||       // IPv6 localhost
    ip.startsWith("192.168.") // LAN range
  ) {
    next();
  } else {
    res.status(403).send("Access Denied");
  }
});




// Routes
app.use("/api", authRoutes);
app.use("/api/main", authMiddleware, pageRoutes);
app.use("/api", menuRoute);
app.get("/api/auth/validate", authMiddleware, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user, // comes from JWT payload
  });
});


app.get("/", (req, res) => res.send("Welcome to the backend server!"));

app.listen(5000, "0.0.0.0", () => {
  console.log("Server is running on http://192.168.1.5:5000");
});
