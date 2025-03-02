const Application = require("../model/Applications");
const Job = require("../model/Job");
const User = require("../model/User");
const { getFullImageUrl } = require("../middleware/ImageUtils");

class ApplicationService {
  async getApplicationsByJob(jobId) {
    try {
      const applications = await Application.find({ jobId })
        .populate({
          path: "jobSeekerId",
          select: "userId profilePicture skills experience",
          populate: {
            path: "userId",
            model: User,
            select: "name email",
          },
        })
        .populate({
          path: "jobId",
          select: "title employer",
        })
        .lean();

      return applications.map((app) => ({
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
            ? getFullImageUrl("profilePic", app.jobSeekerId.profilePicture) // ✅ Use "profilePic"
            : null,
          skills: app.jobSeekerId.skills,
          experience: app.jobSeekerId.experience,
        },
        job: {
          title: app.jobId.title,
          employer: app.jobId.employer,
        },
      }));
    } catch (error) {
      throw new Error(`Error fetching applicants: ${error.message}`);
    }
  }
  async createApplication(applicationData) {
    try {
      const newApplication = await Application.create(applicationData);
      return newApplication;
    } catch (error) {
      throw new Error(`Error creating application: ${error.message}`);
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
  async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, employerId } = req.body;

      // Validate that the incoming status is one of the allowed values
      const validStatuses = ["Pending", "Shortlisted", "Accepted", "Rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value",
        });
      }
      console.log(res); // This should log the Express response object

      // Verify application exists and belongs to employer's job
      const application = await Application.findById(id).populate({
        path: "jobId",
        select: "employer",
        match: { employer: employerId },
      });

      if (!application || !application.jobId) {
        return res.status(404).json({
          success: false,
          message: "Application not found or unauthorized",
        });
      }

      // Update and return response using the status provided from the front end
      const updatedApplication = await Application.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate({
        path: "jobSeekerId",
        select: "userId skills experience",
        populate: {
          path: "userId",
          select: "name email",
        },
      });

      res.status(200).json({
        success: true,
        data: {
          _id: updatedApplication._id,
          status: updatedApplication.status,
          applicant: {
            name: updatedApplication.jobSeekerId.userId.name,
            email: updatedApplication.jobSeekerId.userId.email,
            skills: updatedApplication.jobSeekerId.skills,
          },
        },
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the application status.",
      });
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
