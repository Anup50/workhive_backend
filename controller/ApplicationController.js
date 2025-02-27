const applicationService = require("../service/ApplicationService");
const Application = require("../model/Applications");
const Job = require("../model/Job");

const isApplied = async (req, res) => {
  try {
    const { jobId } = req.params; // Get jobId from URL params
    const jobSeekerId = req.user.id; // Assuming you have authentication middleware

    const application = await Application.findOne({ jobId, jobSeekerId });

    res.status(200).json({
      success: true,
      applied: !!application, // Returns true if application exists, else false
    });
  } catch (error) {
    console.error("Error checking application status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const getAppliedJobs = async (req, res) => {
  try {
    const jobSeekerId = req.user.id; // Assuming user ID is available from auth middleware

    const applications = await Application.find({ jobSeekerId })
      .populate({
        path: "jobId",
        select:
          "title description employer location salary jobType experienceLevel deadline skillsRequired isActive datePosted",
        populate: {
          path: "employer",
          select: "companyName companyLogo location",
        },
      })
      .sort({ applicationDate: -1 }); // Sort by latest applied jobs

    const appliedJobs = applications.map((application) => ({
      _id: application.jobId._id,
      title: application.jobId.title,
      description: application.jobId.description,
      employer: application.jobId.employer
        ? {
            _id: application.jobId.employer._id,
            companyName: application.jobId.employer.companyName,
            companyLogo: application.jobId.employer.companyLogo,
            location: application.jobId.employer.location,
          }
        : null,
      location: application.jobId.location,
      salary: application.jobId.salary,
      jobType: application.jobId.jobType,
      experienceLevel: application.jobId.experienceLevel,
      deadline: application.jobId.deadline,
      skillsRequired: application.jobId.skillsRequired,
      isActive: application.jobId.isActive,
      datePosted: application.jobId.datePosted,
      applicationDate: application.applicationDate,
      status: application.status,
    }));

    res.status(200).json({
      success: true,
      data: appliedJobs,
    });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

class ApplicationController {
  async create(req, res) {
    try {
      const { jobId, jobSeekerId, message } = req.body;

      // Create application data
      const newApplication = await applicationService.createApplication({
        jobId,
        jobSeekerId,
        message,
      });

      res.status(201).json({ success: true, data: newApplication });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getApplicationsByJob(req, res) {
    try {
      const applications = await applicationService.getApplicationsByJob(
        req.params.jobId
      );
      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getApplicationById(req, res) {
    try {
      const application = await applicationService.getApplicationById(
        req.params.id
      );
      res.status(200).json({ success: true, data: application });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateApplicationStatus(req, res) {
    try {
      const updatedApplication =
        await applicationService.updateApplicationStatus(
          req.params.id,
          req.body.status
        );
      res.status(200).json({ success: true, data: updatedApplication });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params; // Get jobId from request parameters

    const applications = await Application.find({ jobId }).populate({
      path: "jobSeekerId",
      select: "fullName email profilePicture resume experience", // Select the fields you need
    });

    const applicants = applications.map((app) => ({
      userId: app.jobSeekerId._id,
      fullName: app.jobSeekerId.fullName,
      email: app.jobSeekerId.email,
      profilePicture: app.jobSeekerId.profilePicture,
      resume: app.jobSeekerId.resume,
      experience: app.jobSeekerId.experience,
    }));

    res.status(200).json({ success: true, data: applicants });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  applicationController: new ApplicationController(),
  getAppliedJobs,
  isApplied,
  getApplicantsForJob,
};
