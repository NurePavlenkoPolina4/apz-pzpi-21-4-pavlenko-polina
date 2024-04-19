const express = require("express");
const { protect, grantAccessTo } = require("../controllers/authController");
const {
  addBookToShelf,
  getShelf,
  removeBookFromShelf,
  getBookFromShelf,
  updateBookReview,
} = require("../controllers/shelfController");

const router = express.Router();

//PROTECTING ALL ROUTS THAT COME AFTER THIS POINT
router.use(protect);

router.route("/").get(getShelf).post(addBookToShelf);

router.route("/:id").get(getBookFromShelf).patch(updateBookReview);
router.route("/remove/:id").patch(removeBookFromShelf);

module.exports = router;
