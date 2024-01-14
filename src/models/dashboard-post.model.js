import mongoose, { Schema } from "mongoose";

const dashboardPost = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    body: String,
    created_by: Object,
    created_at: String,
    comment: [
      {
        user: Object,
        created_at: String,
        comment: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("dashboardPost", dashboardPost);
