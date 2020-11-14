const { GLOBAL_MESSAGES } = require("../constants/messages");
const TableModel = require("../models/TableModel");
const { getRestaurantTables } = require("../utils/tables");

class TableController {
  async createTable(req, res, next) {
    try {
      const { tableName } = req.body;

      const tableNameUnique = await TableModel.findOne({
        restaurant: req.restaurant._id,
        tableName,
      });
      if (tableNameUnique) {
        return res
          .status(200)
          .json({ status: false, message: "Bu isimde bir masa var" });
      } else {
        let totalTable = await TableModel.countDocuments({
          restaurant: req.restaurant._id,
        });

        const table = await TableModel.create({
          tableName,
          tableRow: (totalTable += 1),
          restaurant: req.restaurant._id,
        });
        res
          .status(200)
          .json({ status: true, message: "Masa eklenmiştir", table });
      }
    } catch (error) {
      console.log(error);
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async restaurantTables(req, res, next) {
    let query;
    if (req.headers.fromuser) {
      query = {
        restaurant: req.restaurant._id,
        occupied: false,
      };
    } else {
      query = {
        restaurant: req.restaurant._id,
      };
    }
    try {
      const tables = await getRestaurantTables(query);
      res.status(200).json({ status: true, tables });
    } catch (error) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async removeTable(req, res, next) {
    try {
      const { id: _id } = req.params;
      const removeTable = await TableModel.deleteOne({
        restaurant: req.restaurant._id,
        _id,
      });
      if (removeTable.n == 1) {
        res.status(200).json({ status: true, message: "Bu masa silinmiştir" });
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

  async getTable(req, res) {
    try {
      const _id = req.params.id;
      const table = await TableModel.findOne({
        _id,
        restaurant: req.restaurant._id,
      });
      if (table) {
        res.status(200).json({ status: true, table });
      } else {
        res.status(400).json({ status: false, message: "Bulunamadı" });
      }
    } catch (error) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }

  async updateTable(req, res, next) {
    try {
      const { id: _id } = req.params;
      const updateTable = await TableModel.updateOne(
        { restaurant: req.restaurant._id, _id },
        req.body
      );
      if (updateTable.n == 1) {
        res
          .status(200)
          .json({ status: true, message: "Bu masa güncellenmiştir" });
      } else {
        res.locals.badRequestError(GLOBAL_MESSAGES);
      }
    } catch (error) {
      res.locals.badRequestError(GLOBAL_MESSAGES);
    }
  }
}
module.exports = TableController;
