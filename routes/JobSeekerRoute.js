const express = require("express");
const jobSeekerController = require("../controller/JobSeekerController.js");
const upload = require("../middleware/ProfilePicMiddleware.js");

const router = express.Router();

router.post("/", jobSeekerController.create);
router.post("/uploadImage", upload, jobSeekerController.uploadImage);
router.get("/:id", jobSeekerController.getById);
router.put("/update/:id", upload, jobSeekerController.update);

router.delete("/:id", jobSeekerController.delete);

module.exports = router;
