import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";
import App from './App';
import { AuthContextProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

