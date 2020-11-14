const mongoose = require("mongoose");
const OrderModel = new mongoose.Schema({
  restaurant: {
    type: mongoose.Types.ObjectId,
    ref: "restaurants",
    required: true,
  },
  table: {
    type: mongoose.Types.ObjectId,
    ref: "tables",
    required: true,
  },
  menuId: mongoose.Types.ObjectId,
  menu: {},
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    required: true,
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("orders", OrderModel);
