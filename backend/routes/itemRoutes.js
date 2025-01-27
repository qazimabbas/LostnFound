import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  getUserItems,
  deleteItem,
} from "../controllers/itemController.js";

const router = express.Router();

router.post("/list", protect, createItem);
router.post("/all-items", protect, getAllItems);
router.get("/item/:id", protect, getItem);
router.put("/update-item/:id", protect, updateItem);
router.get("/my-items", protect, getUserItems);
router.delete("/delete-item/:id", protect, deleteItem);

export default router;
