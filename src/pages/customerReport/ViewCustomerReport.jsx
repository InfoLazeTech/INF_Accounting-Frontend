// src/pages/customerReport/ViewCustomerReport.jsx
import { useEffect } from "react";
import { Card, Row, Col, Tag, Table, Spin, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerReports } from "../../redux/slice/reports/customerReportSlice";
import dayjs from "dayjs";
import Icons from "../../assets/icon";

const ViewCustomerReport = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedCustomerReport, loading } = useSelector((state) => state.customerReport);
  const { companyId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(
      getCustomerReports({
        companyId,
        customerId,
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch, companyId, customerId]);

  if (loading) return <Spin tip="Loading customer report..." />;

  if (!selectedCustomerReport) {
    return <div className="m-4">No data found for this customer.</div>;
  }

  const { customer, invoices, summary } = selectedCustomerReport;

  const columns = [
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
    },
    {
      title: "Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
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
              : status === "sent"
              ? "blue"
              : "orange"
          }
        >
          {(status || "draft").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `$${Number(total).toFixed(2)}`,
    },
    {
      title: "Paid",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (paid) => `$${Number(paid).toFixed(2)}`,
    },
    {
      title: "Due",
      key: "due",
      render: (_, record) => {
        const due = record.total - record.amountPaid;
        return (
          <span style={{ color: due > 0 ? "red" : "green" }}>
            ${due.toFixed(2)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="m-4">
      {/* Header */}
      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              Customer Report: {customer.companyName}
            </span>
            <Button icon={<Icons.ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={8}><strong>Email:</strong> {customer.email || "-"}</Col>
          <Col span={8}><strong>Phone:</strong> {customer.phone || "-"}</Col>
          <Col span={8}><strong>Contact:</strong> {customer.contactPerson || "-"}</Col>
        </Row>
      </Card>

      {/* Summary */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <div className="text-sm text-gray-500">Total Sales</div>
            <div className="text-xl font-bold">${Number(summary.totalSales).toFixed(2)}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-sm text-gray-500">Total Paid</div>
            <div className="text-xl font-bold text-green-600">
              ${Number(summary.totalPaid).toFixed(2)}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-sm text-gray-500">Total Due</div>
            <div className="text-xl font-bold text-red-600">
              ${Number(summary.totalDue).toFixed(2)}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-sm text-gray-500">Invoices</div>
            <div className="text-xl font-bold">{summary.totalInvoices}</div>
          </Card>
        </Col>
      </Row>

      {/* Invoice Table */}
      <Card title="Invoice History">
        <Table
          dataSource={invoices}
          columns={columns}
          rowKey="key"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ViewCustomerReport;