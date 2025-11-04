
import { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Table, Spin, Button, Space, Typography, Skeleton, DatePicker } from "antd";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getVendorReports } from "../../redux/slice/reports/vendorReportSlice";
import dayjs from "dayjs";
import Icons from "../../assets/icon";
import CustomTable from "../../component/commonComponent/CustomTable";
import { filteredURLParams } from "../../utlis/services";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const ViewVendorReport = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    customerId: searchParams.get("customerId") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });


  const { vendors, selectedVendorReport, loading } = useSelector((state) => state.vendorReport);
  const { companyId } = useSelector((state) => state.auth);

  console.log("vendors", vendors);


  useEffect(() => {
    dispatch(
      getVendorReports({
        companyId,
        vendorId,
        page: 1,
        limit: 100,
        startDate: searchParams.get("startDate") || "",
        endDate: searchParams.get("endDate") || "",
      })
    );
  }, [dispatch, companyId, vendorId, searchParams]);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filterParams = filteredURLParams(params, newParams);
    setSearchParams(filterParams);
  };

  // if (loading) return <Spin tip="Loading vendor report..." style={{ display: "block", margin: "40px auto" }} />;

  if (!vendors) {
    return <div className="m-4 text-center">No data found for this vendor.</div>;
  }

  const { bills, payments, summary } = vendors;

  const handleSearch = () => {
    const searchValue = filter.search ? String(filter.search) : "";

    updateUrlParams({
      companyId,
      search: searchValue,
      vendorId: filter.customerId,
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
      vendorId: "",
      startDate: "",
      endDate: "",
    });
    updateUrlParams({
      search: "",
      vendorId: "",
      startDate: "",
      endDate: "",
    });
  };

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
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (total) => `₹${Number(total).toFixed(2)}`,
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
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
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
          <div className="flex gap-2 items-center">
            <Button type="text" icon={<Icons.ArrowLeftOutlined />} onClick={() => navigate(-1)}>

            </Button>
            <span className="text-lg font-semibold">
              Vendor : {vendors?.vendorName}
            </span>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
        {/* <Row gutter={16}>
          <Col span={8}><strong>Email:</strong> {bills.email || "-"}</Col>
          <Col span={8}><strong>Phone:</strong> {bills.phone || "-"}</Col>
          <Col span={8}><strong>Contact:</strong> {bills.contactPerson || "-"}</Col>
        </Row> */}
      </Card>

      {/* Summary Cards */}
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
                <div className="text-sm text-gray-500">Total Bill Amount</div>
                <div className="text-xl font-bold">
                  ₹{Number(summary?.billTotal || 0).toFixed(2)}
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div className="text-sm text-gray-500">Paid (Bills)</div>
                <div className="text-xl font-bold text-green-600">
                  ₹{Number(summary?.paymentTotal || 0).toFixed(2)}
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div className="text-sm text-gray-500">Remaining (Bills)</div>
                <div className="text-xl font-bold text-red-600">
                  ₹{Number(summary?.due || 0).toFixed(2)}
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div className="text-sm text-gray-500">Bills</div>
                <div className="text-xl font-bold">{summary?.billCount}</div>
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

      {/* Bills Table */}
      <Card
        title={
          <Space>
            <Text strong>Bills</Text>
            <Tag color="blue">{bills?.length} bill(s)</Tag>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <CustomTable
          tableId="billNumber"
          data={bills}
          columns={billColumns}
          loading={loading}
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
            <Tag color="green">{payments?.length} payment(s)</Tag>
          </Space>
        }
      >
        <CustomTable
          tableId="paymentNumber"
          data={payments}
          columns={paymentColumns}
          loading={loading}
          rowKey="paymentId"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ViewVendorReport;