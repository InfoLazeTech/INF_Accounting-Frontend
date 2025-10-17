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
import { filteredURLParams, getQueryParams } from "../../utlis/services";
import FilterInput from "../../component/commonComponent/FilterInput";
import { filterInputEnum } from "../../utlis/constants";

import {
  deletePaymentReceived,
  getAllPaymentReceived,
} from "../../redux/slice/paymentreceived/paymentReceivedSlice";

const { Search } = Input;

const PaymentReceived = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { companyId } = useSelector((state) => state.auth);
  const { payments, loading, deleteLoading, pagination } = useSelector(
    (state) => state.paymentReceived
  );

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
  });
  const fetchPayment = (signal) => {
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

    dispatch(getAllPaymentReceived({ ...payload }));
  };
  useEffect(() => {
    const controller = new AbortController();
    fetchPayment(controller.signal);
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
  const handleDelete = async (recordId) => {
    try {
      await dispatch(deletePaymentReceived(recordId)).unwrap();
      fetchPayment();
    } catch (err) {
      message.error(err?.message);
    }
  };

  const columns = [
    {
      title: "Payment Received #",
      dataIndex: "paymentId",
      key: "paymentId",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Payment Received Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Vendor Name",
      dataIndex: "partyId",
      key: "partyId",
      render: (_, record) => {
        const vendorName =
          record.partyId?.companyName || record.partyId?.name || "-";
        return vendorName;
      },
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
      render: (mode) =>
        mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : "N/A",
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
    // {
    //   title: "Bank",
    //   dataIndex: "bank",
    //   key: "bank",
    //   render: (bank) =>
    //     bank ? bank.charAt(0).toUpperCase() + bank.slice(1) : "N/A",
    //   onHeaderCell: () => ({
    //     style: { fontSize: 16, fontWeight: 700, color: "#001529" },
    //   }),
    // },
    {
      title: "Payment Received",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (amount ? `$${amount.toFixed(2)}` : "-"),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Available Balance",
      dataIndex: "netAmount",
      key: "netAmount",
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
            onClick={() => navigate(`/payment-received/view/${record._id}`)}
            icon={<Icons.EyeOutlined />}
          />

          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/payment-received/edit/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this Payment?"
            okText="Yes"
            okButtonProps={{ loading: deleteLoading }}
            cancelText="No"
           onConfirm={() => handleDelete(record._id)}
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
            <div className="text-xl font-semibold">View Payment Received</div>
          </Col>
          <Col>
            <Space size="middle">
              <Button
                type="primary"
                icon={<Icons.PlusCircleOutlined />}
                size="middle"
                onClick={() => navigate("/payment-received/add")}
              >
                Add Payment Received
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
          tableId="paymentId"
          columns={columns}
          data={payments || []}
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

export default PaymentReceived;
