import express from "express";
import multer from "multer";

import {
  registerUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  loginUser,
} from "../controllers/userController.js";

let userRoutes = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

userRoutes.post("/login/", loginUser);
userRoutes.post(
  "/",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
    { name: "profile", maxCount: 1 },
  ]),
  registerUser
);
userRoutes.get("/:id", getUser);
userRoutes.get("/", getUsers);
userRoutes.put(
  "/:id",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
    { name: "profile", maxCount: 1 },
  ]),
  updateUser
);
userRoutes.delete("/:id", deleteUser);

export { userRoutes };
