const express = require("express");
const router = express.Router();
const {
  findAll,
  add,
  findById,
  deleteById,
  update,
  login,
} = require("../controller/UserController");
const {
  authenticateToken,
  allowSelfOrRole,
  authorize,
} = require("../security/Auth");
const UserValidation = require("../validation/UserValidation");

router.get("/", authenticateToken, authorize("Admin"), findAll);

router.post("/register", UserValidation, add);

router.get("/:id", authenticateToken, allowSelfOrRole("Admin"), findById);

router.delete("/:id", authenticateToken, authorize("Admin"), deleteById);

router.put("/:id", authenticateToken, allowSelfOrRole("Admin"), update);

router.post("/login", login);

module.exports = router;
