const Role = require("../model/Role");

const findAll = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (e) {
    res.json(e);
  }
};
const add = async (req, res) => {
    try {
      const role = new Role(req.body);
      await role.save();
      res.status(201).json(role)
    } catch (e) {
      res.json(e);
    }
  };
module.exports = {
  findAll, add
};
