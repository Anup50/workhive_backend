const express = require("express");
const router = express.Router();
const {
  searchEmployers,
  searchJobs,
} = require("../controller/SearchController");

router.get("/employers/:query", searchEmployers);
router.get("/jobs/:query", searchJobs);

module.exports = router;
