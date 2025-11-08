import { useState, useEffect } from 'react';

const MOBILE_QUERY = '(max-width: 768px)';

export const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const listener = () => setIsMobile(media.matches);
    
    // Add the listener
    media.addEventListener('change', listener);
    
    // Clean up the listener on component unmount
    return () => media.removeEventListener('change', listener);
  }, []);

  return isMobile;
};