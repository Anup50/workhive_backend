const express = require("express");
const bookmarkController = require("../controller/BookmarkController");

const router = express.Router();

router.post("/", bookmarkController.createBookmark);

router.delete("/:jobId/:jobSeekerId", bookmarkController.deleteBookmark);

router.get("/jobSeeker/:jobSeekerId", bookmarkController.getByJobSeeker);

router.get("/job/:jobId", bookmarkController.getByJob);

router.get(
  "/isBookmarked/:jobId/:jobSeekerId",
  bookmarkController.isBookmarked
);

module.exports = router;
