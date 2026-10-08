require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

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
  const booking = { id: `res-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  bookings.push(booking);
  res.status(201).json({ message: "Reservation recorded", data: booking });
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