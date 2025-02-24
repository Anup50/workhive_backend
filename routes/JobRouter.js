const express = require("express");
const {
  create,
  getAll,
  deleteById,
  getById,
  update,
  getByEmployerId,
  getRecommended,
} = require("../controller/JobController");
const router = express.Router();

router.post("/", create);
router.get("/getall", getAll);
router.put("/:id", update);
router.delete("/:id", deleteById);
router.get("/employer/:employerId", getByEmployerId);
router.get("/:id", getById);
router.get("/recommended/:jobSeekerId", getRecommended);
module.exports = router;
