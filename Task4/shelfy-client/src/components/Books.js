import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useBooks } from "../hooks/useBooks";
import useRating from "../hooks/useRating";
import StarRating from "../components/StarRating";
import "./../styles/Books.css";

const Books = ({ fetchLink, loaderSize = 30 }) => {
  const [userRating, setUserRating] = useState("");
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const { books } = useBooks(fetchLink, user, setIsLoading);
  useRating(userRating, user);
  return (
    <div className="books">
      {!isLoading ? (
        books.map((book) => (
          <div key={book._id} className="book">
            <Link to={`/shelf/${book._id}`}>
              <img src={book.cover} alt={book.title} />
            </Link>
            <p>
              {book.title.length <= 20
                ? book.title
                : `${book.title.slice(0, 20)}...`}
            </p>
            <p className="author">{book.author.split(",")[0]}</p>
            <StarRating
              bookId={book._id}
              size={30}
              defaultRating={book.rating}
              color="#b996d4"
              onSetRating={setUserRating}
            />
          </div>
        ))
      ) : (
        <div className="loader">
          <l-jelly-triangle
            size={loaderSize}
            speed="1.75"
            color="#b996d4"
          ></l-jelly-triangle>
        </div>
      )}
    </div>
  );
};

export default Books;
