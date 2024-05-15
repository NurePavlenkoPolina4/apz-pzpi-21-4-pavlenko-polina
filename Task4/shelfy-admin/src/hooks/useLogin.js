import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://127.0.0.1:3001/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
    }

    if (response.ok) {
      if (json.data.user.role !== "admin") {
        setIsLoading(false);
        setError("You are not an admin! Access denied!");
      } else {
        //saving user to local storage
        localStorage.setItem("jwt-admin", JSON.stringify(json.token));
        //updeting auth context
        dispatch({ type: "LOGIN", payload: json.token });
        setIsLoading(false);
      }
    }
  };

  return { login, isLoading, error, setError };
};
