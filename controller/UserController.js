const UserService = require("../service/UserService");

const findAll = async (req, res) => {
  try {
    const users = await UserService.findAllUsers();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: "Error fetching users", error: e.message });
  }
};

//register
const add = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await UserService.registerUser({
      name,
      email,
      password,
      role,
    });
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ message: "Error creating user", error: e.message });
  }
};

// Find a user by ID
const findById = async (req, res) => {
  try {
    const user = await UserService.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: "Error fetching user", error: e.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const result = await UserService.deleteUserById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Error deleting user", error: e.message });
  }
};

const update = async (req, res) => {
  try {
    const updatedUser = await UserService.updateUserById(
      req.params.id,
      req.body
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (e) {
    res.status(500).json({ message: "Error updating user", error: e.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { token, role } = await UserService.loginUser({ email, password });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    //for mobile app
    res.status(200).json({ message: "Login successful", token, role });
  } catch (e) {
    res.status(401).json({ message: "Invalid credentials", error: e.message });
  }
};

module.exports = {
  findAll,
  add,
  findById,
  deleteById,
  update,
  login,
};
