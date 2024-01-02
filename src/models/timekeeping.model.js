import mongoose, { Schema } from "mongoose";

const timekeepings = new Schema(
  {
    year: String,
    employees: [
      {
        employee: Object,
        start_time: String,
        end_time: String,
        date_timekeeping: String,
        workday: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("timekeepings", timekeepings);
