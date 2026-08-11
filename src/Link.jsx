import React from "react";
import "@fontsource/roboto"; // Defaults to weight 400.
import "./Link.css";
import "./fonts.css";
import ReactGA from "react-ga4";
import { appendUtm } from "./tracking";

function Link({ data, page }) {
  const handleClick = (item) => {
    // Tag our own destinations with utm params derived from the visitor's source.
    const url = appendUtm(item.link, page);

    // Send a custom event
    ReactGA.event({
      category: "User Click Link",
      action: "User Click Link - "+page,
      label: url, // optional
    });

    // Open the link in a new tab
    window.open(url, "_blank");
  };

  return (
    <div className="card">
      {data.map((item, index) => (
        <button className="link" key={index} onClick={() => handleClick(item)}>
          <div className="contents">
            <img src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <h4>{item.description}</h4>
          </div>
        </button>
      ))}
    </div>
  );
}

export default Link;
