const Employer = require("../model/Employer");
const Job = require("../model/Job");
const searchEmployers = async (req, res) => {
  try {
    const query = req.params.query.trim();
    const employers = await Employer.find({
      companyName: { $regex: new RegExp(query, "i") }, // Case-insensitive search
    });

    if (employers.length === 0) {
      return res.status(404).json({ message: "No employers found" });
    }

    res.status(200).json(employers);
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
      title: { $regex: new RegExp(query, "i") }, // Case-insensitive search
    });

    if (jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }

    res.status(200).json(jobs);
  } catch (e) {
    res.status(500).json({ error: "Error fetching jobs", details: e.message });
  }
};
module.exports = {
  searchEmployers,
  searchJobs,
};
