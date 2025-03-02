const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../model/User");
const Role = require("../model/Role");

describe("User Routes", () => {
  let adminToken;
  let userToken;
  let testRole;
  let testUser;

  before(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create test role
    testRole = await Role.create({ name: "TestRole" });

    // Create test admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: "adminPass123",
      role: testRole._id,
      isAdmin: true,
    });

    // Create test regular user
    testUser = await User.create({
      name: "Test User",
      email: "user@test.com",
      password: "userPass123",
      role: testRole._id,
    });

    // Get admin token
    const adminLogin = await request(app)
      .post("/api/users/login")
      .send({ email: "admin@test.com", password: "adminPass123" });

    adminToken = adminLogin.body.token;

    // Get user token
    const userLogin = await request(app)
      .post("/api/users/login")
      .send({ email: "user@test.com", password: "userPass123" });

    userToken = userLogin.body.token;
  });

  after(async () => {
    await User.deleteMany({});
    await Role.deleteMany({});
    await mongoose.disconnect();
  });

  describe("GET /api/users", () => {
    it("should return all users if the user is an Admin", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should return 403 if the user is not an Admin", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message", "Forbidden");
    });
  });

  describe("POST /api/users/register", () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        name: "New User",
        email: "new@test.com",
        password: "newPass123",
        role: testRole._id,
      };

      const res = await request(app).post("/api/users/register").send(newUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
    });

    it("should return 400 for invalid role ID format", async () => {
      const res = await request(app).post("/api/users/register").send({
        name: "Invalid Role",
        email: "invalid@test.com",
        password: "test123",
        role: "bad-role-format",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid role ID");
    });

    it("should return 404 for non-existent role", async () => {
      const fakeRoleId = new mongoose.Types.ObjectId();
      const res = await request(app).post("/api/users/register").send({
        name: "No Role",
        email: "norole@test.com",
        password: "test123",
        role: fakeRoleId,
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Role not found");
    });

    it("should return 409 for duplicate email", async () => {
      const res = await request(app).post("/api/users/register").send({
        name: "Duplicate",
        email: "user@test.com", // Already exists
        password: "test123",
        role: testRole._id,
      });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty("message", "Email already exists");
    });
  });

  describe("POST /api/users/login", () => {
    it("should log in with valid credentials", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "user@test.com", password: "userPass123" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("role");
    });

    it("should return 401 for invalid credentials", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "user@test.com", password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return user details for authorized user", async () => {
      const res = await request(app)
        .get(`/api/users/${testUser._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", testUser._id.toString());
    });

    it("should return 403 for unauthorized access", async () => {
      const otherUserId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/users/${otherUserId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message", "Forbidden");
    });
  });
});
