const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },
    fileUrl: {
      type: String, // URL to the uploaded resume file if premade resume
    },
    education: {
      type: [
        {
          institution: String,
          degree: String,
          fieldOfStudy: String,
          startDate: Date,
          endDate: Date,
        },
      ],
    },
    experience: {
      type: [
        {
          jobTitle: String,
          companyName: String,
          startDate: Date,
          endDate: Date,
          description: String,
        },
      ],
    },
    skills: {
      type: [String],
    },
    certifications: {
      type: [
        {
          name: String,
          issuedBy: String,
          issueDate: Date,
        },
      ],
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", ResumeSchema);
module.exports = Resume;
