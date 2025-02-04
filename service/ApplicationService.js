const Application = require("../model/Applications");

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
}

module.exports = new ApplicationService();
