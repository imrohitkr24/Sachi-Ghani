const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String },
  items: [{ productId: String, name: String, qty: Number, price: Number }],
  total: Number,
  customerDetails: {
    fullName: String,
    phone: String,
    address: String,
    district: String,
    pincode: String,
    utr: String
  },
  paymentProof: { type: String }, // URL/path to uploaded file
  status: { type: String, default: 'placed' },
  deliveryMethod: { type: String, enum: ['delivery', 'pickup'], default: 'delivery' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
