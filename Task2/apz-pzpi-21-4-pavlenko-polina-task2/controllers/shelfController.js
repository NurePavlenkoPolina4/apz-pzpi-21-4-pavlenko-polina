const axios = require("axios");
const validator = require("validator");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const mergeBookData = async (req, bookIds) => {
  const objectIdArray = bookIds.map((id) => new mongoose.Types.ObjectId(id));
  let pipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(req.user.id) } },
    { $unwind: "$books" },
    {
      $lookup: {
        from: "books",
        localField: "books.id",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    { $unwind: "$bookDetails" },
    { $match: { "books.id": { $in: objectIdArray } } },
    {
      $project: {
        _id: "$bookDetails._id",
        isbn: "$bookDetails.isbn",
        title: "$bookDetails.title",
        author: "$bookDetails.author",
        year: "$bookDetails.year",
        genres: "$bookDetails.genres",
        description: "$bookDetails.description",
        status: "$books.status",
        rating: "$books.rating",
        notes: "$books.notes",
        addedAt: "$books.addedAt",
      },
    },
  ];

  if (req.query.search) {
    const search = req.query.search;
    pipeline.push({
      $match: {
        $or: [
          { isbn: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
        ],
      },
    });
  }
  if (req.query.sort) {
    const sortByArr = req.query.sort.split(",");
    sortByArr.forEach((sortBy) => {
      let order = 1; // default to ascending
      if (sortBy[0] === "-") {
        sortBy = sortBy.substring(1);
        order = -1; // set to descending if '-' is present
      }
      pipeline.push({ $sort: { [sortBy]: order } });
    });
  }
  if (req.query.page || req.query.limit) {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip }, { $limit: limit });
  }

  // Execute aggregation pipeline
  const bookshelf = await User.aggregate(pipeline);
  return bookshelf;
};

exports.addBookToShelf = catchAsync(async (req, res, next) => {
  const { isbn } = req.body;
  if (!validator.isISBN(isbn)) {
    return next(new AppError("The ISBN number is not valid! Try again..."));
  }
  let book = await Book.findOne({ isbn });
  if (!book) {
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
    book = await Book.create({
      isbn,
      title,
      author: authors ? authors.join(", ") : "Unknown",
      year: publishedDate ? publishedDate.substring(0, 4) : null,
      genres,
      description,
    });
  }
  let user = req.user;
  if (
    user.books.some(
      (userBook) => userBook.id.toString() === book._id.toString()
    )
  ) {
    return next(new AppError("This book is already in your shelf", 400));
  }
  user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { books: { id: book._id } } },
    { new: true, runValidators: true }
  );
  res.status(201).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.getShelf = catchAsync(async (req, res, next) => {
  const bookIds = req.user.books.map((book) => book.id);

  const mergedBooks = await mergeBookData(req, bookIds);
  res.status(200).json({
    status: "success",
    results: mergedBooks.length,
    data: {
      books: mergedBooks,
    },
  });
});

exports.getBookFromShelf = catchAsync(async (req, res, next) => {
  const bookId = [req.params.id];
  if (
    !req.user.books.some(
      (userBook) => userBook.id.toString() === bookId.toString()
    )
  ) {
    return next(new AppError("User's shelf doesn't contain such book", 404));
  }
  const mergedBooks = await mergeBookData(req, bookId);

  res.status(200).json({
    status: "success",
    data: {
      book: mergedBooks,
    },
  });
});

exports.removeBookFromShelf = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;
  if (
    !req.user.books.some(
      (userBook) => userBook.id.toString() === bookId.toString()
    )
  ) {
    return next(new AppError("User's shelf doesn't contain such book", 404));
  }
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { books: { id: bookId } } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Book removed from user shelf",
  });
});

exports.updateBookReview = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;
  const { status, notes, rating } = req.body;
  if (
    !req.user.books.some(
      (userBook) => userBook.id.toString() === bookId.toString()
    )
  ) {
    return next(new AppError("User's shelf doesn't contain such book", 404));
  }
  const updateFields = {};
  if (status) updateFields["books.$.status"] = status;
  if (notes) updateFields["books.$.notes"] = notes;
  if (rating) updateFields["books.$.rating"] = rating;

  // Update the corresponding book in the user's books array
  const user = await User.findOneAndUpdate(
    { _id: req.user.id, "books.id": bookId },
    { $set: updateFields },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    message: "Book review updated successfully",
  });
});
