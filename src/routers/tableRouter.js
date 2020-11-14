const router = require("express").Router();
const TableController = require("../controllers/TableController");
const tableController = new TableController();
const { currentUser } = require("../middlewares/auth");

router.post("/", currentUser, tableController.createTable);
router.get("/", currentUser, tableController.restaurantTables);
router.get("/:id", currentUser, tableController.getTable);
router.delete("/:id", currentUser, tableController.removeTable);
router.put("/:id", currentUser, tableController.updateTable);

module.exports = router;
