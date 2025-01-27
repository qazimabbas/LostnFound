import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createResponse,
  getSentResponses,
  getReceivedResponses,
  getReceivedClaims,
  updateResponseStatus,
  deleteResponse,
} from "../controllers/responseController.js";

const router = express.Router();

router.post("/", protect, createResponse);
router.get("/sent", protect, getSentResponses);
router.get("/received", protect, getReceivedResponses);
router.get("/claims", protect, getReceivedClaims);
router.patch("/:responseId/status", protect, updateResponseStatus);
router.delete("/:responseId", protect, deleteResponse);

export default router;
