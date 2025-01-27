import Response from "../models/responseModel.js";
import Item from "../models/itemModel.js";

// Create a new response
export const createResponse = async (req, res) => {
  try {
    const { itemId, message } = req.body;
    const senderId = req.user._id;

    // Find the item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if user already submitted a response for this item
    const existingResponse = await Response.findOne({
      item: itemId,
      sender: senderId,
      deleted_by_sender: false, // Only check non-deleted responses
    });

    if (existingResponse) {
      if (existingResponse.status === "rejected") {
        return res.status(400).json({
          message:
            "You have a rejected response for this item. Please delete it before submitting a new one.",
          existingResponseId: existingResponse._id,
        });
      }
      return res.status(400).json({
        message: "You already have an active response for this item",
      });
    }

    const response = await Response.create({
      item: itemId,
      sender: senderId,
      receiver: item.user,
      message,
    });

    await response.populate([
      {
        path: "sender",
        select: "name email phoneNo profilePic ",
      },
      { path: "item", select: "title images type" },
    ]);

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get responses sent by user
export const getSentResponses = async (req, res) => {
  try {
    const responses = await Response.find({
      sender: req.user._id,
      deleted_by_sender: false,
    })
      .populate("item", "title images type")
      .populate({
        path: "receiver",
        select: "name email phoneNo profilePic",
      })
      .sort("-createdAt");

    res.json({
      success: true,
      data: responses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get responses received on user's found items (claims)
export const getReceivedClaims = async (req, res) => {
  try {
    const foundItems = await Item.find({
      user: req.user._id,
      type: "found",
    });

    const claims = await Response.find({
      item: { $in: foundItems.map((item) => item._id) },
      deleted_by_receiver: false,
    })
      .populate("item", "title images type")
      .populate({
        path: "sender",
        select: "name email phoneNo profilePic ",
      })
      .sort("-createdAt");

    res.json({
      success: true,
      data: claims,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get responses received on user's lost items
export const getReceivedResponses = async (req, res) => {
  try {
    const lostItems = await Item.find({
      user: req.user._id,
      type: "lost",
    });

    const responses = await Response.find({
      item: { $in: lostItems.map((item) => item._id) },
      deleted_by_receiver: false,
    })
      .populate("item", "title images type")
      .populate({
        path: "sender",
        select: "name email phoneNo profilePic",
      })
      .sort("-createdAt");

    res.json({
      success: true,
      data: responses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update response status
export const updateResponseStatus = async (req, res) => {
  try {
    const { responseId } = req.params;
    const { status } = req.body;

    const response = await Response.findById(responseId);

    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    // Check if user is the receiver of the response
    if (response.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update status without deleting
    response.status = status;
    await response.save();

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this new controller function
export const deleteResponse = async (req, res) => {
  try {
    const { responseId } = req.params;
    const userId = req.user._id;

    const response = await Response.findById(responseId);

    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    // Check if user is sender or receiver
    const isSender = response.sender.toString() === userId.toString();
    const isReceiver = response.receiver.toString() === userId.toString();

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update the appropriate deleted_by field
    const updateField = isSender ? "deleted_by_sender" : "deleted_by_receiver";

    await Response.findByIdAndUpdate(responseId, {
      [updateField]: true,
    });

    // Only delete from database if both parties have deleted
    const updatedResponse = await Response.findById(responseId);
    if (
      updatedResponse.deleted_by_sender &&
      updatedResponse.deleted_by_receiver
    ) {
      await Response.findByIdAndDelete(responseId);
    }

    res.json({
      success: true,
      message: "Response deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
