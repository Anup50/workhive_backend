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
    if (!job.employer) {
      throw new Error("Employer does not exist.");
    }
    if (job.employer.companyLogo) {
      job.employer.companyLogo = getFullImageUrl(
        "companyLogo",
        job.employer.companyLogo
      );
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

    // Normalize skills
    let skills = jobSeeker.skills;
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
    if (skills.length === 0) {
      throw new Error("No skills found for this job seeker.");
    }
    const normalizedSkills = skills.map((skill) => skill.toLowerCase());

    const recommendedJobs = await Job.find({
      skillsRequired: { $in: normalizedSkills },
    }).populate("employer", "companyName companyLogo location");

    return recommendedJobs.map((job) => {
      if (job.employer && job.employer.companyLogo) {
        job.employer.companyLogo = getFullImageUrl(
          "companyLogo",
          job.employer.companyLogo
        );
      }
      return job;
    });
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
