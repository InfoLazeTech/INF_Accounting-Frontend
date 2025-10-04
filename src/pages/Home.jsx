import React from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Typography,
  List,
  Avatar,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Line } from "@ant-design/charts";

const { Title } = Typography;

const Home = () => {
  const salesData = [
    { month: "Jan", sales: 1200 },
    { month: "Feb", sales: 1500 },
    { month: "Mar", sales: 1800 },
    { month: "Apr", sales: 2000 },
    { month: "May", sales: 2200 },
    { month: "Jun", sales: 2500 },
  ];

  const recentActivities = [
    { title: "New customer added", time: "2 hours ago" },
    { title: "Order #1023 completed", time: "5 hours ago" },
    { title: "Stock for Item A updated", time: "1 day ago" },
    { title: "Invoice #512 generated", time: "2 days ago" },
  ];

  // Chart configuration
  const config = {
    data: salesData,
    xField: "month",
    yField: "sales",
    smooth: true,
    point: { size: 5, shape: "diamond" },
    tooltip: { showCrosshairs: true, shared: true },
    height: 250,
    color: "#1890ff",
  };

  return (
    <div style={{ padding: 24, minHeight: "100vh" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>

      {/* Top Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={1200}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={3500}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={124500}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Stock Level" value={78} suffix="%" />
            <Progress percent={78} status="active" />
          </Card>
        </Col>
      </Row>

      {/* Sales Chart & Top Items */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={16}>
          <Card title="Sales Overview">
            <Line {...config} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Top Selling Items">
            <List
              itemLayout="horizontal"
              dataSource={[
                "Item A - 250 sold",
                "Item B - 200 sold",
                "Item C - 180 sold",
                "Item D - 150 sold",
                "Item E - 120 sold",
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Recent Activities">
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<ClockCircleOutlined />} />}
                    title={item.title}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Quick Stats / Goals */}
        <Col xs={24} md={12}>
          <Card title="Goals">
            <div style={{ marginBottom: 16 }}>
              <Statistic title="Monthly Sales Target" value={3000} />
              <Progress percent={(2500 / 3000) * 100} status="active" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Statistic title="Customer Growth Target" value={500} />
              <Progress percent={(1200 / 1500) * 100} status="active" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
