// src/pages/EditCustomer.jsx
import React, { useEffect } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Select,
  Typography,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;

const EditCustomer = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock fetch data for editing
  const customerData = {
    code: "CUST001",
    name: "John Doe",
    company: "Tech Solutions",
    email: "john@example.com",
    phone: "9876543210",
    companyType: "Private Limited",
    openingBalance: 5000,
    currentBalance: 3000,
    status: "Active",
  };

  useEffect(() => {
    // Set form fields with customer data
    form.setFieldsValue(customerData);
  }, [form]);

  const onFinish = (values) => {
    console.log("Updated Customer:", values);
    // API call to update customer goes here
    navigate("/dashboard/customer"); // redirect back to list
  };

  return (
    <Card
      style={{ maxWidth: 1200, margin: "0 auto" }}
      bodyStyle={{ padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {/* Header with Back Button */}
      <Row align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/dashboard/customer")}
            style={{ marginRight: 8 }}
          />
        </Col>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Edit Customer
          </Title>
        </Col>
      </Row>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="code"
              label="Customer Code"
              rules={[{ required: true, message: "Please enter customer code" }]}
            >
              <Input placeholder="Enter customer code" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="name"
              label="Customer Name"
              rules={[{ required: true, message: "Please enter customer name" }]}
            >
              <Input placeholder="Enter customer name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="company"
              label="Company Name"
              rules={[{ required: true, message: "Please enter company name" }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="phone" label="Work Phone">
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="companyType" label="Company Type">
              <Select
                placeholder="Select company type"
                options={[
                  { value: "Private Limited", label: "Private Limited" },
                  { value: "Partnership", label: "Partnership" },
                  { value: "Proprietorship", label: "Proprietorship" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="openingBalance" label="Opening Balance">
              <InputNumber
                placeholder="Enter opening balance"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="currentBalance" label="Current Balance">
              <InputNumber
                placeholder="Enter current balance"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label="Status">
              <Select
                placeholder="Select status"
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Form.Item>
          <Row justify="end" gutter={16}>
            <Col>
              <Button onClick={() => navigate("/dashboard/customer")}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditCustomer;
