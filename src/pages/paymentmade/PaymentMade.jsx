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
  Select,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import { filteredURLParams, getQueryParams } from "../../utlis/services";
import FilterInput from "../../component/commonComponent/FilterInput";
import { filterInputEnum } from "../../utlis/constants";

import { getVendorDropdown } from "../../redux/slice/customer/customerVendorSlice";

import {
  deletePaymentMade,
  getAllPaymentMade,
} from "../../redux/slice/paymentMade/paymentMadeSlice";

const { Search } = Input;

const PaymentMade = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { companyId } = useSelector((state) => state.auth);
  const { payments, loading, deleteLoading, pagination } = useSelector(
    (state) => state.paymentMade
  );

  const { dropdownVendors, dropLoading } = useSelector(
    (state) => state.customerVendor
  );
  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    partyId: searchParams.get("partyId") || null,
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
    
    if (filter.partyId) {
      payload = { ...payload, partyId: filter.partyId };
    }

    dispatch(getAllPaymentMade({ ...payload }));
  };
    const fetchVendors = (signal) => {
      dispatch(getVendorDropdown({ companyId, signal }));
    };
  useEffect(() => {
    const controller = new AbortController();
    fetchPayment(controller.signal);
     fetchVendors(controller.signal);
    return () => controller.abort();
  }, [dispatch, companyId, searchParams, filter.partyId]);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filterParams = filteredURLParams(params, newParams);
    setSearchParams(filterParams);
  };
  const handleSearch = () => {
    const searchValue = filter.search ? String(filter.search) : "";
     const vendorValue = filter.partyId ? String(filter.partyId) : "";
    updateUrlParams({
      companyId,
      page: 1,
      limit: 10,
      search: searchValue,
      partyId: vendorValue,
    });
  };

  const handleClear = () => {
     updateUrlParams({
      companyId,
      page: 1,
      limit: 10,
      search: "",
      partyId: null,
    });
    setFilter({
      search: "",
    });
  };

  const handlePaginationChange = (page, pageSize) => {
    updateUrlParams({ page, limit: pageSize, partyId: filter.partyId });
  };
  const handleDelete = async (recordId) => {
    try {
      await dispatch(deletePaymentMade(recordId)).unwrap();
      fetchPayment();
    } catch (err) {
      message.error(err?.message);
    }
  };
    const handleVendorChange = (value) => {
    setFilter((prev) => ({ ...prev, partyId: value || "" }));

    // optional: auto-update bills when vendor changes
    updateUrlParams({
      companyId,
      partyId: value || "",
      page: 1,
      limit: 10,
      search: filter.search || "",
    });
  };


  const columns = [
    {
      title: "Payment Made #",
      dataIndex: "paymentId",
      key: "paymentId",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Payment Made Date",
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
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) =>
    //     status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A",
    //   onHeaderCell: () => ({
    //     style: { fontSize: 16, fontWeight: 700, color: "#001529" },
    //   }),
    // },
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
      title: "Payment Made",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (amount ? `₹${amount.toFixed(2)}` : "-"),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    // {
    //   title: "Available Balance",
    //   dataIndex: "netAmount",
    //   key: "netAmount",
    //   render: (amount) => (amount ? `$${amount.toFixed(2)}` : "-"),
    //   onHeaderCell: () => ({
    //     style: { fontSize: 16, fontWeight: 700, color: "#001529" },
    //   }),
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            onClick={() => navigate(`/payment-made/view/${record._id}`)}
            icon={<Icons.EyeOutlined />}
          />

          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/payment-made/edit/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this Payment?"
            okText="Yes"
            okButtonProps={{ loading: deleteLoading }}
            cancelText="No"
            disabled
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
            <div className="text-xl font-semibold">View Payment Made</div>
          </Col>
          <Col>
            <Space size="middle">
              <Button
                type="primary"
                icon={<Icons.PlusCircleOutlined />}
                size="middle"
                onClick={() => navigate("/payment-made/add")}
              >
                Add Payment Made
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Search / Filter */}
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          {/* Left Side - Search Input */}
          <Col flex="auto">
            <FilterInput
              type={filterInputEnum.SEARCH}
              name="search"
              placeHolder="Search..."
              value={filter.search}
              setFilter={setFilter}
              onSerch={handleSearch}
              onClear={handleClear}
            />
          </Col>

          {/* Right Side - Select Vendor + Buttons */}
          <Col>
            <Space>
              <div className="w-44">
                <Select
                  showSearch
                  placeholder="Select Vendor"
                  loading={dropLoading}
                  className="w-full"
                  value={filter.partyId || undefined}
                  onChange={handleVendorChange}
                  allowClear
                  size="large"
                  optionFilterProp="label" 
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  dropdownStyle={{ textAlign: "left" }}
                  style={{ textAlign: "left" }}
                  options={
                    dropdownVendors?.length
                      ? dropdownVendors.map((vendor) => ({
                          label: vendor.companyName || vendor.name,
                          value: vendor._id,
                        }))
                      : [
                          {
                            label: "No vendors available",
                            value: "",
                            disabled: true,
                          },
                        ]
                  }
                />
              </div>

              <Button
                type="default"
                icon={<Icons.ClearOutlined />}
                size="middle"
                onClick={handleClear}
              >
                Clear All
              </Button>

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

export default PaymentMade;
