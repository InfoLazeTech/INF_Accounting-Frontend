// src/pages/settings/SettingsLayout.jsx
import React from "react";
import { Layout, Menu, Typography } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;
const { Title } = Typography;

const SettingsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar items (except "All Settings" which is now a title)
  const menuItems = [
    { key: "profile", label: "Profile", onClick: () => navigate("/dashboard/settings/profile") },
    { key: "inventory", label: "Inventory Config", onClick: () => navigate("/dashboard/settings/inventory") },
    { key: "manpower", label: "Manpower Config", onClick: () => navigate("/dashboard/settings/manpower") },
    { key: "item", label: "Item Config", onClick: () => navigate("/dashboard/settings/item") },
    { key: "other", label: "Other Settings", onClick: () => navigate("/dashboard/settings/other") },
  ];

  const selectedKey = location.pathname.split("/").pop() || "profile";

  return (
    <Layout style={{ minHeight: "80vh" }}>
      <Sider width={250} style={{ background: "#f5f5f5", paddingTop: 16 }}>
        {/* All Settings title */}
        <div style={{ padding: "16px 24px" }}>
          <Title level={4} style={{ margin: 0 }}>
            All Settings
          </Title>
        </div>

        {/* Sidebar Menu as Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 16px" }}>
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 16px",
                backgroundColor: selectedKey === item.key ? "#001529" : "#f5f5f5",
                color: selectedKey === item.key ? "#fff" : "#000",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (selectedKey !== item.key) e.target.style.backgroundColor = "#e6f7ff";
              }}
              onMouseLeave={(e) => {
                if (selectedKey !== item.key) e.target.style.backgroundColor = "#f5f5f5";
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Sider>

      <Content style={{ padding: 24, background: "#f0f2f5" }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default SettingsLayout;
