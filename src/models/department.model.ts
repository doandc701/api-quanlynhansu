import mongoose from "mongoose";

const { Schema } = mongoose;

const departments = new Schema(
  {
    code: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branchs",
      },
    ],
    name: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("departments", departments);
