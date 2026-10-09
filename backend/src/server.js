require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;
const RESERVATION_STATUSES = ["pending", "confirmed", "seated", "preparing", "ready", "served", "cancelled", "no_show"];

const reservationSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    date: { type: String, required: true, index: true },
    time: { type: String, required: true },
    timeMinutes: { type: Number, index: true },
    partySize: { type: Number, required: true, min: 1 },
    userName: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    tableIds: { type: [String], default: [] },
    tableNames: { type: [String], default: [] },
    status: { type: String, enum: RESERVATION_STATUSES, default: "confirmed", index: true },
  },
  { strict: false, timestamps: true, versionKey: false, collection: "reservations" }
);
const Reservation = mongoose.models.Reservation || mongoose.model("Reservation", reservationSchema);
const kitchenTaskSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    station: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    status: { type: String, enum: ["open", "in_progress", "done"], default: "open" },
    dueTime: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false, collection: "kitchen_tasks" }
);
const KitchenTask = mongoose.models.KitchenTask || mongoose.model("KitchenTask", kitchenTaskSchema);

// Middleware
app.use(cors());
app.use(express.json());

// In-memory seed database matching high-fidelity mockups
let staffMembers = [
  {
    id: "staff-1",
    staffCode: "#ST-101",
    name: "Jane Doe",
    role: "MANAGER",
    department: "General Operations",
    isOnDuty: true,
    avatarColor: "purple",
    initials: "JD",
    email: "jane.doe@restaurant.com",
    phone: "+1 (555) 234-5678",
    shift: "Dinner Shift A",
  },
  {
    id: "staff-2",
    staffCode: "#ST-108",
    name: "Mark Smith",
    role: "KITCHEN",
    department: "Head Line Chef",
    isOnDuty: true,
    avatarColor: "orange",
    initials: "MS",
    email: "mark.smith@restaurant.com",
    phone: "+1 (555) 345-6789",
    shift: "Dinner Shift A",
  },
  {
    id: "staff-3",
    staffCode: "#ST-114",
    name: "Alex Lee",
    role: "STAFF",
    department: "Server & Host",
    isOnDuty: false,
    avatarColor: "gray",
    initials: "AL",
    email: "alex.lee@restaurant.com",
    phone: "+1 (555) 456-7890",
    shift: "Closing Shift B",
  },
  {
    id: "staff-4",
    staffCode: "#ST-122",
    name: "Rachel Wong",
    role: "STAFF",
    department: "Floor Lead",
    isOnDuty: true,
    avatarColor: "emerald",
    initials: "RW",
    email: "rachel.wong@restaurant.com",
    phone: "+1 (555) 567-8901",
    shift: "Dinner Shift A",
  },
];

let userProfile = {
  id: "mgr-4082",
  staffId: "#MGR-4082",
  name: "Kaweerna Sneha",
  email: "kaweerna.sneha@email.com",
  phone: "+1 (555) 789-0123",
  role: "General Manager",
  shiftInfo: "Floor & Service • Shift A",
  isOnShift: true,
  rating: 4.9,
  completedShifts: 142,
  floor: "Zone A",
  alertsAndSound: true,
  avatarUrl: "/staff_avatar.jpg",
};

let bookings = [];
let queue = [];
let kitchenTasks = [];

function localDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function reservationTimeMinutes(reservation) {
  if (Number.isFinite(Number(reservation.timeMinutes))) return Number(reservation.timeMinutes);
  const match = String(reservation.time || "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3] && match[3].toUpperCase();
  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function kitchenReservationView(booking) {
  return {
    ...booking,
    timeMinutes: reservationTimeMinutes(booking),
    guestCount: Number(booking.partySize),
    tableNames: Array.isArray(booking.tableNames)
      ? booking.tableNames
      : booking.tableName
        ? [booking.tableName]
        : [],
  };
}

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Restaurant API is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "in-memory (dev mode)",
    timestamp: new Date().toISOString(),
  });
});

// Authentication endpoints
app.post("/api/auth/login", (req, res) => {
  const { emailOrId, password } = req.body;
  if (!emailOrId || !password) {
    return res.status(400).json({ message: "Staff email/ID and password are required" });
  }

  const token = `jwt_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  res.json({
    message: "Sign in successful",
    token,
    user: userProfile,
  });
});

app.get("/api/auth/profile", (req, res) => {
  res.json({ data: userProfile });
});

app.put("/api/auth/profile", (req, res) => {
  userProfile = { ...userProfile, ...req.body };
  res.json({ message: "Profile updated", data: userProfile });
});

// Staff CRUD Endpoints
// 1. Read All
app.get("/api/staff", (req, res) => {
  res.json({ data: staffMembers });
});

// 2. Read One
app.get("/api/staff/:id", (req, res) => {
  const member = staffMembers.find((s) => s.id === req.params.id);
  if (!member) return res.status(404).json({ message: "Staff member not found" });
  res.json({ data: member });
});

// 3. Create
app.post("/api/staff", (req, res) => {
  const { name, role, department, isOnDuty, email, phone, staffCode } = req.body;
  if (!name || !role || !department) {
    return res.status(400).json({ message: "Name, role, and department are required" });
  }

  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();

  const newMember = {
    id: `staff-${Date.now()}`,
    staffCode: staffCode || `#ST-${123 + staffMembers.length}`,
    name: name.trim(),
    role,
    department: department.trim(),
    isOnDuty: isOnDuty ?? true,
    avatarColor: role === "MANAGER" ? "purple" : role === "KITCHEN" ? "orange" : "emerald",
    initials,
    email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@restaurant.com`,
    phone: phone || "+1 (555) 000-0000",
    shift: "Dinner Shift A",
  };

  staffMembers.push(newMember);
  res.status(201).json({ message: "Staff member added", data: newMember });
});

// 4. Update
app.put("/api/staff/:id", (req, res) => {
  const index = staffMembers.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Staff member not found" });

  staffMembers[index] = { ...staffMembers[index], ...req.body };
  res.json({ message: "Staff member updated", data: staffMembers[index] });
});

// 5. Delete
app.delete("/api/staff/:id", (req, res) => {
  const index = staffMembers.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Staff member not found" });

  const deleted = staffMembers.splice(index, 1)[0];
  res.json({ message: "Staff member removed", data: deleted });
});

// Dashboard endpoints
app.get("/api/dashboard/metrics", (req, res) => {
  const activeCount = staffMembers.filter((s) => s.isOnDuty).length;
  res.json({
    data: {
      reservationsToday: 24 + bookings.length,
      reservationsChange: "+14%",
      guestsInQueue: 6 + queue.length,
      queueWaitTime: "~12m wait",
      tablesOccupied: 12,
      tablesTotal: 20,
      noShows: 2,
      noShowsLevel: "Low",
      serviceName: "Dinner Service",
      shiftName: "Shift A",
      dateFormatted: "Wednesday, June 12",
      activeStaffCount: activeCount,
    },
  });
});

app.post("/api/reservations", (req, res) => {
  const { date, time, partySize, userName, phone } = req.body;
  if (!date || !time || !Number.isInteger(Number(partySize)) || Number(partySize) < 1 || !userName) {
    return res.status(400).json({ message: "Date, time, party size, and guest name are required" });
  }
  const booking = {
    id: `res-${Date.now()}`,
    ...req.body,
    partySize: Number(partySize),
    status: req.body.status || "confirmed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const normalizedBooking = kitchenReservationView(booking);
  if (mongoose.connection.readyState === 1) {
    return Reservation.create({ ...normalizedBooking, _id: normalizedBooking.id })
      .then((saved) => res.status(201).json({ message: "Reservation recorded", data: kitchenReservationView(saved.toObject()) }))
      .catch((error) => {
        console.error("Reservation save failed:", error.message);
        res.status(500).json({ message: "Could not save reservation" });
      });
  }
  bookings.push(normalizedBooking);
  res.status(201).json({ message: "Reservation recorded", data: normalizedBooking });
});

app.get("/api/reservations", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (req.query.date) filter.date = req.query.date;
      if (req.query.status) filter.status = req.query.status;
      const result = await Reservation.find(filter).sort({ timeMinutes: 1, time: 1 }).lean();
      return res.json({ data: result.map(kitchenReservationView) });
    }
    const result = bookings
      .filter((booking) => !req.query.date || booking.date === req.query.date)
      .filter((booking) => !req.query.status || booking.status === req.query.status)
      .map(kitchenReservationView)
      .sort((a, b) => a.timeMinutes - b.timeMinutes);
    res.json({ data: result });
  } catch (error) {
    console.error("Reservation list failed:", error.message);
    res.status(500).json({ message: "Could not load reservations" });
  }
});

app.get("/api/kitchen/today", async (req, res) => {
  const date = req.query.date || localDateValue();
  try {
    const reservations = mongoose.connection.readyState === 1
      ? (await Reservation.find({ date, status: { $nin: ["cancelled", "no_show"] } }).sort({ timeMinutes: 1 }).lean()).map(kitchenReservationView)
      : bookings
        .filter((booking) => booking.date === date)
        .filter((booking) => !["cancelled", "no_show"].includes(booking.status))
        .map(kitchenReservationView)
        .sort((a, b) => a.timeMinutes - b.timeMinutes);
    res.json({
      data: {
        date,
        totalReservations: reservations.length,
        totalGuests: reservations.reduce((total, booking) => total + booking.guestCount, 0),
        reservations,
      },
    });
  } catch (error) {
    console.error("Kitchen reservations load failed:", error.message);
    res.status(500).json({ message: "Could not load kitchen reservations" });
  }
});

app.patch("/api/reservations/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!RESERVATION_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${RESERVATION_STATUSES.join(", ")}` });
  }
  const booking = mongoose.connection.readyState === 1
    ? await Reservation.findById(req.params.id)
    : bookings.find((item) => item.id === req.params.id);
  if (!booking) return res.status(404).json({ message: "Reservation not found" });

  const updatedAt = new Date().toISOString();
  const update = { status, updatedAt };
  if (status === "seated") update.seatedAt = updatedAt;
  if (status === "preparing") update.preparingAt = updatedAt;
  if (status === "ready") update.readyAt = updatedAt;
  if (status === "served") update.servedAt = updatedAt;
  if (mongoose.connection.readyState === 1) {
    Object.assign(booking, update);
    await booking.save();
    return res.json({ message: "Reservation status updated", data: kitchenReservationView(booking.toObject()) });
  }
  Object.assign(booking, update);
  res.json({ message: "Reservation status updated", data: booking });
});

app.post("/api/kitchen/tasks", async (req, res) => {
  const title = String(req.body.title || "").trim();
  const station = String(req.body.station || "").trim();
  const { priority = "normal", dueTime = "", notes = "" } = req.body;
  if (!title || !station) {
    return res.status(400).json({ message: "Task title and station are required" });
  }
  if (!["low", "normal", "high"].includes(priority)) {
    return res.status(400).json({ message: "Priority must be low, normal, or high" });
  }
  const task = {
    id: `kt-${Date.now()}`,
    title,
    station,
    priority,
    status: "open",
    dueTime: String(dueTime),
    notes: String(notes),
  };
  try {
    if (mongoose.connection.readyState === 1) {
      const saved = await KitchenTask.create({ ...task, _id: task.id });
      return res.status(201).json({ message: "Kitchen task created", data: { ...saved.toObject(), id: saved._id } });
    }
    kitchenTasks.push(task);
    res.status(201).json({ message: "Kitchen task created", data: task });
  } catch (error) {
    console.error("Kitchen task create failed:", error.message);
    res.status(500).json({ message: "Could not create kitchen task" });
  }
});

app.get("/api/kitchen/tasks", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const tasks = await KitchenTask.find().sort({ status: 1, createdAt: -1 }).lean();
      return res.json({ data: tasks.map((task) => ({ ...task, id: task._id })) });
    }
    res.json({ data: [...kitchenTasks].sort((a, b) => b.id.localeCompare(a.id)) });
  } catch (error) {
    console.error("Kitchen task list failed:", error.message);
    res.status(500).json({ message: "Could not load kitchen tasks" });
  }
});

app.put("/api/kitchen/tasks/:id", async (req, res) => {
  const allowed = ["title", "station", "priority", "status", "dueTime", "notes"];
  const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  if (update.title !== undefined && !String(update.title).trim()) {
    return res.status(400).json({ message: "Task title cannot be empty" });
  }
  if (update.priority !== undefined && !["low", "normal", "high"].includes(update.priority)) {
    return res.status(400).json({ message: "Priority must be low, normal, or high" });
  }
  if (update.status !== undefined && !["open", "in_progress", "done"].includes(update.status)) {
    return res.status(400).json({ message: "Status must be open, in_progress, or done" });
  }
  try {
    if (mongoose.connection.readyState === 1) {
      const task = await KitchenTask.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).lean();
      if (!task) return res.status(404).json({ message: "Kitchen task not found" });
      return res.json({ message: "Kitchen task updated", data: { ...task, id: task._id } });
    }
    const task = kitchenTasks.find((item) => item.id === req.params.id);
    if (!task) return res.status(404).json({ message: "Kitchen task not found" });
    Object.assign(task, update);
    res.json({ message: "Kitchen task updated", data: task });
  } catch (error) {
    console.error("Kitchen task update failed:", error.message);
    res.status(500).json({ message: "Could not update kitchen task" });
  }
});

app.delete("/api/kitchen/tasks/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const deleted = await KitchenTask.findByIdAndDelete(req.params.id).lean();
      if (!deleted) return res.status(404).json({ message: "Kitchen task not found" });
      return res.json({ message: "Kitchen task deleted", data: { ...deleted, id: deleted._id } });
    }
    const index = kitchenTasks.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Kitchen task not found" });
    const [deleted] = kitchenTasks.splice(index, 1);
    res.json({ message: "Kitchen task deleted", data: deleted });
  } catch (error) {
    console.error("Kitchen task delete failed:", error.message);
    res.status(500).json({ message: "Could not delete kitchen task" });
  }
});

app.post("/api/queue", (req, res) => {
  const entry = { id: `q-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  queue.push(entry);
  res.status(201).json({ message: "Queue entry added", data: entry });
});

// Connect to MongoDB and start the API
async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected successfully");
    } else {
      console.log("MONGODB_URI not provided; running in local in-memory fallback mode");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup notice:", error.message);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend API running on port ${PORT} (standalone mode)`);
    });
  }
}

startServer();