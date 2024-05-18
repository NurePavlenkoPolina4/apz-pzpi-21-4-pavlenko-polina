import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import i18n from "./i18n";
import "./styles/App.css";

import Hearder from "./components/Header";
import Menu from "./components/Menu";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Shelf from "./pages/Shelf";
import Book from "./pages/Book";
import AddBook from "./pages/AddBook";
import User from "./pages/User";

function App() {
  const [search, setSearch] = useState("")
  const { user } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
        <Hearder onSetSearch={setSearch}/>
        {user && <Menu />}
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/shelf"
            element={user ? <Shelf search={search}/> : <Navigate to="/login" />}
          />
          <Route
            path="/addbook"
            element={user ? <AddBook /> : <Navigate to="/login" />}
          />
          <Route
            path="/shelf/:bookId"
            element={user ? <Book /> : <Navigate to="/login" />}
          />
          <Route
            path="/user"
            element={user ? <User /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
