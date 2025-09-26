// src/pages/SignupOTP.jsx
import React from 'react';
import { Row, Col, Card, Form, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../component/CustomInput';

const { Title, Text } = Typography;

export default function SignupOTP() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('OTP Entered:', values.otp);
    // Navigate to company detail page after OTP verification
    navigate('/signup/company');
  };

  return (
    <Row style={{ minHeight: '100vh' }}>
      {/* Left Side - Branding */}
      <Col
        span={12}
        style={{
          backgroundColor: '#001529',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <Title style={{ color: '#fff' }}>INF Accounting</Title>
        <Text style={{ color: '#fff' }}>Enter the OTP sent to your email</Text>
      </Col>

      {/* Right Side - OTP Form */}
      <Col
        span={12}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card title="OTP Verification" style={{ width: 450, padding: '2rem' }}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <CustomInput
              type="otp"
              name="otp"
              label="OTP"
              rules={[{ required: true, message: 'OTP is required' }]}
              otpLength={6} // You can change length if needed
            />

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Verify OTP
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
