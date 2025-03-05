const jobSeekerService = require("../service/JobSeekerService");
const JobSeeker = require("../model/JobSeeker");
const User = require("../model/User");
const { getFullImageUrl } = require("../middleware/ImageUtils");
class JobSeekerController {
  async create(req, res) {
    try {
      if (req.file && req.file.filename) {
        req.body.profilePicture = req.file.filename;
      }

      const jobSeeker = await jobSeekerService.createJobSeeker(req.body);

      res.status(201).json({ success: true, data: jobSeeker });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const jobSeeker = await jobSeekerService.getJobSeekerById(req.params.id);
      if (!jobSeeker) {
        return res
          .status(404)
          .json({ success: false, message: "JobSeeker not found" });
      }
      res.status(200).json({ success: true, data: jobSeeker });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      const updateData = { ...req.body };

      if (req.file && req.file.filename) {
        updateData.profilePicture = req.file.filename;
      }

      const updatedJobSeeker = await jobSeekerService.updateJobSeeker(
        id,
        updateData
      );

      res.status(200).json({
        success: true,
        data: updatedJobSeeker,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedJobSeeker = await jobSeekerService.deleteJobSeeker(
        req.params.id
      );
      if (!deletedJobSeeker) {
        return res
          .status(404)
          .json({ success: false, message: "JobSeeker not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "JobSeeker deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const jobSeekers = await jobSeekerService.getAllJobSeekers(req.query);
      res.status(200).json({ success: true, data: jobSeekers });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).send({ message: "Please upload a file" });
      }
      res.status(200).json({ success: true, data: req.file.filename });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async getJobSeekerId(req, res) {
    try {
      const userId = req.user.id;
      const jobSeeker = await jobSeekerService.getJobSeekerByUserId(userId);

      if (!jobSeeker) {
        return res.json({ jobSeekerId: null });
      }

      res.status(200).json({
        success: true,
        message: "Job seeker ID retrieved successfully",
        jobSeekerId: jobSeeker._id,
      });
    } catch (error) {
      // Handle unexpected errors
      console.error("Error fetching job seeker:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
// const getSimpleJobSeekerById = async (req, res) => {
//   try {
//     const { jobSeekerId } = req.params;

//     const jobSeeker = await JobSeeker.findById(jobSeekerId)
//       .populate({
//         path: "userId",
//         select: "name email",
//       })
//       .lean(); // Convert to plain JavaScript object

//     if (!jobSeeker) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Job seeker not found" });
//     }

// // Process profile picture URL
// if (jobSeeker.profilePicture) {
//   jobSeeker.profilePicture = getFullImageUrl(
//     "profilePic",
//     jobSeeker.profilePicture
//   );
// }

//     // Simplify the response
//     const simplifiedJobSeeker = {
//       _id: jobSeeker._id,
//       userId: jobSeeker.userId,
//       profilePicture: jobSeeker.profilePicture,
//       bio: jobSeeker.bio,
//       location: jobSeeker.location,
//       skills: jobSeeker.skills,
//       createdAt: jobSeeker.createdAt,
//       updatedAt: jobSeeker.updatedAt,
//     };

//     res.status(200).json({ success: true, data: simplifiedJobSeeker });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const getSimpleJobSeekerById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const jobSeeker = await JobSeeker.findById(id)
//       .populate({
//         path: "userId",
//         select: "username", // Only fetch the username from the User model
//         model: User,
//       })
//       .select("-bookmarks -applications") // Exclude virtual fields
//       .lean();

//     if (!jobSeeker) {
//       return res.status(404).json({ message: "Job Seeker not found" });
//     }

//     // Merge the username into the jobSeeker object
//     const result = {
//       ...jobSeeker,
//       username: jobSeeker.userId.username,
//     };

//     // Remove the populated userId field from the result
//     delete result.userId;

//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const getSimpleJobSeekerById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const jobSeeker = await JobSeeker.findById(id)
//       .populate({
//         path: "userId",
//         select: "name",
//         model: User,
//       })
//       .select("-bookmarks -applications")
//       .lean();

//     if (!jobSeeker) {
//       return res.status(404).json({
//         success: false,
//         message: "Job Seeker not found",
//       });
//     }

//     jobSeeker.username = jobSeeker.userId.username;

//     res.json({
//       success: true,
//       data: jobSeeker,
//       message: "Job Seeker retrieved successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

const getSimpleJobSeekerById = async (req, res) => {
  try {
    const { id } = req.params;

    const jobSeeker = await JobSeeker.findById(id)
      .populate({
        path: "userId",
        select: "name",
        model: User,
      })
      .select("-bookmarks -applications")
      .lean();

    if (!jobSeeker) {
      return res.status(404).json({
        success: false,
        message: "Job Seeker not found",
      });
    }
    // Flatten the userId object
    if (jobSeeker.userId) {
      jobSeeker.userName = jobSeeker.userId.name;
      jobSeeker.userId = jobSeeker.userId._id;
    }

    res.json({
      success: true,
      data: jobSeeker,
      message: "Job Seeker retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = new JobSeekerController();
const jobSeekerController = new JobSeekerController();

module.exports = {
  jobSeekerController,
  getSimpleJobSeekerById,
};
