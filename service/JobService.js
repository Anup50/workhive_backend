const Job = require("../model/Job");
const Employer = require("../model/Employer");
const mongoose = require("mongoose");
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
    return await Job.find(filters).populate("employer", "companyName location");
  }

  static async getJobById(jobId) {
    const job = await Job.findById(jobId).populate(
      "employer",
      "companyName location"
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
    if (!mongoose.Types.ObjectId.isValid(employerId)) {
      throw new Error("Invalid employer ID format.");
    }

    const employerExists = await Employer.findById(employerId);
    if (!employerExists) {
      throw new Error("Employer does not exist.");
    }

    return await Job.find({ employer: employerId });
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
