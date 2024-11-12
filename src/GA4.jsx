import { useEffect } from 'react';

function GA4() {
  useEffect(() => {
    // Redirect to the external URL after the component mounts
    window.location.href = 'https://www.investingwithrain.com';
  }, []);

  return null; // This component doesn't need to render anything
}

export default GA4;