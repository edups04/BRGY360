import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  date: { type: String, required: true },
  // file: { type: String, required: true },
  file: { type: String, default: "N/A" },
  barangayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barangay",
  },
});

export const Budget = mongoose.model("Budget", budgetSchema);
