const mongoose = require("mongoose");
const TableModel = new mongoose.Schema({
  tableRow: Number,
  restaurant: {
    type: mongoose.Types.ObjectId,
    ref: "restaurants",
  },
  tableName: {
    type: String,
    min: 3,
    max: 10,
    required: true,
  },
  occupied: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("tables", TableModel);
