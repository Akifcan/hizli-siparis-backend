const mongoose = require("mongoose");
const OrderModel = require("../models/OrderModel");

class OrderDal {
  async getOrderById({ restaurant, table }) {
    return await OrderModel.aggregate([
      {
        $match: {
          restaurant: mongoose.Types.ObjectId(restaurant),
          table: mongoose.Types.ObjectId(table),
        },
      },
      {
        $lookup: {
          from: "tables",
          localField: "table",
          foreignField: "_id",
          as: "table",
        },
      },
    ]);
  }

  async deactiveOrder({ table }) {
    return await OrderModel.updateMany(
      { table: mongoose.Types.ObjectId(table) },
      { active: false }
    );
  }

  async getTodayOrders(restaurantId) {
    var now = new Date();
    var startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    return await OrderModel.find({
      restaurant: mongoose.Types.ObjectId(restaurantId),
      createdAt: { $lte: new Date(startOfToday) },
    });
  }

  async allOrders(restaurantId, page) {
    const skipVal = (page - 1) * 5;
    return await OrderModel.find({
      restaurant: mongoose.Types.ObjectId(restaurantId),
    })
      .sort({ price: -1 })
      .skip(skipVal)
      .limit(5);
  }

  async totalOrderCount(restaurantId) {
    return await OrderModel.countDocuments({
      restaurant: mongoose.Types.ObjectId(restaurantId),
    });
  }

  async totalEarningsCount(restaurantId) {
    return await OrderModel.aggregate([
      {
        $match: { restaurant: mongoose.Types.ObjectId(restaurantId) },
      },
      { $group: { _id: "sum", amount: { $sum: "$price" } } },
    ]);
  }
}

module.exports = OrderDal;
