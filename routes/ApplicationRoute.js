// ApplicationRoutes.js
const express = require("express");
const applicationController = require("../controller/ApplicationController");

const router = express.Router();

// Create a new application
router.post("/", applicationController.create);

// Get all applications for a job
router.get("/job/:jobId", applicationController.getApplicationsByJob);

// Get a specific application by ID
router.get("/:id", applicationController.getApplicationById);

// Update application status
router.put("/:id/status", applicationController.updateApplicationStatus);

module.exports = router; // Ensure you're exporting the router correctly
