const router = require("express").Router();
router.use("/restaurant", require("./restaurantRouter"));
router.use("/table", require("./tableRouter"));
router.use("/menu", require("./menuRouter"));
router.use("/user", require("./userRouter"));
router.use("/order", require("./orderRouter"));
module.exports = router;
