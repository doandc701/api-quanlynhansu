import mongoose from "mongoose";

const { Schema } = mongoose;

const User = new Schema(
  {
    code: String,
    username: String,
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    password: String,
    phone_number: String,
    branch_code: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branchs",
      },
    ],
    department_code: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments",
      },
    ],
    postition_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "positions",
      },
    ],
    avatar_id: String,
    role_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const ObjectUsers = mongoose.model("users", User);
