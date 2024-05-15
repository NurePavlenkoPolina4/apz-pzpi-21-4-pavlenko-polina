import React from "react";
import "./../styles/Header.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./../context/LanguageContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";


const Header = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { logout } = useLogout();


  const toggleLanguage = () => {
    setLanguage(language === "en" ? "uk" : "en");
  };
  const handleLogout = () => {
    logout();
    navigate('/login')
  };
  return (
    <div className="header">
      <p className="logo">Shelfy Admin</p>
      <div>
        <button className="language" onClick={toggleLanguage}>
          {t("language")}
        </button>
        {user && <button className="delete-btn" onClick={handleLogout}> {t("Log Out")}</button>}
      </div>
    </div>
  );
};

export default Header;
