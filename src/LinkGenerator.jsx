import React, { useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  startAfter,
  query,
  orderBy,
  limit,
  Timestamp,
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
  LinearProgress,
  Box,
  Tooltip,
  ListItem,
  IconButton,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import ga4Keys from "./ga4.json";
import { Link, Facebook, Instagram, YouTube, Email } from "@mui/icons-material";
import CampaignField from "./CampaignField.jsx";
import { useHookstate } from "@hookstate/core";
import { globalSelectedCampaign } from "./context";
import social from "./Social.json";

function LinkGenerator() {
  const sourceKeys = ga4Keys.source;
  const mediumKeys = ga4Keys.medium;

  const redirectUrl = useHookstate("");
  const utmSource = useHookstate("");
  const utmMedium = useHookstate("");
  const selectedCampaign = useHookstate(globalSelectedCampaign);
  const utmTerm = useHookstate("");
  const utmContent = useHookstate("");
  const shortLink = useHookstate("");
  const history = useHookstate([]);
  const loading = useHookstate(false);
  const fetching = useHookstate(false);
  const lastVisible = useHookstate(null);
  const limitValue = 10;



  const fetchHistory = async () => {
    fetching.set(true);
    if (lastVisible.get()) {

      const next = query(
        collection(db, "Links"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible.get()),
        limit(limitValue)
      );

      const querySnapshot = await getDocs(next);
      const links = [];
      querySnapshot.forEach((doc) => {
        links.push(doc.data());
      });
      lastVisible.set(querySnapshot.docs[querySnapshot.docs.length - 1]);
      history.merge(links);
    } else {
      const q = query(
        collection(db, "Links"),
        orderBy("createdAt", "desc"),
        limit(limitValue)
      );
      const querySnapshot = await getDocs(q);
      const links = [];
      querySnapshot.forEach((doc) => {
        links.push(doc.data());
      });
      lastVisible.set(querySnapshot.docs[querySnapshot.docs.length - 1]);
      history.set(links);
    }
    fetching.set(false);
  };

  const generateUrl = async () => {
    //if no campaign is selected, show alert
    if (selectedCampaign.get().id === "") {
      alert("Please set a Campaign Name");
      return;
    }

    console.log(
      "generateUrl",
      redirectUrl.get(),
      utmSource.get(),
      utmMedium.get(),
      selectedCampaign.get().id,
      utmTerm.get(),
      utmContent.get()
    );

    loading.set(true);
    try {
      const docRef = await addDoc(collection(db, "Links"), {
        redirectUrl: redirectUrl.get(),
        utmSource: utmSource.get(),
        utmMedium: utmMedium.get(),
        utmCampaign: selectedCampaign.get().id,
        utmTerm: utmTerm.get(),
        utmContent: utmContent.get(),
        createdAt: Timestamp.now(),
      });

      const utmParams = new URLSearchParams({
        code: docRef.id,
        utm_source: utmSource.get(),
        utm_medium: utmMedium.get(),
        utm_campaign: selectedCampaign.get().id,
        utm_term: utmTerm.get(),
        utm_content: utmContent.get(),
      });

      //add log
      console.log(utmParams);

      const url = `https://links.investingwithrain.com/#/ga4?${utmParams.toString()}`;

      // Update the document with the docRef.id value
      await updateDoc(doc(db, "Links", docRef.id), {
        code: docRef.id,
        url: url,
      });

      // Set the short link
      shortLink.set(
        `https://links.investingwithrain.com/#/ga4?code=${docRef.id}`
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    loading.set(false);
  };

  const sourceIcon = (source) => {
    switch (source) {
      case "instagram":
        return <Instagram />;
      case "email":
        return <Email />;
      default:
        for (let item of social) {
          if (item.name.toLowerCase() === source) {
            return (
              <img
                style={{ width: 22, height: 22 }}
                src={item.img}
                alt={item.name}
              />
            );
          }
        }
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


  
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div
      style={{
        margin: "5vw",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
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
              value={redirectUrl.get()}
              onChange={(e) => redirectUrl.set(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <ToggleButtonGroup
              color="primary"
              value={utmSource.get()}
              required
              onChange={(e) => {
                console.log("utmSource", e.target.value);
                utmSource.set(e.target.value);
              }}
              aria-label="Source"
            >
              {sourceKeys.map((source) => (
                <ToggleButton key={source} value={source}>
                  {/* {sourceIcon(source)} */}
                  {source}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
          <div className="form-group">
            <ToggleButtonGroup
              color="primary"
              value={utmMedium.get()}
              required
              onChange={(e) => utmMedium.set(e.target.value)}
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
            {/* <TextField
              fullWidth
              label="Campaign"
              variant="filled"
              helperText="Product, promo code, or slogan (e.g. Spring Sale) One of campaign name or campaign id are required."
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              required
            /> */}

            <CampaignField />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="UTM Term"
              variant="filled"
              value={utmTerm.get()}
              onChange={(e) => utmTerm.set(e.target.value)}
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="UTM Content"
              variant="filled"
              value={utmContent.get()}
              onChange={(e) => utmContent.set(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outlined" size="large">
            Generate URL
          </Button>
        </form>
        {shortLink.get() && (
          <Box
            className="generated-link"
            style={{
              margin: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Tooltip title="Copy Link">
              <Button
                variant="contained"
                size="large"
                onClick={() => copyToClipboard(shortLink.get())}
              >
                Copy Generated Link
              </Button>
            </Tooltip>

            <Tooltip title="Test Link">
              <Button
                variant="contained"
                color="red"
                size="large"
                onClick={() => (window.location.href = shortLink.get())}
              >
                Test Generated Link
              </Button>
            </Tooltip>
          </Box>
        )}
        {loading.get() && (
          <Box sx={{ width: "100%", marginTop: "20px" }}>
            <LinearProgress />
          </Box>
        )}
      </div>
      {history.get() && (
        <div className="form-container">
          <Typography variant="h2" gutterBottom>
            History
          </Typography>

          {/* <ToggleButtonGroup
            color="primary"
            value={searchLength.get()}
            required
            onChange={(e) => searchLength.set(e.target.value)}
            aria-label="Medium"
          >
            {["30", "50", "100"].map((term) => (
              <ToggleButton
                key={term}
                value={term}
                onClick={() => history.set([])}
              >
                {term}
              </ToggleButton>
            ))}
          </ToggleButtonGroup> */}
          <List
            sx={{ width: "100%", bgcolor: "background.paper", gap: "10px" }}
          >
            {history.get().map((link, index) => (
              <div key={index}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Tooltip title="Copy Link">
                      <IconButton edge="end" aria-label="comments">
                        <Link />
                      </IconButton>
                    </Tooltip>
                  }
                  onClick={() =>
                    copyToClipboard(
                      `https://links.investingwithrain.com/#/ga4?code=${link.code}`
                    )
                  }
                >
                  <ListItemAvatar>
                    {/* <div style={{display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}> */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {sourceIcon(link.utmSource)}
                      {/* {link.utmMedium} */}
                    </div>
                  </ListItemAvatar>
                  <ListItemText
                    primary={link.utmCampaign}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "text.primary", display: "inline" }}
                        >
                          {link.utmMedium + " - "}
                        </Typography>
                        <Tooltip title={link.redirectUrl}>
                          {link.redirectUrl}
                        </Tooltip>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="middle" component="li" />
              </div>
            ))}
            {fetching.get() && (
              <Box sx={{ width: "100%", marginTop: "20px" }}>
                <LinearProgress />
              </Box>
            )}
            <Button onClick={() => fetchHistory()}>Load More</Button>
          </List>
        </div>
      )}
    </div>
  );
}

export default LinkGenerator;
