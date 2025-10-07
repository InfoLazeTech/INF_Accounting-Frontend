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
  message,
  Spin,
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
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../component/commonComponent/CustomInput";
import {IndianStates}from '../../utlis/state.js'
import {
  getCompany,
  updateCompany,
} from "../../redux/slice/company/companySlice";
import Icons from "../../assets/icon";

const stateOptions = Object.values(IndianStates).map((stateName ) => ({
  value: stateName,
  label: stateName,
}));

const Profile = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const { companyData, loading, postLoading } = useSelector(
    (state) => state.company
  );
  const { user, companyId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCompany(companyId));
  }, [dispatch, companyId]);

  useEffect(() => {
    if (companyData) {
      form.setFieldsValue({
        companyName: companyData.companyName || "",
        email: companyData.email || user?.email || "",
        phone: companyData.phone || user?.phone || "",
        gstNo: companyData.gstNo || "",
        panNo: companyData.panNo || "",
        logo: companyData.logo || "",
        signature: companyData.signature || "",
        street1: companyData.address?.street1 || "",
        street2: companyData.address?.street2 || "",
        city: companyData.address?.city || "",
        state: companyData.address?.state || "",
        pin: companyData.address?.pinCode || "",
        fax: companyData.address?.faxNumber || "",
      });
    }
  }, [companyData, form, user]);
  const handleSave = async (values) => {
    try {
      const payload = {
        companyName: values.companyName,
        gstNo: values.gstNo,
        panNo: values.panNo,
        logo: values.logo,
        signature: values.signature,
        address: {
          street1: values.street1,
          street2: values.street2,
          city: values.city,
          state: values.state,
          pinCode: values.pin,
          faxNumber: values.fax,
        },
      };

      await dispatch(updateCompany({ companyId, data: payload })).unwrap();
      setIsEditing(false);
    } catch (err) {
      message.error(err);
    }
  };

  const uploadProps = (type) => ({
    accept: "image/*",
    listType: "picture-card",
    maxCount: 1,
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        form.setFieldsValue({ [type]: e.target.result });
      };
      reader.readAsDataURL(file);
      return false;
    },
  });

  const SectionTitle = ({ icon, title, subtitle }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 32,
        marginBottom: 12,
      }}
    >
      {React.cloneElement(icon, {
        style: { fontSize: 28, color: "#1890ff", marginRight: 12 },
      })}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <Spin tip="Loading company profile..." />;
      </div>
    );
  }

  return (
    <Card className="!m-4 !p-3">
      <Row
        justify="space-between"
        align="middle"
        className="border-b border-gray-200 pb-4"
      >
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Company Profile
          </Title>
          <Text type="secondary">
            Configure your company information, tax details, and address
          </Text>
        </Col>
        <Col className="!space-x-2">
          {isEditing && (
            <Button
              type="default"
              icon={<Icons.CloseOutlined />}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
          {isEditing ? (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={postLoading}
              onClick={() => form.submit()}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              icon={<EditOutlined />}
              type="primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Col>
      </Row>

      <Form form={form} layout="vertical" onFinish={handleSave}>
        <SectionTitle
          icon={<UserOutlined />}
          title="Basic Details"
          subtitle="Essential company information and branding"
        />
        <Row gutter={16}>
          <Col span={8}>
         <CustomInput
              type="text"
              name="companyName"
              label="Company Name"
              placeholder="Enter company name"
              disabled={!isEditing}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              rules={[{ required: true, message: "Please enter company name" }]}
            />
          </Col>
          <Col span={8}>
           <CustomInput
              type="text"
              name="email"
              label="Email Address"
              placeholder="Enter email address"
              disabled
              prefix={<MailOutlined style={{ color: "#1890ff" }} />}
              rules={[
                { required: true, message: "Please enter email address" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            />
          </Col>
          <Col span={8}>
           <CustomInput
              type="text"
              name="phone"
              label="Phone Number"
              placeholder="Enter phone number"
              disabled
              prefix={<PhoneOutlined style={{ color: "#1890ff" }} />}
              rules={[
                { required: true, message: "Please enter phone number" },
                { len: 10, message: "Phone number must be 10 digits" },
              ]}
            />
          </Col>
        </Row>

        {/* Logo / Signature */}
        <SectionTitle icon={<InboxOutlined />} title="Logo & Signature" />
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Company Logo">
              {!isEditing ? (
                companyData?.logo ? (
                  <img
                    src={companyData.logo}
                    alt="Logo"
                    style={{
                      height: 100,
                      border: "2px dashed #ccc",
                      padding: 4,
                    }}
                  />
                ) : (
                  <PlaceholderBox text="No logo uploaded" />
                )
              ) : (
                <Dragger {...uploadProps("logo")}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag logo to upload
                  </p>
                </Dragger>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Digital Signature">
              {!isEditing ? (
                companyData?.signature ? (
                  <img
                    src={companyData.signature}
                    alt="Signature"
                    style={{
                      height: 100,
                      border: "2px dashed #ccc",
                      padding: 4,
                    }}
                  />
                ) : (
                  <PlaceholderBox text="No signature uploaded" />
                )
              ) : (
                <Dragger {...uploadProps("signature")}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag signature to upload
                  </p>
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
            <CustomInput
              type="text"
              name="gstNo"
              label="GSTIN"
              placeholder="Enter GST number"
              disabled={!isEditing}
              prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
              rules={[{ required: true, message: "Please enter GST number" }]}
            />
          </Col>
          <Col span={12}>
              <CustomInput
              type="text"
              name="panNo"
              label="PAN Number"
              placeholder="Enter PAN number"
              disabled={!isEditing}
              prefix={<IdcardOutlined style={{ color: "#1890ff" }} />}
              rules={[{ required: true, message: "Please enter PAN number" }]}
            />
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
             <CustomInput
              type="text"
              name="street1"
              label="Street Address 1"
              placeholder="Enter street address"
              disabled={!isEditing}
              prefix={<EnvironmentOutlined style={{ color: "#1890ff" }} />}
              rules={[
                { required: true, message: "Please enter street address" },
              ]}
            />
          </Col>
          <Col span={12}>
            <CustomInput
              type="text"
              name="street2"
              label="Street Address 2"
              placeholder="Enter street address"
              disabled={!isEditing}
              prefix={<EnvironmentOutlined style={{ color: "#1890ff" }} />}
              rules={[
                { required: true, message: "Please enter street address" },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <CustomInput
              type="text"
              name="city"
              label="City"
              placeholder="Enter city"
              disabled={!isEditing}
              prefix={<HomeOutlined style={{ color: "#1890ff" }} />}
              rules={[{ required: true, message: "Please enter city" }]}
            />
          </Col>
           <Col span={8}>
            <CustomInput
              type="select"
              name="state"
              label="State"
              placeholder="Select state"
              disabled={!isEditing}
              prefix={<HomeOutlined style={{ color: "#1890ff" }} />}
              options={stateOptions}
              rules={[{ required: true, message: "Please select state" }]}
            />
          </Col>
          <Col span={8}>
           <CustomInput
              type="text"
              name="pin"
              label="PIN Code"
              placeholder="Enter PIN code"
              disabled={!isEditing}
              prefix={<LockOutlined style={{ color: "#1890ff" }} />}
              rules={[{ required: true, message: "Please enter PIN code" }]}
            />
          </Col>
          <Col span={8}>
            <CustomInput
              type="text"
              name="fax"
              label="Fax Number"
              placeholder="Enter fax number"
              disabled={!isEditing}
              prefix={<PhoneOutlined style={{ color: "#1890ff" }} />}
              rules={[{ required: true, message: "Please enter fax number" }]}
            />
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Profile;
