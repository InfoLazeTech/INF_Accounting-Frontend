
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
import { getInvoices, deleteInvoice } from "../../redux/slice/invoice/invoiceSlice";
import { filteredURLParams, getQueryParams } from "../../utlis/services";

const { Search } = Input;

const Invoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { invoices, loading, deleteLoading, pagination } = useSelector((state) => state.invoice);
  const { companyId } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
  });

  const fetchInvoices = (signal) => {
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

    dispatch(getInvoices(payload));
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchInvoices(controller.signal);
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
      title: "INVOICE#",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
   {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (name) => (name ? name : "-"),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? status : "N/A"),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
     {
      title: "Total Amount",
      dataIndex: ["totals", "grandTotal"],
      key: "totalAmount",
      render: (amount) => (amount ? `₹${amount.toFixed(2)}` : "₹0.00"),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Balance Due",
      dataIndex: "remainingAmount",
      key: "balanceDue",
      render: (amount) => (amount ? `₹${amount.toFixed(2)}` : "₹0.00"),
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
            onClick={() => navigate(`/invoice/view/${record._id}`)}
          />
          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/invoice/edit/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this invoice?"
            okText="Yes"
            okButtonProps={{ loading: deleteLoading }}
            cancelText="No"
            onConfirm={async () => {
              try {
                await dispatch(deleteInvoice(record._id)).unwrap();
                message.success("Invoice deleted successfully");
              } catch (err) {
                message.error(err || "Failed to delete invoice");
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
            <div className="text-xl font-semibold">View Invoices</div>
          </Col>
          <Col>
            <Space size="middle">
              <Button
                type="primary"
                icon={<Icons.PlusCircleOutlined />}
                size="middle"
                onClick={() => navigate("/invoice/add")}
              >
                Add Invoice
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Search / Filter */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={10}>
            <Search
              placeholder="Search invoices..."
              value={filter.search}
              onChange={(e) =>
                setFilter({
                  search: e.target.value ? String(e.target.value) : "",
                })
              }
              allowClear
              onClear={handleClear}
              onSearch={handleSearch}
              style={{ borderRadius: 6, height: 36 }}
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
          tableId="invoiceId"
          columns={columns}
          data={invoices || []}
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

export default Invoice;