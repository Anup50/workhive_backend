const JobService = require("../service/JobService");
const Job = require("../model/Job");
const mongoose = require("mongoose");

const create = async (req, res) => {
  try {
    const jobData = req.body;
    const newJob = await JobService.createJob(jobData);
    res.status(201).json({ success: true, data: newJob });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const filters = req.query;
    const jobs = await JobService.getAllJobs(filters);

    console.log("Jobs Data:", JSON.stringify(jobs, null, 2));

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
const getById = async (req, res) => {
  try {
    const job = await JobService.getJobById(req.params.id);
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const jobData = req.body;
    const updatedJob = await JobService.updateJob(id, jobData);
    if (!updatedJob)
      return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, data: updatedJob });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getByEmployerId = async (req, res) => {
  try {
    const jobs = await JobService.getJobsByEmployerId(req.params.employerId);

    // Wrap the array in a data property
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await JobService.deleteJob(id);
    if (!deletedJob)
      return res.status(404).json({ success: false, message: "Job not found" });
    res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const getRecommended = async (req, res) => {
  try {
    const { jobSeekerId } = req.params;
    const recommendedJobs = await JobService.getRecommendedJobs(jobSeekerId);
    res.status(200).json({ success: true, data: recommendedJobs });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getSimilarJobs = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 4 } = req.query;

    const jobs = await JobService.getSimilarJobs(
      id,
      parseInt(page),
      parseInt(limit)
    );

    res.json({
      success: true,
      data: jobs,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteById,
  getByEmployerId,
  getRecommended,
  getSimilarJobs,
};
