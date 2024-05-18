import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { jellyTriangle } from "ldrs";
import { useAuthContext } from "../hooks/useAuthContext";
import { useBooks } from "../hooks/useBooks";
import { useTranslation } from "react-i18next";
import useRating from "../hooks/useRating";
import StarRating from "../components/StarRating";
import "./../styles/Book.css";
import bin from "./../assets/bin.svg";
import infoBook from "./../assets/info-book.svg";

jellyTriangle.register();

function Book() {
  const [userRating, setUserRating] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { bookId } = useParams();
  const fetchLink = `http://127.0.0.1:3001/api/v1/shelf/${bookId}`;
  const { user } = useAuthContext();
  const { books } = useBooks(fetchLink, user, setIsLoading);
  const { t } = useTranslation();

  useRating(userRating, user);

  if (!books || books.length === 0) {
    return (
      <div className="loader">
        <l-jelly-triangle
          size="50"
          speed="1.75"
          color="#b996d4"
        ></l-jelly-triangle>
      </div>
    );
  }
  const book = books[0];
  const year = new Date(book.year).getFullYear();
  let displayedDescription;
  let words;
  if (book.description) {
    words = book.description.split(" ");
    displayedDescription = showFullDescription
      ? book.description
      : words.slice(0, 130).join(" ");
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleUpdateBook = async (event, elem) => {
    const value = event.target.value;
    if (elem === "status") {
      setStatus(event.target.value);
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/api/v1/shelf/${book._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user}`,
          },
          body: JSON.stringify({ [elem]: value }),
        }
      );
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const handleRemoveBook = async () => {
    const confirmMessage = `${t("Remove")} ${book.title} ${t("from your shelf?")}`;
    const isConfirmed = window.confirm(confirmMessage);
    if (isConfirmed) {
      try {
        const response = await fetch(
          `http://127.0.0.1:3001/api/v1/shelf/remove/${book._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user}`,
            },
          }
        );
        if (response.ok) {
          setIsDeleted(true);
        }
      } catch (error) {
        console.error("Error removing book:", error);
      }
    }
  };
  return (
    <>
      {!isDeleted ? (
        <>
          <div className="book-page">
            <img className="book-cover" src={book.cover} alt={book.title} />
            <div>
              <h2>{book.title}</h2>
              <button className="delete-book" onClick={handleRemoveBook}>
                <img src={bin} alt="Delete" />
              </button>
            </div>
            <StarRating
              bookId={book._id}
              size={45}
              defaultRating={book.rating}
              color="#b996d4"
              onSetRating={setUserRating}
            />
            <p className="status">
             {t("Status")}
              <select
                value={status ? status : book.status}
                onChange={(event) => handleUpdateBook(event, "status")}
              >
                <option value="Want to read">{t("Want to read")}</option>
                <option value="Reading">{t("Reading")}</option>
                <option value="Finished">{t("Finished")}</option>
              </select>
            </p>
            <p>
              {t("Author1")} <span>{book.author}</span>
            </p>
            <p>
               {t("Year")}<span>{year}</span>
            </p>
            <p>
              {t("Genre")}<span>{book.genres ? book.genres : "Fiction"}</span>
            </p>
            <label>
            {t("Notes")}{" "}
              <textarea
                defaultValue={book.notes}
                onBlur={(event) => handleUpdateBook(event, "notes")}
              ></textarea>
            </label>
            <p>
              ISBN: <span>{book.isbn}</span>
            </p>
            <p className="about">
              {words && (
                <>
                  {t("About")} <span>{displayedDescription}</span>
                  {words.length > 130 && (
                    <p onClick={toggleDescription}>
                      {showFullDescription ? t("Show less" ): t("Read more")}
                    </p>
                  )}
                </>
              )}
            </p>
          </div>
        </>
      ) : (
        <div className="deleted-message">
          <img src={infoBook} alt="Book Icon" />
          <p className="deleted-mesage">
            {t("The book was successfully removed from shelf!")}
            <br />
            <br />
            <Link to={`/addbook`}>{t("Add new book")}</Link>
            <br />
            <Link to={`/`}> {t("Home")}</Link>
            <br />
            <Link to={`/shelf`}> {t("Book Shelf")}</Link>
          </p>
        </div>
      )}
    </>
  );
}

export default Book;
