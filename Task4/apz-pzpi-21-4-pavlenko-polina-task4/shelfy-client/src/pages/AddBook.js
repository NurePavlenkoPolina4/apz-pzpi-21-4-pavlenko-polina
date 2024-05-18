import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./../hooks/useAuthContext";
import { jellyTriangle } from "ldrs";
import { useTranslation } from "react-i18next";
import books from "./../assets/add-book.svg";
import "./../styles/AddBook.css";

const AddBook = () => {
  const [isbn, setIsbn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:3001/api/v1/shelf/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify({ isbn }),
      });
      const json = await response.json();
      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        setIsLoading(false);
        const bookId = json.data.book._id;
        navigate(`/shelf/${bookId}`);
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleIsbnChange = (event) => {
    setIsbn(event.target.value);
  };

  return (
    <>
      {!isLoading ? (
        <div className="new-book">
          <img src={books} alt="Books" />
          <h2>{t("Let’s add new book!")}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              ISBN:{" "}
              <input type="text" value={isbn} onChange={handleIsbnChange} />
            </label>
            <button type="submit">{t("Save")}</button>
          </form>
          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <div className="loader">
          <l-jelly-triangle
            size="50"
            speed="1.75"
            color="#b996d4"
          ></l-jelly-triangle>
        </div>
      )}
    </>
  );
};
export default AddBook;
