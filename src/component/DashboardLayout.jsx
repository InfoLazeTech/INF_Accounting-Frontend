// src/components/DashboardLayout.jsx
import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, Typography } from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Outlet, Link, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapse = () => setCollapsed(!collapsed);

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">Home</Link>,
    },
    {
      key: "2",
      icon: <DollarOutlined />,
      label: <Link to="/dashboard/banking">Banking</Link>,
    },
    {
      key: "3",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/dashboard/sales">Sales</Link>,
    },
    {
      key: "4",
      icon: <AppstoreAddOutlined />,
      label: <Link to="/dashboard/inventory">Inventory</Link>,
    },
    {
      key: "5",
      icon: <UserOutlined />,
      label: <Link to="/dashboard/customer">Customer</Link>,
    },
    {
      key: "6",
      icon: <UserOutlined />,
      label: <Link to="/dashboard/profile">Profile</Link>,
    },
  ];

  const userMenu = (
    <Menu>
      {/* <Menu.Item
        key="settings"
        icon={<SettingOutlined />}
        onClick={() => navigate("/dashboard/settings/profile")}
      >
        Settings
      </Menu.Item> */}
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => navigate("/login")}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 64,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#fff",
            fontSize: 18,
            borderRadius: 8,
          }}
        >
          {collapsed ? "INF" : "INF Accounting"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
            boxShadow: "0 2px 8px #f0f1f2",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapse}
            style={{ fontSize: "18px" }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Avatar
                  style={{ backgroundColor: "#1890ff" }}
                  icon={<UserOutlined />}
                />
                <Text style={{ marginLeft: 8 }}>Admin</Text>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: "16px",
            padding: "24px",
            background: "#f5f5f5",
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
