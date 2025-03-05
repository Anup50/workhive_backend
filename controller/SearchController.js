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

// const searchJobs = async (req, res) => {
//   try {
//     const query = req.params.query.trim();
//     const jobs = await Job.find({
//       title: { $regex: new RegExp(query, "i") },
//     }).populate("employer", "companyName companyLogo location");

//     const jobsWithFullImages = jobs.map((job) => {
//       if (job.employer && job.employer.companyLogo) {
//         job.employer.companyLogo = getFullImageUrl(
//           "companyLogo",
//           job.employer.companyLogo
//         );
//       }
//       return job;
//     });

//     res.status(200).json(jobsWithFullImages);
//   } catch (e) {
//     res.status(500).json({ error: "Error fetching jobs", details: e.message });
//   }
// };
const searchJobs = async (req, res) => {
  try {
    const query = req.params.query.trim();
    const filters = { title: { $regex: new RegExp(query, "i") } };

    const jobs = await Job.find(filters)
      .populate("employer", "companyName companyLogo location")
      .lean(); // Convert Mongoose documents to plain JS objects

    // Sanitize jobs to match getAll's structure
    const sanitizedJobs = jobs.map((job) => {
      // Ensure employer exists and has valid fields
      const employer = job.employer || {};
      return {
        ...job,
        employer: {
          _id: employer._id || "",
          companyName: employer.companyName || "Unknown Company",
          companyLogo: employer.companyLogo
            ? getFullImageUrl("companyLogo", employer.companyLogo)
            : "",
          location: employer.location || "Unknown Location",
        },
        // Ensure array fields are never null
        skillsRequired: job.skillsRequired || [],
        description: {
          summary: job.description?.summary || "No summary",
          responsibilities: job.description?.responsibilities || [],
        },
      };
    });

    res.status(200).json({
      success: true,
      data: sanitizedJobs,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: `Error fetching jobs: ${e.message}`,
    });
  }
};
module.exports = {
  searchEmployers,
  searchJobs,
};
