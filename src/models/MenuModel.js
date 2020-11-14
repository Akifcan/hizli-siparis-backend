const mongoose = require("mongoose");
const MenuModel = new mongoose.Schema({
  title: {
    type: String,
    min: 3,
    max: 100,
    required: true,
  },
  restaurant: {
    type: mongoose.Types.ObjectId,
    ref: "restaurants",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ["drink", "meat food", "dessert", "vegan food", "soup", "salad"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("menus", MenuModel);
