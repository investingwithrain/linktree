import { useEffect } from "react";
import "./App.css";
import "@fontsource/roboto"; // Defaults to weight 400.
import Link from "./Link.jsx";
import Blogs from "./blogs.jsx";
import logo from "/rainishere_s.png";
import "./fonts.css";
import dataLinks from "./DataLinks.json";
import social from "./Social.json";
import ReactGA from "react-ga4"; // Import ReactGA
import packageJson from "../package.json"; // Adjust the path as necessary
import { CONTENT_DOCS, useContent } from "./useContent";
import { resolveSource } from "./tracking";

ReactGA.initialize("G-CQL9ZVL151");
const App = ({ source }) => {
  // Editable via /admin; the bundled JSON is the fallback if Firestore is
  // unreachable or the doc has never been saved. One shared list for every
  // route — utm_source is appended at click time (see tracking.js).
  const { data } = useContent(CONTENT_DOCS.links, dataLinks);
  const { data: socialLinks } = useContent(CONTENT_DOCS.social, social);
  const version = packageJson.version;

  // /instagram and /thread carry their own source; every other route (just
  // "/" today) falls back to ?utm_source= on the real URL, e.g. the link
  // handed out in a YouTube description.
  const resolvedSource = resolveSource(source);

  // Send pageview with a custom path. Kept in an effect so the async content
  // load does not fire a duplicate hit on every re-render.
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "/" + resolvedSource,
      title: "User on Linktree",
    });
  }, [resolvedSource]);

  return (
    <>
      <div className="logo-title">
        <a
          href="https://www.youtube.com/channel/UC7v5yfvZhs-d5opF575AEhA"
          target="_blank"
        >
          <img src={logo} className="logo" alt="Rainishere logo" />
        </a>
        <div className="title">Rainishere</div>
      </div>
      <div className="social-media">
        {socialLinks.map((item, index) => (
          <button
            className="social-media-button"
            key={index}
            onClick={() => window.open(item.link, "_blank")}
          >
            <img src={item.img} alt={item.name} />
          </button>
        ))}
      </div>
      <Blogs />
      <Link data={data} page={resolvedSource} />
      <p className="read-the-docs">
        以上的{data.length}
        個連結是RainIsHere的真實社交平台及獨家優惠連結，其他沒有登記的平台及連結全部屬於虛假帳戶或假平台，請大家小心騙徒喔！!
      </p>
      <p className="version-txt">v.{packageJson.version}</p>
    </>
  );
};

export default App;
