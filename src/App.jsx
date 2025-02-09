import "./App.css";
import "@fontsource/roboto"; // Defaults to weight 400.
import Link from "./Link.jsx";
import Blogs from "./blogs.jsx";
import logo from "/rainishere_s.png";
import "./fonts.css";
import dataInstagram from "./DataInstagram.json";
import dataThread from "./DataThread.json";
import social from "./Social.json";
import ReactGA from "react-ga4"; // Import ReactGA

ReactGA.initialize("G-CQL9ZVL151");
const App = ({ source }) => {
  const data = source === "instagram" ? dataInstagram : dataThread;
  const version = process.env.APP_VERSION;

  // Send pageview with a custom path
  ReactGA.send({
    hitType: "pageview",
    page: "/" + source,
    title: "User on Linktree",
  });
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
        {social.map((item, index) => (
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
      <Link data={data} page={source} />
      <p className="read-the-docs">
        以上的{data.length}
        個連結是RainIsHere的真實社交平台及獨家優惠連結，其他沒有登記的平台及連結全部屬於虛假帳戶或假平台，請大家小心騙徒喔！!
      </p>
      <br />
      <p className="version-txt">v.{version}</p>
    </>
  );
};

export default App;
