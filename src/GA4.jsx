import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { db } from "./main.jsx";

function GA4() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  useEffect(() => {
    const fetchDocument = async () => {
      if (code) {
        const docRef = doc(db, "Links", code);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

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

        if (docSnap.exists()) {
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
            // if it doesn't, add the UTM parameters to
            // a new query string
            redirectUrl.search = utmParams.toString();
          }

          // redirect to the new URL with the UTM parameters
          window.location.href = redirectUrl.toString();
          

          // window.location.href = data.redirectUrl + "&" + utmParams.toString();
        } else {
          console.log("No such document!");
          //   window.location.href = 'https://www.investingwithrain.com';
        }
      } else {
        // Redirect to the external URL if no code is provided
        window.location.href = "https://www.investingwithrain.com";
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
