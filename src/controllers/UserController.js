const { GLOBAL_MESSAGES } = require("../constants/messages");
const UserModel = require("../models/UserModel");
const RestaurantModel = require("../models/RestaurantModel");
const md5 = require("md5");

class UserController {
  async restaurantLogin(req, res, next) {
    const { title, loginCode } = req.body;
    try {
      const restaurant = await RestaurantModel.findOne({ title, loginCode });
      if (restaurant) {
        const token = res.locals.createToken({ id: restaurant._id });
        res.status(200).json({ status: true, restaurant, token });
      } else {
        res.status(400).json({
          status: false,
          message: "Bu bilgilerde bir restoran bulunamadı",
        });
      }
    } catch (error) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  currentUser(req, res) {
    res.status(200).json({ user: req.user, status: true });
  }

  async login(req, res, next) {
    const { username, password } = req.body;
    try {
      const user = await UserModel.findOne({
        username,
        password: md5(password),
      });
      if (user) {
        const token = res.locals.createToken({ id: user._id });
        res.status(200).json({ status: true, user, token });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Böyle bir kullanıcı bulunamadı" });
      }
    } catch (error) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async createUser(req, res, next) {
    try {
      const userIsExists = await UserModel.findOne({
        restaurant: req.restaurant._id,
        username: req.body.username,
      });

      if (!userIsExists) {
        const user = await UserModel.create({
          ...req.body,
          restaurant: req.restaurant._id,
        });
        res
          .status(200)
          .json({ status: true, message: "Kullanıcı eklenmiştir", user });
      } else {
        res.status(400).json({
          status: true,
          message: "Bu isimde bir kullanıcı kayıt edilmiş",
        });
      }
    } catch (error) {
      console.log(error);
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async users(req, res) {
    try {
      const users = await UserModel.find({ restaurant: req.restaurant._id });
      res.status(200).json({ status: true, users });
    } catch (error) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async getUser(req, res, next) {
    try {
      const _id = req.params.id;
      const user = await UserModel.findOne({
        restaurant: req.restaurant._id,
        _id,
      });
      if (user) {
        res.status(200).json({ status: true, user });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Böyle bir kullanıcı bulunamadı" });
      }
    } catch (error) {
      console.log(error);
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async removeUser(req, res, next) {
    try {
      const { id: _id } = req.params;
      const removeUser = await UserModel.deleteOne({
        restaurant: req.restaurant._id,
        _id,
      });
      if (removeUser.n == 1) {
        res
          .status(200)
          .json({ status: true, message: "Bu kullanıcı silinmiştir" });
        const setTableRows = await getRestaurantTables({
          restaurant: req.restaurant._id,
        });
        setTableRows.forEach(async (table, index) => {
          await TableModel.updateOne(
            { _id: table._id },
            { tableRow: (index += 1) }
          );
        });
      } else {
        res.locals.badRequestError(GLOBAL_MESSAGES);
      }
    } catch (error) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id: _id } = req.params;
      const update = await UserModel.updateOne(
        { restaurant: req.restaurant._id, _id },
        req.body
      );
      if (update.n == 1) {
        res.status(200).json({
          status: true,
          message: "Bu kullanıcı bilgileri güncellenmiştir",
        });
      } else {
        res.locals.badRequestError(GLOBAL_MESSAGES);
      }
    } catch (error) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }
}
module.exports = UserController;
