const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Update with your app entry point
const Employer = require("../model/Employer");
const Job = require("../model/Job");
const fs = require("fs");
const path = require("path");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Employer Routes", () => {
  const testLogoPath = path.join(__dirname, "test-logo.png"); // Create a test image file

  before(async () => {
    // Create a test file for uploads
    fs.writeFileSync(testLogoPath, "TEST FILE CONTENT");
  });

  after(async () => {
    // Cleanup test file
    if (fs.existsSync(testLogoPath)) {
      fs.unlinkSync(testLogoPath);
    }
  });

  beforeEach(async () => {
    // Clear database before each test
    await Employer.deleteMany({});
    await Job.deleteMany({});
  });

  describe("GET /employer/", () => {
    it("should retrieve all employers (empty array when none exist)", async () => {
      const res = await chai.request(app).get("/employer/");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array").that.is.empty;
    });

    it("should retrieve all employers with data", async () => {
      // Add test employer
      const employer = new Employer({
        companyName: "Test Company",
        companyWebsite: "https://test.com",
        userId: "user123",
      });
      await employer.save();

      const res = await chai.request(app).get("/employer/");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array").with.lengthOf(1);
    });
  });

  describe("POST /employer/add", () => {
    it("should create a new employer with company logo", async () => {
      const res = await chai
        .request(app)
        .post("/employer/add")
        .field("userId", "user123")
        .field("companyName", "Tech Corp")
        .field("companyWebsite", "https://tech.com")
        .field("companyDescription", "Tech company")
        .field("location", "New York")
        .attach("companyLogo", testLogoPath, "test-logo.png");

      expect(res).to.have.status(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property("companyLogo", "test-logo.png");
    });

    it("should return error when required fields are missing", async () => {
      const res = await chai
        .request(app)
        .post("/employer/add")
        .field("companyWebsite", "https://tech.com")
        .attach("companyLogo", testLogoPath, "test-logo.png");

      expect(res).to.have.status(500);
      expect(res.body).to.have.property("errors");
    });
  });

  describe("GET /employer/find/:employerId", () => {
    it("should retrieve employer details with job information", async () => {
      const employer = await Employer.create({
        companyName: "Job Corp",
        userId: "user123",
        companyLogo: "logo.png",
      });

      // Create test jobs
      await Job.create([
        { title: "Developer", employer: employer._id, isActive: true },
        { title: "Designer", employer: employer._id, isActive: false },
      ]);

      const res = await chai.request(app).get(`/employer/find/${employer._id}`);

      expect(res).to.have.status(200);
      expect(res.body.employer.companyName).to.equal("Job Corp");
      expect(res.body.post_info.total_vacancies).to.equal(2);
      expect(res.body.post_info.active_vacancies).to.equal(1);
      expect(res.body.jobs.allJobs).to.have.lengthOf(2);
    });

    it("should return 404 for invalid employer ID", async () => {
      const res = await chai.request(app).get("/employer/find/invalid_id");
      expect(res).to.have.status(500);
    });
  });
});
