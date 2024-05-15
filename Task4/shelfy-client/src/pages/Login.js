import { React, useState } from "react";
import { useLogin } from "../hooks/useLogin";
import logo from "./../assets/auth-book.svg";
import "./../styles/Login.css";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, error, isLoading } = useLogin();
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const { email, password } = formData;
    e.preventDefault();
    await login(email, password);
  };
  return (
    <div className="login">
      <div className="titles">
        <img src={logo} alt="Pink Book" />
        <h1>{t("log in to")}</h1>
        <h2>Shelfy</h2>
        <p>
          {t("If you don't have an account")}
          <br />
          {t("You can")} <a href="/signup">{t("Register here!")}</a>
        </p>
      </div>
      <div className="login-form">
        <h2>{t("login")}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("Enter email")}
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t("Enter password")}
            required
          />
          <a href="#">{t("Forgot password?")}</a>
          <button type="submit" disabled={isLoading}>
            {t("login")}
          </button>
        </form>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Login;
