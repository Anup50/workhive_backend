// const mongoose = require("mongoose");

// const JobSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   employer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Employer", // Reference to the Employer collection
//     required: true,
//   },
//   location: {
//     type: String,
//     required: true,
//   },
//   salary: {
//     type: Number,
//     required: true,
//   },
//   jobType: {
//     type: String,
//     enum: ["Full-time", "Part-time", "Contract", "Freelance"],
//     required: true,
//   },
//   experienceLevel: {
//     type: String,
//     enum: ["Entry", "Mid", "Senior"],
//     required: true,
//   },
//   datePosted: {
//     type: Date,
//     default: Date.now,
//   },
//   deadline: {
//     type: Date,
//   },
//   skillsRequired: {
//     type: [String],
//     required: true,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
// });

// const Job = mongoose.model("Job", JobSchema);

const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    summary: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one responsibility is required",
      },
    },
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Freelance"],
    required: true,
  },
  experienceLevel: {
    type: String,
    enum: ["Entry", "Mid", "Senior"],
    required: true,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
  },
  skillsRequired: {
    type: [String],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

JobSchema.pre("save", function (next) {
  if (typeof this.description === "string") {
    this.description = {
      summary: this.description,
      responsibilities: [],
    };
  }
  next();
});

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
