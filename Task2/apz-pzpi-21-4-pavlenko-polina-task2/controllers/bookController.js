const axios = require("axios");
const validator = require("validator");
const Book = require("./../models/bookModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllBooks = catchAsync(async (req, res) => {
  const books = await Book.find();
  res.status(200).json({
    status: "success",
    results: books.length,
    data: {
      books,
    },
  });
});

exports.createBook = catchAsync(async (req, res, next) => {
  const { isbn } = req.body;
  if (!validator.isISBN(isbn)) {
    return next(new AppError("The ISBN number is not valid! Try again..."));
  }
  //Get request to the Open Library API to fetch book details
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
  const googleapisRes = await axios.get(apiUrl);

  if (!googleapisRes.data.totalItems) {
    return next(
      new AppError("Sorry! We weren't able to find book with such ISBN...")
    );
  }
  const {
    title,
    authors,
    publishedDate,
    categories: genres,
    description,
  } = googleapisRes.data.items[0].volumeInfo;
  const book = await Book.create({
    isbn,
    title,
    author: authors ? authors.join(", ") : "Unknown",
    year: publishedDate ? publishedDate.substring(0, 4) : null,
    genres,
    description,
  });

  res.status(201).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.getBookById = catchAsync(async (req, res, next) => {
  if (!validator.isMongoId(req.params.id)) {
    return next(new AppError("The value is not a mongo ID", 400));
  }
  const book = await Book.findById(req.params.id);
  if (!book) {
    return next(new AppError("No book found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});
