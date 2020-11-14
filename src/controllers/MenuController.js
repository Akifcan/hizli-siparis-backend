const { GLOBAL_MESSAGES } = require("../constants/messages");
const MenuModel = require("../models/MenuModel");

class MenuController {
  async createMenu(req, res, next) {
    try {
      await MenuModel.create({ ...req.body, restaurant: req.restaurant._id });
      res.status(200).json({ status: true, message: "Menü oluşturulmuştur." });
    } catch (error) {
      console.log(error);
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async menus(req, res, next) {
    try {
      const menus = await MenuModel.find({ restaurant: req.restaurant._id });
      res.status(200).json({ status: true, menus });
    } catch (error) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async menu(req, res, next) {
    try {
      const _id = req.params.id;
      const menu = await MenuModel.findOne({
        restaurant: req.restaurant._id,
        _id,
      });
      res.status(200).json({ status: true, menu });
    } catch (error) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async removeMenu(req, res, next) {
    try {
      const { id: _id } = req.params;
      const removeTable = await MenuModel.deleteOne({
        restaurant: req.restaurant._id,
        _id,
      });
      if (removeTable.n == 1) {
        res.status(200).json({ status: true, message: "Bu menü silinmiştir" });
      } else {
        res.locals.badRequestError(GLOBAL_MESSAGES);
      }
    } catch (error) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async updateMenu(req, res, next) {
    try {
      const { id: _id } = req.params;
      const updateTable = await MenuModel.updateOne(
        { restaurant: req.restaurant._id, _id },
        req.body
      );
      if (updateTable.n == 1) {
        res
          .status(200)
          .json({ status: true, message: "Bu menü güncellenmiştir" });
      } else {
        res.locals.badRequestError(GLOBAL_MESSAGES);
      }
    } catch (error) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }
}
module.exports = MenuController;
