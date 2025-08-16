import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { signup, login, getInfo,logOut} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};
const upload = multer({ storage, fileFilter });

// Routes
router.post("/signup", upload.single("avatar"), signup);
router.post("/login", login);
router.get("/main", authMiddleware, (req, res) => {
  res.json({ user: `${req.user.id}` });
});
router.get("/main/get",authMiddleware, getInfo);
router.post("/auth/logout",logOut);

export default router;
