import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Layout, Menu } from "antd";
import { useTheme } from "../commonComponent/ThemeProvider";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Icons from "../../assets/icon";
import { colorPalette } from "../../utlis/theme";
import { useSelector } from "react-redux";

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
    { key: "1", icon: <Icons.HomeOutlined />, label: "Home", path: "/" },
    { key: "2", icon: <Icons.BankOutlined />, label: "Banking", path: "/banking" },
    { key: "3", icon: <Icons.UsergroupAddOutlined />, label: "Customer/Vendor", path: "/customer" },
    { key: "4", icon: <Icons.CreditCardOutlined />, label: "Item", path: "/item" },
    { key: "5", icon: <Icons.BuildOutlined />, label: "Purchase Bill", path: "/bill" },
    { key: "6", icon: <Icons.InboxOutlined />, label: "Invoice", path: "/invoice" },
    {
      key: "7",
      icon: <Icons.DollarOutlined />,
      label: "Payments",
      children: [
        { key: "7-1", label: "Payment Received", icon: <Icons.DollarOutlined />, path: "/payment-received" },
        { key: "7-2", label: "Payment Made", icon: <Icons.DollarOutlined />, path: "/payment-made" },
      ],
    },
    {
      key: "8",
      icon: <Icons.RiseOutlined />,
      label: "Reports",
      children: [
        { key: "8-1", icon: <Icons.RiseOutlined />, label: "Customer Report", path: "/customer-report" },
        { key: "8-2", icon: <Icons.RiseOutlined />, label: "Vendor Report", path: "/vendor-report" },
        { key: "8-3", icon: <Icons.RiseOutlined />, label: "Item Report", path: "/item-report" },
      ],
    },
  ];

  // safe matching: exact match OR segment prefix (path + "/")
  const matchesPath = (pathname, path) => {
    if (!path) return false;
    if (path === "/") return pathname === "/"; // root only exact
    return pathname === path || pathname.startsWith(path + "/");
  };

  // Recursively find selected key and which parents should be open
  const computeActive = (menuItems, pathname) => {
    for (const item of menuItems) {
      // If parent has a path and matches (treat parent as active for subroutes)
      if (item.path && matchesPath(pathname, item.path)) {
        return { selectedKey: item.key, openKeys: [] }; // parent is selected
      }

      // If children exist, check children
      if (item.children) {
        for (const child of item.children) {
          if (child.path && matchesPath(pathname, child.path)) {
            return { selectedKey: child.key, openKeys: [item.key] }; // child selected, parent open
          }
        }
      }
    }
    return { selectedKey: null, openKeys: [] };
  };

  const { selectedKey: initialSelectedKey, openKeys: initialOpenKeys } = useMemo(
    () => computeActive(items, location.pathname),
    [items, location.pathname]
  );

  const [openKeys, setOpenKeys] = useState(initialOpenKeys);
  const [selectedKey, setSelectedKey] = useState(initialSelectedKey);

  useEffect(() => {
    const { selectedKey: sk, openKeys: ok } = computeActive(items, location.pathname);
    setSelectedKey(sk);
    setOpenKeys(collapsed ? [] : ok);
  }, [location.pathname, collapsed]);

  const handleMenuClick = ({ key }) => {
    const findItemByKey = (menuItems, k) => {
      for (const it of menuItems) {
        if (it.key === k) return it;
        if (it.children) {
          const child = findItemByKey(it.children, k);
          if (child) return child;
        }
      }
      return null;
    };

    const clicked = findItemByKey(items, key);
    if (clicked?.path) {
      navigate(clicked.path);
    }
    setSelectedKey(key);
  };

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

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
          className={`h-16 flex items-center px-4 border-b z-50 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
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
            selectedKeys={selectedKey ? [selectedKey] : []}
            openKeys={collapsed ? [] : openKeys}
            onOpenChange={onOpenChange}
            items={items}
            style={menuStyles}
            className="border-none custom-menu h-full"
          />
        </div>

        <div
          className={`${isDarkMode ? "bg-[#1a1a1a]" : "bg-white"} border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"
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
              <span className="font-semibold text-sm truncate">{user?.name}</span>
              <span className="text-xs text-gray-500 truncate">
                {user?.company?.companyName}
              </span>
            </div>
          )}
        </div>

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
