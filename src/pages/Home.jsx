import React from 'react';
import { Form, Button, Card } from 'antd';
import CustomInput from '../component/commonComponent/CustomInput';

export default function Home() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form Values:', values);
  };

  return (
    <Card title="CustomInput Full Demo" style={{ maxWidth: 800, margin: '20px auto' }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Text Input */}
        <CustomInput
          type="text"
          name="username"
          label="Username"
          placeholder="Enter your username"
          rules={[{ required: true, message: 'Username is required' }]}
        />

        {/* Password Input */}
        <CustomInput
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        />

        {/* TextArea */}
        <CustomInput
          type="textarea"
          name="bio"
          label="Bio"
          placeholder="Write something about yourself"
        />

        {/* Number Input */}
        <CustomInput
          type="number"
          name="age"
          label="Age"
          placeholder="Enter your age"
          rules={[
            { required: true, message: 'Age is required' },
            { type: 'number', min: 1, max: 120, message: 'Enter a valid age' },
          ]}
        />

        {/* Select */}
        <CustomInput
          type="select"
          name="role"
          label="Role"
          placeholder="Select a role"
          options={[
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' },
          ]}
          rules={[{ required: true, message: 'Role is required' }]}
        />

        {/* Switch */}
        <CustomInput
          type="switch"
          name="active"
          label="Active"
        />

        {/* Single Checkbox */}
        <CustomInput
          type="checkbox"
          name="subscribe"
          label="Subscribe to newsletter"
        />

        {/* Checkbox Group */}
        <CustomInput
          type="checkbox"
          name="interests"
          label="Interests"
          options={[
            { label: 'Music', value: 'music' },
            { label: 'Sports', value: 'sports' },
            { label: 'Movies', value: 'movies' },
          ]}
        />

        {/* Radio Group */}
        <CustomInput
          type="radio"
          name="gender"
          label="Gender"
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
        />

        {/* Date Picker */}
        <CustomInput
          type="date"
          name="dob"
          label="Date of Birth"
        />

        {/* Time Picker */}
        <CustomInput
          type="time"
          name="meeting"
          label="Preferred Meeting Time"
        />

        {/* File Upload */}
        <CustomInput
          type="file"
          name="resume"
          label="Upload Resume"
        />

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
