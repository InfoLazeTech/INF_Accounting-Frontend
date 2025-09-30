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
import { useNavigate } from "react-router-dom";
import Icons from "../../assets/icon";

const { Title } = Typography;

const AddCustomer = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("New Customer:", values);
    // API call to save customer goes here
    navigate("/dashboard/customer"); // redirect back to customer list
  };

  return (
    <div className="!relative">
      <Card className="!p-3 !m-4">
        <Row align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Button
              type="text"
              icon={<Icons.ArrowLeftOutlined />}
              onClick={() => navigate("/customer")}
              style={{ marginRight: 8 }}
            />
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Add Customer
            </Title>
          </Col>
        </Row>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="min-h-[70vh] !px-2"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="code"
                label="Customer Code"
                rules={[
                  { required: true, message: "Please enter customer code" },
                ]}
              >
                <Input placeholder="Enter customer code" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="name"
                label="Customer Name"
                rules={[
                  { required: true, message: "Please enter customer name" },
                ]}
              >
                <Input placeholder="Enter customer name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="company"
                label="Company Name"
                rules={[
                  { required: true, message: "Please enter company name" },
                ]}
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
        </Form>
      </Card>
      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" htmlType="submit">
          Save Customer
        </Button>
        <Button onClick={() => navigate("/customer")}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddCustomer;
