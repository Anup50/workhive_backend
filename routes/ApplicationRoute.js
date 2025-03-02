const express = require("express");
const {
  applicationController,
  isApplied,
  getAppliedJobs,
  getApplicantsForJob,
} = require("../controller/ApplicationController");
const {
  authenticateToken,
  allowSelfOrRole,
  authorize,
} = require("../security/Auth");

const router = express.Router();

// Application CRUD operations
router.post("/", authenticateToken, applicationController.create);
router.delete(
  "/job/:jobId/withdraw",
  authenticateToken,
  applicationController.withdraw
);
router.get("/job/:jobId", applicationController.getApplicationsByJob);
router.get("/:id", applicationController.getApplicationById);
router.patch("/:id/status", applicationController.updateApplicationStatus);

// Additional application-related routes
router.get("/applicants/:jobId", getApplicantsForJob);
router.get("/appliedjobs/:jobSeekerId", getAppliedJobs);
router.get("/isApplied/:jobId", authenticateToken, isApplied);

module.exports = router;
