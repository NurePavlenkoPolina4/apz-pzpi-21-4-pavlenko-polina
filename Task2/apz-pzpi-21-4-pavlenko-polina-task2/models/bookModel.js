const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    isbn: {
      type: String,
      required: [true, "A book must have an ISBN"],
      unique: true,
    },
    title: {
      type: String,
      required: [true, "A book must have a title"],
    },
    author: {
      type: String,
      required: [true, "A book must have an author"],
    },
    year: {
      type: Date,
    },
    genres: [{ type: String }],
    description: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
