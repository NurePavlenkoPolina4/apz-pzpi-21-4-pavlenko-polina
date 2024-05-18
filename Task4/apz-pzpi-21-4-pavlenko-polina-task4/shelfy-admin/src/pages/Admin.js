import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useTranslation } from "react-i18next";
import { jellyTriangle } from "ldrs";
import "./../styles/Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const { user } = useAuthContext();
  const { t } = useTranslation();
  useEffect(() => {
    if (user) {
      async function getUserId() {
        try {
          const res = await fetch(`http://127.0.0.1:3001/api/v1/users/me`, {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          });
          const data = await res.json();
          setUserId(data.data.user._id);
          console.log(userId)
        } catch (error) {
          console.error(error);
        }
      }
      getUserId();
    }
  }, [user, userId]);
  useEffect(() => {
    setIsLoading(true);
    async function getUsers() {
      try {
        const res = await fetch(
          `http://127.0.0.1:3001/api/v1/users?sort=-name`,
          {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          }
        );
        const data = await res.json();
        setUsers(data.data.users);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    getUsers();
  }, [user]);

  const handleDeleteUser = async (userId) => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://127.0.0.1:3001/api/v1/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      });
      if (res.ok) {
        setMessage(t("User was deleted successfully!"));
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        setMessage(t("Couldn't delete user. Something went wrong."));
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  const handleRoleToggle = async (event, userId) => {
    const value = event.target.value;
    setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: value } : user
        )
      );
    try {
      setIsLoading(true);
      const res = await fetch(`http://127.0.0.1:3001/api/v1/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify({ role: value }),
      });
      if (res.ok) {
        setMessage(t("User role was updated successfully!"));
      } else {
        setMessage(t("Couldn't update user role. Something went wrong."));
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  return (
    <div className="admin">
      {users && (
        <div className="table-container">
          <h2>{t("User Management")}</h2>
          <p className="error">{message}</p>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("Name")}</th>
                <th>{t("Email")}</th>
                <th>{t("Role")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} >
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(event) => handleRoleToggle(event, user._id)}
                      disabled={user._id === userId}
                    >
                      <option value="user">{t("User")}</option>
                      <option value="admin" selected>
                        {t("Admin")}
                      </option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user._id === userId}
                    >
                      {t("Delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
export default Admin;
