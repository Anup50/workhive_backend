const express = require("express");
const bookmarkController = require("../controller/BookmarkController");

const router = express.Router();

router.post("/", bookmarkController.create);

router.delete("/:bookmarkId", bookmarkController.remove);

router.get("/jobSeeker/:jobSeekerId", bookmarkController.getByJobSeeker);

router.get("/job/:jobId", bookmarkController.getByJob);

module.exports = router;
