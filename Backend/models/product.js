const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    ProductID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    price:{
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true,
    },
    barcodes: {
      type: [String], // Array to hold barcodes for each product's quantity
      required: true,
    },
    description: String,
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
// const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
