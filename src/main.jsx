import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Blog from "./blog.jsx";
import "./index.css";
// import backgroundVideo from '/background.webm'
import { HashRouter, Routes, Route } from "react-router-dom";
import GA4 from "./GA4.jsx";
import LinkGenerator from "./LinkGenerator.jsx";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, BarElement } from 'chart.js';

import CompoundCal from "./Pages/CompoundCal.jsx";
import Admin from "./Pages/Admin.jsx";

// Firebase now lives in ./firebase.js. Re-exported here so the existing
// `import { db } from "./main.jsx"` callers keep working unchanged.
export { db } from "./firebase";


// Register components
ChartJS.register(
  CategoryScale,  // This is where the "category" scale is registered
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App source="None" />} />
        <Route path="/thread" element={<App source="thread" />} />
        <Route path="/instagram" element={<App source="instagram" />} />
        <Route path="/ga4" element={<GA4/>} />
        <Route path="/blog/:folder" element={<Blog />} />
        <Route path="/link-generator" element={<LinkGenerator />} />
        <Route path="/calculator" element={<CompoundCal />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
