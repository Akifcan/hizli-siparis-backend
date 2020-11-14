const { GLOBAL_MESSAGES } = require("../constants/messages");
const TableModel = require("../models/TableModel");
const MenuModel = require("../models/MenuModel");
const OrderModel = require("../models/OrderModel");
const OrderDal = require("../data-access/OrderDal");
const mongoose = require("mongoose");

class OrderController {
  async orderDeactive(req, res) {
    const orderDal = new OrderDal();
    const _id = req.params.id;
    const deactive = await orderDal.deactiveOrder({ table: _id });
    return deactive;
  }

  async createOrder(req, res) {
    const order = await OrderModel.findOne({
      table: mongoose.Types.ObjectId(req.body.table),
      menuId: mongoose.Types.ObjectId(req.body.menu),
      restaurant: mongoose.Types.ObjectId(req.restaurant._id),
      active: true,
    });
    if (order) {
      order.quantity = parseInt(req.body.quantity);
      order.price = order.menu.price * order.quantity;
      const updateOrder = await order.save();
      res.status(200).json({
        status: true,
        message: "Sipariş güncellenmiştir",
        order: updateOrder,
      });
    } else {
      const table = await TableModel.updateOne(
        { _id: req.body.table, restaurant: req.restaurant._id },
        { occupied: true }
      );
      if (table.n == 1) {
        const menu = await MenuModel.findOne({ _id: req.body.menu });
        const newOrder = await OrderModel.create({
          menu,
          menuId: menu,
          quantity: parseInt(req.body.quantity),
          price: menu.price * parseInt(req.body.quantity),
          table: req.body.table,
          restaurant: req.restaurant._id,
        });
        res.status(200).json({
          status: true,
          message: "Sipariş alınmıştır",
          order: newOrder,
        });
      }
    }
  }

  async orders(req, res) {
    const orders = await OrderModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $match: { active: true, restaurant: req.restaurant._id } },
      {
        $lookup: {
          from: "tables",
          localField: "table",
          foreignField: "_id",
          as: "tables",
        },
      },
    ]);
    res.status(200).json({ status: true, orders });
  }

  async earnings(req, res) {
    const totalEarnings = await OrderModel.aggregate([
      {
        $match: { restaurant: mongoose.Types.ObjectId(req.restaurant._id) },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalUnitsSold: {
            $sum: "$price",
          },
        },
      },
    ]);
    res.send(totalEarnings);
  }

  async todayOrders(req, res) {
    try {
      const orderDal = new OrderDal();
      const orders = await orderDal.getTodayOrders(req.restaurant._id);
      res.status(200).json({ status: true, orders });
    } catch (e) {
      console.log(e);
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async allOrders(req, res) {
    try {
      console.log(req.query);
      const orderDal = new OrderDal();
      const totalOrderCount = await orderDal.totalOrderCount(
        req.restaurant._id
      );
      const orders = await orderDal.allOrders(
        req.restaurant._id,
        parseInt(req.query.page) || 1
      );
      res.status(200).json({
        status: true,
        orders,
        totalPage: Math.floor(totalOrderCount) / 5,
      });
    } catch (e) {
      console.log(e);
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async totalEarningsCount(req, res) {
    try {
      const orderDal = new OrderDal();
      const result = await orderDal.totalEarningsCount(req.restaurant._id);
      res.status(200).json({ status: true, earnings: result });
    } catch (e) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }
}

module.exports = OrderController;
