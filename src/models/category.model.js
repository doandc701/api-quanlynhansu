import mongoose, { Schema } from "mongoose";

const categories = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    image: String,
    alias: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("categories", categories);
