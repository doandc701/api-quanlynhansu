import mongoose from "mongoose";

export const connectMongoose = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Authentication");
    console.log("Connect successfully!");
  } catch (err) {
    console.log("Connect failed!", err);
  }
};
