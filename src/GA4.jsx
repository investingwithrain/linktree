import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc, increment, Timestamp } from "firebase/firestore";

import { db } from "./main.jsx";

// Anything that goes wrong (bad code, deleted doc, Firestore down) must still
// land the visitor somewhere useful, never on a black screen.
const FALLBACK_URL = "https://www.investingwithrain.com";

function GA4() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  useEffect(() => {
    const fetchDocument = async () => {
      if (!code) {
        window.location.replace(FALLBACK_URL);
        return;
      }

      try {
        const docRef = doc(db, "Links", code);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          console.log("No such document!");
          window.location.replace(FALLBACK_URL);
          return;
        }
        const data = docSnap.data();

        // Count the click in Firestore before navigating away — unlike the
        // gtag event below, an awaited write can't be lost to the redirect.
        try {
          await updateDoc(docRef, {
            clickCount: increment(1),
            lastClickedAt: Timestamp.now(),
          });
        } catch (e) {
          console.warn("Click count update failed", e);
        }

        if (window.gtag) {
          // Send the UTM parameters as a custom event to Google Analytics
          window.gtag("event", "utm_parameters", {
            utm_source: data.utmSource || "(not set)",
            utm_medium: data.utmMedium || "(not set)",
            utm_campaign: data.utmCampaign || "(not set)",
            utm_term: data.utmTerm || "(not set)",
            utm_content: data.utmContent || "(not set)",
          });

          console.log("Logged UTM params to Google Analytics:", data);
        } else {
          console.warn("Google Analytics (gtag) is not initialized");
        }

        // Construct the UTM query string
        const utmParams = new URLSearchParams({
          utm_source: data.utmSource || "(not set)",
          utm_medium: data.utmMedium || "(not set)",
          utm_campaign: data.utmCampaign || "(not set)",
          utm_term: data.utmTerm || "(not set)",
          utm_content: data.utmContent || "(not set)",
        });

        // Append the UTM parameters to the redirect URL
        const redirectUrl = new URL(data.redirectUrl);
        // check if the redirect URL already has a query string
        if (redirectUrl.search) {
          // if it does, append the UTM parameters to the existing query string
          redirectUrl.search += "&" + utmParams.toString();
        } else {
          // if it doesn't, add the UTM parameters to a new query string
          redirectUrl.search = utmParams.toString();
        }

        // replace() keeps the redirect page out of history, so the browser
        // back button returns to where the visitor came from, not a loop.
        window.location.replace(redirectUrl.toString());
      } catch (e) {
        console.error("Redirect failed", e);
        window.location.replace(FALLBACK_URL);
      }
    };

    fetchDocument();
  }, [code]);

  return (
    <div style={{ backgroundColor: "black", width: "100vw", height: "100vh" }}>
      {/* This component doesn't need to render anything else */}
    </div>
  );
}

export default GA4;
