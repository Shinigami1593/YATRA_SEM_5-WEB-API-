const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index"); // Adjust path to your Express app
const Admin = require("../models/admin/Admin");
const TripSchedule = require("../models/TripSchedule");
const Route = require("../models/RouteModel"); // Assuming Route model exists
const Vehicle = require("../models/Vehicle"); // Assuming Vehicle model exists
const jwt = require("jsonwebtoken");

let adminToken = "";
let testTripId = "";
let testRouteId = "";
let testVehicleId = "";

describe("Trip Schedule API Tests", () => {
  beforeAll(async () => {
    // Clean up Admin, Route, and Vehicle collections
    await Admin.deleteMany({ email: "admin@yatra.com" });
    await Route.deleteMany({});
    await Vehicle.deleteMany({});

    // Create admin user
    const admin = new Admin({
      email: "admin@yatra.com",
      password: "password123",
      role: "admin",
    });
    await admin.save();

    // Generate JWT token
    const payload = {
      userId: admin._id,
      role: "admin",
    };
    adminToken = jwt.sign(payload, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "1h" });

    // Create test Route and Vehicle for TripSchedule
    const route = await Route.create({ name: "Route 1" });
    const vehicle = await Vehicle.create({ type: "Bus" });
    testRouteId = route._id;
    testVehicleId = vehicle._id;
  });

  afterAll(async () => {
    await TripSchedule.deleteMany({});
    await Route.deleteMany({});
    await Vehicle.deleteMany({});
    await Admin.deleteMany({});
    await mongoose.disconnect();
  });

  // -------------------- USER ROUTES --------------------

  test("User can fetch all trip schedules", async () => {
    await TripSchedule.create({
      route: testRouteId,
      vehicle: testVehicleId,
      departureTime: "08:00",
      arrivalTime: "10:00",
      status: "scheduled",
    });

    const res = await request(app)
      .get("/api/v1/trip")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.trips).toBeInstanceOf(Array);
    expect(res.body.trips.length).toBeGreaterThan(0);
    expect(res.body.trips[0]).toHaveProperty("route");
    expect(res.body.trips[0]).toHaveProperty("vehicle");
  });

//   test("User can fetch a trip schllledule by ID", async () => {
//     const trip = await TripSchedule.create({
//       route: testRouteId,
//       vehicle: testVehicleId,
//       departureTime: "08:00",
//       arrivalTime: "10:00",
//       status: "scheduled",
//     });

//     const res = await request(app)
//       .get(`/api/v1/trip/${trip._id}`)
//       .set("Authorization", `Bearer ${adminToken}`);

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty("_id", trip._id.toString());
//     expect(res.body.route).toHaveProperty("name");
//     expect(res.body.vehicle).toHaveProperty("type");
//   });

//   test("User receives 404 for non-existent trip schedule", async () => {
//     const fakeId = new mongoose.Types.ObjectId();
//     const res = await request(app)
//       .get(`/api/v1/trip/${fakeId}`)
//       .set("Authorization", `Bearer ${adminToken}`);

//     expect(res.statusCode).toBe(404);
//     expect(res.body.message).toBe("Trip schedule not found");
//   });

//   test("User receives 500 on server error for fetching trips", async () => {
//     jest.spyOn(TripSchedule, "find").mockImplementationOnce(() => {
//       throw new Error("DB error");
//     });

//     const res = await request(app)
//       .get("/api/v1/trip")
//       .set("Authorization", `Bearer ${adminToken}`);

//     expect(res.statusCode).toBe(500);
//     expect(res.body.message).toBe("Server error");
//   });

//   test("User receives 500 on server error for fetching trip by ID", async () => {
//     jest.spyOn(TripSchedule, "findById").mockImplementationOnce(() => {
//       throw new Error("DB error");
//     });

//     const fakeId = new mongoose.Types.ObjectId();
//     const res = await request(app)
//       .get(`/api/v1/trip/${fakeId}`)
//       .set("Authorization", `Bearer ${adminToken}`);

//     expect(res.statusCode).toBe(500);
//     expect(res.body.message).toBe("Server error");
//   });

//   // -------------------- ADMIN ROUTES --------------------

//   test("Admin can create a trip schedule", async () => {
//     const res = await request(app)
//       .post("/api/v1/trip/admin")
//       .set("Authorization", `Bearer ${adminToken}`)
//       .send({
//         route: testRouteId,
//         vehicle: testVehicleId,
//         departureTime: "08:00",
//         arrivalTime: "10:00",
//       });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.message).toBe("Trip schedule created");
//     expect(res.body.trip).toHaveProperty("_id");
//     expect(res.body.trip.departureTime).toBe("08:00");

//     testTripId = res.body.trip._id;
//   });

//   test("Admin cannot create trip schedule without required fields", async () => {
//     const res = await request(app)
//       .post("/api/v1/trip/admin")
//       .set("Authorization", `Bearer ${adminToken}`)
//       .send({ route: testRouteId, vehicle: testVehicleId });

//     expect(res.statusCode).toBe(400);
//     expect(res.body.message).toBe("All fields are required");
//   });

//   test("Admin cannot create trip schedule with invalid time format", async () => {
//     const res = await request(app)
//       .post("/api/v1/trip/admin")
//       .set("Authorization", `Bearer ${adminToken}`)
//       .send({
//         route: testRouteId,
//         vehicle: testVehicleId,
//         departureTime: "25:00",
//         arrivalTime: "10:00",
//       });

//     expect(res.statusCode).toBe(400);
//     expect(res.body.message).toBe("Invalid time format. Use HH:MM (24-hour format).");
//   });

//   test("Admin receives 500 on server error for creating trip", async () => {
//     jest.spyOn(TripSchedule.prototype, "save").mockImplementationOnce(() => {
//       throw new Error("DB error");
//     });

//     const res = await request(app)
//       .post("/api/v1/trip/admin")
//       .set("Authorization", `Bearer ${adminToken}`)
//       .send({
//         route: testRouteId,
//         vehicle: testVehicleId,
//         departureTime: "08:00",
//         arrivalTime: "10:00",
//       });

//     expect(res.statusCode).toBe(500);
//     expect(res.body.message).toBe("Server error");
//   });

//   test("Admin can update a trip schedule", async () => {
//     const trip = await TripSchedule.create({
//       route: testRouteId,
//       vehicle: testVehicleId,
//       departureTime: "08:00",
//       arrivalTime: "10:00",
//       status: "scheduled",
//     });

//     const res = await request(app)
//       .put(`/api/v1/trip/admin/${trip._id}`)
//       .set("Authorization", `Bearer ${adminToken}`)
//       .send({ departureTime: "09:00", status: "cancelled" });

//     expect(res.statusCode).toBe(200);
//     expect(res.body.message).toBe("Trip schedule updated");
//     expect(res.body.trip.departureTime).toBe("09:00");
//     expect(res.body.trip.status).toBe("cancelled");
//   });

//   test("Admin ignores invalid status during update", async () => {
//     const trip = await TripSchedule.create({
//       route: testRouteId,
//       vehicle: testVehicleId,
//       departureTime: "08:00",
//       arrivalTime: "10:00",
//       status: "scheduled",
//     });

//     const res = await request(app)
//       .put(`/api/v1/trip/admin/${trip._id}`)
//       .set("Authorization", `Bearer ${adminToken}`)
//       .send({ status: "invalid-status" });

//     expect(res.statusCode).toBe(200);
//     expect(res.body.trip.status).toBe("scheduled");
//   });

//   test("Admin receives 404 when updating non-existent trip schedule", async () => {
//     const fakeId = new mongoose.Types.ObjectId();
//     const res = await request(app)
//       .put(`/api/v1/trip/admin/${fakeId}`)
//       .set("Authorization", `Bearer ${adminToken}`)
//       .send({ departureTime: "09:00" });

//     expect(res.statusCode).toBe(404);
//     expect(res.body.message).toBe("Trip schedule not found");
//   });

//   test("Admin receives 500 on server error for updating trip", async () => {
//     jest.spyOn(TripSchedule, "findByIdAndUpdate").mockImplementationOnce(() => {
//       throw new Error("DB error");
//     });

//     const res = await request(app)
//       .put(`/api/v1/trip/admin/${testTripId}`)
//       .set("Authorization", `Bearer ${adminToken}`)
//       .send({ departureTime: "09:00" });

//     expect(res.statusCode).toBe(500);
//     expect(res.body.message).toBe("Server error");
//   });

//   test("Admin can delete a trip schedule", async () => {
//     const trip = await TripSchedule.create({
//       route: testRouteId,
//       vehicle: testVehicleId,
//       departureTime: "08:00",
//       arrivalTime: "10:00",
//       status: "scheduled",
//     });

//     const res = await request(app)
//       .delete(`/api/v1/trip/admin/${trip._id}`)
//       .set("Authorization", `Bearer ${adminToken}`);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.message).toBe("Trip schedule deleted successfully");
//   });

//   test("Admin receives 404 when deleting non-existent trip schedule", async () => {
//     const fakeId = new mongoose.Types.ObjectId();
//     const res = await request(app)
//       .delete(`/api/v1/trip/admin/${fakeId}`)
//       .set("Authorization", `Bearer ${adminToken}`);

//     expect(res.statusCode).toBe(404);
//     expect(res.body.message).toBe("Trip schedule not found");
//   });

//   test("Admin receives 500 on server error for deleting trip", async () => {
//     jest.spyOn(TripSchedule, "findByIdAndDelete").mockImplementationOnce(() => {
//       throw new Error("DB error");
//     });

//     const res = await request(app)
//       .delete(`/api/v1/trip/admin/${testTripId}`)
//       .set("Authorization", `Bearer ${adminToken}`);

//     expect(res.statusCode).toBe(500);
//     expect(res.body.message).toBe("Server error");
//   });

//   test("Non-admin user cannot create trip schedule", async () => {
//     const userPayload = {
//       userId: new mongoose.Types.ObjectId(),
//       role: "user",
//     };
//     const userToken = jwt.sign(userPayload, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "1h" });

//     const res = await request(app)
//       .post("/api/v1/trip/admin")
//       .set("Authorization", `Bearer ${userToken}`)
//       .send({
//         route: testRouteId,
//         vehicle: testVehicleId,
//         departureTime: "08:00",
//         arrivalTime: "10:00",
//       });

//     expect(res.statusCode).toBe(403);
//     expect(res.body.message).toBe("Admin access required");
//   });

//   test("Non-admin user cannot update trip schedule", async () => {
//     const trip = await TripSchedule.create({
//       route: testRouteId,
//       vehicle: testVehicleId,
//       departureTime: "08:00",
//       arrivalTime: "10:00",
//       status: "scheduled",
//     });

//     const userPayload = {
//       userId: new mongoose.Types.ObjectId(),
//       role: "user",
//     };
//     const userToken = jwt.sign(userPayload, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "1h" });

//     const res = await request(app)
//       .put(`/api/v1/trip/admin/${trip._id}`)
//       .set("Authorization", `Bearer ${userToken}`)
//       .send({ departureTime: "09:00" });

//     expect(res.statusCode).toBe(403);
//     expect(res.body.message).toBe("Admin access required");
//   });

//   test("Non-admin user cannot delete trip schedule", async () => {
//     const trip = await TripSchedule.create({
//       route: testRouteId,
//       vehicle: testVehicleId,
//       departureTime: "08:00",
//       arrivalTime: "10:00",
//       status: "scheduled",
//     });

//     const userPayload = {
//       userId: new mongoose.Types.ObjectId(),
//       role: "user",
//     };
//     const userToken = jwt.sign(userPayload, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "1h" });

//     const res = await request(app)
//       .delete(`/api/v1/trip/admin/${trip._id}`)
//       .set("Authorization", `Bearer ${userToken}`);

//     expect(res.statusCode).toBe(403);
//     expect(res.body.message).toBe("Admin access required");
//   });

//   test("Unauthenticated user cannot fetch trip schedules", async () => {
//     const res = await request(app).get("/api/v1/trip");

//     expect(res.statusCode).toBe(401);
//   });

//   test("Unauthenticated user cannot create trip schedule", async () => {
//     const res = await request(app)
//       .post("/api/v1/trip/admin")
//       .send({
//         route: testRouteId,
//         vehicle: testVehicleId,
//         departureTime: "08:00",
//         arrivalTime: "10:00",
//       });

//     expect(res.statusCode).toBe(401);
//   });
});