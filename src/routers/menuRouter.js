const router = require("express").Router();
const MenuController = require("../controllers/MenuController");
const menuController = new MenuController();
const { currentUser, restaurantUser } = require("../middlewares/auth");

router.post("/", currentUser, menuController.createMenu);
router.get("/", currentUser, menuController.menus);
router.delete("/:id", currentUser, menuController.removeMenu);
router.put("/:id", currentUser, menuController.updateMenu);
router.get("/:id", currentUser, menuController.menu);

module.exports = router;
