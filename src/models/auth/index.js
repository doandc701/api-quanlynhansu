import mongoose from "mongoose";
import { ObjectUsers } from "./user.model.js";
import { ObjectRole } from "./role.model.js";
mongoose.Promise = global.Promise;

export const ObjectDatabase = {
  user: ObjectUsers,
  role: ObjectRole,
  mongoose,
};
