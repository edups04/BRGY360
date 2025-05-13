import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import dotenv from "dotenv";

dotenv.config();
const URL = process.env.MONGODB;
const connection = mongoose.createConnection(URL);
const AutoIncrement = AutoIncrementFactory(connection);

const fileRequestSchema = new mongoose.Schema({
  requestNumber: { type: Number },
  requestedDocumentType: { type: String, required: true },
  file: { type: String, required: true },
  status: { type: String, required: true },
  dateRequested: { type: Date, required: true },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  data: {},
});

fileRequestSchema.plugin(AutoIncrement, { inc_field: "requestNumber" });

export const FileRequest = mongoose.model("FileRequest", fileRequestSchema);
