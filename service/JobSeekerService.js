const fs = require("fs");
const path = require("path");
const JobSeeker = require("../model/JobSeeker");
const Application = require("../model/Applications");
const { getFullImageUrl } = require("../middleware/ImageUtils");

class JobSeekerService {
  async createJobSeeker(jobSeekerData) {
    try {
      const newJobSeeker = await JobSeeker.create(jobSeekerData);
      return newJobSeeker;
    } catch (error) {
      throw new Error(`Error creating job seeker: ${error.message}`);
    }
  }
  async getJobSeekerById(id) {
    const jobSeeker = await JobSeeker.findById(id)
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "applications",
        populate: {
          path: "jobId",
          model: "Job",
          select: "title employer location salary jobType experienceLevel",
          populate: {
            path: "employer",
            model: "Employer",
            select: "companyName companyLogo location",
          },
        },
      })
      .populate({
        path: "bookmarks",
        populate: {
          path: "jobId",
          model: "Job",
          select: "title employer location salary jobType experienceLevel",
          populate: {
            path: "employer",
            model: "Employer",
            select: "companyName companyLogo location",
          },
        },
      })
      .lean(); // Convert to plain JavaScript object

    if (!jobSeeker) return null;

    // Process applications
    if (jobSeeker.applications) {
      jobSeeker.applications = jobSeeker.applications.map((application) => {
        if (application?.jobId?.employer?.companyLogo) {
          application.jobId.employer.companyLogo = getFullImageUrl(
            "companyLogo",
            application.jobId.employer.companyLogo
          );
        }
        return application;
      });
    }

    // Process bookmarks
    if (jobSeeker.bookmarks) {
      jobSeeker.bookmarks = jobSeeker.bookmarks.map((bookmark) => {
        if (bookmark?.jobId?.employer?.companyLogo) {
          bookmark.jobId.employer.companyLogo = getFullImageUrl(
            "companyLogo",
            bookmark.jobId.employer.companyLogo
          );
        }
        return bookmark;
      });
    }

    return jobSeeker;
  }
  async updateJobSeeker(id, updateData) {
    try {
      const existingJobSeeker = await JobSeeker.findById(id);

      if (!existingJobSeeker) {
        throw new Error(`JobSeeker with ID ${id} not found`);
      }
      if (existingJobSeeker.profilePicture && updateData.profilePicture) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "profile_picture",
          existingJobSeeker.profilePicture
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Synchronous deletion
          console.log(`Deleted old profile picture: ${oldImagePath}`);
        } else {
          console.log(`Old profile picture not found: ${oldImagePath}`);
        }
      }

      const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      return updatedJobSeeker;
    } catch (error) {
      throw new Error(`Error updating job seeker: ${error.message}`);
    }
  }

  async deleteJobSeeker(id) {
    return await JobSeeker.findByIdAndDelete(id);
  }

  async getAllJobSeekers(filter = {}) {
    return await JobSeeker.find(filter).populate("userId");
  }
  async getJobSeekerByUserId(userId) {
    try {
      const jobSeeker = await JobSeeker.findOne({ userId });
      if (!jobSeeker) {
        return null;
      }
      return jobSeeker;
    } catch (error) {
      console.error("Error fetching job seeker:", error);
      throw new Error("Failed to fetch job seeker.");
    }
  }
}

module.exports = new JobSeekerService();
