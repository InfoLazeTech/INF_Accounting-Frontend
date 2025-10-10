import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  message,
  Space,
  Table,
  Tag,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomersVendors,
  deleteCustomerVendor,
} from "../../redux/slice/customer/customerVendorSlice";
import { Popconfirm } from "antd";
import { filteredURLParams, getQueryParams } from "../../utlis/services";
import FilterInput from "../../component/commonComponent/FilterInput";
import { filterInputEnum } from "../../utlis/constants";

const Customer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    type: searchParams.get("type") || "",
  });
  const { customers, loading, pagination, deleteLoading } = useSelector(
    (state) => state.customerVendor
  );
  const { companyId } = useSelector((state) => state.auth);

  const fetchCustomers = (signal) => {
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
    dispatch(getCustomersVendors({ ...payload }));
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchCustomers(controller.signal);
    return () => controller.abort();
  }, [dispatch, companyId, searchParams]);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filterParams = filteredURLParams(params, newParams);
    setSearchParams(filterParams);
  };

  const handleSearch = () => {
    if (filter.search) {
      updateUrlParams({ companyId, page: 1, limit: 10, search: filter.search });
    }
  };

  const handleFilter = () => {
    updateUrlParams({
      companyId,
      page: 1,
      limit: 10,
      search: filter.search,
      type: filter.type,
    });
  };

  const handleClear = () => {
    updateUrlParams({ companyId, page: 1, limit: 10, search: "", type: "" });
    setFilter({
      search: "",
      type: "",
    });
  };

  const handlePaginationChange = (page, pageSize) => {
    updateUrlParams({ page, limit: pageSize });
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "customerVendorId",
      key: "customerVendorId",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color="blue" className="">
          {type?.isCustomer ? "Customer" : "Vendor"}
        </Tag>
      ),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Customer Name",
      dataIndex: "contactPerson",
      key: "contactPerson",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Work Phone",
      dataIndex: "phone",
      key: "phone",
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
            onClick={() => navigate(`/customer/view/${record._id}`)}
          />

          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/customer/edit/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this customer?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: deleteLoading }}
            onConfirm={async () => {
              try {
                await dispatch(deleteCustomerVendor(record._id)).unwrap();
                message.success("Customer deleted successfully");
              } catch (err) {
                message.error(err || "Failed to delete customer");
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
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: "12px 20px" }}>
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">View Customers</div>
          </Col>
          <Col>
            <Space size="middle">
              {/* <Button size="middle" style={{ fontSize: 16, fontWeight: 400 }}>
                Export Customer
              </Button>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                size="middle"
                style={{ fontSize: 16, fontWeight: 400 }}
              >
                Add Bulk Customer
              </Button> */}
              <Button
                type="primary"
                icon={<Icons.PlusCircleOutlined />}
                size="middle"
                onClick={() => navigate("/customer/add")}
              >
                Add Customer
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={10}>
            {/* <Search
              placeholder="Search..."
              onChange={(e) => setFilter({ search: e.target.value })}
              allowClear
              onSearch={handleSearch}
              onClear={handleClear}
              style={{ borderRadius: 6, height: 36 }}
            /> */}
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
              <div className="w-28">
              <FilterInput
                type={filterInputEnum?.SELECT}
                name={"type"}
                className="!w-full"
                placeHolder={"Select Type"}
                selectionOptions={[
                  {
                    label: "Customer",
                    value: "customer",
                  },
                   {
                    label: "Vendor",
                    value: "vendor",
                  },
                ]}
                value={filter?.type}
                setFilter={setFilter}
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
                onClick={handleFilter}
              >
                Apply Filter
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <CustomTable
          tableId="key"
          data={customers}
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

export default Customer;
