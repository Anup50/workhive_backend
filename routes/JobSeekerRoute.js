const express = require("express");
const jobSeekerController = require("../controller/JobSeekerController.js");
const upload = require("../middleware/ProfilePicMiddleware.js");
const { authenticateToken } = require("../security/Auth");
const router = express.Router();
router.get(
  "/getJobSeekerId",
  authenticateToken,
  jobSeekerController.getJobSeekerId
);
router.post("/", jobSeekerController.create);
router.post("/uploadImage", upload, jobSeekerController.uploadImage);
router.get("/:id", jobSeekerController.getById);
router.put("/update/:id", upload, jobSeekerController.update);
router.delete("/:id", jobSeekerController.delete);

module.exports = router;
