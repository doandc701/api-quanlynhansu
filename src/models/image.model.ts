import mongoose, { Schema } from "mongoose";

const images = new Schema(
  {
    origin_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    path: String,
    extension: String,
    filesize: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("images", images);
