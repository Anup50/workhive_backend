const mongoose = require("mongoose");
const User = require("../model/User");
const Role = require("../model/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY =
  "fef3b170bd182cb817e569f32af534fa372e5eab3b537a5e2b5a06f3a9522c260afa3aa440463b3c32d09177edd60dc8d9f9e8fb56ca4a6684f24e5a44835360";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role.role_name }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

async function registerUser({ name, email, password, role }) {
  if (!mongoose.Types.ObjectId.isValid(role)) {
    throw { status: 400, message: "Invalid role ID" };
  }

  const roleExists = await Role.findById(role);
  if (!roleExists) {
    throw { status: 400, message: "Role does not exist" };
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw { status: 409, message: "Email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashedPassword, role });

  await newUser.save();

  return { success: true, message: "User registered successfully" };
}

// Login User
async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).populate("role");
  if (!user) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw { status: 401, message: "Invalid email or password" };
  }

  // Generate token
  const token = generateToken(user);

  return { token, role: user.role.role_name };
}

module.exports = { registerUser, loginUser };
