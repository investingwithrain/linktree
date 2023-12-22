import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Blog from './blog.jsx'
import './index.css'
// import backgroundVideo from '/background.webm'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/blog/:folder",
    element: <Blog/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <div class="video-background">
  <video playsinline="playsinline" autoplay="autoplay" muted="muted" loop="loop">
      <source src={backgroundVideo} type="video/webm"/>
  </video>
</div> */}
  <RouterProvider router={router} />
  </React.StrictMode>,
)
