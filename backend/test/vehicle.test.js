const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Admin = require("../models/admin/Admin");
const Vehicle = require("../models/Vehicle");
const jwt = require("jsonwebtoken");

let adminToken = "";
let testVehicleId = "";

describe("Vehicle API Tests", () => {
  beforeAll(async () => {
    await Admin.deleteMany({ email: "admin@yatra.com" });

    const admin = new Admin({
      name: "Super Admin",
      email: "admin@example.com",
      password: "password123",
      firstName: "Super",
      lastName: "Admin",
      role: "admin",
    });

    await admin.save();

    const payload = {
      userId: admin._id,
      role: "admin",
    };

    adminToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    await Vehicle.deleteMany({});
    await Admin.deleteMany({});
    await mongoose.disconnect();
  });

  // -------------------- ADMIN ROUTES --------------------

  test("Admin can create a vehicle", async () => {
    const res = await request(app)
      .post("/api/v1/vehicle/admin")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ type: "Bus" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Vehicle created successfully");
    expect(res.body.vehicle).toHaveProperty("_id");

    testVehicleId = res.body.vehicle._id;
  });

  test("Admin cannot create vehicle without type", async () => {
    const res = await request(app)
      .post("/api/v1/vehicle/admin")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Vehicle type is required");
  });

  test("Admin can update a vehicle", async () => {
    const res = await request(app)
      .put(`/api/v1/vehicle/admin/${testVehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ type: "Micro" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Vehicle updated");
    expect(res.body.vehicle.type).toBe("Micro");
  });

  test("Admin can fetch all vehicles", async () => {
    const res = await request(app)
      .get("/api/v1/vehicle/admin")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles).toBeInstanceOf(Array);
    expect(res.body.vehicles.length).toBeGreaterThan(0);
  });

  test("Admin can get vehicle by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/vehicle/admin/${testVehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicle).toHaveProperty("_id", testVehicleId);
  });

  test("Admin receives 404 for non-existent vehicle", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/v1/vehicle/admin/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Vehicle not found");
  });

  test("Admin can delete a vehicle", async () => {
    const res = await request(app)
      .delete(`/api/v1/vehicle/admin/${testVehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Vehicle deleted");
  });

  test("Admin receives 404 when deleting a non-existent vehicle", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/v1/vehicle/admin/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Vehicle not found");
  });

  // -------------------- USER ROUTES --------------------

  test("User (admin token) can fetch available vehicles", async () => {
    // Add vehicle again for user test
    const newVehicle = await Vehicle.create({ type: "Tempo" });

    const res = await request(app)
      .get("/api/v1/vehicle")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles).toBeInstanceOf(Array);
    expect(res.body.vehicles.length).toBeGreaterThan(0);
  });

  test("User (admin token) can fetch single vehicle by ID", async () => {
    const vehicle = await Vehicle.findOne({ type: "Tempo" });

    const res = await request(app)
      .get(`/api/v1/vehicle/${vehicle._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicle.type).toBe("Tempo");
  });

  test("User gets 404 on invalid vehicle ID", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/v1/vehicle/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Vehicle not found");
  });
});
