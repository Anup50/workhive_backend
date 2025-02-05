// controllers/resumeController.js
const resumeService = require("../service/ResumeService");
const path = require("path");
const Resume = require("../model/Resume"); // Correct path to your Resume model

class ResumeController {
  async create(req, res) {
    try {
      let fileUrl = null;

      if (req.file) {
        fileUrl = `/uploads/resumes/${req.file.filename}`;
      }

      const resumeData = {
        jobSeekerId: req.body.jobSeekerId,
        fileUrl: fileUrl,
        education: req.body.education,
        experience: req.body.experience,
        skills: req.body.skills,
        certifications: req.body.certifications,
      };

      const resume = await Resume.create(resumeData);

      // Send success response
      res.status(201).json({ success: true, data: resume });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `Error creating resume: ${error.message}`,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { education, experience, skills, certifications } = req.body;

      let updateData = {};
      if (req.file && req.file.filename) {
        updateData.fileUrl = `/uploads/resumes/${req.file.filename}`;
      }

      // Update other fields
      if (education) updateData.education = JSON.parse(education);
      if (experience) updateData.experience = JSON.parse(experience);
      if (skills) updateData.skills = JSON.parse(skills);
      if (certifications)
        updateData.certifications = JSON.parse(certifications);

      const updatedResume = await resumeService.updateResume(id, updateData);

      res.status(200).json({ success: true, data: updatedResume });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getByJobSeekerId(req, res) {
    try {
      const { jobSeekerId } = req.params;
      const resume = await resumeService.getResumeByJobSeekerId(jobSeekerId);
      if (!resume) {
        return res
          .status(404)
          .json({ success: false, message: "Resume not found" });
      }
      res.status(200).json({ success: true, data: resume });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ResumeController();
