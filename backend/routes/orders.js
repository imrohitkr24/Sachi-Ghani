const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/order');

// place order - protected
router.post('/', auth, async (req, res) => {
  const { items, total, customerDetails, deliveryMethod, paymentProof } = req.body;
  try {
    const orderId = Math.floor(100000 + Math.random() * 900000).toString();
    const order = new Order({
      user: req.user.id,
      orderId,
      items,
      total,
      customerDetails,
      deliveryMethod,
      paymentProof
    });
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// get my orders
router.get('/me', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});

// admin: all orders + summary
router.get('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: 'Forbidden' });
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders, orders });
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});

module.exports = router;
