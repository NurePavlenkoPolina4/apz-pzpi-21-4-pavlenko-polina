import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Header.css";
import search from "./../assets/search.svg";
import { useAuthContext } from "../hooks/useAuthContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./../context/LanguageContext";

const Header = ({ onSetSearch }) => {
  const [name, setName] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "uk" : "en");
  };

  useEffect(() => {
    if (user) {
      async function getUserName() {
        try {
          const res = await fetch(`http://127.0.0.1:3001/api/v1/users/me`, {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          });
          const data = await res.json();
          setName(data.data.user.name);
        } catch (error) {
          console.error(error);
        }
      }
      getUserName();
    }
  }, [user]);
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      onSetSearch(searchValue);
      navigate('/shelf') 
    }

  };
  const handleClickAvatar = () =>{
    navigate("/user")
  }
  return (
    <div className="header">
      <p className="logo">Shelfy</p>
      {user && (
        <>
          <div className="search">
            <input
              className="search-input"
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder={t("Search by title, author, ISBN")}
            />
            <img src={search} alt="Search icon" />
          </div>
          <div className="avatar" onClick={handleClickAvatar}>{name[0]}</div>
        </>
      )}
      <button className="language" onClick={toggleLanguage}>{t("language")}</button>

    </div>
  );
};

export default Header;
