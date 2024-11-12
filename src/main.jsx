import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Blog from "./blog.jsx";
import "./index.css";
// import backgroundVideo from '/background.webm'
import { HashRouter, Routes, Route } from "react-router-dom";
import GA4 from "./GA4.jsx";

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
      <Route path="/" element={<App source="None"/>} />
      <Route path="/thread" element={<App source="thread"/>} />
      <Route path="/instagram" element={<App source="instagram"/>} />
        <Route path="/ga4" element={<GA4 />} />
        <Route path="/blog/:folder" element={<Blog />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
