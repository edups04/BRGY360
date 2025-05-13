import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  date: { type: String, required: true },
  contents: { type: String, required: true },
  image: { type: String, required: true },
  barangayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barangay",
  },
});

export const Project = mongoose.model("Project", projectSchema);
