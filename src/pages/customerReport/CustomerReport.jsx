// src/pages/reports/CustomerReport.jsx
import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Tag,
  DatePicker,
  Skeleton,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerReports, resetCustomerReport } from "../../redux/slice/reports/customerReportSlice";
import { filteredURLParams } from "../../utlis/services";
import FilterInput from "../../component/commonComponent/FilterInput";
import { filterInputEnum } from "../../utlis/constants";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const CustomerReport = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    customerId: searchParams.get("customerId") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });

  const { reports, loading, pagination, summary } = useSelector(
    (state) => state.customerReport
  );
  const { companyId } = useSelector((state) => state.auth);

  // Fetch reports
  const fetchReports = (signal) => {
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const payload = {
      companyId,
      page,
      limit,
      search: filter.search || undefined,
      customerId: filter.customerId || undefined,
      startDate: filter.startDate || undefined,
      endDate: filter.endDate || undefined,
    };

    // Remove undefined/null/empty
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v != null && v !== "")
    );

    dispatch(getCustomerReports({ ...cleanPayload, signal }));
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchReports(controller.signal);
    return () => controller.abort();
  }, [dispatch, companyId, searchParams]);

  // Update URL params
  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setSearchParams(params);
  };

  const handleSearch = () => {
    updateUrlParams({
      page: 1,
      limit: 10,
      search: filter.search,
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
    updateUrlParams({ page: 1, limit: 10 });
  };

  const handlePaginationChange = (page, pageSize) => {
    updateUrlParams({ page, limit: pageSize });
  };
  const columns = [
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      onHeaderCell: () => ({ style: { fontSize: 16, fontWeight: 700, color: "#001529" } }),
    },
    {
      title: "Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
      onHeaderCell: () => ({ style: { fontSize: 16, fontWeight: 700, color: "#001529" } }),
    },
    {
      title: "Customer",
      dataIndex: ["customer", "companyName"],
      key: "companyName",
      onHeaderCell: () => ({ style: { fontSize: 16, fontWeight: 700, color: "#001529" } }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "orange";
        if (status === "paid") color = "green";
        else if (status === "overdue") color = "red";
        else if (status === "sent") color = "blue";
        return <Tag color={color}>{(status || "draft").toUpperCase()}</Tag>;
      },
      onHeaderCell: () => ({ style: { fontSize: 16, fontWeight: 700, color: "#001529" } }),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `$${Number(total).toFixed(2)}`,
      onHeaderCell: () => ({ style: { fontSize: 16, fontWeight: 700, color: "#001529" } }),
    },
    {
      title: "Paid",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (paid) => `$${Number(paid).toFixed(2)}`,
      onHeaderCell: () => ({ style: { fontSize: 16, fontWeight: 700, color: "#001529" } }),
    },
    {
      title: "Due",
      key: "due",
      render: (_, record) => {
        const due = record.total - record.amountPaid;
        return (
          <span style={{ color: due > 0 ? "red" : "green", fontWeight: 500 }}>
            ${due.toFixed(2)}
          </span>
        );
      },
      onHeaderCell: () => ({ style: { fontSize: 16, fontWeight: 700, color: "#001529" } }),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            size="small"
            icon={<Icons.EyeOutlined />}
            onClick={() => navigate(`/customer-report/view/${record.customer._id}`)}
          />
        </Space>
      ),
      onHeaderCell: () => ({ style: { fontSize: 16, fontWeight: 700, color: "#001529" } }),
    },
  ];

  return (
    <div className="m-4">
      {/* Header */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: "12px 20px" }}>
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">Customer Sales Report</div>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Icons.DownloadOutlined />}
              onClick={() => {
                // Export logic here
                alert("Export feature coming soon!");
              }}
            >
              Export Report
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Summary Stats */}
      {loading ? (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <Col span={6} key={i}>
              <Card>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <div className="text-sm text-gray-500">Total Sales</div>
              <div className="text-2xl font-bold">
                ${Number(summary.totalSales).toFixed(2)}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="text-sm text-gray-500">Paid</div>
              <div className="text-2xl font-bold text-green-600">
                ${Number(summary.totalPaid).toFixed(2)}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="text-sm text-gray-500">Due</div>
              <div className="text-2xl font-bold text-red-600">
                ${Number(summary.totalDue).toFixed(2)}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="text-sm text-gray-500">Invoices</div>
              <div className="text-2xl font-bold">{summary.totalInvoices}</div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <FilterInput
              type={filterInputEnum.SEARCH}
              name="search"
              placeHolder="Search invoice or customer..."
              value={filter.search}
              setFilter={setFilter}
              onSerch={handleSearch}
              onClear={handleClear}
            />
          </Col>
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

      {/* Table */}
      <Card>
        <CustomTable
          tableId="customer-report"
          data={reports}
          loading={loading}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.limit,
            total: pagination.totalCount,
            onChange: handlePaginationChange,
            showSizeChanger: true,
          }}
        />
      </Card>
    </div>
  );
};

export default CustomerReport;