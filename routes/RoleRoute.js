const express = require("express");
const router = express.Router();
const { findAll, add } = require("../controller/RoleController");

router.get("/", findAll);
router.post("/", add);

module.exports = router;
