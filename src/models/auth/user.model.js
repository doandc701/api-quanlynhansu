import mongoose from "mongoose";

const { Schema } = mongoose;

const User = new Schema(
  {
    code: { type: String },
    username: {
      type: String,
      trim: true,
      sparse: true,
    },
    first_name: { type: String },
    last_name: { type: String },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      sparse: true,
    },
    phone_number: { type: String },
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
    avatar_id: { type: String },
    role_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles",
      },
    ],
    access_token: { type: String },
    token_type: { type: String },
    expires_in: { type: Number },
  },
  {
    timestamps: true,
  }
);
export const ObjectUsers = mongoose.model("users", User);
