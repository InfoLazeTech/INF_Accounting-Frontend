// src/pages/settings/Profile.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Typography,
  Upload,
} from "antd";
import {
  InboxOutlined,
  EditOutlined,
  SaveOutlined,
  UserOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  HomeOutlined,
  LockOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const Profile = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    companyName: "Demo Infolanze",
    email: "techteam.infolanze@gmail.com",
    phone: "7229028694",
    logo: null,
    signature: null,
    gstin: "27ABCDE1234F1Z5",
    pan: "BJPFC1243E",
    street1: "A-807, Empire Business Hub",
    street2: "Science City Road, Sola",
    cityState: "Ahmedabad",
    pin: "360004",
    fax: "12345678",
  });

  useEffect(() => {
    form.setFieldsValue(companyData);
  }, [companyData, form]);

  const handleSave = (values) => {
    setCompanyData((prev) => ({ ...prev, ...values }));
    setIsEditing(false);
  };

  const uploadProps = (type) => ({
    accept: "image/*",
    listType: "picture-card",
    maxCount: 1,
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyData((prev) => ({ ...prev, [type]: e.target.result }));
      };
      reader.readAsDataURL(file);
      return false;
    },
  });

  // Section Title Component with Icon
  const SectionTitle = ({ icon, title, subtitle }) => (
    <div style={{ display: "flex", alignItems: "center", marginTop: 32, marginBottom: 12 }}>
      {React.cloneElement(icon, { style: { fontSize: 28, color: "#1890ff", marginRight: 12 } })}
      <div>
        <Title
          level={3}
          style={{
            margin: 0,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#001529",
          }}
        >
          {title}
        </Title>
        {subtitle && <Text type="secondary">{subtitle}</Text>}
      </div>
    </div>
  );

  const PlaceholderBox = ({ text }) => (
    <div
      style={{
        height: 100,
        border: "2px dashed #ccc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#aaa",
        fontStyle: "italic",
      }}
    >
      {text}
    </div>
  );

  return (
    <Card>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Company Profile</Title>
          <Text type="secondary">Configure your company information, tax details, and address</Text>
        </Col>
        <Col>
          {isEditing ? (
            <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()}>
              Save Changes
            </Button>
          ) : (
            <Button icon={<EditOutlined />} type="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Col>
      </Row>

      <Form form={form} layout="vertical" onFinish={handleSave}>
        {/* Basic Details */}
        <SectionTitle
          icon={<UserOutlined />}
          title="Basic Details"
          subtitle="Essential company information and branding"
        />
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="companyName" label="Company Name">
              <Input
                disabled={!isEditing}
                prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="email" label="Email Address">
              <Input
                disabled={!isEditing}
                prefix={<MailOutlined style={{ color: "#1890ff" }} />}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="phone" label="Phone Number">
              <Input
                disabled={!isEditing}
                prefix={<PhoneOutlined style={{ color: "#1890ff" }} />}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Logo / Signature */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Company Logo">
              {!isEditing ? (
                companyData.logo ? (
                  <img
                    src={companyData.logo}
                    alt="Logo"
                    style={{ height: 100, border: "2px dashed #ccc", padding: 4 }}
                  />
                ) : (
                  <PlaceholderBox text="No logo uploaded" />
                )
              ) : (
                <Dragger {...uploadProps("logo")}>
                  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                  <p className="ant-upload-text">Click or drag logo to upload</p>
                </Dragger>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Digital Signature">
              {!isEditing ? (
                companyData.signature ? (
                  <img
                    src={companyData.signature}
                    alt="Signature"
                    style={{ height: 100, border: "2px dashed #ccc", padding: 4 }}
                  />
                ) : (
                  <PlaceholderBox text="No signature uploaded" />
                )
              ) : (
                <Dragger {...uploadProps("signature")}>
                  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                  <p className="ant-upload-text">Click or drag signature to upload</p>
                </Dragger>
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Tax Information */}
        <SectionTitle
          icon={<FileTextOutlined />}
          title="Tax Information"
          subtitle="GST and PAN details for compliance"
        />
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="gstin" label="GSTIN">
              <Input
                disabled={!isEditing}
                prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="pan" label="PAN Number">
              <Input
                disabled={!isEditing}
                prefix={<IdcardOutlined style={{ color: "#1890ff" }} />}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Address Details */}
        <SectionTitle
          icon={<EnvironmentOutlined />}
          title="Address Details"
          subtitle="Company location and contact information"
        />
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="street1" label="Street Address 1">
              <Input
                disabled={!isEditing}
                prefix={<EnvironmentOutlined style={{ color: "#1890ff" }} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="street2" label="Street Address 2">
              <Input
                disabled={!isEditing}
                prefix={<EnvironmentOutlined style={{ color: "#1890ff" }} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="cityState" label="City & State">
              <Input
                disabled={!isEditing}
                prefix={<HomeOutlined style={{ color: "#1890ff" }} />}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="pin" label="PIN Code">
              <Input
                disabled={!isEditing}
                prefix={<LockOutlined style={{ color: "#1890ff" }} />}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="fax" label="Fax Number">
              <Input
                disabled={!isEditing}
                prefix={<PhoneOutlined style={{ color: "#1890ff" }} />}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Profile;
