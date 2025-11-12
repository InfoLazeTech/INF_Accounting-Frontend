// src/pages/customerReport/ViewCustomerReport.jsx
import { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Spin, Button, Skeleton, Space, Typography, DatePicker } from "antd";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerReports } from "../../redux/slice/reports/customerReportSlice";
import dayjs from "dayjs";
import Icons from "../../assets/icon";
import CustomTable from "../../component/commonComponent/CustomTable";
import { filteredURLParams } from "../../utlis/services";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const ViewCustomerReport = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    customerId: searchParams.get("customerId") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });


  const { reports, loading } = useSelector((state) => state.customerReport);
  const { companyId } = useSelector((state) => state.auth);

  console.log("reports", reports);


  useEffect(() => {
    dispatch(
      getCustomerReports({
        companyId,
        customerId,
        page: 1,
        limit: 100,
        startDate: searchParams.get("startDate") || "",
        endDate: searchParams.get("endDate") || "",
      })
    );
  }, [dispatch, companyId, customerId, searchParams]);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filterParams = filteredURLParams(params, newParams);
    setSearchParams(filterParams);
  };

  if (!reports) {
    return <div className="m-4">No data found for this customer.</div>;
  }

  const handleSearch = () => {
    const searchValue = filter.search ? String(filter.search) : "";

    updateUrlParams({
      companyId,
      search: searchValue,
      customerId: filter.customerId,
      startDate: filter.startDate,
      endDate: filter.endDate,
    });

  };

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setFilter({
        ...filter,
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD"),
      });
    } else {
      setFilter({ ...filter, startDate: "", endDate: "" });
    }
  };

  const handleClear = () => {
    setFilter({
      search: "",
      customerId: "",
      startDate: "",
      endDate: "",
    });
    updateUrlParams({
      search: "",
      customerId: "",
      startDate: "",
      endDate: "",
    });
  };

  // const { customers: customer, summary, customers: [{ invoices }] } = reports;
  const invoices = reports?.invoices || [];
  const payments = reports?.payments || [];
  const columns = [
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
    },
    {
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (
    //     <Tag
    //       color={
    //         status === "paid"
    //           ? "green"
    //           : status === "overdue"
    //             ? "red"
    //             : status === "sent"
    //               ? "blue"
    //               : "orange"
    //       }
    //     >
    //       {(status).toUpperCase()}
    //     </Tag>
    //   ),
    // },
    // {
    //   title: "Status",
    //   dataIndex: "paymentStatus",
    //   key: "paymentStatus",
    //   render: (status) => (
    //     <Tag color={status === "paid" ? "green" : "red"}>
    //       {(status).toUpperCase()}
    //     </Tag>
    //   ),
    // },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (total) => `$${Number(total).toFixed(2)}`,
    },
    // {
    //   title: "Paid",
    //   dataIndex: "paidAmount",
    //   key: "paidAmount",
    //   render: (paid) => `$${Number(paid).toFixed(2)}`,
    // },
    // {
    //   title: "Due",
    //   key: "due",
    //   render: (_, record) => {
    //     const due = record?.remainingAmount;
    //     return (
    //       <span style={{ color: due > 0 ? "red" : "green" }}>
    //         ₹{due.toFixed(2)}
    //       </span>
    //     );
    //   },
    // },
  ];

  const Paymentcolumns = [
    {
      title: "Payment #",
      dataIndex: "paymentNumber",
      key: "paymentNumber",
    },
    {
      title: "Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (total) => `$${Number(total).toFixed(2)}`,
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
    },
    // {
    //   title: "Paid",
    //   dataIndex: "paidAmount",
    //   key: "paidAmount",
    //   render: (paid) => `$${Number(paid).toFixed(2)}`,
    // },
    // {
    //   title: "Due",
    //   key: "due",
    //   render: (_, record) => {
    //     const due = record?.remainingAmount;
    //     return (
    //       <span style={{ color: due > 0 ? "red" : "green" }}>
    //         ₹{due.toFixed(2)}
    //       </span>
    //     );
    //   },
    // },
  ];

  return (
    <div className="m-4">
      {/* Header */}
      <Card
        title={
          <div className="flex gap-2 items-center">
            <Button type="text" icon={<Icons.ArrowLeftOutlined />} onClick={() => navigate(-1)}>

            </Button>
            <span className="text-lg font-semibold">
              Customer : {reports?.customerName}
            </span>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
        {/* <Row gutter={16}>
          <Col span={8}><strong>Email:</strong> {customer?.customerDetails?.email || "-"}</Col>
          <Col span={8}><strong>Phone:</strong> {customer?.customerDetails?.phone || "-"}</Col>
          <Col span={8}><strong>Contact:</strong> {customer?.customerDetails?.contactPerson || "-"}</Col>
        </Row> */}
      </Card>

      {/* Summary */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <Col span={6} key={i}>
              <Card>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            </Col>
          ))
        ) : (
          <>
            <Col span={6}>
              <Card>
                <div className="text-sm text-gray-500">Total Sales</div>
                <div className="text-xl font-bold">${Number(reports?.summary?.invoiceTotal).toFixed(2)}</div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div className="text-sm text-gray-500">Total Paid</div>
                <div className="text-xl font-bold text-green-600">
                  ${Number(reports?.summary?.paymentTotal).toFixed(2)}
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div className="text-sm text-gray-500">Total Due</div>
                <div className="text-xl font-bold text-red-600">
                  ${Number(reports?.summary?.due).toFixed(2)}
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div className="text-sm text-gray-500">Invoices</div>
                <div className="text-xl font-bold">{reports?.summary?.invoiceCount}</div>
              </Card>
            </Col>
          </>
        )}
      </Row>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <RangePicker
              style={{ width: "100%" }}
              value={
                filter.startDate
                  ? [dayjs(filter.startDate), dayjs(filter.endDate)]
                  : null
              }
              onChange={handleDateChange}
              format="YYYY-MM-DD"
            />
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            <Space>
              <Button
                type="default"
                icon={<Icons.ClearOutlined />}
                onClick={handleClear}
              >
                Clear All
              </Button>
              <Button
                type="primary"
                icon={<Icons.FilterOutlined />}
                onClick={handleSearch}
              >
                Apply Filter
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Invoice Table */}
      <Card title={
        <Space>
          <Text strong>Invoice History</Text>
          <Tag color="blue">{invoices.length} invoices(s)</Tag>
        </Space>
      }>
        <CustomTable
          tableId="invoiceNumber"
          data={invoices}
          loading={loading}
          columns={columns}
          pagination={false}
        />
      </Card>
      <Card title={
        <Space>
          <Text strong>Payment History</Text>
          <Tag color="green">{payments.length} payment(s)</Tag>
        </Space>
      } style={{ marginTop: 20 }}>
        <CustomTable
          tableId="paymentNumber"
          data={payments}
          loading={loading}
          columns={Paymentcolumns}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ViewCustomerReport;