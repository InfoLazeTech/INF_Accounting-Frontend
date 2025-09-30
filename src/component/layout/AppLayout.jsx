import React, { useEffect, useState } from "react";
import AppSidebar from "./AppSidebar";
import { Layout } from "antd";
import AppHeader from "./AppHeader";
import { Outlet, useLocation } from "react-router-dom";
const { Content } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [isManuallyToggled, setIsManuallyToggled] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
    setIsManuallyToggled(true);
  };

  useEffect(() => {
    if (location.pathname.startsWith("/setting") && !isManuallyToggled) {
      setCollapsed(true);
    }
  }, [location.pathname, isManuallyToggled]);

  return (
    <div className="">
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        className="transition-all duration-300"
        style={{ marginLeft: collapsed ? 80 : 250 }}
      >
        <AppHeader collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <Content
          className=""
          style={{
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "#f9fafb",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};

export default AppLayout;
