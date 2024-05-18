import { React } from "react";
import { useNavigate } from "react-router-dom";
import Books from "../components/Books";
import bannerBooks from "./../assets/book-stack.svg";
import { useTranslation } from "react-i18next";
import "./../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigate = () =>{
    navigate("/shelf")
  }
  return (
    <div className="home">
      <div className="banner">
        <h1>{t("Manage your home library!")}</h1>
        <p>
         {t("Organize and classify your")}
          <br />
          {t("book shelfs easily")}
        </p>
        <button onClick={handleNavigate}>{t("View All")}</button>
        <img src={bannerBooks} alt="Book Stack" />
      </div>
      <div className="latest-additions">
          <>
            <p> {t("Your latest additions to the shelf")}</p>
            <Books
              fetchLink="http://127.0.0.1:3001/api/v1/shelf?sort=-addedAt&limit=5"

            />
          </>

      </div>
    </div>
  );
};

export default Home;
