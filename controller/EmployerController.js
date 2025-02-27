const Employer = require("../model/Employer");
const { getFullImageUrl } = require("../middleware/ImageUtils");
const Job = require("../model/Job");
const add = async (req, res) => {
  try {
    const {
      userId,
      companyName,
      companyWebsite,
      companyDescription,
      location,
    } = req.body;
    const employer = new Employer({
      userId,
      companyName,
      companyWebsite,
      companyDescription,
      location,
      companyLogo: req.file.originalname,
    });
    await employer.save();
    res.status(201).json(employer);
  } catch (e) {
    res.json(e);
  }
};
const update = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.companyLogo = req.file.originalname;
    }

    const employer = await Employer.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    res.status(200).json(employer);
  } catch (e) {
    res.status(500).json(e);
  }
};
const findAll = async (req, res) => {
  try {
    const employer = await Employer.find();
    res.status(200).json(employer);
  } catch (e) {
    res.json(e);
  }
};
const findById = async (req, res) => {
  try {
    // Find the employer by ID
    const employer = await Employer.findById(req.params.employerId);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    // If employer has a companyLogo, update it to the full URL
    if (employer.companyLogo) {
      employer.companyLogo = getFullImageUrl(
        "companyLogo",
        employer.companyLogo
      );
    }

    const jobs = await Job.find({ employer: employer._id });

    const activeJobs = jobs.filter((job) => job.isActive);
    const employerInfo = {
      employer: {
        companyName: employer.companyName,
        companyWebsite: employer.companyWebsite,
        companyDescription: employer.companyDescription,
        companyLogo: employer.companyLogo,
        location: employer.location,
        createdAt: employer.createdAt,
      },
      post_info: {
        total_vacancies: jobs.length,
        active_vacancies: activeJobs.length,
      },
      jobs: {
        allJobs: jobs,
        activeJobs: activeJobs,
      },
    };

    res.status(200).json(employerInfo);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error fetching employer", error: e.message });
  }
};

const getEmployerId = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user.id });
    if (!employer) {
      return res.status(404).json({ message: "Employer profile not found" });
    }
    res.status(200).json({ employerId: employer._id });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch employer ID",
      details: error.message,
    });
  }
};

module.exports = {
  add,
  update,
  findAll,
  findById,
  getEmployerId,
};
