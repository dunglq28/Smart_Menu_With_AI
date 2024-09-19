import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import PROFILE_EN from '../locales/en/profile.json'
import PROFILE_VI from '../locales/vi/profile.json'

const resources = {
    en: {
        profile: PROFILE_EN,
      translation: {
        "dashboard": "Dashboard",
        "users":"Users",
        "brands":"Brands",
        "branches":"Branches",
        "products":"Products",
        "customer segment":"Customer Segment",
        "categories":"Categories",
        "menu":"Menu",
        "settings": "Settings",
        "new product":"New Product",
        "new":"New Product",
        "new brand":"New Brand",
        "new branch":"New Branch"
      }
    },
    vi: {
      profile: PROFILE_VI,
      translation: {
        "dashboard": "Bảng Thống Kê",
        "admin-dashboard": "Bảng Thống Kê",
        "brand-dashboard": "Bảng Thống Kê",
        "users":"Người Dùng",
        "paymentHistory":"Lịch sử thanh toán",
        "payment-history":"Lịch sử thanh toán",
        "packages":"Gói đăng ký",
        "landingPage":"Trang landing",
        "brands":"Thương Hiệu",
        "branches":"Chi Nhánh",
        "customer segment":"Phân Khúc Khách Hàng",
        "customerSegment":"Phân Khúc Khách Hàng",
        "products":"Sản Phẩm",
        "categories":"Loại Danh Mục",
        "menu":"Thực Đơn",
        "settings": "Cài Đặt",
        "new product":"Sản Phẩm Mới",
        "new":"Sản Phẩm Mới",
        "new brand":"Thương Hiệu Mới",
        "new branch":"Chi Nhánh Mới",
        "profile": "Hồ Sơ Cá Nhân"
      }
    }
  };

  i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: "vi",
    fallbackLng:"vi",
    ns:['profile','translation'],
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;