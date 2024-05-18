import { React, useState, useEffect } from "react";
import { useBooks } from "../hooks/useBooks";
import { useAuthContext } from "../hooks/useAuthContext";
import { useTranslation } from "react-i18next";
import Books from "../components/Books";
import "./../styles/Shelf.css";
import arrow from "./../assets/arrow.svg";
import reversedArrow from "./../assets/reversed-arrow.svg";

const Shelf = ({ search }) => {
  const [sortBy, setSortBy] = useState("addedAt");
  const [isLoading, setIsLoading] = useState(false);
  const [reverse, setReverse] = useState(false);
  const { t } = useTranslation();
  const [fetchLink, setFetchLink] = useState(
    `http://127.0.0.1:3001/api/v1/shelf?search=${search}&sort=${sortBy}`
  );
  const { user } = useAuthContext();
  const { books } = useBooks(fetchLink, user, setIsLoading);
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };
  const toggleReverse = () => {
    setReverse(!reverse);
  };
  useEffect(() => {
    setFetchLink(
      `http://127.0.0.1:3001/api/v1/shelf?search=${search}&sort=${
        reverse ? "-" : ""
      }${sortBy}`
    );
  }, [sortBy, reverse, search, fetchLink]);

  return (
    <div className="shelf-books">
      <div className="filter-container">
        <p>{books.length}{t("Books")}</p>
        <div className="filter">
          <button onClick={toggleReverse}>
            <img src={!reverse ? reversedArrow : arrow} alt="Arrow" />
          </button>
           {t("Sorder By:")}
          <select onChange={handleSortChange}>
            <option value="rating">{t("Rating")}</option>
            <option value="addedAt" selected>
               {t("Date Added")}
            </option>
            <option value="title"> {t("Title")}</option>
            <option value="author"> {t("Author")}</option>
          </select>
        </div>
      </div>
      <Books fetchLink={fetchLink} loaderSize="50" />
    </div>
  );
};
export default Shelf;
