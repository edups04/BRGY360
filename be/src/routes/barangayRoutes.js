import express from "express";

import {
  createBarangay,
  getBarangay,
  geBarangays,
  updateBarangay,
  deleteBarangay,
} from "../controllers/barangayController.js";

let barangayRoutes = express.Router();

barangayRoutes.get("/", geBarangays);
barangayRoutes.get("/:id", getBarangay);
barangayRoutes.post("/", createBarangay);
barangayRoutes.put("/:id", updateBarangay);
barangayRoutes.delete("/:id", deleteBarangay);

export { barangayRoutes };
