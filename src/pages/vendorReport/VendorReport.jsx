import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Space, Tag, DatePicker, Skeleton } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import {
  getVendorReports,
} from "../../redux/slice/reports/vendorReportSlice";
import { filteredURLParams, getQueryParams } from "../../utlis/services";
import FilterInput from "../../component/commonComponent/FilterInput";
import { filterInputEnum } from "../../utlis/constants";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const VendorReport = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    customerId: searchParams.get("customerId") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });

  const { vendors, loading, pagination, summary } = useSelector(
    (state) => state.vendorReport
  );
  const { companyId } = useSelector((state) => state.auth);

  const fetchReports = (signal) => {
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams?.get("limit")) || pagination.limit;

    let payload = getQueryParams(window.location.href);

    if (Object.keys(payload)?.length <= 0) {
      payload = {
        companyId,
        page,
        limit: pageSize,
        search: filter.search || undefined,
        vendorId: filter.customerId || undefined,
        startDate: filter.startDate || undefined,
        endDate: filter.endDate || undefined,
      };
    }

    if (!payload?.companyId) {
      payload = {
        ...payload,
        companyId,
      };
    }

    dispatch(getVendorReports({ ...payload,signal }));
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchReports(controller.signal);
    return () => controller.abort();
  }, [dispatch, companyId, searchParams]);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filterParams = filteredURLParams(params, newParams);
    setSearchParams(filterParams);
  };

  const handleSearch = () => {
    const searchValue = filter.search ? String(filter.search) : "";

    updateUrlParams({
      companyId,
      page: 1,
      limit: 10,
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
      page: 1,
      limit: 10,
      search: "",
      vendorId: "",
      startDate: "",
      endDate: "",
    });
  };

  const handlePaginationChange = (page, pageSize) => {
    updateUrlParams({ page, limit: pageSize });
  };
  const columns = [
   
    {
      title: "Vendor",
      key: "vendorName",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <div style={{ fontWeight: 600 }}>{record.vendorName}</div>
          {record.vendorDetails?.contactPerson && (
            <div style={{ fontSize: 12, color: "#888" }}>
              {record.vendorDetails.contactPerson}
            </div>
          )}
        </Space>
      ),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Bills",
      dataIndex: ["bills"],
      key: "bills",
      render: (bills) => bills?.length || 0,
      align: "center",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Bill Amount",
      key: "totalBillAmount",
      render: (_, record) => `₹${Number(record.summary.totalBillAmount || 0).toFixed(2)}`,
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Paid (Bills)",
      key: "totalPaidAmount",
      render: (_, record) => `₹${Number(record.summary.totalPaidAmount || 0).toFixed(2)}`,
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Remaining",
      key: "totalRemainingAmount",
      render: (_, record) => `₹${Number(record.summary.totalRemainingAmount || 0).toFixed(2)}`,
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Payments Made",
      key: "totalPaymentAmount",
      render: (_, record) => `₹${Number(record.summary.totalPaymentAmount || 0).toFixed(2)}`,
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
   {
      title: "Net Due",
      key: "netAmountDue",
      render: (_, record) => {
        const net = Number(record.summary.netAmountDue || 0);
        return (
          <span style={{ color: net > 0 ? "red" : "green", fontWeight: 600 }}>
            ₹{net.toFixed(2)}
          </span>
        );
      },
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
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
            type="default"
            size="small"
            icon={<Icons.EyeOutlined />}
            onClick={() =>
              navigate(`/vendor-report/view/${record.vendorId}`)
            }
          />
        </Space>
      ),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
  ];

  return (
    <div className="m-4">
      {/* Header */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: "12px 20px" }}>
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">Vendor Purchase Report</div>
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
      {loading ? (
        <Row gutter={16} style={{ marginBottom: 16 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <Col span={4} key={i}>
              <Card>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
       <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={4}>
            <Card>
              <div className="text-sm text-gray-500">Total Vendors</div>
              <div className="text-2xl font-bold">{summary.totalVendors}</div>
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <div className="text-sm text-gray-500">Total Bills</div>
              <div className="text-2xl font-bold">{summary.totalBills}</div>
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <div className="text-sm text-gray-500">Bill Amount</div>
              <div className="text-2xl font-bold">
                ₹{Number(summary.totalAmount).toFixed(2)}
              </div>
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <div className="text-sm text-gray-500">Paid</div>
              <div className="text-2xl font-bold text-green-600">
                ₹{Number(summary.totalPaid).toFixed(2)}
              </div>
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-2xl font-bold text-red-600">
                ₹{Number(summary.totalPending).toFixed(2)}
              </div>
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <div className="text-sm text-gray-500">Net Amount</div>
              <div className="text-2xl font-bold">
                ₹{Number(summary.netAmount).toFixed(2)}
              </div>
            </Card>
          </Col>
        </Row>
      )}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <FilterInput
              type={filterInputEnum.SEARCH}
              name="search"
              placeHolder="Search vendor or bill..."
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
          tableId="vendor-report"
          data={vendors}
          loading={loading}
          columns={columns}
          pagination={{
            current: parseInt(searchParams?.get("page")) || 1,
            pageSize: parseInt(searchParams?.get("limit")) || 10,
            total: pagination.totalCount,
            onChange: handlePaginationChange,
          }}
        />
      </Card>
    </div>
  );
};

export default VendorReport;
