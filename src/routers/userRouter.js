const router = require("express").Router();
const UserController = require("../controllers/UserController");
const userController = new UserController();
const { currentUser, user } = require("../middlewares/auth");

//For restaurant
router.post("/", currentUser, userController.createUser);
router.get("/", currentUser, userController.users);

router.get("/current-user", user, userController.currentUser);

router.get("/:id", currentUser, userController.getUser);
router.delete("/:id", currentUser, userController.removeUser);
router.put("/:id", currentUser, userController.updateUser);

//login
router.post("/login", currentUser, userController.login);
router.post("/restaurant-login", userController.restaurantLogin);

module.exports = router;
