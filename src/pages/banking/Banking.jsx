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
  Tooltip,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import { getItem, deleteItem } from "../../redux/slice/item/itemSlice";
import { filteredURLParams, getQueryParams } from "../../utlis/services";
import { filterInputEnum } from "../../utlis/constants";
import FilterInput from "../../component/commonComponent/FilterInput";
import { getcategory } from "../../redux/slice/category/categorySlice";
import { getBank } from "../../redux/slice/bank/bankSlice";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

function Banking() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorys } = useSelector((state) => state.category);
  const { banks, loading, pagination } = useSelector((state) => state.bank);
  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
  });
  const { companyId } = useSelector((state) => state.auth);

  console.log("banks", banks);
  console.log("pagination", pagination);

  const page = parseInt(searchParams.get("page")) || pagination?.page || 1;
  const limit = parseInt(searchParams.get("limit")) || pagination?.limit || 10;

  useEffect(() => {
    dispatch(
      getBank({
        search: filter.search,
        page,
        limit,
        companyId,
      })
    );
  }, [dispatch, searchParams, filter.search, page, limit, companyId]);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filterParams = filteredURLParams(params, newParams);
    setSearchParams(filterParams);
  };

  const handleSearch = () => {
    const searchValue = filter.search ? String(filter.search) : "";
    updateUrlParams({ page: 1, limit: 10, search: searchValue });
  };

  const handleClear = () => {
    updateUrlParams({ page: 1, limit: 10, search: "" });
    setFilter({
      search: "",
    });
  };

  const handlePaginationChange = (page, pageSize) => {
    setSearchParams({
      search: filter.search || "",
      page,
      limit: pageSize,
    });
  };

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Opening Balance",
      dataIndex: "openingBalance",
      key: "openingBalance",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Available Balance",
      dataIndex: "bankBalance",
      key: "bankBalance",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Show Transaction">
            <Button
              type="default"
              icon={<Icons.EyeOutlined />}
              onClick={() => navigate(`/banking/transaction/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title="Add Transaction">
            <Button
              type="default"
              icon={<Icons.PlusCircleOutlined />}
              style={{ color: "#1890ff", borderColor: "#1890ff" }}
              onClick={() => navigate(`/banking/add-transaction/${record._id}`)}
            />
          </Tooltip>
          {/* <Tooltip title="Credit">
                        <Button
                            type="default"
                            icon={<UpOutlined />}
                            style={{
                                color: "green",
                                borderColor: "green",
                            }}
                            onClick={() => navigate(`/banking/credit/${record._id}`, { state: { type: "credit" } })}
                        />
                    </Tooltip>
                    <Tooltip title="debit">
                        <Button
                            type="default"
                            icon={<DownOutlined />}
                            style={{
                                color: "red",
                                borderColor: "red"
                            }}
                            onClick={() => navigate(`/banking/debit/${record._id}`, { state: { type: "debit" } })}
                        />
                    </Tooltip> */}
          {/* <Button
                        type="primary"
                        icon={<Icons.EditOutlined />}
                        onClick={() => navigate(`/item/edit/${record._id}`)}
                    /> */}
          {/* <Popconfirm
                        title="Are you sure you want to delete this item?"
                        okText="Yes"
                        okButtonProps={{ loading: deleteLoading }}
                        cancelText="No"
                        disabled
                        onConfirm={async () => {
                            try {
                                await dispatch(deleteItem(record._id)).unwrap();
                                message.success("Item deleted successfully");
                            } catch (err) {
                                message.error(err || "Failed to delete item");
                            }
                        }}
                    >
                        <Button type="default" danger icon={<Icons.DeleteOutlined />} />
                    </Popconfirm> */}
        </Space>
      ),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
  ];

  const categoryOptions =
    categorys && Array.isArray(categorys) && categorys.length
      ? categorys.map((c) => ({
          label: c.name || c.categoryName || c.title || "Unnamed",
          value: c._id || c.id,
        }))
      : [];

  return (
    <div className="m-4">
      {/* Header */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: "12px 20px" }}>
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">View Bank</div>
          </Col>
          <Col>
            <Space size="middle">
              {/* <Button
                                type="default"
                                icon={<Icons.PlusCircleOutlined />}
                                size="middle"
                                onClick={() => navigate("/banking/add-transaction")}
                            >
                                Add Transaction
                            </Button> */}
              <Button
                type="primary"
                icon={<Icons.PlusCircleOutlined />}
                size="middle"
                onClick={() => navigate("/banking/add-account")}
              >
                Add New Account
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
          tableId="bankId"
          columns={columns}
          data={banks || []}
          loading={loading}
          pagination={{
            current: pagination?.page || 1,
            pageSize: pagination?.limit || 10,
            total: pagination?.total || 0,
            onChange: handlePaginationChange,
          }}
        />
      </Card>
    </div>
  );
}

export default Banking;
