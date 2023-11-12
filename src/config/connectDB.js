import mongoose from "mongoose";
import "dotenv/config";

export const connectMongoose = async () => {
  try {
    await mongoose.connect(process.env.URL_CONNECT_MONGODB);
    console.log("Connect successfully!");
  } catch (err) {
    console.log("Connect failed!", err);
  }
};

export const cleanup = () => {
  mongoose.connection.close();
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("SIGHUP", cleanup);
