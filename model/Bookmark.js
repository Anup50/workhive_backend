const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema(
  {
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    bookmarkedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Bookmark = mongoose.model("Bookmark", BookmarkSchema);
module.exports = Bookmark;
