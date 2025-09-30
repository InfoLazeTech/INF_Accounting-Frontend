import { useState } from "react";
import { Card, Row, Col, Typography, Button, Input, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";

const Customer = () => {
  const [data] = useState([
    {
      key: "1",
      code: "CUST001",
      name: "John Doe",
      company: "Tech Solutions",
      email: "john@example.com",
      openingBalance: 5000,
      currentBalance: 3000,
      phone: "9876543210",
    },
    {
      key: "2",
      code: "CUST002",
      name: "Jane Smith",
      company: "Innovate Corp",
      email: "jane@example.com",
      openingBalance: 2000,
      currentBalance: 1500,
      phone: "9876543222",
    },
    {
      key: "3",
      code: "CUST003",
      name: "Jane Smith",
      company: "Innovate Corp",
      email: "jane@example.com",
      openingBalance: 2000,
      currentBalance: 1500,
      phone: "9876543222",
    },
    {
      key: "4",
      code: "CUST004",
      name: "Jane Smith",
      company: "Innovate Corp",
      email: "jane@example.com",
      openingBalance: 2000,
      currentBalance: 1500,
      phone: "9876543222",
    },
  ]);

  const navigate = useNavigate();

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Company Name",
      dataIndex: "company",
      key: "company",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Opening Balance",
      dataIndex: "openingBalance",
      key: "openingBalance",
      render: (val) => `₹${val}`,
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Current Balance",
      dataIndex: "currentBalance",
      key: "currentBalance",
      render: (val) => `₹${val}`,
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Work Phone",
      dataIndex: "phone",
      key: "phone",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/customer/edit/${record.key}`)}
          />
          <Button type="default" danger icon={<Icons.DeleteOutlined />} />
        </Space>
      ),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
  ];

  return (
    <div className="m-4">
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: "12px 20px" }}>
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">View Customers</div>
          </Col>
          <Col>
            <Space size="middle">
              {/* <Button size="middle" style={{ fontSize: 16, fontWeight: 400 }}>
                Export Customer
              </Button>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                size="middle"
                style={{ fontSize: 16, fontWeight: 400 }}
              >
                Add Bulk Customer
              </Button> */}
              <Button
                type="primary"
                icon={<Icons.PlusCircleOutlined />}
                size="middle"
                onClick={() => navigate("/customer/add")}
              >
                Add Customer
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={10}>
            <Input
              placeholder="Search by customer name"
              suffix={
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      borderLeft: "1px solid #ccc",
                      height: 20,
                      display: "inline-block",
                    }}
                  />
                  <Icons.SearchOutlined className="" />
                </span>
              }
              style={{ borderRadius: 6, height: 36 }}
            />
          </Col>
          <Col span={14} style={{ textAlign: "right" }}>
            <Space>
              <Button
                type="primary"
                icon={<Icons.FilterOutlined />}
                size="middle"
              >
                Apply Filter
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <CustomTable
          tableId="key"
          data={data}
          // bordered
          columns={columns}
          pagination={{ current: 1, pageSize: 10, total: 20 }}
        />
      </Card>
    </div>
  );
};

export default Customer;
