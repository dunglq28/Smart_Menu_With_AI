import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Mỗi khi route thay đổi, cuộn trang về đầu
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
