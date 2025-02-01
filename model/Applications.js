const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Shortlisted", "Rejected", "Accepted"], // Status of the application
      default: "Pending",
    },
    message: {
      type: String, // Optional message from the applicant
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;
