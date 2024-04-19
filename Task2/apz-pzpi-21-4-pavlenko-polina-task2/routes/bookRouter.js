const express = require("express");
const {
  getAllBooks,
  createBook,
  getBookById,
} = require("./../controllers/bookController");
const { protect, grantAccessTo } = require("../controllers/authController");
const router = express.Router();

router.use(protect);
router.use(grantAccessTo("admin"));
router.route("/").get(getAllBooks).post(createBook);

router.route("/:id/").get(getBookById);

module.exports = router;
