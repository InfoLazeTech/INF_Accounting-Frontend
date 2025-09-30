import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  InputNumber,
  Select,
  DatePicker,
  TimePicker,
  Switch,
  Checkbox,
  Radio,
  Upload,
  Button,
  Form,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const CustomInput = ({
  type = "text",
  name,
  label,
  placeholder,
  options = [],
  rules = [],
  otpLength = 6,
  ...restProps
}) => {
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const val = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    restProps.onChange?.(newOtp.join(""));

    if (val && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  useEffect(() => {
    if (type === "otp") {
      inputRefs.current[0]?.focus();
    }
  }, [type]);

  let inputComponent;

  switch (type) {
    case "password":
      inputComponent = (
        <Input.Password placeholder={placeholder} {...restProps} />
      );
      break;
    case "textarea":
      inputComponent = <TextArea placeholder={placeholder} {...restProps} />;
      break;
    case "number":
      inputComponent = (
        <InputNumber
          placeholder={placeholder}
          style={{ width: "100%", paddingBottom: 2.5, paddingTop: 2.5 }}
          {...restProps}
        />
      );
      break;
    case "select":
      inputComponent = (
        <Select placeholder={placeholder} options={options} {...restProps} />
      );
      break;
    case "date":
      inputComponent = <DatePicker style={{ width: "100%" }} {...restProps} />;
      break;
    case "time":
      inputComponent = <TimePicker style={{ width: "100%" }} {...restProps} />;
      break;
    case "switch":
      inputComponent = <Switch {...restProps} />;
      break;
    case "checkbox":
      inputComponent =
        options.length > 0 ? (
          <Checkbox.Group options={options} {...restProps} />
        ) : (
          <Checkbox {...restProps}>{label}</Checkbox>
        );
      break;
    case "radio":
      inputComponent = <Radio.Group options={options} {...restProps} />;
      break;
    case "file":
      inputComponent = (
        <Upload {...restProps} maxCount={1}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      );
      break;
    case "otp":
      inputComponent = (
        <div style={{ display: "flex", gap: 8 }}>
          {otp.map((val, idx) => (
            <Input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              value={val}
              maxLength={1}
              onChange={(e) => handleOtpChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              style={{ width: 40, textAlign: "center" }}
            />
          ))}
        </div>
      );
      break;
    default:
      inputComponent = <Input placeholder={placeholder} {...restProps} />;
  }

  const valuePropName =
    type === "switch"
      ? "checked"
      : type === "file"
      ? "fileList"
      : type === "checkbox" && options.length === 0
      ? "checked"
      : "value";

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      valuePropName={valuePropName}
    >
      {inputComponent}
    </Form.Item>
  );
};

export default CustomInput;
