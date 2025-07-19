const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  amount: { type: String, required: true }, // now it's a string
  imageUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
