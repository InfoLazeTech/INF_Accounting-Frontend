import { Avatar, Layout, Menu } from "antd";
import { useTheme } from "../commonComponent/ThemeProvider";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Icons from "../../assets/icon";
import { colorPalette } from "../../utlis/theme";
import { useSelector } from "react-redux";
// import logo from "../../assets/logo.png"

const { Sider } = Layout;

const AppSidebar = ({ collapsed, setCollapsed }) => {
  const { isDarkMode } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const mainPrimaryColor = colorPalette.primary[500];
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarToggle = () => {
    if (typeof setCollapsed === "function") {
      setCollapsed(!collapsed);
    } else {
      console.error("setCollapsed is not a function");
    }
  };

  const menuStyles = {
    backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
    paddingBottom: "50px",
  };

  const items = [
    {
      key: "1",
      icon: <Icons.HomeOutlined />,
      label: "Home",
      path: "/",
    },
    {
      key: "2",
      icon: <Icons.UsergroupAddOutlined />,
      label: "Customer/Vendor",
      path: "/customer",
    },
    {
      key: "3",
      icon: <Icons.CreditCardOutlined />,
      label: "Item",
      path: "/item",
    },
    {
      key: "4",
      icon: <Icons.BuildOutlined />,
      label: "Purchase Bill",
      path: "/bill",
    },
    {
      key: "5",
      icon: <Icons.InboxOutlined />,
      label: "Invoice",
      path: "/invoice",
    },
      {
      key: "6",
      icon: <Icons.DollarOutlined />,
      label: "Payment Received",
      path: "/payment-received",
    },
     {
      key: "7",
      icon: <Icons.DollarOutlined />,
      label: "Payment Made",
      path: "/payment-made",
    },
    {
      key: "8",
      icon: <Icons.RiseOutlined />,
      label: "Customer Report",
      path: "/customer-report",
    },
    {
      key: "9",
      icon: <Icons.RiseOutlined />,
      label: "Vendor Report",
      path: "/vendor-report",
    },
     {
      key: "10",
      icon: <Icons.RiseOutlined />,
      label: "Item Report",
      path: "/item-report",
    },
  ];

  const handleMenuClick = ({ key }) => {
    const item = items.find((i) => i.key === key);
    if (item?.path) navigate(item.path);
  };

  // Map location to menu key
  const selectedKey = items.find(
    (i) =>
      location.pathname === i.path || location.pathname.startsWith(i.path + "/")
  )?.key;

  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={handleSidebarToggle}
        width={250}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        {/* Logo */}
        <div
          className={`h-16 flex items-center px-4 border-b z-50 ${
            isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
          } ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: collapsed ? 80 : 250,
            transition: "width 0.3s",
          }}
        >
          <NavLink to="/" className="w-full text-center">
            {/* <img
              alt="INF"
              src={logo}
              className={`transition-all duration-300 ${
                collapsed ? "w-40" : "w-full"
              }`}
            /> */}
            <span
              className={`font-semibold text-2xl text-gray-800 transition-all duration-500 ease-in-out block`}
            >
              {collapsed ? "INF" : "INF ACCOUNTS"}
            </span>
          </NavLink>
        </div>

        {/* Menu Section */}
        <div
          className="z-10"
          style={{
            backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
            marginTop: 64,
            marginBottom: 80,
            height: `calc(100vh - 64px - 80px)`,
            overflowY: "auto",
            minHeight: 0,
            border: "none",
            borderInlineEnd: "none",
          }}
        >
          <Menu
            mode="inline"
            theme="light"
            inlineCollapsed={collapsed}
            onClick={handleMenuClick}
            selectedKeys={[selectedKey]}
            items={items}
            style={menuStyles}
            className="border-none custom-menu h-full"
          />
        </div>

        <div
          className={`${isDarkMode ? "bg-[#1a1a1a]" : "bg-white"} border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          } p-4 flex items-center gap-3 z-50 hover:bg-gray-100 transition`}
          style={{
            position: "fixed",
            left: 0,
            bottom: 0,
            width: collapsed ? 80 : 250,
            transition: "width 0.3s",
          }}
        >
          <Avatar
            className="flex-shrink-0"
            style={{ background: mainPrimaryColor, color: "#fff" }}
          >
            {user?.name?.[0] || "U"}
          </Avatar>

          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-sm truncate">
                {user?.name}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {user?.company?.companyName}
              </span>
            </div>
          )}
        </div>

        {/* Custom Styles */}
        <style jsx global>{`
          .ant-menu-light .ant-menu-item,
          .ant-menu-light .ant-menu-submenu-title {
            font-weight: 500 !important;
            font-size: 14px !important;
            line-height: 3 !important;
          }
          .ant-menu-light .ant-menu-item-selected {
            background-color: ${mainPrimaryColor} !important;
            color: #ffffff !important;
            font-weight: 600 !important;
          }
          .ant-menu-light .ant-menu-item:hover {
            background-color: ${mainPrimaryColor} !important;
            color: #ffffff !important;
          }
          .ant-menu-light .ant-menu-submenu-title:hover {
            background-color: ${mainPrimaryColor} !important;
            color: #ffffff !important;
          }
        `}</style>
      </Sider>
    </>
  );
};

export default AppSidebar;
