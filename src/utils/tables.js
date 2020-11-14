const TableModel = require('../models/TableModel')

const getRestaurantTables = async (restaurant) => {
    return await TableModel.find(restaurant).sort({tableRow: 1})
}

module.exports = {
    getRestaurantTables
}