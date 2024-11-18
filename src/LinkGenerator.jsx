import React, { useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "./main.jsx";
import "./LinkGenerator.css";
import {
  TextField,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ga4Keys from "./ga4.json";

function LinkGenerator() {
  const sourceKeys = ga4Keys.source;
  const mediumKeys = ga4Keys.medium;

  const [url, setUrl] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const querySnapshot = await getDocs(collection(db, "Links"));
    const links = [];
    querySnapshot.forEach((doc) => {
      links.push(doc.data());
    });
    setHistory(links);
  };

  const generateUrl = async () => {

    try {
      const docRef = await addDoc(collection(db, "Links"), {
        redirectUrl: redirectUrl,
        utmSource: utmSource,
        utmMedium: utmMedium,
        utmCampaign: utmCampaign,
        utmTerm: utmTerm,
        utmContent: utmContent,
      });



    const utmParams = new URLSearchParams({
      code: docRef.id,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent,
    });

    //add log
    console.log(utmParams);

    const url = `https://links.investingwithrain.com/#/ga4?${utmParams.toString()}`;
    setUrl(url);

      // Update the document with the docRef.id value
      await updateDoc(doc(db, "Links", docRef.id), {
        code: docRef.id,
        url: url,
      });

      // Set the short link
      setShortLink(
        `https://links.investingwithrain.com/#/ga4?code=${docRef.id}`
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Short link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  if (history.length === 0) {
    fetchHistory();
  }

  return (
    <div>
      <div className="form-container">
        <Typography variant="h2" gutterBottom>
          UTM Generator for GA4
        </Typography>
        <form
          onSubmit={(e) => {
            console.log("submit");
            e.preventDefault();
            generateUrl();
          }}
        >
          <div className="form-group">
            <TextField
              fullWidth
              label="URL"
              variant="filled"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <ToggleButtonGroup
              color="primary"
              value={utmSource}
              required
              onChange={(e) => setUtmSource(e.target.value)}
              aria-label="Source"
            >
              {sourceKeys.map((source) => (
                <ToggleButton key={source} value={source}>
                  {source}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
          <div className="form-group">
            <ToggleButtonGroup
              color="primary"
              value={utmMedium}
              required
              onChange={(e) => setUtmMedium(e.target.value)}
              aria-label="Medium"
            >
              {mediumKeys.map((medium) => (
                <ToggleButton key={medium} value={medium}>
                  {medium}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="Campaign"
              variant="filled"
              helperText="Product, promo code, or slogan (e.g. spring_sale) One of campaign name or campaign id are required."
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="UTM Term"
              variant="filled"
              value={utmTerm}
              onChange={(e) => setUtmTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="UTM Content"
              variant="filled"
              value={utmContent}
              onChange={(e) => setUtmContent(e.target.value)}
            />
          </div>
          <Button type="submit" variant="contained" size="large">
            Generate URL
          </Button>
        </form>
        {shortLink && (
          <div className="generated-link">
            <Button
              variant="contained"
              size="large"
              onClick={() => copyToClipboard(shortLink)}
            >
              {shortLink}
            </Button>
          </div>
        )}
      </div>
      <div className="form-container">
        <Typography variant="h2" gutterBottom>
          History
        </Typography>
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
        >
          {history.map((link) => (
            <ListItem alignItems="flex-start"             onClick={() => copyToClipboard(`https://links.investingwithrain.com/#/ga4?code=${link.code}`)}
>
              <ListItemText
                primary={link.utmSource + " - " + link.utmMedium}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "text.primary", display: "inline" }}
                    >
                      "Shortlink:"
                    </Typography>
                    {` - https://links.investingwithrain.com/#/ga4?code=${link.code}`}
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
}

export default LinkGenerator;
