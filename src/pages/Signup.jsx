// src/pages/Signup.jsx
import React, { useState } from "react";
import { Row, Col, Card, Form, Button, Steps, Typography } from "antd";
import CustomInput from "../component/CustomInput";
import { Link } from "react-router-dom";
import {  useNavigate } from "react-router-dom";

const { Step } = Steps;
const { Text } = Typography;



export default function Signup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
const navigate = useNavigate();

  const next = async () => {
    try {
      await form.validateFields();
      // Get current step values
      const stepValues = form.getFieldsValue();
      if (currentStep === steps.length - 2) {
        // On last step before company
        navigate("/signup/company", { state: { signupData: stepValues } });
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = (values) => {
    console.log("All Signup Data:", values);
    // submit to API
  };

  const steps = [
    {
      title: "Signup",
      content: (
        <>
          <CustomInput
            type="text"
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            rules={[{ required: true, message: "Name is required" }]}
          />
          <CustomInput
            type="text"
            name="email"
            label="Email"
            placeholder="Enter your email"
            rules={[{ required: true, message: "Email is required" }]}
          />
          <CustomInput
            type="text"
            name="phone"
            label="Phone"
            placeholder="Enter your phone number"
            rules={[{ required: true, message: "Phone is required" }]}
          />
          <CustomInput
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            rules={[{ required: true, message: "Password is required" }]}
          />
        </>
      ),
    },
    // {
    //   title: 'OTP',
    //   content: (
    //     <>
    //       <CustomInput
    //         type="otp"
    //         name="otp"
    //         label="OTP"
    //         rules={[{ required: true, message: 'OTP is required' }]}
    //       />
    //     </>
    //   ),
    // },
    {
      title: "Company Details",
      content: (
        <>
          <CustomInput
            type="text"
            name="companyName"
            label="Company Name"
            placeholder="Enter company name"
            rules={[{ required: true, message: "Company Name is required" }]}
          />
          <CustomInput
            type="text"
            name="gstNumber"
            label="GST Number"
            placeholder="Enter GST number"
            rules={[{ required: true, message: "GST Number is required" }]}
          />
          <CustomInput
            type="text"
            name="panNumber"
            label="PAN Number"
            placeholder="Enter PAN number"
            rules={[{ required: true, message: "PAN Number is required" }]}
          />
        </>
      ),
    },
  ];

  return (
    <Row style={{ minHeight: "100vh" }}>
      {/* Left Side - Branding */}
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
        <p>Create your account</p>
      </Col>

      {/* Right Side - Form */}
      <Col
        span={12}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card title="Signup" style={{ width: 500 }}>
          <Steps current={currentStep} style={{ marginBottom: 20 }}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            {steps[currentStep].content}

            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {currentStep > 0 && <Button onClick={prev}>Previous</Button>}

              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={next}>
                  Next
                </Button>
              )}

              {currentStep === steps.length - 1 && (
                <Button type="primary" htmlType="submit">
                  Finish Signup
                </Button>
              )}
            </div>
            {/* Bottom Link */}
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Text>
                Already have an account? <Link to="/login">Login</Link>
              </Text>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
