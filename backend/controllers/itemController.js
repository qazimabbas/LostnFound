import Item from "../models/itemModel.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// Create a new item listing
export const createItem = async (req, res) => {
  try {
    const { type, title, category, location, description, images } = req.body;

    // Handle base64 image uploads if any
    let imageUrls = [];
    if (images && images.length > 0) {
      // Upload each base64 image to cloudinary
      const uploadPromises = images.map((base64String) =>
        uploadToCloudinary(base64String)
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    // Create new item
    const item = await Item.create({
      type,
      title,
      category,
      location,
      description,
      images: imageUrls,
      user: req.user._id, // From auth middleware
    });

    res.status(201).json({
      status: "success",
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get all items with filtering
export const getAllItems = async (req, res) => {
  try {
    const { type, category, search, dateRange, location } = req.body;
    const filter = {};

    // Add type filter if provided
    if (type) filter.type = type;

    // Add category filter if provided and not "all"
    if (category && category !== "all") filter.category = category;

    // Add location filter if provided
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Add date range filter
    if (dateRange) {
      const now = new Date();
      let dateFilter;

      switch (dateRange) {
        case "today":
          dateFilter = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          dateFilter = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          dateFilter = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          dateFilter = null;
      }

      if (dateFilter) {
        filter.createdAt = { $gte: dateFilter };
      }
    }

    // Add search filter if provided
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const items = await Item.find(filter)
      .populate("user", "name email")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: items.length,
      data: {
        items,
      },
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get a single item
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "user",
      "name profilePic createdAt"
    );

    if (!item) {
      return res.status(404).json({
        status: "error",
        message: "No item found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, category, location, description, images } = req.body;

    // Find the item and check ownership
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Verify the user owns this item
    if (item.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this item" });
    }

    // Handle image uploads if any
    let imageUrls = item.images; // Keep existing images by default
    if (images && images.length > 0) {
      try {
        // Delete existing images from Cloudinary
        const deletePromises = item.images.map(async (imageUrl) => {
          // Extract public_id from the Cloudinary URL
          const urlParts = imageUrl.split("/");
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split(".")[0];

          // If the image is in a folder, include the folder path in the public_id
          const folderPath = urlParts[urlParts.length - 2];
          const fullPublicId =
            folderPath === "upload" ? publicId : `${folderPath}/${publicId}`;

          return deleteFromCloudinary(fullPublicId);
        });
        await Promise.all(deletePromises);

        // Upload new images to Cloudinary
        const uploadPromises = images.map((base64String) =>
          uploadToCloudinary(base64String)
        );
        imageUrls = await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Error handling images:", error);
        return res.status(500).json({
          message: "Error handling image uploads",
          error: error.message,
        });
      }
    }

    // Update the item
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      {
        type,
        title,
        category,
        location,
        description,
        images: imageUrls,
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate("user", "name email");

    res.status(200).json({
      status: "success",
      data: {
        item: updatedItem,
      },
    });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get items by user ID
export const getUserItems = async (req, res) => {
  try {
    const userId = req.user._id; // Get logged in user's ID from auth middleware

    const items = await Item.find({ user: userId })
      .populate("user", "name email")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: items.length,
      data: {
        items,
      },
    });
  } catch (error) {
    console.error("Error fetching user items:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Delete an item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the item and check ownership
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        status: "error",
        message: "Item not found",
      });
    }

    // Verify the user owns this item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this item",
      });
    }

    // Delete images from Cloudinary if they exist
    if (item.images && item.images.length > 0) {
      try {
        const deletePromises = item.images.map(async (imageUrl) => {
          // Extract public_id from the Cloudinary URL
          // Example URL: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/folder/public_id.jpg
          const urlParts = imageUrl.split("/");
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split(".")[0];

          // If the image is in a folder, include the folder path in the public_id
          const folderPath = urlParts[urlParts.length - 2];
          const fullPublicId =
            folderPath === "upload" ? publicId : `${folderPath}/${publicId}`;

          return deleteFromCloudinary(fullPublicId);
        });
        await Promise.all(deletePromises);
      } catch (error) {
        console.error("Error deleting images from Cloudinary:", error);
        // Continue with item deletion even if image deletion fails
      }
    }

    // Delete the item from database
    await Item.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export default {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  getUserItems,
  deleteItem,
};
