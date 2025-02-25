const Employer = require("../model/Employer");
const Job = require("../model/Job");
const { getFullImageUrl } = require("../middleware/ImageUtils");
const searchEmployers = async (req, res) => {
  try {
    const query = req.params.query.trim();
    const employers = await Employer.find({
      companyName: { $regex: new RegExp(query, "i") }, // Case-insensitive search
    });

    const employersWithFullImages = employers.map((employer) => {
      if (employer.companyLogo) {
        employer.companyLogo = getFullImageUrl(
          "companyLogo",
          employer.companyLogo
        );
      }
      return employer;
    });

    res.status(200).json(employersWithFullImages);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Error fetching employers", details: e.message });
  }
};

const searchJobs = async (req, res) => {
  try {
    const query = req.params.query.trim();
    const jobs = await Job.find({
      title: { $regex: new RegExp(query, "i") },
    }).populate("employer", "companyName companyLogo location");

    const jobsWithFullImages = jobs.map((job) => {
      if (job.employer && job.employer.companyLogo) {
        job.employer.companyLogo = getFullImageUrl(
          "companyLogo",
          job.employer.companyLogo
        );
      }
      return job;
    });

    res.status(200).json(jobsWithFullImages);
  } catch (e) {
    res.status(500).json({ error: "Error fetching jobs", details: e.message });
  }
};
module.exports = {
  searchEmployers,
  searchJobs,
};
