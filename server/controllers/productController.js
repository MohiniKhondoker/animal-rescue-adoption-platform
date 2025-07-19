const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  try {
    const { name, description, amount } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (!name || !amount || typeof amount !== 'string') {
      return res.status(400).json({ message: 'Name and amount (as text) are required' });
    }

    const product = new Product({
      sellerId: req.user._id,
      name,
      description,
      amount,
      imageUrl,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('sellerId', 'name email')  // Populate seller name & email
      .select('name description amount imageUrl sellerId'); // include sellerId for frontend

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
