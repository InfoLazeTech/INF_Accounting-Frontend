
import { useEffect } from "react";
import { Card, Row, Col, Tag, Table, Spin, Button, Space, Typography } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getVendorReports } from "../../redux/slice/reports/vendorReportSlice";
import dayjs from "dayjs";
import Icons from "../../assets/icon";

const { Text } = Typography;

const ViewVendorReport = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedVendorReport, loading } = useSelector((state) => state.vendorReport);
  const { companyId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(
      getVendorReports({
        companyId,
        vendorId,
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch, companyId, vendorId]);

  if (loading) return <Spin tip="Loading vendor report..." style={{ display: "block", margin: "40px auto" }} />;

  if (!selectedVendorReport) {
    return <div className="m-4 text-center">No data found for this vendor.</div>;
  }

  const { vendor, bills, payments, summary } = selectedVendorReport;

  // Bills Table Columns
  const billColumns = [
    {
      title: "Bill #",
      dataIndex: "billNumber",
      key: "billNumber",
    },
    {
      title: "Bill Date",
      dataIndex: "billDate",
      key: "billDate",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "paid"
              ? "green"
              : status === "overdue"
              ? "red"
              : status === "pending"
              ? "orange"
              : "blue"
          }
        >
          {(status || "draft").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (total) => `₹${Number(total).toFixed(2)}`,
    },
    {
      title: "Paid",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (paid) => `₹${Number(paid).toFixed(2)}`,
    },
    {
      title: "Remaining",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      render: (remaining) => `₹${Number(remaining).toFixed(2)}`,
    },
  ];

  // Payments Table Columns
  const paymentColumns = [
    {
      title: "Payment #",
      dataIndex: "paymentNumber",
      key: "paymentNumber",
    },
    {
      title: "Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₹${Number(amount).toFixed(2)}`,
    },
    {
      title: "Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
      render: (mode) => (
        <Tag color={mode === "bank" ? "blue" : "green"}>
          {mode?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Ref #",
      dataIndex: "referenceNumber",
      key: "referenceNumber",
      render: (ref) => ref || "-",
    },
  ];

  return (
    <div className="m-4">
      {/* Header */}
      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              Vendor Report: {vendor.companyName}
            </span>
            <Button icon={<Icons.ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={8}><strong>Email:</strong> {vendor.email || "-"}</Col>
          <Col span={8}><strong>Phone:</strong> {vendor.phone || "-"}</Col>
          <Col span={8}><strong>Contact:</strong> {vendor.contactPerson || "-"}</Col>
        </Row>
      </Card>

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <div className="text-sm text-gray-500">Total Bill Amount</div>
            <div className="text-xl font-bold">
              ₹{Number(summary.totalBillAmount || 0).toFixed(2)}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-sm text-gray-500">Paid (Bills)</div>
            <div className="text-xl font-bold text-green-600">
              ₹{Number(summary.totalPaidAmount || 0).toFixed(2)}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-sm text-gray-500">Remaining (Bills)</div>
            <div className="text-xl font-bold text-red-600">
              ₹{Number(summary.totalRemainingAmount || 0).toFixed(2)}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-sm text-gray-500">Payments Made</div>
            <div className="text-xl font-bold text-blue-600">
              ₹{Number(summary.totalPaymentAmount || 0).toFixed(2)}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card>
            <div className="text-sm text-gray-500">Net Amount Due</div>
            <div
              className="text-2xl font-bold"
              style={{
                color: summary.netAmountDue > 0 ? "#d32029" : "#52c41a",
              }}
            >
              ₹{Number(summary.netAmountDue || 0).toFixed(2)}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bills Table */}
      <Card
        title={
          <Space>
            <Text strong>Bills</Text>
            <Tag color="blue">{bills.length} bill(s)</Tag>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Table
          dataSource={bills}
          columns={billColumns}
          rowKey="key"
          pagination={false}
          size="small"
        />
      </Card>

      {/* Payments Table */}
      <Card
        title={
          <Space>
            <Text strong>Payments</Text>
            <Tag color="green">{payments.length} payment(s)</Tag>
          </Space>
        }
      >
        <Table
          dataSource={payments}
          columns={paymentColumns}
          rowKey="paymentId"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default ViewVendorReport;