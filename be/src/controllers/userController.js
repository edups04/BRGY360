import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// * register new user
const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const files = req.files || {};
    const front = files["front"]?.[0]?.filename || "N/A";
    const back = files["back"]?.[0]?.filename || "N/A";
    const profile = files["profile"]?.[0]?.filename || "N/A";

    const user = new User({
      ...req.body,
      password: hashedPassword,
      validId: {
        ...req.body.validId,
        front,
        back,
      },
      profile: profile,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// * Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    res.json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// * Get User by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User retrieved", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// * Get All Users
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      status,
      sex,
      barangayId,
      search,
    } = req.query;

    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (sex) filter.sex = sex;
    if (barangayId) filter.barangayId = barangayId;

    // * name search
    if (search) {
      const searchRegex = new RegExp(search, "i"); // * case-insensitive regex
      filter.$or = [{ firstName: searchRegex }, { lastName: searchRegex }];
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limitNumber);

    const totalUsers = await User.countDocuments(filter);

    res.json({
      success: true,
      message: "Users retrieved",
      data: users,
      meta: {
        total: totalUsers,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalUsers / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// * Update User
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // * multiple image uploads
    const fileFields = ["profile", "front", "back"];
    for (const field of fileFields) {
      const file = req.files?.[field]?.[0];

      if (file) {
        // * new file uploaded
        if (field === "profile") {
          // * delete old profile image
          if (existingUser.profile && existingUser.profile !== "N/A") {
            const oldPath = path.join("public/images", existingUser.profile);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }
          updates.profile = file.filename;
        } else {
          // * front or back (nested in validId)
          const oldFile = existingUser.validId?.[field];
          if (oldFile && oldFile !== "N/A") {
            const oldPath = path.join("public/images", oldFile);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }

          if (!updates.validId) updates.validId = {};
          updates.validId[field] = file.filename;
        }
      } else if (!req.body[field] || req.body[field] === "N/A") {
        // * no file uploaded and client wants to remove the image
        if (
          field === "profile" &&
          existingUser.profile &&
          existingUser.profile !== "N/A"
        ) {
          const oldPath = path.join("public/images", existingUser.profile);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          updates.profile = "N/A";
        } else if (
          (field === "front" || field === "back") &&
          existingUser.validId?.[field] &&
          existingUser.validId[field] !== "N/A"
        ) {
          const oldPath = path.join(
            "public/images",
            existingUser.validId[field]
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          if (!updates.validId) updates.validId = {};
          updates.validId[field] = "N/A";
        }
      }
    }

    if (req.body.validId?.type) {
      if (!updates.validId) updates.validId = {};
      updates.validId.type = req.body.validId.type;
    }

    console.log("UPDATES", updates);

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// * Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // * utility function to delete a file if it exists
    const deleteFile = (filename) => {
      if (filename && filename !== "N/A") {
        const filePath = path.join("public/images", filename);
        if (fs.existsSync(filePath)) {
          // * check if file exists
          fs.unlinkSync(filePath);
          console.log(`Deleted: ${filename}`);
        } else {
          console.log(`File not found: ${filename}`);
        }
      }
    };

    // * Delete associated files
    deleteFile(user.profile);
    deleteFile(user.validId?.front);
    deleteFile(user.validId?.back);

    res.json({
      success: true,
      message: "User and associated files deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export { loginUser, registerUser, updateUser, deleteUser, getUser, getUsers };
