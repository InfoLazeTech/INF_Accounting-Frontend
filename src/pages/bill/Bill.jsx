import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  message,
  Popconfirm,
  Select,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import { getBills, deleteBill } from "../../redux/slice/bill/billSlice";
import { filteredURLParams, getQueryParams } from "../../utlis/services";
import FilterInput from "../../component/commonComponent/FilterInput";
import { filterInputEnum } from "../../utlis/constants";
import { getVendorDropdown } from "../../redux/slice/customer/customerVendorSlice";

const Bill = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bills, loading, deleteLoading, pagination } = useSelector(
    (state) => state.bill
  );
  const { dropdownVendors, dropLoading } = useSelector(
    (state) => state.customerVendor
  );
  const { companyId } = useSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    vendorId: searchParams.get("vendorId") || "",
  });

  // Fetch bills
  const fetchBills = (signal) => {
    const page = parseInt(searchParams?.get("page")) || 1;
    const pageSize = parseInt(searchParams?.get("limit")) || pagination.limit;

    let payload = getQueryParams(window.location.href);

    if (Object.keys(payload)?.length <= 0) {
      payload = { companyId, page, limit: pageSize };
    }

    if (!payload?.companyId) {
      payload = { ...payload, companyId };
    }

    if (filter.vendorId) {
      payload = { ...payload, vendorId: filter.vendorId };
    }

    dispatch(getBills({ ...payload }));
  };

  // Fetch vendor dropdown
  const fetchVendors = (signal) => {
    dispatch(getVendorDropdown({ companyId, signal }));
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchBills(controller.signal);
    fetchVendors(controller.signal);
    return () => controller.abort();
  }, [dispatch, companyId, searchParams, filter.vendorId]);

  // Update URL params
  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filterParams = filteredURLParams(params, newParams);
    setSearchParams(filterParams);
  };

  // Search and Clear Handlers
  const handleSearch = () => {
    const searchValue = filter.search ? String(filter.search) : "";
    const vendorValue = filter.vendorId ? String(filter.vendorId) : "";
    updateUrlParams({
      companyId,
      page: 1,
      limit: 10,
      search: searchValue,
      vendorId: vendorValue,
    });
  };

  const handleClear = () => {
    // Reset filters
    setFilter({ search: "", vendorId: "" });

    // Reset URL params
    updateUrlParams({
      companyId,
      page: 1,
      limit: 10,
      search: "",
      vendorId: "",
    });
  };

  // Pagination
  const handlePaginationChange = (page, pageSize) => {
    updateUrlParams({ page, limit: pageSize, vendorId: filter.vendorId });
  };

  // Vendor change (improved)
  const handleVendorChange = (value) => {
    setFilter((prev) => ({ ...prev, vendorId: value || "" }));

    // optional: auto-update bills when vendor changes
    updateUrlParams({
      companyId,
      vendorId: value || "",
      page: 1,
      limit: 10,
      search: filter.search || "",
    });
  };

  // Table columns
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
      title: "Total Amount",
      dataIndex: "totals",
      key: "grandTotal",
      render: (totals) =>
        totals?.grandTotal ? `₹${totals.grandTotal.toFixed(2)}` : "-",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    // {
    //   title: "Balance Due",
    //   dataIndex: "remainingAmount",
    //   key: "remainingAmount",
    //   render: (amount) => (amount ? `₹${amount.toFixed(2)}` : "-"),
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
            disabled
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
            <div className="text-xl font-semibold">View Purchase Bills</div>
          </Col>
          <Col>
            <Space size="middle">
              <Button
                type="primary"
                icon={<Icons.PlusCircleOutlined />}
                size="middle"
                onClick={() => navigate("/bill/add")}
              >
                Add Purchase Bill
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
                  value={filter.vendorId || undefined}
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
