// const fs = require("fs");
// const path = require("path");
// const JobSeeker = require("../model/JobSeeker");

// class JobSeekerService {
//   async createJobSeeker(jobSeekerData) {
//     try {
//       const newJobSeeker = await JobSeeker.create(jobSeekerData);
//       return newJobSeeker;
//     } catch (error) {
//       throw new Error(`Error creating job seeker: ${error.message}`);
//     }
//   }

//   async getJobSeekerById(id) {
//     return await JobSeeker.findById(id).populate("userId");
//   }

//   async updateJobSeeker(id, updateData) {
//     try {
//       const existingJobSeeker = await JobSeeker.findById(id);

//       if (existingJobSeeker.profilePicture && updateData.profilePicture) {
//         const oldImagePath = path.join(
//           __dirname,
//           "..",
//           "uploads",
//           existingJobSeeker.profilePicture
//         );
//         fs.unlinkSync(oldImagePath);
//       }

//       // Update the job seeker with new data
//       return await JobSeeker.findByIdAndUpdate(id, updateData, { new: true });
//     } catch (error) {
//       throw new Error(`Error updating job seeker: ${error.message}`);
//     }
//   }

//   async deleteJobSeeker(id) {
//     return await JobSeeker.findByIdAndDelete(id);
//   }

//   async getAllJobSeekers(filter = {}) {
//     return await JobSeeker.find(filter).populate("userId");
//   }
// }

// module.exports = new JobSeekerService();
const fs = require("fs");
const path = require("path");
const JobSeeker = require("../model/JobSeeker");

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
    return await JobSeeker.findById(id).populate("userId");
  }

  async updateJobSeeker(id, updateData) {
    try {
      // Fetch the existing JobSeeker
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

        // Check if the file exists before attempting to delete
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Synchronous deletion
          console.log(`Deleted old profile picture: ${oldImagePath}`);
        } else {
          console.log(`Old profile picture not found: ${oldImagePath}`);
        }
      }

      // Update the JobSeeker with the new data
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
}

module.exports = new JobSeekerService();
