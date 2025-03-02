const request = require("supertest");
const app = require("../app"); // Path to your Express app
const chai = require("chai");
const expect = chai.expect;

describe("Role Routes", () => {
  it("should fetch all roles", async () => {
    const res = await request(app).get("/api/role");
    expect(res.status).to.equal(200);
  });

  it("should add a new role", async () => {
    const res = await request(app).post("/api/role").send({ name: "new role" }); // Adjust to match your role data

    expect(res.status).to.equal(200);
  });

  it("should return an error if role data is missing", async () => {
    const res = await request(app).post("/api/role").send({});

    expect(res.status).to.equal(400);
  });
});
