import mongoose from "mongoose";

const { Schema } = mongoose;

const departments = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    name: String,
    branch_code: Object,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("departments", departments);
