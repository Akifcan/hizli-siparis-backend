const router = require("express").Router();
const RestaurantController = require("../controllers/RestaurantController");
const restaurantController = new RestaurantController();

const { currentUser } = require("../middlewares/auth");

router.post("/register", restaurantController.register);
router.post("/login", restaurantController.login);
router.get("/current-user", currentUser, restaurantController.currentUser);
router.put(
  "/update-settings",
  currentUser,
  restaurantController.updateSettings
);
router.put(
  "/update-password",
  currentUser,
  restaurantController.updatePassword
);

module.exports = router;
