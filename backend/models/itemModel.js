import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["lost", "found"],
      required: [true, "Item type must be specified"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["electronics", "accessories", "documents", "others"],
      required: [true, "Category must be specified"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [String], // Changed to simple array of strings for image URLs
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Item must belong to a user"],
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
