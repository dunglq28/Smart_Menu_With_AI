import {
  Avatar,
  Flex,
  Text,
  Icon,
  Divider,
  Link as ChakraLink,
  useDisclosure,
} from "@chakra-ui/react";
import style from "./Sidebar.module.scss";
import React, { useState, useEffect } from "react";
import { CgAddR } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import {
  Link as ReactRouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Logo from "../../../assets/images/Logo.jpeg";
import { AiOutlineCreditCard, AiOutlineCustomerService, AiOutlineProduct } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { GoHome } from "react-icons/go";
import { AiOutlineUser } from "react-icons/ai";
import { IoGitBranchOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { MdListAlt } from "react-icons/md";
import { MdOutlineBrandingWatermark } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { BrandForm } from "../../../models/BrandForm.model";
import { BranchForm } from "../../../models/BranchForm.model";
import { UserForm } from "../../../models/UserForm.model";
import { CurrentForm, UserRole } from "../../../constants/Enum";
import { getInitialBranchData, getInitialBrandData, getInitialUserData } from "../../../utils/initialData";
import { toast } from "react-toastify";
import { capitalizeWords } from "../../../utils/functionHelper";
import { createUser } from "../../../services/UserService";
import { createBrand } from "../../../services/BrandService";
import { createBranch } from "../../../services/BranchService";
import ModalForm from "../../Modals/ModalForm/ModalForm";
import ModalFormBrand from "../../Modals/ModalFormBrand/ModalFormBrand";
import ModalFormBranch from "../../Modals/ModalFormBranch/ModalFormBranch";
import ModalFormUser from "../../Modals/ModalFormUser/ModalFormUser";



function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [item, setItem] = useState("");
  const [formPrevious, setFormPrevious] = useState(CurrentForm.BRAND);

  //BRAND DATA
  const [brandData, setBrandData] = useState<BrandForm>(getInitialBrandData());

  //BRANCH DATA
  const [branchData, setBranchData] = useState<BranchForm>(
    getInitialBranchData()
  );

  // USER DATA
  const [userData, setUserData] = useState<UserForm>(getInitialUserData());

  const {
    isOpen: isOpenBrand,
    onOpen: onOpenBrand,
    onClose: onCloseBrand,
  } = useDisclosure();
  const {
    isOpen: isOpenBranch,
    onOpen: onOpenBranch,
    onClose: onCloseBranch,
  } = useDisclosure();
  const {
    isOpen: isOpenUser,
    onOpen: onOpenUser,
    onClose: onCloseUser,
  } = useDisclosure();

  const changeItem = (label: string) => {
    setItem(label);
  };

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const roleIdString = localStorage.getItem("RoleId");
  const roleId = roleIdString ? roleIdString : "";
  const menuItems = [
    {
      icon: MdOutlineDashboard,
      label: t("dashboard"),
      to: "/admin-dashboard",
      permissionRole: UserRole.Admin,
    },
    {
      icon: MdOutlineDashboard,
      label: t("dashboard"),
      to: "/brand-dashboard",
      permissionRole: UserRole.BrandManager,
    },
    {
      icon: AiOutlineUser,
      label: t("users"),
      to: "/users",
      permissionRole: UserRole.Admin,
    },
    {
      icon: AiOutlineCreditCard, 
      label: t("paymentHistory"), 
      to: "/payment-history",
      permissionRole: [UserRole.BrandManager, UserRole.Admin], 
    },
    {
      icon: MdOutlineBrandingWatermark,
      label: t("brands"),
      divider: true,
      to: "/brands",
      permissionRole: UserRole.Admin,
    },
    {
      icon: AiOutlineProduct,
      label: t("products"),
      to: "/products",
      permissionRole: [UserRole.BrandManager],
    },
    {
      icon: MdOutlineCategory,
      label: t("categories"),
      to: "/categories",
      permissionRole: [UserRole.BrandManager],
    },
    {
      icon: AiOutlineCustomerService,
      label: t("customer segment"),
      divider: true,
      to: "/customerSegment",
      permissionRole: [UserRole.BrandManager],
    },
    {
      icon: MdListAlt,
      label: t("menu"),
      to: "/menu",
      permissionRole: [UserRole.BrandManager],
    },
    {
      icon: IoGitBranchOutline,
      label: t("branches"),
      to: "/branches",
      permissionRole: [UserRole.BrandManager],
    },
    {
      icon: IoSettingsOutline,
      label: t("settings"),
      divider: true,
      to: "/settings",
    },
    // { icon: CgAddR, label: t("new product"), to: "/new" ,permissionRole: UserRole.Admin,},
    {
      icon: CgAddR,
      label: t("new brand"),
      onclick: onOpenBrand,
      permissionRole: UserRole.Admin,
    },
    {
      icon: CgAddR,
      label: t("new branch"),
      onclick: onOpenBranch,
      permissionRole: UserRole.Admin,
    },
  ];

  useEffect(() => {
    const currentItem = menuItems.find(
      (menuItem) => menuItem.to === location.pathname
    );
    if (currentItem) {
      setItem(currentItem.label);
    }
  }, [location.pathname, menuItems]);

  function logoutHandler() {
    localStorage.clear();
    navigate("/login");
  }

  useEffect(() => {
    const toastMessage = localStorage.getItem("toastMessage");
    if (toastMessage) {
      toast.success(toastMessage);
      localStorage.removeItem("toastMessage");
    }
  }, []);

  function nextHandler(currentForm: CurrentForm) {
    if (currentForm === CurrentForm.BRAND) {
      onCloseBrand();
      setFormPrevious(CurrentForm.BRAND);
    } else {
      onCloseBranch();
      setFormPrevious(CurrentForm.BRANCH);
    }
    setTimeout(() => {
      onOpenUser();
    }, 350);
  }

  const updateBrandData = (data: BrandForm) => {
    setBrandData(data);
  };

  const updateBranchData = (data: BranchForm) => {
    setBranchData(data);
  };

  const updateUserData = (data: UserForm) => {
    setUserData(data);
  };

  async function saveBrandHandle(data: UserForm) {
    try {
      const brandForm = new FormData();

      if (brandData.image.value && brandData.brandName.value) {
        brandForm.append(
          "BrandName",
          capitalizeWords(brandData.brandName.value)
        );
        brandForm.append("Image", brandData.image.value);
      }

      const userResult = await createUser(data, 2);

      if (userResult.statusCode === 200) {
        brandForm.append("UserId", userResult.data.toString());

        const brandResult = await createBrand(brandForm);

        if (brandResult.statusCode === 200) {
          await onCloseUser();
          const toastMessage = "Thêm thương hiệu mới thành công";
          const pathname = location.pathname;
          const formattedPathname = pathname.replace("/", "");
          if (formattedPathname === "brands") {
            localStorage.setItem("toastMessage", toastMessage);
            window.location.reload();
          } else {
            navigate("/brands", { state: { toastMessage } });
          }
        }
      }
    } catch {
      toast.error("Tên thương hiệu đã tồn tại");
    }
  }

  async function saveBranchHandle(data: UserForm) {
    try {
      const userResult = await createUser(data, 3);

      if (userResult.statusCode === 200) {
        const branchResult = await createBranch(
          branchData,
          userResult.data.toString()
        );

        if (branchResult.statusCode === 200) {
          await onCloseUser();
          const toastMessage = "Thêm chi nhánh mới thành công";
          const pathname = decodeURIComponent(location.pathname);
          const formattedPathname = pathname.replace("/", "");
          const brandName = branchData.brandName.value;
          const id = branchData.brandName.id;
          localStorage.setItem("toastMessage", toastMessage);
          localStorage.setItem("brandName", brandName);
          localStorage.setItem("brandId", id);
          if (formattedPathname === `branches/${brandName}`) {
            window.location.reload();
          } else {
            navigate(`/branches/${brandName}`, { state: { id } });
          }
        }
      }
    } catch {
      toast.error("Thêm chi nhánh mới thất bại");
    }
  }

  const filteredMenuItems = menuItems.filter((menuItem) => {
    if (!menuItem.permissionRole) return true;
    if (Array.isArray(menuItem.permissionRole)) {
      return menuItem.permissionRole.toString().includes(roleId);
    }
    return menuItem.permissionRole.toString() === roleId;
  });

  return (
    <Flex
      className={style.Sidebar}
      width={isExpanded ? "250px" : "65px"}
      direction="column"
    >
      <Flex>
        <Flex className={style.Logo}>
          <Avatar src={Logo} className={style.Avatar} />
          {isExpanded && <Text className={style.LogoText}>Smart Menu</Text>}
        </Flex>
        <IoIosArrowForward
          className={style.ArrowSidebar}
          onClick={toggleSidebar}
          style={{
            transform: `rotate(${isExpanded ? 180 : 0}deg)`,
            color: "#fff",
          }}
        />
      </Flex>

      <Flex className={style.MenuItems} direction="column">
        {filteredMenuItems.map((menuItem, index) => (
          <React.Fragment key={index}>
            <ChakraLink
              as={menuItem.to ? ReactRouterLink : "button"}
              {...(menuItem.to ? { to: menuItem.to } : {})}
              className={style.MenuItem}
              style={{ textDecoration: "none" }}
              onClick={
                menuItem.to
                  ? () => changeItem(menuItem.label)
                  : menuItem.onclick
              }
              backgroundColor={item === menuItem.label ? "#55AD9B" : "#fff"}
              color={item === menuItem.label ? "#F1F8E8" : "black"}
            >
              <Flex>
                <Icon as={menuItem.icon} className={style.MenuIcon} />
                {isExpanded && (
                  <Text className={style.MenuText}>{menuItem.label}</Text>
                )}
              </Flex>
            </ChakraLink>
            {menuItem.divider && <Divider />}
          </React.Fragment>
        ))}
      </Flex>

      <Flex className={style.Profile} onClick={logoutHandler}>
        <MdLogout className={style.LogoutIcon} />
        {isExpanded && <Text className={style.LogoutText}>Đăng Xuất</Text>}
      </Flex>

      <ModalForm
        formBody={
          <ModalFormBrand
            brandData={brandData}
            onClose={onCloseBrand}
            updateBrandData={updateBrandData}
            nextHandler={() => nextHandler(CurrentForm.BRAND)}
            isEdit={false}
          />
        }
        onClose={onCloseBrand}
        isOpen={isOpenBrand}
        title={t("Tạo thương hiệu mới")}
        updateBrandData={updateBrandData}
      />

      <ModalForm
        formBody={
          <ModalFormBranch
            branchData={branchData}
            onClose={onCloseBranch}
            updateBranchData={updateBranchData}
            nextHandler={() => nextHandler(CurrentForm.BRANCH)}
            isEdit={false}
          />
        }
        onClose={onCloseBranch}
        isOpen={isOpenBranch}
        updateBranchData={updateBranchData}
        title={t("Tạo chi nhánh mới")}
      />

      <ModalForm
        formBody={
          <ModalFormUser
            isEdit={false}
            onClose={onCloseUser}
            formPrevious={formPrevious}
            onOpenBranch={onOpenBranch}
            onOpenBrand={onOpenBrand}
            updateBrandData={updateBrandData}
            updateBranchData={updateBranchData}
            updateUserData={updateUserData}
            saveBrandHandle={saveBrandHandle}
            saveBranchHandle={saveBranchHandle}
            brandName={brandData.brandName.value}
            branch={branchData}
            userData={userData}
          />
        }
        onClose={onCloseUser}
        isOpen={isOpenUser}
        title={t("Thêm người dùng mới")}
        updateBranchData={updateBranchData}
        updateBrandData={updateBrandData}
        updateUserData={updateUserData}
      />
    </Flex>
  );
}

export default Sidebar;
