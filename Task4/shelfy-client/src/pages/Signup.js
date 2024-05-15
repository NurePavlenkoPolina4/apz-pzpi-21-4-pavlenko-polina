import { React, useState } from "react";
import { useSignup } from "../hooks/useSignup";
import logo from "./../assets/auth-book.svg";
import "./../styles/Signup.css";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
  });
  const { signup, error, isLoading, setError } = useSignup();
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const { email, name, password, passwordConfirm } = formData;
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError("Passwords are not the same!");
    } else {
      await signup(email, name, password, passwordConfirm);
    }
  };
  return (
    <div className="signup">
      <div className="titles">
        <img src={logo} alt="Pink Book" />
        <h1>{t("Sign Up to")}</h1>
        <h2>Shelfy</h2>
        <p>{t("If you already have an account")}
          
          <br />{t("You can")}
          <a href="/login">{t("Log In here !")}</a>
        </p>
      </div>
      <div className="signup-form">
        <h2>{t("Sign Up")}</h2>
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
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("Create user name")}
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

          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder={t("Confirm password")}
            required
          />

          <button type="submit" disabled={isLoading}>
            {t("Register")}
          </button>
        </form>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Signup;
