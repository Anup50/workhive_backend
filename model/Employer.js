const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: { type: String, required: true },
    companyWebsite: { type: String },
    companyDescription: { type: String },
    companyLogo: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);
const Employer = mongoose.model("Employer", employerSchema);
module.exports = Employer;
