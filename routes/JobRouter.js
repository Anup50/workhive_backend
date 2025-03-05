// const express = require("express");
// const {
//   create,
//   getAll,
//   deleteById,
//   getById,
//   update,
//   getByEmployerId,
//   getRecommended,
// } = require("../controller/JobController");
// const router = express.Router();

// router.post("/", create);
// router.get("/getall", getAll);
// router.put("/:id", update);
// router.delete("/:id", deleteById);
// router.get("/employer/:employerId", getByEmployerId);
// router.get("/:id", getById);
// router.get("/recommended/:jobSeekerId", getRecommended);
// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  create,
  getAll,
  deleteById,
  getById,
  update,
  getByEmployerId,
  getRecommended,
  getSimilarJobs,
} = require("../controller/JobController");
const {
  authenticateToken,
  authorize,
  allowSelfOrRole,
} = require("../security/Auth");
const validateJob = require("../validation/JobValidation");

//  Employer/Admin only
router.post(
  "/",
  // authenticateToken,
  // authorize("Employer", "Admin"),
  validateJob,
  create
);

router.put(
  "/:id",
  authenticateToken,
  authorize("Employer", "Admin"),
  validateJob,
  update
);
router.delete(
  "/:id",
  authenticateToken,
  authorize("Employer", "Admin"),
  deleteById
);
// Get All Jobs - Public access
router.get("/getall", getAll);
router.get("/getsimilar/:id", getSimilarJobs);

// Update Job - Employer/Admin only (add ownership check in controller)
router.put(
  "/:id",
  // authenticateToken,
  // authorize("Employer", "Admin"),
  // validateJob,
  update
);

// Delete Job - Employer/Admin only (add ownership check in controller)
router.delete(
  "/:id",
  authenticateToken,
  authorize("Employer", "Admin"),
  deleteById
);

// Get Jobs by Employer - Public or authenticated users
router.get("/employer/:employerId", getByEmployerId);

// Get Job by ID - Public access
router.get("/:id", getById);

// Get Recommended Jobs - Authenticated job seekers only
router.get(
  "/recommended/:jobSeekerId",
  authenticateToken,
  // allowSelfOrRole("User"),
  getRecommended
);

module.exports = router;
