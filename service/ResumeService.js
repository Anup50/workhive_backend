const Resume = require("../model/Resume");

class ResumeService {
  async createResume(resumeData) {
    try {
      const newResume = await Resume.create(resumeData);
      return newResume;
    } catch (error) {
      throw new Error(`Error creating resume: ${error.message}`);
    }
  }

  async updateResume(id, updateData) {
    try {
      const updatedResume = await Resume.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      return updatedResume;
    } catch (error) {
      throw new Error(`Error updating resume: ${error.message}`);
    }
  }

  // Get resume by job seeker ID
  async getResumeByJobSeekerId(jobSeekerId) {
    try {
      const resume = await Resume.findOne({ jobSeekerId }).populate(
        "jobSeekerId"
      );
      return resume;
    } catch (error) {
      throw new Error(`Error retrieving resume: ${error.message}`);
    }
  }
}

module.exports = new ResumeService();
