const Job = require("../model/Job");
const Employer = require("../model/Employer");
const JobSeeker = require("../model/JobSeeker");
const mongoose = require("mongoose");
const { getFullImageUrl } = require("../middleware/ImageUtils");

class JobService {
  static async createJob(jobData) {
    const employerExists = await Employer.findById(jobData.employer);
    if (!employerExists) {
      throw new Error("Invalid employer ID. Employer does not exist.");
    }
    const job = new Job(jobData);
    return await job.save();
  }

  static async getAllJobs(filters = {}) {
    const jobs = await Job.find(filters).populate(
      "employer",
      "companyName companyLogo location"
    );
    return jobs.map((job) => {
      if (job.employer && job.employer.companyLogo) {
        job.employer.companyLogo = getFullImageUrl(
          "companyLogo",
          job.employer.companyLogo
        );
      }
      return job;
    });
  }
  static async getJobById(jobId) {
    const job = await Job.findById(jobId).populate(
      "employer",
      "companyName companyLogo location"
    );

    if (!job) {
      throw new Error("Job not found.");
    }

    if (job.employer) {
      if (job.employer.companyLogo) {
        job.employer.companyLogo = getFullImageUrl(
          "companyLogo",
          job.employer.companyLogo
        );
      }
    } else {
      throw new Error("Employer does not exist.");
    }

    return job;
  }

  static async getJobsByEmployerId(employerId) {
    if (!mongoose.isValidObjectId(employerId)) {
      throw new Error("Invalid employer ID format.");
    }
    const jobs = await Job.find({ employer: employerId }).populate(
      "employer",
      "companyName companyLogo location"
    );
    if (!jobs.length) {
      throw new Error("No jobs found for this employer.");
    }
    return jobs.map((job) => {
      if (job.employer && job.employer.companyLogo) {
        job.employer.companyLogo = getFullImageUrl(
          "companyLogo",
          job.employer.companyLogo
        );
      }
      return job;
    });
  }

  static async getRecommendedJobs(jobSeekerId) {
    const jobSeeker = await JobSeeker.findById(jobSeekerId);
    if (!jobSeeker) {
      throw new Error("Job seeker not found.");
    }

    // Process skills with proper normalization
    let skills = jobSeeker.skills;
    skills = Array.isArray(skills)
      ? skills.flatMap((skill) =>
          typeof skill === "string"
            ? skill.split(",").map((s) => s.trim().toLowerCase())
            : []
        )
      : [];

    if (skills.length === 0) {
      throw new Error("No skills found for this job seeker.");
    }

    // Use aggregation for case-insensitive matching
    const recommendedJobs = await Job.aggregate([
      {
        $addFields: {
          lowercaseSkills: {
            $map: {
              input: "$skillsRequired",
              as: "skill",
              in: { $toLower: "$$skill" },
            },
          },
        },
      },
      {
        $match: {
          lowercaseSkills: { $in: skills },
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "employers",
          localField: "employer",
          foreignField: "_id",
          as: "employer",
        },
      },
      { $unwind: "$employer" },
      {
        $addFields: {
          "employer.companyLogo": {
            $concat: [
              "http://localhost:3000/uploads/companylogo_images/",
              "$employer.companyLogo",
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          location: 1,
          salary: 1,
          jobType: 1,
          experienceLevel: 1,
          skillsRequired: 1,
          description: 1,
          "employer.companyName": 1,
          "employer.companyLogo": 1,
          "employer.location": 1,
          matchScore: {
            $size: {
              $setIntersection: ["$lowercaseSkills", skills],
            },
          },
        },
      },
      { $sort: { matchScore: -1, datePosted: -1 } },
    ]);

    return recommendedJobs;
  }
  static async updateJob(jobId, jobData) {
    if (jobData.employer) {
      const employerExists = await Employer.findById(jobData.employer);
      if (!employerExists) {
        throw new Error("Invalid employer ID. Employer does not exist.");
      }
    }
    return await Job.findByIdAndUpdate(jobId, jobData, { new: true });
  }

  static async deleteJob(jobId) {
    return await Job.findByIdAndDelete(jobId);
  }

  static async getSimilarJobs(jobId, page = 1, limit = 4) {
    console.log("Fetching job with ID:", jobId);

    // Find the current job using the jobId
    const currentJob = await Job.findById(jobId).lean();
    console.log("Fetched job:", currentJob);

    if (!currentJob) {
      throw new Error("Job not found");
    }

    // Normalize skills for comparison
    let skills = currentJob.skillsRequired;
    if (typeof skills === "string") {
      skills = skills.split(",").map((skill) => skill.trim());
    } else if (Array.isArray(skills)) {
      skills = skills.flatMap((skill) => {
        if (typeof skill === "string") {
          return skill.split(",").map((s) => s.trim());
        }
        return skill;
      });
    } else {
      skills = [];
    }

    // Find similar jobs based on skills only
    const similarJobs = await Job.aggregate([
      {
        $match: {
          isActive: true,
          _id: { $ne: currentJob._id },
        },
      },
      {
        $addFields: {
          similarityScore: {
            $size: {
              $setIntersection: [skills, "$skillsRequired"],
            },
          },
        },
      },
      { $match: { similarityScore: { $gt: 0 } } }, // Only jobs with at least one matching skill
      { $sort: { similarityScore: -1, datePosted: -1 } }, // Sort by similarity score
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: "employers",
          localField: "employer",
          foreignField: "_id",
          as: "employer",
        },
      },
      { $unwind: "$employer" },
      {
        $project: {
          title: 1,
          location: 1,
          jobType: 1,
          experienceLevel: 1,
          salary: 1,
          datePosted: 1,
          similarityScore: 1,
          "employer.companyName": 1,
          "employer.companyLogo": 1,
        },
      },
    ]);

    return similarJobs.map((job) => ({
      ...job,
      employer: {
        ...job.employer,
        companyLogo: job.employer.companyLogo
          ? getFullImageUrl("companyLogo", job.employer.companyLogo)
          : null,
      },
    }));
  }
}

module.exports = JobService;

// static async getSimilarJobs(jobId, page = 1, limit = 4) {
//   console.log("Fetching job with ID:", jobId);
//   const currentJob = await Job.findById(jobId).lean();
//   console.log("Fetched job:", currentJob);

//   if (!currentJob) {
//     throw new Error("Job not found");
//   }

//   const similarityThreshold = 2; // Minimum 2 matching criteria

//   const similarJobs = await Job.aggregate([
//     {
//       $match: {
//         _id: { $ne: currentJob._id },
//         isActive: true,
//       },
//     },
//     {
//       $addFields: {
//         similarityScore: {
//           $add: [
//             {
//               $size: {
//                 $setIntersection: [
//                   currentJob.skillsRequired,
//                   "$skillsRequired",
//                 ],
//               },
//             },
//             { $cond: [{ $eq: ["$jobType", currentJob.jobType] }, 2, 0] },
//             {
//               $cond: [
//                 { $eq: ["$experienceLevel", currentJob.experienceLevel] },
//                 1,
//                 0,
//               ],
//             },
//             { $cond: [{ $eq: ["$location", currentJob.location] }, 1, 0] },
//           ],
//         },
//       },
//     },
//     { $match: { similarityScore: { $gte: similarityThreshold } } },
//     { $sort: { similarityScore: -1, datePosted: -1 } },
//     { $skip: (page - 1) * limit },
//     { $limit: limit },
//     {
//       $lookup: {
//         from: "employers",
//         localField: "employer",
//         foreignField: "_id",
//         as: "employer",
//       },
//     },
//     { $unwind: "$employer" },
//     {
//       $project: {
//         title: 1,
//         location: 1,
//         jobType: 1,
//         experienceLevel: 1,
//         salary: 1,
//         datePosted: 1,
//         similarityScore: 1,
//         "employer.companyName": 1,
//         "employer.companyLogo": 1,
//       },
//     },
//   ]);

//   return similarJobs.map((job) => ({
//     ...job,
//     employer: {
//       ...job.employer,
//       companyLogo: job.employer.companyLogo
//         ? getFullImageUrl("companyLogo", job.employer.companyLogo)
//         : null,
//     },
//   }));
// }
