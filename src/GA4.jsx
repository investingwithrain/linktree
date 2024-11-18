import { useEffect, useLocation } from 'react';
import {
    doc,
    getDoc
  } from "firebase/firestore";

function GA4() {

    const [documentData, setDocumentData] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const source = searchParams.get('utm_source');

  useEffect( async () => {
    
    if (code) {
        const docRef = doc(db, 'Links', code);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setDocumentData(docSnap.data());
            if(source){
                window.location.href = docSnap.data().redirectUrl;
            }else{
                window.location.href = docSnap.data().url;
            }
        } else {
            console.log('No such document!');
        }
      }

    // Redirect to the external URL after the component mounts
    window.location.href = 'https://www.investingwithrain.com';
  }, []);

  return null; // This component doesn't need to render anything
}

export default GA4;