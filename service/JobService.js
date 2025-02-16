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

    console.log("Fetched Job:", job);

    if (!job) {
      throw new Error("Job not found.");
    }

    if (!job.employer) {
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

    return jobs;
  }

  // static async getRecommendedJobs(jobSeekerId) {
  //   const jobSeeker = await JobSeeker.findById(jobSeekerId);
  //   if (!jobSeeker) throw new Error("Job seeker not found.");

  //   // Skills are already normalized via pre-save hook
  //   const skills = jobSeeker.skills;
  //   if (!skills?.length) throw new Error("No skills found.");

  //   // Case-sensitive match (since both sides are normalized)
  //   const recommendedJobs = await Job.find({
  //     skillsRequired: { $in: skills }
  //   }).populate("employer", "companyName companyLogo location");

  //   return recommendedJobs;
  // }

  static async getRecommendedJobs(jobSeekerId) {
    const jobSeeker = await JobSeeker.findById(jobSeekerId);
    if (!jobSeeker) {
      throw new Error("Job seeker not found.");
    }

    let skills = jobSeeker.skills;

    // Handle case where skills is a string (convert to array)
    if (typeof skills === "string") {
      skills = skills.split(",").map((skill) => skill.trim());
    }
    // Ensure skills is an array and process each element
    else if (Array.isArray(skills)) {
      // Split any comma-separated strings within the array elements
      skills = skills.flatMap((skill) => {
        if (typeof skill === "string") {
          return skill.split(",").map((s) => s.trim());
        }
        return skill;
      });
    }
    // Fallback in case skills is neither string nor array
    else {
      skills = [];
    }

    if (skills.length === 0) {
      throw new Error("No skills found for this job seeker.");
    }

    // Normalize skills to lowercase
    const normalizedSkills = skills.map((skill) => skill.toLowerCase());

    console.log("Job Seeker Skills:", skills);
    console.log("Querying for jobs with skills:", normalizedSkills);

    const recommendedJobs = await Job.find({
      skillsRequired: { $in: normalizedSkills },
    }).populate("employer", "companyName companyLogo location");

    console.log("Recommended Jobs Found:", recommendedJobs.length);

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
}

module.exports = JobService;
