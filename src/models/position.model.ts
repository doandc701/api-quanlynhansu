import mongoose, { Schema } from "mongoose";

const positions = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    name: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("positions", positions);
