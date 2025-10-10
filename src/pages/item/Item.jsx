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
import { getItem, deleteItem } from "../../redux/slice/item/itemSlice";
import { filteredURLParams, getQueryParams } from "../../utlis/services";
import { filterInputEnum } from "../../utlis/constants";
import FilterInput from "../../component/commonComponent/FilterInput";

const { Search } = Input;

const Item = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, deleteLoading } = useSelector((state) => state.item);
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorys } = useSelector((state) => state.category);

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
  });
  const { pagination } = useSelector((state) => state.item);

  const { companyId } = useSelector((state) => state.auth);

  const fetchItem = (signal) => {
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
    dispatch(getItem({ ...payload }));
  };
  useEffect(() => {
    const controller = new AbortController();
    fetchItem(controller.signal);
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
      title: "Item Code",
      dataIndex: "itemId",
      key: "itemId",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat) => {
        if (cat?.name) return cat.name;
        const found = categorys.find((c) => c._id === cat);
        return found ? found.name : "-";
      },
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (status) => (status ? "Active" : "Inactive"),
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Opening Stock",
      dataIndex: "openingStock",
      key: "openingStock",
      onHeaderCell: () => ({
        style: { fontSize: 16, fontWeight: 700, color: "#001529" },
      }),
    },
    {
      title: "Available Stock",
      dataIndex: "availableStock",
      key: "availableStock",
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
            onClick={() => navigate(`/item/view/${record._id}`)}
          />

          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/item/edit/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this item?"
            okText="Yes"
            okButtonProps={{ loading: deleteLoading }}
            cancelText="No"
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
            <div className="text-xl font-semibold">View Items</div>
          </Col>
          <Col>
            <Space size="middle">
              <Button
                type="primary"
                icon={<Icons.PlusCircleOutlined />}
                size="middle"
                onClick={() => navigate("/item/add")}
              >
                Add Item
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
          tableId="itemId"
          columns={columns}
          data={items || []}
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

export default Item;
