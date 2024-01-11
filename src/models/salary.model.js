import mongoose, { Schema } from "mongoose";

const salary = new Schema(
  {
    year: String,
    employees: [
      {
        employee: Object,
        standard_working_day: Number,
        actual_workday: Number,
        official_paid_working: Number,
        deducted_from_salary: {
          social_insurance: Number,
          health_insurance: Number,
          voluntary_insurance: Number,
          personal_income_tax: Number,
          total: Number,
        },
        month: Number,
        salary_received: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("salary", salary);
