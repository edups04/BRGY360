import express from "express";

import {
  createFileRequest,
  getFileRequest,
  getFileRequests,
  updateFileRequest,
  deleteFileRequest,
} from "../controllers/fileRequestControllers.js";

let fileRequestRoutes = express.Router();

fileRequestRoutes.get("/", getFileRequests);
fileRequestRoutes.get("/:id", getFileRequest);
fileRequestRoutes.post("/", createFileRequest);
fileRequestRoutes.put("/:id", updateFileRequest);
fileRequestRoutes.delete("/:id", deleteFileRequest);

export { fileRequestRoutes };
