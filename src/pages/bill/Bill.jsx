import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Space,
  message,
  Popconfirm,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import { getBills, deleteBill } from "../../redux/slice/bill/billSlice";
import { filteredURLParams, getQueryParams } from "../../utlis/services";
import FilterInput from "../../component/commonComponent/FilterInput";
import { filterInputEnum } from "../../utlis/constants";

const { Search } = Input;

const Bill = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bills, loading, deleteLoading, pagination } = useSelector(
    (state) => state.bill
  );
  const { customers } = useSelector((state) => state.customerVendor);

  const [searchParams, setSearchParams] = useSearchParams();
  const { companyId } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
  });
  const fetchBills = (signal) => {
    const page = parseInt(searchParams?.get("page")) || 1;
    const pageSize = parseInt(searchParams?.get("limit")) || pagination.limit;

    let payload = getQueryParams(window.location.href);

    if (Object.keys(payload)?.length <= 0) {
      payload = { companyId, page, limit: pageSize };
    }

    if (!payload?.companyId) {
      payload = {
        ...payload,
        companyId,
      };
    }

    dispatch(getBills({ ...payload }));
  };
  useEffect(() => {
    const controller = new AbortController();
    fetchBills(controller.signal);
    return () => controller.abort();
  }, [dispatch, companyId, searchParams]);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filterParams = filteredURLParams(params, newParams);
    setSearchParams(filterParams);
  };
  const handleSearch = () => {
    const searchValue = filter.search ? String(filter.search) : "";
    updateUrlParams({ companyId, page: 1, limit: 10, search: searchValue });
  };

  const handleClear = () => {
    updateUrlParams({ companyId, page: 1, limit: 10, search: "" });
    setFilter({
      search: "",
    });
  };

  const handlePaginationChange = (page, pageSize) => {
    updateUrlParams({ page, limit: pageSize });
  };
  const columns = [
    {
      title: "Bill Number",
      dataIndex: "billNumber",
      key: "billNumber",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Bill Date",
      dataIndex: "billDate",
      key: "billDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName",
      render: (vendorName) => vendorName || "-",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Total Amount",
      dataIndex: "totals",
      key: "grandTotal",
      render: (totals) =>
        totals?.grandTotal ? `$${totals.grandTotal.toFixed(2)}` : "-",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
  {
      title: "Balance Due",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      render: (amount) => (amount ? `$${amount.toFixed(2)}` : "-"),
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
            icon={<Icons.EyeOutlined />}
            onClick={() => navigate(`/bill/view/${record._id}`)}
          />

          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/bill/edit/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this bill?"
            okText="Yes"
            okButtonProps={{ loading: deleteLoading }}
            cancelText="No"
            onConfirm={async () => {
              try {
                await dispatch(deleteBill(record._id)).unwrap();
                message.success("Bill deleted successfully");
              } catch (err) {
                message.error(err || "Failed to delete bill");
              }
            }}
          >
            <Button type="default" danger icon={<Icons.DeleteOutlined />} />
          </Popconfirm>
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
            <div className="text-xl font-semibold">View Bills</div>
          </Col>
          <Col>
            <Space size="middle">
              <Button
                type="primary"
                icon={<Icons.PlusCircleOutlined />}
                size="middle"
                onClick={() => navigate("/bill/add")}
              >
                Add Bill
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Search / Filter */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={10}>
            
            <FilterInput
              type={filterInputEnum?.SEARCH}
              name={"search"}
              placeHolder="Search..."
              value={filter?.search}
              setFilter={setFilter}
              onSerch={handleSearch}
              onClear={handleClear}
            />
          </Col>
          <Col span={14} style={{ textAlign: "right" }}>
            <Space>
              <Button
                type="primary"
                icon={<Icons.FilterOutlined />}
                size="middle"
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
          tableId="billId"
          columns={columns}
          data={bills || []}
          loading={loading}
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

export default Bill;
