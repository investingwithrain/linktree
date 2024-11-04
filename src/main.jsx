import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AppThread from "./AppThread.jsx";
import AppInstagram from "./AppInstagram.jsx";
import Blog from "./blog.jsx";
import "./index.css";
// import backgroundVideo from '/background.webm'
import { HashRouter, Routes, Route } from "react-router-dom";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App/>,
//   },
//   {
//     path: "/blog/:folder",
//     element: <Blog/>
//   }
// ]);

// const router = createHashRouter();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/thread" element={<AppThread />} />
        <Route path="/instagram" element={<AppInstagram />} />
        <Route path="/blog/:folder" element={<Blog />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
