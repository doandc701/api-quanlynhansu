import mongoose from "mongoose";

const { Schema } = mongoose;

const User = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
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
      trim: true,
      sparse: true,
    },
    phone_number: { type: String },
    hard_salary: Number,
    branch_code: Object,
    department_code: Object,
    position_id: Number,
    avatar_id: { type: String },
    avatar_path: { type: String },
    role_id: Number,
    access_token: { type: String },
    token_type: { type: String },
    expires_in: { type: Number },
    timezone: String,
  },
  {
    timestamps: true,
  }
);

User.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const ObjectUsers = mongoose.model("users", User);
