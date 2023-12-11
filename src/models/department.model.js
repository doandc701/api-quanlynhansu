import mongoose from "mongoose";

const { Schema } = mongoose;

const departments = new Schema(
  {
    code: String,
    name: String,
    branch_code: String,
    offices: Array,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("departments", departments);
