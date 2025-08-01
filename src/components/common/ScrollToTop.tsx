import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 즉시 스크롤 (부드러운 스크롤 대신 즉시 이동)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // 'smooth' 대신 'instant' 사용하여 즉시 이동
    });
    
    // 추가적으로 document.body도 스크롤 (모바일에서 더 안정적)
    if (document.body) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop; 