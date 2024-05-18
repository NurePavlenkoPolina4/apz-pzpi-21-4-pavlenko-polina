import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, name, password, passwordConfirm) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://127.0.0.1:3001/api/v1/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password, passwordConfirm }),
    });
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
    }
    if (response.ok) {
      //saving user to local storage
      localStorage.setItem("jwt", JSON.stringify(json.token));

      //updeting auth context
      dispatch({ type: "LOGIN", payload: json.token });
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error, setError };
};
