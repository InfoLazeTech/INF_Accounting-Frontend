import React, { useEffect } from "react";
import { Card, Row, Col, Button, Input, Space, message, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import { getItem, deleteItem } from "../../redux/slice/item/itemSlice";

const Item = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.item);

 
  useEffect(() => {
    dispatch(getItem());
  }, [dispatch]);
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
      render: (cat) => cat?.name || "-",
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
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/item/edit/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this item?"
            okText="Yes"
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
            <Input
              placeholder="Search by Item name"
              suffix={
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      borderLeft: "1px solid #ccc",
                      height: 20,
                      display: "inline-block",
                    }}
                  />
                  <Icons.SearchOutlined />
                </span>
              }
              style={{ borderRadius: 6, height: 36 }}
            />
          </Col>
          <Col span={14} style={{ textAlign: "right" }}>
            <Space>
              <Button type="primary" icon={<Icons.FilterOutlined />} size="middle">
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
          pagination={{ current: 1, pageSize: 10, total: items?.length || 0 }}
        />
      </Card>
    </div>
  );
};

export default Item;
