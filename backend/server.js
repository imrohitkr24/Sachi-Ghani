// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Models & Middleware
const User = require("./models/user");
const Order = require("./models/order");
const Feedback = require("./models/feedback");
const authMiddleware = require("./middleware/auth");

const app = express();

/* =======================
   BASIC CONFIG
======================= */
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/* =======================
   ✅ CORS (FINAL FIX)
======================= */
app.use(cors({
  origin: "https://sachi-ghani.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🔥 Preflight (OPTIONS) fix
app.options("*", cors());

// 🔥 Ensure OPTIONS never breaks due to any middleware
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

/* =======================
   MIDDLEWARE
======================= */
app.use(bodyParser.json());
app.use(helmet());

/* =======================
   RATE LIMITER (FIXED)
======================= */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: (req) => req.method === "OPTIONS",
  message: { message: "Too many requests, try later." }
});

/* =======================
   DATABASE
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

/* =======================
   EMAIL
======================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* =======================
   CLOUDINARY
======================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sachi-ghani-proofs",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

const upload = multer({ storage });

/* =======================
   ROOT & HEALTH
======================= */
app.get("/", (req, res) => {
  res.send("Sachi Ghani Backend is Live 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* =======================
   AUTH ROUTES
======================= */

// Register
app.post("/auth/register", authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/auth/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   FILE UPLOAD
======================= */
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No file uploaded" });

  res.json({ url: req.file.path });
});

/* =======================
   CART
======================= */
app.get("/api/cart", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.cart || []);
});

app.put("/api/cart", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.cart = req.body.cart;
  await user.save();
  res.json(user.cart);
});

/* =======================
   ORDERS
======================= */
app.post("/api/orders", authMiddleware, async (req, res) => {
  const order = await Order.create({
    user: req.user.id,
    ...req.body,
    status: "placed"
  });
  res.status(201).json(order);
});

app.get("/api/orders/me", authMiddleware, async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
});

app.get("/api/orders", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ message: "Admin only" });

  const orders = await Order.find();
  res.json(orders);
});

/* =======================
   FEEDBACK
======================= */
app.get("/api/feedback", async (req, res) => {
  const feed = await Feedback.find().sort({ createdAt: -1 });
  res.json(feed);
});

app.post("/api/feedback", async (req, res) => {
  const feedback = await Feedback.create(req.body);
  res.status(201).json(feedback);
});

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
