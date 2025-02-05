const express = require("express");
const resumeController = require("../controller/ResumeController");
const uploadMiddleware = require("../middleware/UploadResumeMiddleware");

const router = express.Router();

router.post("/", uploadMiddleware, resumeController.create);

router.put("/:id", uploadMiddleware, resumeController.update);

router.get("/jobseeker/:jobSeekerId", resumeController.getByJobSeekerId);

module.exports = router;
