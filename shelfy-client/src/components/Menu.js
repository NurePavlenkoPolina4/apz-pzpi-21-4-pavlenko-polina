import { React, useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./../styles/Menu.css";

function Menu() {
  const [activeIndex, setActiveIndex] = useState(null); 
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = useMemo(() => [
    { text: t("Home"), href: "/" },
    { text: t("Book Shelf"), href: "/shelf" },
    { text: t("Add Book +"), href: "/addbook" }
  ], [t]);

  useEffect(() => {
    const currentPathname = location.pathname;
    const activeIndex = menuItems.findIndex(
      (item) => item.href === currentPathname
    );
    setActiveIndex(activeIndex);
  }, [location.pathname, menuItems]);

  return (
    <nav className="menu">
      <ul>
        {menuItems.map((menuItem, index) => (
          <li key={index}>
            <Link
              to={menuItem.href}
              className={`menu-item ${activeIndex === index ? "active" : ""}`}
            >
              {menuItem.text}
            </Link>
            <div
              className={`dot ${activeIndex === index ? "active" : ""}`}
            ></div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export default Menu;
