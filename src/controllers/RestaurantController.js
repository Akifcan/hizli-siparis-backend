const { GLOBAL_MESSAGES } = require("../constants/messages");
const { BadRequest, NotFound } = require("../utils/errors");
const RestaurantModel = require("../models/RestaurantModel");
const md5 = require("md5");

class RestaurantController {
  async register(req, res, next) {
    try {
      const create = await RestaurantModel.create(req.body);
      const token = res.locals.createToken({ id: create._id });
      return res.status(200).json({
        status: true,
        create,
        message: "Hesabınız oluşturulmuştur",
        token,
      });
    } catch (error) {
      if (error.name == "MongoError" && error.code == 11000) {
        return next(
          new BadRequest(`Bu ${Object.keys(error.keyValue)} ile kayıt yapılmış`)
        );
      } else {
        return next(new Error(GLOBAL_MESSAGES));
      }
    }
  }

  async login(req, res, next) {
    try {
      const email = req.body.email;
      const password = res.locals.md5(req.body.password);
      const restaurant = await RestaurantModel.findOne({ email, password });
      if (restaurant) {
        const token = res.locals.createToken({ id: restaurant._id });
        res.status(200).json({
          status: true,
          message: "Giriş başarılı",
          user: restaurant,
          token,
        });
      } else {
        return next(
          new NotFound(`Bu bilgilerle kayıtlı bir restoran bulunamadı`)
        );
      }
    } catch (error) {
      return next(new Error(GLOBAL_MESSAGES));
    }
  }

  currentUser(req, res) {
    res.status(200).send({ user: req.restaurant, status: true });
  }

  async updateSettings(req, res) {
    if (req.body.loginCode) {
      console.log("login code exists!");
      if (req.body.loginCode.length < 5) {
        return res.status(400).json({
          status: false,
          message: "Giriş kodu en fazla 5 karakter olmalı",
        });
      }
    }

    try {
      const update = await RestaurantModel.updateOne(
        { _id: req.restaurant._id },
        req.body
      );
      if (update.n == 1) {
        res
          .status(200)
          .json({ status: true, message: "Bilgileriniz güncellenmiştir" });
      }
    } catch (error) {
      return next(new Error(GLOBAL_MESSAGES));
    }
  }

  async updatePassword(req, res) {
    try {
      let { oldPassword, newPassword } = req.body;
      if (oldPassword.length >= 5 && newPassword.length >= 5) {
        if (oldPassword != newPassword) {
          const restaurant = await RestaurantModel.findOne({
            _id: req.restaurant._id,
          }).select("+password");
          console.log(restaurant.password);
          console.log(md5(oldPassword));
          if (md5(oldPassword) == restaurant.password) {
            restaurant.password = newPassword;
            await restaurant.save();
            res.status(200).json({
              status: true,
              message: "Şifreniz güncellenmiştir",
            });
          } else {
            res.status(400).json({
              status: false,
              message: "Eski şifrenizi hatalı girdiniz",
            });
          }
        } else {
          res
            .status(400)
            .json({ status: false, message: "Girdiğiniz şifreler aynı" });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "Lütfen şifre bilgilerini doğru giriniz",
        });
      }
    } catch (error) {
      return next(new Error(GLOBAL_MESSAGES));
    }
  }
}
module.exports = RestaurantController;
