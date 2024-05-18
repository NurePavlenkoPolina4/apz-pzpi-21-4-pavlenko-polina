import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();
export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};
export const AuthContextProvider = ({ children }) => {
  const jwt = localStorage.getItem("jwt-admin");
  const initialUserState = jwt ? JSON.parse(jwt) : null;
  const [state, dispatch] = useReducer(authReducer, {
    user: initialUserState,
  });

  useEffect(() => {
    if (initialUserState) {
      dispatch({ type: "LOGIN", payload: initialUserState });
    }
  }, [initialUserState]);

  // console.log("AuthContext state: ", state);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
