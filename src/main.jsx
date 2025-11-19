import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { IsLoggedInProvider } from "./contexts/isLoggedinContext"; // استدعاء الـ Provider
import { Buffer } from "buffer";
window.Buffer = Buffer;
import "../src/pdf/Fonts.js"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <IsLoggedInProvider>
      <App />
    </IsLoggedInProvider>
  </StrictMode>
);

// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { IsLoggedInProvider } from "./contexts/isLoggedinContext";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <IsLoggedInProvider>
//       <App />
//     </IsLoggedInProvider>
//   </React.StrictMode>
// );
