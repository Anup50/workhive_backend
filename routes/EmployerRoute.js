const express = require("express");
const router = express.Router();
const {
  add,
  findAll,
  update,
  findById,
  getEmployerId,
} = require("../controller/EmployerController");
const { authenticateToken, authorize } = require("../security/Auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/companylogo_images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", findAll);
router.post("/add", upload.single("companyLogo"), add);
router.put("/update/:id", upload.single("companyLogo"), update);
router.get("/find/:employerId", findById);
router.get("/getEmployerId", authenticateToken, getEmployerId);
module.exports = router;
