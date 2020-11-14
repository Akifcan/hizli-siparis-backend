const jwt = require("jsonwebtoken");
const RestaurantModel = require("../models/RestaurantModel");
const UserModel = require("../models/UserModel");

const currentUser = async (req, res, next) => {
  if (req.headers.authorization) {
    const decode = jwt.decode(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const restaurant = await RestaurantModel.findOne({ _id: decode.id });
    if (decode) {
      if (restaurant) {
        req.restaurant = restaurant;
        next();
      } else {
        res.locals.notFoundError("Bu bilgilere sahip restoran bulunamadı");
      }
    } else {
      res.locals.badRequestError("Lütfen giriş yapın");
    }
  } else {
    res.locals.badRequestError("Lütfen giriş yapın");
  }
};

const restaurantUser = async (req, res, next) => {
  if (req.headers.restaurantauthorization && req.headers.userauthorization) {
    const decodeRestaurant = jwt.decode(
      req.headers.restaurantauthorization,
      process.env.JWT_SECRET
    );
    const decodeUser = jwt.decode(
      req.headers.userauthorization,
      process.env.JWT_SECRET
    );
    if (decodeRestaurant && decodeUser) {
      const restaurant = await RestaurantModel.findOne({
        _id: decodeRestaurant.id,
      });
      const user = await UserModel.findOne({ _id: decodeUser.id });
      if (restaurant && user) {
        req.restaurant = restaurant;
        req.user = user;
        next();
      } else {
        res.locals.badRequestError("Bu giriş bilgileri hatalı");
      }
    }
  } else {
    res.locals.badRequestError("Lütfen giriş yapın");
  }
};

const user = async (req, res, next) => {
  if (req.headers.authorization) {
    const decode = jwt.decode(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const user = await UserModel.findOne({ _id: decode.id });
    if (decode) {
      if (user) {
        req.user = user;
        next();
      } else {
        res.locals.notFoundError("Bu bilgilere sahip kullanıcı bulunamadı");
      }
    } else {
      res.locals.badRequestError("Lütfen giriş yapın");
    }
  } else {
    res.locals.badRequestError("Lütfen giriş yapın");
  }
};

module.exports = { currentUser, restaurantUser, user };
