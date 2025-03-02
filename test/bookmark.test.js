const request = require("supertest");
const app = require("../app"); // Path to your Express app
const chai = require("chai");
const expect = chai.expect;
const Bookmark = require("../model/Bookmark");

describe("Bookmark Routes", () => {
  it("should create a bookmark", async () => {
    const res = await request(app).post("/api/bookmark").send({
      jobId: "67c36b07efd9755a494ee1c4",
      jobSeekerId: "67c38126d4b3df336fb61b6a",
    });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.bookmark).to.have.property(
      "jobId",
      "67c36b07efd9755a494ee1c4"
    );
    expect(res.body.bookmark).to.have.property(
      "jobSeekerId",
      "67c38126d4b3df336fb61b6a"
    );
  });

  it("should return error if bookmark already exists", async () => {
    // Create the first bookmark
    await request(app).post("/api/bookmark").send({
      jobId: "67c36b07efd9755a494ee1c4",
      jobSeekerId: "67c38126d4b3df336fb61b6a",
    });

    // Try to create the same bookmark again
    const res = await request(app).post("/api/bookmark").send({
      jobId: "67c36b07efd9755a494ee1c4",
      jobSeekerId: "seeker123",
    });

    expect(res.status).to.equal(404);
    expect(res.body.success).to.equal(false);
    expect(res.body.message).to.equal("Bookmark already exists");
  });

  it("should delete a bookmark", async () => {
    // Create a bookmark to delete
    await request(app).post("/api/bookmark").send({
      jobId: "67c36b07efd9755a494ee1c4",
      jobSeekerId: "67c38126d4b3df336fb61b6a",
    });

    // Delete the bookmark
    const res = await request(app).delete(
      "/api/bookmark/67c36b07efd9755a494ee1c4/67c38126d4b3df336fb61b6a"
    );

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.message).to.equal("Bookmark removed");
  });

  it("should return error if bookmark to delete not found", async () => {
    const res = await request(app).delete(
      "/api/bookmark/67c36b07efd9755a494ee1c4/nonExistentSeeker"
    );

    expect(res.status).to.equal(404);
    expect(res.body.success).to.equal(false);
    expect(res.body.message).to.equal("Bookmark not found");
  });

  it("should get all bookmarks for a job seeker", async () => {
    // Create a bookmark to retrieve
    await request(app).post("/api/bookmark").send({
      jobId: "67c36b07efd9755a494ee1c4",
      jobSeekerId: "67c38126d4b3df336fb61b6a",
    });

    const res = await request(app).get(
      "/api/bookmark/jobSeeker/67c38126d4b3df336fb61b6a"
    );

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.be.an("array");
    expect(res.body.data[0]).to.have.property(
      "jobId",
      "67c36b07efd9755a494ee1c4"
    );
    expect(res.body.data[0]).to.have.property(
      "jobSeekerId",
      "67c38126d4b3df336fb61b6a"
    );
  });

  it("should get all bookmarks for a job", async () => {
    // Create a bookmark to retrieve
    await request(app).post("/api/bookmark").send({
      jobId: "67c36b07efd9755a494ee1c4",
      jobSeekerId: "67c38126d4b3df336fb61b6a",
    });

    const res = await request(app).get(
      "/api/bookmark/job/67c36b07efd9755a494ee1c4"
    );

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.be.an("array");
    expect(res.body.data[0]).to.have.property(
      "jobId",
      "67c36b07efd9755a494ee1c4"
    );
  });

  it("should check if a job is bookmarked by a job seeker", async () => {
    // Create a bookmark to check
    await request(app).post("/api/bookmark").send({
      jobId: "67c36b07efd9755a494ee1c4",
      jobSeekerId: "67c38126d4b3df336fb61b6a",
    });

    const res = await request(app).get(
      "/api/bookmark/isBookmarked/67c36b07efd9755a494ee1c4/67c38126d4b3df336fb61b6a"
    );

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.bookmarked).to.equal(true);
  });

  it("should return false if job is not bookmarked by a job seeker", async () => {
    const res = await request(app).get(
      "/api/bookmark/isBookmarked/67c36b07efd9755a494ee1c4/nonExistentSeeker"
    );

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.bookmarked).to.equal(false);
  });
});
