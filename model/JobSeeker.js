const mongoose = require("mongoose");

const JobSeekerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

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

// JobSeekerSchema.pre("save", function (next) {
//   if (this.isModified("skills")) {
//     this.skills = this.skills
//       .flatMap((skill) =>
//         typeof skill === "string"
//           ? skill.split(",").map((s) => s.trim())
//           : skill
//       )
//       .filter((skill) => skill)
//       .map((skill) => skill.toLowerCase());
//   }
//   next();
// });
// Add to your JobSeekerSchema

JobSeekerSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobSeekerId",
});

JobSeekerSchema.virtual("bookmarks", {
  ref: "Bookmark",
  localField: "_id",
  foreignField: "jobSeekerId",
});

// Enable virtuals in queries
JobSeekerSchema.set("toObject", { virtuals: true });
JobSeekerSchema.set("toJSON", { virtuals: true });

const JobSeeker = mongoose.model("JobSeeker", JobSeekerSchema);
module.exports = JobSeeker;
