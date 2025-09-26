// src/pages/CompanyDetail.jsx
import React from "react";
import { Row, Col, Card, Form, Button } from "antd";
import CustomInput from "../component/CustomInput";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../redux/slice/auth/authSlice";
import { useDispatch } from "react-redux";

export default function CompanyDetail() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signupData } = location.state || {};
  const onFinish = async (companyData) => {
    if (!signupData) {
      return navigate("/signup"); // fallback
    }

    // Merge user info + company info
    const finalData = {
      ...signupData,
      ...companyData,
    };

    try {
      await dispatch(registerUser(finalData)).unwrap(); // Redux Thunk
      navigate("/dashboard"); // after successful registration
    } catch (err) {
      console.log("Signup failed:", err);
    }
  };
  return (
    <Row style={{ minHeight: "100vh" }}>
      <Col
        span={12}
        style={{
          backgroundColor: "#001529",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ color: "#fff" }}>INF Accounting</h1>
        <p>Enter your company details</p>
      </Col>

      <Col
        span={12}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card title="Company Details" style={{ width: 500 }}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <CustomInput
              type="text"
              name="companyName"
              label="Company Name"
              placeholder="Enter company name"
              rules={[{ required: true, message: "Company Name is required" }]}
            />

            <CustomInput
              type="text"
              name="gstNo"
              label="GST Number"
              placeholder="Enter GST number"
              rules={[{ required: true, message: "GST Number is required" }]}
            />

            <CustomInput
              type="text"
              name="panNo" 
              label="PAN Number"
              placeholder="Enter PAN number"
              rules={[{ required: true, message: "PAN Number is required" }]}
            />
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Finish Signup
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
