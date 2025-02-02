const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
  email: Joi.string().required().email().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
  role: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": "Role is required",
      "string.pattern.base": "Role must be a valid ObjectId",
    }),
});

function UserValidation(req, res, next) {
  const { name, email, password, role } = req.body;
  const { error } = userSchema.validate({ name, email, password, role });

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }

  next();
}

module.exports = UserValidation;
