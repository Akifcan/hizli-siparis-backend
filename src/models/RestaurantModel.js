const md5 = require("md5");
const mongoose = require("mongoose");
const shortid = require("shortid");
const RestaurantModel = new mongoose.Schema({
  title: {
    type: String,
    min: 3,
    max: 50,
    required: true,
  },
  managerName: {
    type: String,
    min: 3,
    max: 50,
    required: true,
  },
  email: {
    type: String,
    min: 3,
    max: 100,
    required: true,
    unique: [true, "Bu e-posta adresi zaten kayıt edilmiş"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
  },
  loginCode: {
    type: String,
  },
  phoneNumber: {
    unique: true,
    type: String,
    min: 10,
    max: 10,
    required: true,
  },
  managerPhoneNumber: {
    type: String,
    min: 10,
    max: 10,
    required: true,
  },
  contact: {
    city: String,
    province: String,
    address: String,
  },
  password: {
    type: String,
    select: false,
    min: 5,
    max: 100,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

RestaurantModel.pre("save", function (next) {
  this.password = md5(this.password);
  this.loginCode = shortid.generate();
  next();
});

module.exports = mongoose.model("restaurants", RestaurantModel);
