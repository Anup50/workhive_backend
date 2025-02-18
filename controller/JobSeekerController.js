const jobSeekerService = require("../service/JobSeekerService");

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
      res.json({ jobSeekerId: jobSeeker._id });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = new JobSeekerController();
