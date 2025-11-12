import { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Button, Space, Tag, DatePicker, Skeleton } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomerReports,
  getCustomerSummary,
  resetCustomerReport,
} from "../../redux/slice/reports/customerReportSlice";
import { filteredURLParams, getQueryParams } from "../../utlis/services";
import FilterInput from "../../component/commonComponent/FilterInput";
import { filterInputEnum } from "../../utlis/constants";
import dayjs from "dayjs";
import CustomDateFilter from "../../component/commonComponent/CustomDateFilter";

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
  console.log("summary", summary);

  const { companyId } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!filter.startDate && !filter.endDate) {
      const start = dayjs().subtract(1, "month").format("YYYY-MM-DD");
      const end = dayjs().format("YYYY-MM-DD"); 

      setFilter((prev) => ({
        ...prev,
        startDate: start,
        endDate: end,
      }));

      updateUrlParams({
        startDate: start,
        endDate: end,
        page: 1,
        limit: 10,
      });
    }
  }, []);

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
        customerId: filter.customerId || undefined,
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

    dispatch(getCustomerSummary({ ...payload }));
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
  const dateFilterRef = useRef(null);

  const handleSearch = () => {
    const searchValue = filter.search ? String(filter.search) : "";
    const { startDate = "", endDate = "" } =
      dateFilterRef.current?.applyFilter() || {};
    setFilter((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));

    updateUrlParams({
      companyId,
      page: 1,
      limit: 10,
      search: searchValue,
      customerId: filter.customerId,
      startDate,
      endDate,
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
      page: 1,
      limit: 10,
      search: "",
      customerId: "",
      startDate: "",
      endDate: "",
    });
  };

  const handlePaginationChange = (page, pageSize) => {
    updateUrlParams({ page, limit: pageSize });
  };
  const columns = [
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Invoice",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        return <Tag color="blue">{record?.invoiceCount}</Tag>;
      },
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Invoice Total",
      dataIndex: "invoiceTotal",
      key: "invoiceTotal",
      render: (_, record) => `₹${Number(record?.invoiceTotal).toFixed(2)}`,
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Payment Total",
      dataIndex: "paymentTotal",
      key: "paymentTotal",
      render: (_, record) => `₹${Number(record?.paymentTotal).toFixed(2)}`,
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Due",
      key: "due",
      render: (_, record) => {
        const due = record?.due;
        return (
          <span style={{ color: due > 0 ? "red" : "green" }}>
            ₹{due.toFixed(2)}
          </span>
        );
      },
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
              navigate(`/customer-report/view/${record?.customerId}`)
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
                ₹{Number(summary?.total?.invoiceTotal).toFixed(2)}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="text-sm text-gray-500">Paid</div>
              <div className="text-2xl font-bold text-green-600">
                ₹{Number(summary?.total?.paymentTotal).toFixed(2)}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="text-sm text-gray-500">Due</div>
              <div className="text-2xl font-bold text-red-600">
                ₹{Number(summary?.total?.due).toFixed(2)}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="text-sm text-gray-500">Invoices</div>
              <div className="text-2xl font-bold">
                {summary?.total?.invoiceCount}
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
              placeHolder="Search customer..."
              value={filter.search}
              setFilter={setFilter}
              onSerch={handleSearch}
              onClear={handleClear}
            />
          </Col>
          {/* <Col span={8}>
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
            </Col> */}
          <Col span={8}>
            <CustomDateFilter
              ref={dateFilterRef}
              onDateChange={({ startDate, endDate }) => {
                setFilter((prev) => ({
                  ...prev,
                  startDate,
                  endDate,
                }));
              }}
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
          // tableId="customerId"
          data={summary?.customerSummary}
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

export default CustomerReport;
// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   Row,
//   Col,
//   Button,
//   Space,
//   Tag,
//   Skeleton,
// } from "antd";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import CustomTable from "../../component/commonComponent/CustomTable";
// import Icons from "../../assets/icon";
// import { useDispatch, useSelector } from "react-redux";
// import { getCustomerSummary } from "../../redux/slice/reports/customerReportSlice";
// import { filteredURLParams, getQueryParams } from "../../utlis/services";
// import FilterInput from "../../component/commonComponent/FilterInput";
// import { filterInputEnum } from "../../utlis/constants";
// import dayjs from "dayjs";
// import CustomDateFilter from "../../component/commonComponent/CustomDateFilter";

// const CustomerReport = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [filter, setFilter] = useState({
//     search: searchParams.get("search") || "",
//     customerId: searchParams.get("customerId") || "",
//     startDate: searchParams.get("startDate") || "",
//     endDate: searchParams.get("endDate") || "",
//   });

//   const { loading, pagination, summary } = useSelector(
//     (state) => state.customerReport
//   );
//   const { companyId } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!filter.startDate && !filter.endDate) {
//       const start = dayjs().subtract(1, "month").format("YYYY-MM-DD");
//       const end = dayjs().format("YYYY-MM-DD");

//       setFilter((prev) => ({
//         ...prev,
//         startDate: start,
//         endDate: end,
//       }));

//       updateUrlParams({
//         startDate: start,
//         endDate: end,
//         page: 1,
//         limit: 10,
//       });
//     }
//   }, []);

//   const fetchReports = () => {
//     const page = parseInt(searchParams.get("page") || "1");
//     const pageSize = parseInt(searchParams.get("limit") || "10");

//     let payload = getQueryParams(window.location.href);

//     if (Object.keys(payload).length === 0) {
//       payload = {
//         companyId,
//         page,
//         limit: pageSize,
//         search: filter.search || undefined,
//         customerId: filter.customerId || undefined,
//         startDate: filter.startDate || undefined,
//         endDate: filter.endDate || undefined,
//       };
//     } else {
//       payload = { ...payload, companyId };
//     }

//     dispatch(getCustomerSummary(payload));
//   };

//   useEffect(() => {
//     fetchReports();
//   }, [searchParams, companyId, dispatch]);

//   const updateUrlParams = (newParams) => {
//     const params = new URLSearchParams(searchParams);
//     const filtered = filteredURLParams(params, newParams);
//     setSearchParams(filtered);
//   };

//   const handleApplyFilter = () => {
//     const searchValue = filter.search ? String(filter.search) : "";

//     updateUrlParams({
//       companyId,             
//       page: 1,
//       limit: 10,
//       search: searchValue,
//       customerId: filter.customerId,
//       startDate: filter.startDate,
//       endDate: filter.endDate,
//     });
//   };
//   const handleClear = () => {
//     setFilter({
//       search: "",
//       customerId: "",
//       startDate: "",
//       endDate: "",
//     });
//     updateUrlParams({ page: 1, limit: 10 });
//   };
//   const handlePaginationChange = (page, pageSize) => {
//     updateUrlParams({ page, limit: pageSize });
//   };

//   const columns = [
//     {
//       title: "Customer",
//       dataIndex: "customerName",
//       key: "customerName",
//       onHeaderCell: () => ({
//         style: { fontSize: 16, fontWeight: 700, color: "#001529" },
//       }),
//     },
//     {
//       title: "Invoice",
//       key: "invoiceCount",
//       render: (_, record) => (
//         <Tag color="blue">{record?.invoiceCount ?? 0}</Tag>
//       ),
//       onHeaderCell: () => ({
//         style: { fontSize: 16, fontWeight: 700, color: "#001529" },
//       }),
//     },
//     {
//       title: "Invoice Total",
//       key: "invoiceTotal",
//       render: (_, record) => `₹${Number(record?.invoiceTotal ?? 0).toFixed(2)}`,
//       onHeaderCell: () => ({
//         style: { fontSize: 16, fontWeight: 700, color: "#001529" },
//       }),
//     },
//     {
//       title: "Payment Total",
//       key: "paymentTotal",
//       render: (_, record) => `₹${Number(record?.paymentTotal ?? 0).toFixed(2)}`,
//       onHeaderCell: () => ({
//         style: { fontSize: 16, fontWeight: 700, color: "#001529" },
//       }),
//     },
//     {
//       title: "Due",
//       key: "due",
//       render: (_, record) => {
//         const due = record?.due ?? 0;
//         return (
//           <span style={{ color: due > 0 ? "red" : "green" }}>
//             ₹{due.toFixed(2)}
//           </span>
//         );
//       },
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <Space>
//           <Button
//             type="default"
//             size="small"
//             icon={<Icons.EyeOutlined />}
//             onClick={() =>
//               navigate(`/customer-report/view/${record?.customerId}`)
//             }
//           />
//         </Space>
//       ),
//       onHeaderCell: () => ({
//         style: { fontSize: 16, fontWeight: 700, color: "#001529" },
//       }),
//     },
//   ];
//   return (
//     <div className="m-4">
//       {/* Header */}
//       <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: "12px 20px" }}>
//         <Row align="middle" justify="space-between">
//           <Col>
//             <div className="text-xl font-semibold">Customer Sales Report</div>
//           </Col>
//           <Col>
//             <Button
//               type="primary"
//               icon={<Icons.DownloadOutlined />}
//               onClick={() => alert("Export feature coming soon!")}
//             >
//               Export Report
//             </Button>
//           </Col>
//         </Row>
//       </Card>
//       {loading ? (
//         <Row gutter={16} style={{ marginBottom: 16 }}>
//           {[1, 2, 3, 4].map((i) => (
//             <Col span={6} key={i}>
//               <Card>
//                 <Skeleton active paragraph={{ rows: 1 }} />
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       ) : (
//         <Row gutter={16} style={{ marginBottom: 16 }}>
//           <Col span={6}>
//             <Card>
//               <div className="text-sm text-gray-500">Total Sales</div>
//               <div className="text-2xl font-bold">
//                 ₹{Number(summary?.total?.invoiceTotal ?? 0).toFixed(2)}
//               </div>
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card>
//               <div className="text-sm text-gray-500">Paid</div>
//               <div className="text-2xl font-bold text-green-600">
//                 ₹{Number(summary?.total?.paymentTotal ?? 0).toFixed(2)}
//               </div>
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card>
//               <div className="text-sm text-gray-500">Due</div>
//               <div className="text-2xl font-bold text-red-600">
//                 ₹{Number(summary?.total?.due ?? 0).toFixed(2)}
//               </div>
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card>
//               <div className="text-sm text-gray-500">Invoices</div>
//               <div className="text-2xl font-bold">
//                 {summary?.total?.invoiceCount ?? 0}
//               </div>
//             </Card>
//           </Col>
//         </Row>
//       )}

//       {/* Filter Bar */}
//       <Card style={{ marginBottom: 16 }}>
//         <Row gutter={16} align="middle">
//           {/* Search */}
//           <Col span={8}>
//             <FilterInput
//               type={filterInputEnum.SEARCH}
//               name="search"
//               placeHolder="Search customer..."
//               value={filter.search}
//               setFilter={setFilter}
//               onSerch={handleApplyFilter}
//               onClear={handleClear}
//             />
//           </Col>
//           <Col span={8}>
//             <CustomDateFilter
//               value={{
//                 startDate: filter.startDate,
//                 endDate: filter.endDate,
//               }}
//               onChange={(range) => {
//                 if (range) {
//                   setFilter((prev) => ({
//                     ...prev,
//                     startDate: range.startDate,
//                     endDate: range.endDate,
//                   }));
//                 }
//               }}
//               onApply={(range) => {
//                 if (range) {
//                   setFilter((prev) => ({
//                     ...prev,
//                     startDate: range.startDate,
//                     endDate: range.endDate,
//                   }));
//                 }
//                 handleApplyFilter(); 
//               }}
//               defaultPreset="1m"
//             />
//           </Col>
//           <Col span={8} style={{ textAlign: "right" }}>
//             <Space>
//               <Button
//                 type="default"
//                 icon={<Icons.ClearOutlined />}
//                 onClick={handleClear}
//               >
//                 Clear All
//               </Button>
//               <Button
//                 type="primary"
//                 icon={<Icons.FilterOutlined />}
//                 onClick={handleApplyFilter}
//               >
//                 Apply Filter
//               </Button>
//             </Space>
//           </Col>
//         </Row>
//       </Card>

//       {/* Table */}
//       <Card>
//         <CustomTable
//           data={summary?.customerSummary ?? []}
//           loading={loading}
//           columns={columns}
//           pagination={{
//             current: parseInt(searchParams.get("page") || "1"),
//             pageSize: parseInt(searchParams.get("limit") || "10"),
//             total: pagination?.totalCount ?? 0,
//             onChange: handlePaginationChange,
//           }}
//         />
//       </Card>
//     </div>
//   );
// };

// export default CustomerReport;