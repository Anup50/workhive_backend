const Application = require("../model/Applications");
const Job = require("../model/Job");

class ApplicationService {
  async createApplication(applicationData) {
    try {
      const newApplication = await Application.create(applicationData);
      return newApplication;
    } catch (error) {
      throw new Error(`Error creating application: ${error.message}`);
    }
  }
  async getApplicationsByJob(jobId) {
    try {
      return await Application.find({ jobId })
        .populate("jobSeekerId")
        .populate("jobId");
    } catch (error) {
      throw new Error(`Error fetching applications: ${error.message}`);
    }
  }

  async getApplicationById(id) {
    try {
      return await Application.findById(id)
        .populate("jobSeekerId")
        .populate("jobId");
    } catch (error) {
      throw new Error(`Error fetching application: ${error.message}`);
    }
  }

  async updateApplicationStatus(id, status) {
    try {
      return await Application.findByIdAndUpdate(id, { status }, { new: true })
        .populate("jobSeekerId")
        .populate("jobId");
    } catch (error) {
      throw new Error(`Error updating application status: ${error.message}`);
    }
  }
  async checkExistingApplication(jobId, jobSeekerId) {
    try {
      return await Application.findOne({ jobId, jobSeekerId });
    } catch (error) {
      throw new Error(`Error checking application: ${error.message}`);
    }
  }
  async deleteApplication(jobId, jobSeekerId) {
    try {
      return await Application.findOneAndDelete({ jobId, jobSeekerId });
    } catch (error) {
      throw new Error(`Error deleting application: ${error.message}`);
    }
  }
  async incrementJobApplicationCount(jobId) {
    try {
      return await Job.findByIdAndUpdate(
        jobId,
        { $inc: { applicationCount: 1 } },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error incrementing application count: ${error.message}`);
    }
  }

  async decrementJobApplicationCount(jobId) {
    try {
      return await Job.findByIdAndUpdate(
        jobId,
        { $inc: { applicationCount: -1 } },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error decrementing application count: ${error.message}`);
    }
  }
}

module.exports = new ApplicationService();
