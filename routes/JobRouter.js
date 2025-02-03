const express = require("express");
const {
  create,
  getAll,
  deleteById,
  getById,
  update,
  getByEmployerId,
} = require("../controller/JobController");
const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.put("/:id", update);
router.delete("/:id", deleteById);
router.get("/employer/:employerId", getByEmployerId);
router.get("/:id", getById);
module.exports = router;
