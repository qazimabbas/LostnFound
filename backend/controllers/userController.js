import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/helpers/generateToken.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, username, email, password, phoneNo } = req.body;

    // Check if user already exists with email or username
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (userExists.username === username) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      phoneNo,
    });

    if (newUser) {
      // Generate JWT token
      generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        phoneNo: newUser.phoneNo,
        profilePic: newUser.profilePic,
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Something went wrong during signup" });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    generateToken(user._id, res);

    // If login successful, send user data
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phoneNo: user.phoneNo,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong during login" });
  }
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Update user profile
// @route   PUT /api/users/update
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, username, email, phoneNo, password } = req.body;
    const profilePic = req.body.profilePic; // Base64 string

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if username or email is being changed and if it's already taken
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already registered" });
      }
      user.email = email;
    }

    // Update basic fields if provided
    if (name) user.name = name;
    if (phoneNo) user.phoneNo = phoneNo;

    // Handle profile picture upload
    if (profilePic) {
      try {
        // Check if the profilePic is a valid base64 string
        if (!profilePic.startsWith("data:image")) {
          return res.status(400).json({
            message:
              "Invalid image format. Please provide a valid base64 image string",
          });
        }

        // Delete old profile picture from Cloudinary if it exists
        if (user.profilePic) {
          try {
            const urlParts = user.profilePic.split("/");
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = publicIdWithExtension.split(".")[0];

            // If the image is in a folder, include the folder path in the public_id
            const folderPath = urlParts[urlParts.length - 2];
            const fullPublicId =
              folderPath === "upload" ? publicId : `${folderPath}/${publicId}`;

            await deleteFromCloudinary(fullPublicId);
          } catch (deleteError) {
            console.error("Error deleting old profile picture:", deleteError);
            // Continue with upload even if deletion fails
          }
        }

        // Upload new profile picture to the "profile_pics" folder
        const uploadedUrl = await uploadToCloudinary(
          profilePic,
          "profile_pics"
        );
        user.profilePic = uploadedUrl;
      } catch (uploadError) {
        console.error("Profile pic upload error:", uploadError);
        return res.status(400).json({
          message: "Error uploading profile picture. Please try again.",
        });
      }
    }

    // Handle password update
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters long",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      phoneNo: updatedUser.phoneNo,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};
