import mongoose from "mongoose";

const newsAnnouncementSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  date: { type: Date, required: true },
  contents: { type: String, required: true },
  image: { type: String, default: "N/A" },
  barangayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barangay",
  },
});

export const NewsAnnouncement = mongoose.model(
  "NewsAnnouncement",
  newsAnnouncementSchema
);
