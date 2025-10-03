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

const { Search } = Input;

const Customer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
  });
  const { customers, loading, pagination } = useSelector(
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
      title: "Code",
      dataIndex: "customerVendorId",
      key: "customerVendorId",
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
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/customer/edit/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this customer?"
            okText="Yes"
            cancelText="No"
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
            <Search
              placeholder="Search..."
              onChange={(e) => setFilter({ search: e.target.value })}
              allowClear
              onSearch={handleSearch}
              onClear={handleClear}
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
