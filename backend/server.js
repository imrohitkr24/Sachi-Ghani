// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const User = require('./models/user');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(bodyParser.json());

// basic rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests from this IP, try again later.' }
});

// Connect DB
console.log('Attempting DB connection to: ' + process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.log('MongoDB connection ERROR: ' + err.message);
    console.error(err);
  });

// Nodemailer transport (example using SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sachi-ghani-proofs',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// Upload Endpoint - Cloudinary
app.post('/api/upload', (req, res, next) => {
  console.log('Upload request received');
  next();
}, upload.single('file'), (req, res) => {
  console.log('File upload processed');
  if (!req.file) {
    console.log('No file in request');
    return res.status(400).json({ message: 'No file uploaded' });
  }
  console.log('File saved to Cloudinary:', req.file.path);
  // Return the Cloudinary URL
  res.json({ url: req.file.path, filename: req.file.filename });
});

// Register
app.post('/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, passwordHash });
    await user.save();

    // issue token
    const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const Order = require('./models/order');

// Get User Cart
app.get('/api/cart', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.cart || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
});

// Update User Cart
app.put('/api/cart', authMiddleware, async (req, res) => {
  try {
    const { cart } = req.body; // array of items
    const user = await User.findById(req.user.id);
    user.cart = cart;
    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating cart' });
  }
});

// Create Order (Protected)
app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { items, total, customerDetails, deliveryMethod, paymentProof } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    const order = new Order({
      user: req.user.id,
      items,
      total,
      customerDetails,
      paymentProof,
      deliveryMethod,
      status: 'placed'
    });

    await order.save();
    res.status(201).json({ message: 'Order placed', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// Get User Orders
app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// Forgot password - create reset token and send email
app.post('/auth/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If that email exists, we sent instructions' }); // don't reveal

    const resetToken = (Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 40);
    user.resetToken = resetToken;
    user.resetExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset your Sachi Ghani password',
      text: `Click here to reset your password: ${resetUrl}`
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: 'If that email exists, instructions were sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
app.post('/auth/reset', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email, resetToken: token, resetExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const Feedback = require('./models/feedback');

// Get Feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const feed = await Feedback.find().sort({ createdAt: -1 }).limit(50);
    res.json(feed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching feedback' });
  }
});

// Post Feedback
app.post('/api/feedback', async (req, res) => {
  try {
    console.log('POST /api/feedback body:', req.body);
    const { name, message, rating } = req.body;
    if (!name || !message) return res.status(400).json({ message: 'Name and message required' });

    const feedback = new Feedback({ name, message, rating });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ message: 'Server error saving feedback' });
  }
});

// Update Feedback
app.put('/api/feedback/:id', async (req, res) => {
  try {
    const { name, message, rating } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { name, message, rating },
      { new: true }
    );
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating feedback' });
  }
});

// Delete Feedback
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting feedback' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
