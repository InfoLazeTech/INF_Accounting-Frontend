// src/pages/Customer.jsx
import React, { useState } from "react";
import { Card, Row, Col, Typography, Button, Input, Space, Table } from "antd";

import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Customer = () => {
  const [data] = useState([
    {
      key: "1",
      code: "CUST001",
      name: "John Doe",
      company: "Tech Solutions",
      email: "john@example.com",
      openingBalance: 5000,
      currentBalance: 3000,
      phone: "9876543210",
    },
    {
      key: "2",
      code: "CUST002",
      name: "Jane Smith",
      company: "Innovate Corp",
      email: "jane@example.com",
      openingBalance: 2000,
      currentBalance: 1500,
      phone: "9876543222",
    },
     {
      key: "3",
      code: "CUST003",
      name: "Jane Smith",
      company: "Innovate Corp",
      email: "jane@example.com",
      openingBalance: 2000,
      currentBalance: 1500,
      phone: "9876543222",
    },
     {
      key: "4",
      code: "CUST004",
      name: "Jane Smith",
      company: "Innovate Corp",
      email: "jane@example.com",
      openingBalance: 2000,
      currentBalance: 1500,
      phone: "9876543222",
    },
  ]);

  const navigate = useNavigate();

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Company Name",
      dataIndex: "company",
      key: "company",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Opening Balance",
      dataIndex: "openingBalance",
      key: "openingBalance",
      render: (val) => `₹${val}`,
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Current Balance",
      dataIndex: "currentBalance",
      key: "currentBalance",
      render: (val) => `₹${val}`,
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Work Phone",
      dataIndex: "phone",
      key: "phone",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/dashboard/customer/edit/${record.key}`)}
          />
          <Button type="default" danger icon={<DeleteOutlined />} />
        </Space>
      ),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
  ];

return (
  <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "16px" }}>
    {/* Header Section */}
    <Card
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: "12px 20px" }}
    >
      <Row align="middle" justify="space-between">
        <Col>
          <Title
            level={4}
            style={{
              margin: 0,
              lineHeight: "1.2",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              color: "#001529",
            }}
          >
            View Customers ({data.length})
          </Title>
        </Col>
        <Col>
          <Space size="middle">
            <Button size="middle" style={{fontSize: 16, fontWeight: 400,}}>
              Export Customer
            </Button>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              size="middle"
              style={{fontSize: 16, fontWeight: 400,}}
              // style={{ backgroundColor: "#003366", borderColor: "#003366" }}
            >
              Add Bulk Customer
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="middle"
              style={{fontSize: 16, fontWeight: 400,}}
              // style={{ backgroundColor: "#003366", borderColor: "#003366" }}
              onClick={() => navigate("/dashboard/customer/add")}
            >
              Add Customer
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>

    {/* Filter/Search Section */}
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={16} align="middle">
        <Col span={10}>
          <Input
            placeholder="Search by customer name"
            suffix={
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    borderLeft: "1px solid #ccc",
                    height: 20,
                    display: "inline-block",
                  }}
                />
                <SearchOutlined style={{ color: "#000" }} />
              </span>
            }
            style={{ borderRadius: 6, height: 36 }}
          />
        </Col>
        <Col span={14} style={{ textAlign: "right" }}>
          <Space>
            <Button type="primary" icon={<FilterOutlined />} size="middle">
              Apply Filter
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>

    {/* Table Section */}
    <Card style={{ marginBottom: 16 }}>
      <Row style={{ marginBottom: 12 }}>
        <Col>
          <Title
            level={4}
            style={{
              margin: 0,
              fontWeight: "700",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              color: "#001529",
            }}
          >
            Customer List
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Overview of all customers and their balances
          </Text>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        bordered
        style={{ borderRadius: 6, overflow: "hidden" }}
        components={{
          body: {
            cell: (props) => (
              <td
                {...props}
                style={{
                  fontSize: 15,
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  color: "#000",
                  padding: "12px",
                  ...props.style,
                }}
              >
                {props.children}
              </td>
            ),
          },
        }}
      />
    </Card>
  </div>
);

};

export default Customer;
