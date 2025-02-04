const applicationService = require("../service/ApplicationService");

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

module.exports = new ApplicationController();
