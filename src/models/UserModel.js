const md5 = require("md5");
const mongoose = require("mongoose");
const UserModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    max: 20,
  },
  password: {
    type: String,
    max: 150,
  },
  restaurant: {
    type: mongoose.Types.ObjectId,
    ref: "restaurants",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserModel.pre("save", function (next) {
  this.password = md5(this.password);
  next();
});

module.exports = mongoose.model("users", UserModel);
