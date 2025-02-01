const mongoose = require("mongoose");

const JobSeekerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // fullName: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const JobSeeker = mongoose.model("JobSeeker", JobSeekerSchema);
module.exports = JobSeeker;
