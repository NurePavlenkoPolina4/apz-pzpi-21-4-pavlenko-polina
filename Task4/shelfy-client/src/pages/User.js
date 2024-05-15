import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useTranslation } from "react-i18next";
import { jellyTriangle } from "ldrs";
import "./../styles/User.css";

const User = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(null);
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const { user, dispatch } = useAuthContext();
  const { logout } = useLogout();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    async function getUserName() {
      try {
        const res = await fetch(`http://127.0.0.1:3001/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });
        const data = await res.json();
        setName(data.data.user.name);
        setEmail(data.data.user.email);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    getUserName();
  }, [user]);

  const handleChangeUserData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3001/api/v1/users/updateMe", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setMessage1("Data updated successfully!");
      } else if (
        !res.ok &&
        data.error.errorResponse.codeName === "DuplicateKey"
      ) {
        setMessage1("User with such email already exists!");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await handleUpdatePassword();
  };
  const handleUpdatePassword = async () => {
    if (newPassword !== newPasswordConfirm) {
      return setMessage2("Passwords are not the same!");
    } else if (newPassword.length < 8) {
      return setMessage2("Password should contain at least 8 characters!");
    }
    try {
      const res = await fetch(
        "http://127.0.0.1:3001/api/v1/users/updatePassword",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
            newPasswordConfirm,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("jwt", JSON.stringify(data.token));
        dispatch({ type: "LOGIN", payload: data.token });
        setMessage2("Password updated successfully!");
      } else if (!res.ok) {
        setMessage2(data.message);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  const handleLogout = () => {
    logout();
    navigate('/login')
  };
  return (
    <div className="user">
      {name && (
        <div className="user-data">
          <div className="user-avatar">{name[0]}</div>
          <h1>{t("My Data")}</h1>
          <label>
            {t("Name")}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
          {t("Email")}
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <h2>{t("Change Password")}</h2>
          <form className="change-password" onSubmit={handleFormSubmit}>
            <label>
              {t("Old password")}
              <input
                type="password"
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </label>
            <label>
            {t("New password")}
              <input
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <label>
            {t("Confirm password")}:
              <input
                type="password"
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
              />
            </label>
            <button type="submit">{t("Submit")}</button>
            <p className="error">{message2}</p>
          </form>
          <p className="error">{message1}</p>
          <button className="save" onClick={handleChangeUserData}>
            {t("Save")}
          </button>
          <button className="logout" onClick={handleLogout}>
             {t("Log Out")}
          </button>
        </div>
      )}
      {isLoading && (
        <div className="loader">
          <l-jelly-triangle
            size="50"
            speed="1.75"
            color="#b996d4"
          ></l-jelly-triangle>
        </div>
      )}
    </div>
  );
};
export default User;
