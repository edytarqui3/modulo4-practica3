const mongoose = require("mongoose");
const shoppingCartSchema = new mongoose.Schema({
  user: {
      type: String,
      required: true,
  },
  status: {
      type: String,
      required: true,
  },
  products: {
      type: [],
      required: true
  },
});

const shoppingCart = mongoose.model("Carts", shoppingCartSchema);
module.exports = shoppingCart;
