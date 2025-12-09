const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
  items: [{ productId: String, name: String, qty: Number, price: Number }],
  total: Number,
  status: { type: String, default: 'placed' }
}, { timestamps:true });

module.exports = mongoose.model('Order', orderSchema);
