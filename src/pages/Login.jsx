import React from 'react';
import { Row, Col, Card, Form, Button, Typography } from 'antd';
import CustomInput from '../component/CustomInput';
import { Link,useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slice/auth/authSlice";

const { Title, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state) => state.auth);
  const onFinish =async (values) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      navigate("/dashboard"); // ✅ redirect after login
    } catch (err) {
      console.log("Login failed:", err);
    }
  };

  return (
    <Row style={{ minHeight: '100vh' }}>
      {/* Left Side - Branding */}
      <Col span={12} style={{
        backgroundColor: '#001529',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Title style={{ color: '#fff' }}>INF Accounting</Title>
        <Text  style={{ color: '#fff' }}>Welcome to INF Accounting Dashboard</Text>
        {/* You can add image/logo here */}
      </Col>

      {/* Right Side - Login Form */}
      <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card title="Login" style={{ width: 400 }}>
            
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <CustomInput
              type="text"
              name="email"
              label="Email"
              placeholder="Enter your email"
              rules={[{ required: true, message: 'Email is required' }]}
            />

            <CustomInput
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              rules={[{ required: true, message: 'Password is required' }]}
            />

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Login
              </Button>
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link to="/sign">Sign up</Link>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
