import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Blog from "./blog.jsx";
import "./index.css";
// import backgroundVideo from '/background.webm'
import { HashRouter, Routes, Route } from "react-router-dom";
import GA4 from "./GA4.jsx";
import LinkGenerator from "./LinkGenerator.jsx";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; // Correct import for getFirestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCj5vDpUUC-LYsn_qzQocrIbhz4yys-UL0",
  authDomain: "linktree-c2e43.firebaseapp.com",
  projectId: "linktree-c2e43",
  storageBucket: "linktree-c2e43.firebasestorage.app",
  messagingSenderId: "1053507136109",
  appId: "1:1053507136109:web:5dacbb69164118e8c9ed64",
  measurementId: "G-CQL9ZVL151"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

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
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
