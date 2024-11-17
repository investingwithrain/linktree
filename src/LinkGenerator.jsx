import React, { useState } from "react";
import { collection, addDoc, updateDoc, doc, getDocs } from "firebase/firestore";
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
  Divider
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
    const utmParams = new URLSearchParams({
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent,
    });

    const url = `https://links.investingwithrain.com/#/ga4?${utmParams.toString()}`;
    setUrl(url);

    try {
      const docRef = await addDoc(collection(db, "Links"), {
        url: url,
        redirectUrl: redirectUrl,
        utmSource: utmSource,
        utmMedium: utmMedium,
        utmCampaign: utmCampaign,
        utmTerm: utmTerm,
        utmContent: utmContent,
      });

      // Update the document with the docRef.id value
      await updateDoc(doc(db, "Links", docRef.id), {
        id: docRef.id,
      });

      // Set the short link
      setShortLink(
        `https://links.investingwithrain.com/#/ga4?code=${docRef.id}`
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  if(history.length === 0) {
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
              exclusive
              onChange={(e) => setUtmSource(e.target.value)}
              aria-label="Source"
            >
              {sourceKeys.map((source) => (
                <ToggleButton value={source}>{source}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
          <div className="form-group">
            <ToggleButtonGroup
              color="primary"
              value={utmMedium}
              required
              exclusive
              onChange={(e) => setUtmMedium(e.target.value)}
              aria-label="Medium"
            >
              {mediumKeys.map((medium) => (
                <ToggleButton value={medium}>{medium}</ToggleButton>
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
          <Button variant="contained" size="large">
            Generate URL
          </Button>
        </form>
        {shortLink && (
          <div className="generated-link">
            <Typography variant="h3" gutterBottom>
              Generated URL:
            </Typography>
            <Typography variant="h2" gutterBottom>
              {shortLink}
            </Typography>
          </div>
        )}
      </div>
      <div className="form-container">
        <Typography variant="h2" gutterBottom>
          History
        </Typography>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        </List>

        {history.map((link) => (
          // <div key={link.id} className="history-item">
          //   <div className="history-item-header">
          // <Typography variant="p" gutterBottom>
          //   Source:
          // </Typography>
          //   <Typography variant="h4" gutterBottom>
          //     {link.utmSource}
          //   </Typography>
          //   </div>
          //   <div className="history-item-header">
          // <Typography variant="p" gutterBottom>
          //   Medium:
          // </Typography>
          //   <Typography variant="h4" gutterBottom>
          //     {link.utmMedium}
          //   </Typography>
          //   </div>
          //   <div className="history-item-header">
          // <Typography variant="p" gutterBottom>
          //   Shortlink:
          // </Typography>
          //   <Typography variant="h4" gutterBottom>
          //     {`https://links.investingwithrain.com/#/ga4?code=${link.id}`}
          //   </Typography>
          //   </div>
          // </div>

          <ListItem alignItems="flex-start">
        <ListItemText
          primary={link.utmSource + " - " + link.utmMedium}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.primary', display: 'inline' }}
              >
                "Shortlink:"
              </Typography>
              {` - https://links.investingwithrain.com/#/ga4?code=${link.id}`}
            </React.Fragment>
          }
        />
      </ListItem>
        ))}
      </div>
    </div>
  );
}

export default LinkGenerator;
