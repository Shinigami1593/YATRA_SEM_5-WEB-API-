const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");

const Vehicle = require("../models/Vehicle");
const Route = require("../models/RouteModel");
const TripSchedule = require("../models/TripSchedule");
const User = require("../models/User");

let adminToken = "";
let testTripId = "";
let testRouteId = "";
let testVehicleId = "";

describe("TripSchedule API Tests", () => {
  beforeAll(async () => {
    // Authenticate Admin

      await User.deleteMany({ email: 'tripuser@example.com' });
  await Route.deleteMany({ name: /Test Route/ });
  await Vehicle.deleteMany({ type: /Test Vehicle/ });
  await TripSchedule.deleteMany({});
    const res = await request(app)
      .post("/api/v1/auth/admin/login")
      .send({ email: "admin@admin.com", password: "adminadmin" });

    adminToken = res.body.token;

    // Create a test user (required by Route)
    const user = await User.create({
      name: "Test User",
      email: "tripuser@example.com",
      password: "test123",
      firstName: "Test",
      lastName: "User"
    });

    // Create a test vehicle
    const vehicle = await Vehicle.create({ type: "Bus" });
    testVehicleId = vehicle._id;

    // Create a test route
    const route = await Route.create({
      name: "Route A-B",
      source: "City A",
      destination: "City B",
      coordinates: {
        source: { type: "Point", coordinates: [85.324, 27.7172] },
        destination: { type: "Point", coordinates: [85.3145, 27.6644] },
      },
      type: "bus",
      user: user._id,
    });
    testRouteId = route._id;
  });

  // afterAll(async () => {
  //   await TripSchedule.deleteMany({});
  //   await Route.deleteMany({});
  //   await Vehicle.deleteMany({});
  //   await User.deleteMany({});
  //   await mongoose.connection.close();
  // });

  // CREATE
  test("Admin can create a trip schedule", async () => {
    const res = await request(app)
      .post("/api/v1/trip/admin")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        route: testRouteId,
        vehicle: testVehicleId,
        departureTime: "08:30",
        arrivalTime: "12:45",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Trip schedule created");
    expect(res.body.trip).toHaveProperty("_id");

    testTripId = res.body.trip._id;
  });

  test("Trip creation fails without vehicle", async () => {
    const res = await request(app)
      .post("/api/v1/trip/admin")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        route: testRouteId,
        departureTime: "09:00",
        arrivalTime: "13:00"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("All fields are required");
  });

  test("Trip creation fails without departureTime", async () => {
    const res = await request(app)
      .post("/api/v1/trip/admin")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        route: testRouteId,
        vehicle: testVehicleId,
        arrivalTime: "13:00"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("All fields are required");
  });

  test("Trip creation fails with invalid time format", async () => {
    const res = await request(app)
      .post("/api/v1/trip/admin")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        route: testRouteId,
        vehicle: testVehicleId,
        departureTime: "9am",
        arrivalTime: "13:00"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Invalid time format. Use HH:MM (24-hour format).");
  });

  test("Trip creation fails with wrong vehicle ID", async () => {
    const res = await request(app)
      .post("/api/v1/trip/admin")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        route: testRouteId,
        vehicle: "invalID123",
        departureTime: "09:00",
        arrivalTime: "13:00"
      });

    expect(res.statusCode).toBe(500);
  });

  // READ
  test("Admin can get all trips", async () => {
    const res = await request(app)
      .get("/api/v1/trip")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.trips)).toBe(true);
  });

  test("Admin can get trip by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/trip/${testTripId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    // expect(res.body.trip).toHaveProperty("_id", testTripId.toString());
  });

  test("Getting trip with invalid ID returns 404", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/v1/trip/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Trip schedule not found");
  });

  // UPDATE
  test("Admin can update trip status", async () => {
    const res = await request(app)
      .put(`/api/v1/trip/admin/${testTripId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "completed" });

    expect(res.statusCode).toBe(200);
    expect(res.body.trip.status).toBe("completed");
  });

  test("Admin update success with no status", async () => {
    const res = await request(app)
      .put(`/api/v1/trip/admin/${testTripId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "" });

    expect(res.statusCode).toBe(200);
  });

  test("Admin update fails on invalid trip ID", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/v1/trip/admin/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "completed" });

    expect(res.statusCode).toBe(404);
  });

  // DELETE
  test("Admin can delete trip", async () => {
    const res = await request(app)
      .delete(`/api/v1/trip/admin/${testTripId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Trip schedule deleted successfully");
  });

  test("Deleting already-deleted trip gives 404", async () => {
    const res = await request(app)
      .delete(`/api/v1/trip/admin/${testTripId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Trip schedule not found");
  });

  // EXTRA CASES
  test("Unauthorized request fails", async () => {
    const res = await request(app)
      .get("/api/v1/trip");

    expect(res.statusCode).toBe(403);
  });

  test("Trip creation fails with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/trip/admin")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });
});
