import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    doc,
    getDoc
  } from "firebase/firestore";

import { db } from "./main.jsx";

function GA4() {


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const source = searchParams.get('utm_source');

  useEffect(() => {
    const fetchDocument = async () => {
      if (code) {
        const docRef = doc(db, 'Links', code);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          if (source) {
            window.location.href = docSnap.data().redirectUrl;
          } else {
            window.location.href = docSnap.data().url;
          }
        } else {
          console.log('No such document!');
        //   window.location.href = 'https://www.investingwithrain.com';
        }
      } else {
        // Redirect to the external URL if no code is provided
        window.location.href = 'https://www.investingwithrain.com';
      }
    };

    fetchDocument();
  }, [code, source]);

  return null; // This component doesn't need to render anything
}

export default GA4;