const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  grantAccessTo,
  updatePassword,
} = require("../controllers/authController");
const {
  getMe,
  updateMe,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

//PROTECTING ALL ROUTS THAT COME AFTER THIS POINT
router.use(protect);
router.patch("/updatePassword", updatePassword);

router.get("/me", getMe, getUserById);
router.patch("/updateMe", updateMe);

router.use(grantAccessTo("admin"));
router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
