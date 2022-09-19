const mongoose = require("mongoose");
const shoppingCartSchema = new mongoose.Schema(
  /*{
    user: { type: String, required: true },
    status: { type: String,default: 'PENDING'},
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      }],
  },
  { timestamps: true }*/
  {
  user: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default: 'PENDING'
  },
  products: {
    type: [],
    required: true
  },
} );

const shoppingCart = mongoose.model("Cart", shoppingCartSchema);
module.exports = shoppingCart;
