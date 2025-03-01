const Joi = require("joi");
const mongoose = require("mongoose");

const jobSchema = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    "any.required": "Title is required",
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least {#limit} characters",
    "string.max": "Title cannot exceed {#limit} characters",
  }),
  description: Joi.object({
    summary: Joi.string().required().min(50).max(1000).messages({
      "any.required": "Summary is required",
      "string.empty": "Summary cannot be empty",
      "string.min": "Summary must be at least {#limit} characters",
      "string.max": "Summary cannot exceed {#limit} characters",
    }),
    responsibilities: Joi.array()
      .items(Joi.string().min(10).max(200).required())
      .min(1)
      .messages({
        "array.base": "Responsibilities must be an array",
        "array.min": "At least one responsibility is required",
        "any.required": "Responsibilities are required",
        "string.min": "Responsibility must be at least {#limit} characters",
        "string.max": "Responsibility cannot exceed {#limit} characters",
      }),
  }).required(),
  employer: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": "Employer ID is required",
      "string.pattern.base": "Invalid Employer ID format",
    }),
  location: Joi.string().required().messages({
    "any.required": "Location is required",
    "string.empty": "Location cannot be empty",
  }),
  salary: Joi.number().required().min(0).messages({
    "any.required": "Salary is required",
    "number.base": "Salary must be a number",
    "number.min": "Salary cannot be negative",
  }),
  jobType: Joi.string()
    .valid("Full-time", "Part-time", "Contract", "Freelance")
    .required()
    .messages({
      "any.required": "Job type is required",
      "any.only": "Invalid job type",
    }),
  experienceLevel: Joi.string()
    .valid("Entry", "Mid", "Senior")
    .required()
    .messages({
      "any.required": "Experience level is required",
      "any.only": "Invalid experience level",
    }),
  deadline: Joi.date().greater("now").required().messages({
    "any.required": "Deadline is required",
    "date.base": "Invalid date format",
    "date.greater": "Deadline must be in the future",
  }),
  skillsRequired: Joi.array()
    .items(Joi.string().min(2).max(50).required())
    .min(1)
    .required()
    .messages({
      "array.base": "Skills must be an array",
      "array.min": "At least one skill is required",
      "any.required": "Skills are required",
      "string.min": "Skill must be at least {#limit} characters",
      "string.max": "Skill cannot exceed {#limit} characters",
    }),
  isActive: Joi.boolean().default(true).messages({
    "boolean.base": "Active status must be a boolean",
  }),
});

const validateJob = (req, res, next) => {
  const { error } = jobSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  next();
};

module.exports = validateJob;
