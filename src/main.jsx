import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
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
    {/* <div class="video-background">
  <video playsinline="playsinline" autoplay="autoplay" muted="muted" loop="loop">
      <source src={backgroundVideo} type="video/webm"/>
  </video>
</div> */}
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blog/:folder" element={<Blog />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
