import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { createCat,getCat,deleteCat} from "../controllers/categoryController.js";
import { createDish,getDish,updateDish,deleteDish } from "../controllers/dishController.js";
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

router.post("/categories",upload.single("avatar"), createCat);
router.get("/categories", getCat);
router.delete("/categories", deleteCat);

router.post("/dishes",upload.single("avatar"), createDish);
router.get("/dishes", getDish);
router.delete("/dishes", deleteDish);
router.put("/dishes", updateDish);

export default router;
