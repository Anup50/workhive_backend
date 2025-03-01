const JobSeeker = require("../model/JobSeeker"); // Add this import
const applicationService = require("../service/ApplicationService");
const Application = require("../model/Applications");
const Job = require("../model/Job");

const { getFullImageUrl } = require("../middleware/ImageUtils");

const isApplied = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const jobSeeker = await JobSeeker.findOne({ userId });
    if (!jobSeeker) {
      return res.status(200).json({
        success: true,
        applied: false,
      });
    }

    const application = await Application.findOne({
      jobId,
      jobSeekerId: jobSeeker._id,
    });

    res.status(200).json({
      success: true,
      applied: !!application,
      status: application?.status || null,
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
    const { jobSeekerId } = req.params;

    // Get raw applications
    const applications = await Application.find({ jobSeekerId });

    // Manually populate and transform URLs
    const populatedApplications = await Promise.all(
      applications.map(async (app) => {
        // Fetch job details with employer
        const job = await Job.findById(app.jobId)
          .populate("employer", "companyName companyLogo location")
          .lean();

        // Transform company logo URL
        if (job?.employer?.companyLogo) {
          job.employer.companyLogo = getFullImageUrl(
            "companyLogo",
            job.employer.companyLogo
          );
        }

        // Fetch job seeker details with user
        const jobSeeker = await JobSeeker.findById(app.jobSeekerId)
          .populate("userId", "name email")
          .lean();

        // Transform profile picture URL if needed
        if (jobSeeker?.profilePicture) {
          jobSeeker.profilePicture = getFullImageUrl(
            "profilePicture",
            jobSeeker.profilePicture
          );
        }

        return {
          ...app.toObject(),
          job: job
            ? {
                _id: job._id,
                title: job.title,
                employer: job.employer,
                location: job.location,
                salary: job.salary,
                jobType: job.jobType,
                experienceLevel: job.experienceLevel,
              }
            : null,
          jobSeeker: jobSeeker
            ? {
                bio: jobSeeker.bio,
                skills: jobSeeker.skills,
                profilePicture: jobSeeker.profilePicture,
                user: jobSeeker.userId,
              }
            : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: populatedApplications,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

class ApplicationController {
  // async create(req, res) {
  //   try {
  //     const { jobId, jobSeekerId, message } = req.body;

  //     const newApplication = await applicationService.createApplication({
  //       jobId,
  //       jobSeekerId,
  //       message,
  //     });

  //     res.status(201).json({ success: true, data: newApplication });
  //   } catch (error) {
  //     res.status(400).json({ success: false, message: error.message });
  //   }
  // }
  async create(req, res) {
    try {
      const { jobId } = req.body;
      const userId = req.user.id;

      // Find job seeker profile
      const jobSeeker = await JobSeeker.findOne({ userId });
      if (!jobSeeker) {
        return res.status(403).json({
          success: false,
          message: "Complete your job seeker profile first",
        });
      }

      // Check for existing application
      const existingApplication =
        await applicationService.checkExistingApplication(jobId, jobSeeker._id);
      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: "You've already applied to this job",
        });
      }

      // Create new application
      const newApplication = await applicationService.createApplication({
        jobId,
        jobSeekerId: jobSeeker._id,
        status: "Pending",
      });

      // Increment job application count
      await applicationService.incrementJobApplicationCount(jobId);

      res.status(201).json({ success: true, data: newApplication });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  async withdraw(req, res) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      const jobSeeker = await JobSeeker.findOne({ userId });
      if (!jobSeeker) {
        return res.status(403).json({
          success: false,
          message: "Job seeker profile not found",
        });
      }

      const result = await applicationService.deleteApplication(
        jobId,
        jobSeeker._id
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      // Decrement job application count
      await applicationService.decrementJobApplicationCount(jobId);

      res.status(200).json({
        success: true,
        message: "Application withdrawn successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
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
    const { jobId } = req.params;

    const applications = await Application.find({ jobId }).populate({
      path: "jobSeekerId",
      select: "userId profilePicture resume experience",
      populate: {
        path: "userId",
        select: "name email",
        model: "User",
      },
    });

    const applicants = applications.map((app) => ({
      _id: app._id,
      status: app.status,
      applicationDate: app.applicationDate,
      user: {
        id: app.jobSeekerId.userId._id,
        name: app.jobSeekerId.userId.name,
        email: app.jobSeekerId.userId.email,
      },
      jobSeeker: {
        profilePicture: app.jobSeekerId.profilePicture
          ? getFullImageUrl("profilePicture", app.jobSeekerId.profilePicture)
          : null,
        resume: app.jobSeekerId.resume,
        experience: app.jobSeekerId.experience,
      },
    }));

    res.status(200).json({ success: true, data: applicants });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const applicationController = new ApplicationController();

module.exports = {
  applicationController,
  getAppliedJobs,
  isApplied,
  getApplicantsForJob,
  withdrawApplication: applicationController.withdraw,
};
