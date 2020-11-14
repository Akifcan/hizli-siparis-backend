const router = require("express").Router();
const OrderController = require("../controllers/OrderController");
const orderController = new OrderController();
const { restaurantUser, currentUser } = require("../middlewares/auth");

router.post("/create-order", restaurantUser, orderController.createOrder);
router.get("/", currentUser, orderController.orders);
router.get("/order-deactive/:id", currentUser, orderController.orderDeactive);
router.get("/earnings", currentUser, orderController.earnings);
router.get("/today-orders", currentUser, orderController.todayOrders);
router.get("/all-orders", currentUser, orderController.allOrders);
router.get(
  "/totalEarningsCount",
  currentUser,
  orderController.totalEarningsCount
);

module.exports = router;
