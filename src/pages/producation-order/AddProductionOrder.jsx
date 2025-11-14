import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Typography,
  Table,
  Select,
  InputNumber,
  message,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icons from "../../assets/icon";
import { getItem } from "../../redux/slice/item/itemSlice";
import { addProducationOrder } from "../../redux/slice/producation/producationSlice";

const { Title } = Typography;

const AddProductionOrder = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { companyId } = useSelector((state) => state.auth);
  const { items: itemList } = useSelector((state) => state.item);
  const { loading, postLoading } = useSelector((state) => state.producation);

  const [rawMaterials, setRawMaterials] = useState([
    { id: Date.now(), itemId: "", quantity: 1 },
  ]);
  const [finishedGoods, setFinishedGoods] = useState([
    { id: Date.now() + 1, itemId: "", quantity: 1 },
  ]);

  useEffect(() => {
    if (companyId) {
      dispatch(getItem({ companyId }));
    } else {
      console.error("companyId is undefined");
    }
  }, [dispatch, companyId]);

  const handleItemSelect = (list, setList, value, index) => {
    const selected = itemList.find((i) => i._id === value);
    if (!selected) return;
    const updated = [...list];
    updated[index] = {
      ...updated[index],
      itemId: selected._id,
      quantity: 1,
    };
    setList(updated);
  };

  const handleQtyChange = (list, setList, index, value) => {
    const updated = [...list];
    updated[index].quantity = value;
    setList(updated);
  };

  const addNewRow = (list, setList) => {
    setList([
      ...list,
      {
        id: Date.now(),
        itemId: "",
        quantity: 1,
      },
    ]);
  };

  const removeRow = (list, setList, index) => {
    if (list.length === 1) {
      return message.warning("At least one item is required");
    }
    const updated = [...list];
    updated.splice(index, 1);
    setList(updated);
  };

  const onFinish = async () => {
    if (!companyId) {
      message.error("Company ID is missing. Please log in again.");
      navigate("/login");
      return;
    }

    const payload = {
      companyId,
      date: new Date(),
      rawMaterials: rawMaterials.map((i) => ({
        itemId: i.itemId,
        quantity: i.quantity,
      })),
      finishedGoods: finishedGoods.map((i) => ({
        itemId: i.itemId,
        quantity: i.quantity,
      })),
    };

    try {
      console.log("Submitting Production Order:", payload);
      await dispatch(addProducationOrder(payload)).unwrap();
      message.success("Production order created successfully");
      navigate("/producation-order");
    } catch (err) {
      console.error("API error:", err);
      message.error(err || "Failed to save production order");
    }
  };

  const getColumns = (list, setList) => [
    {
      title: "Item",
      dataIndex: "itemId",
      width: 350,
      render: (_, record, index) => (
        <Form.Item
          validateStatus={!record.itemId && record.touched ? "error" : ""}
          help={!record.itemId && record.touched ? "Item is required" : ""}
          style={{ margin: 0 }}
        >
          <Select
            showSearch
            placeholder="Select item"
            style={{ width: "100%" }}
            value={record.itemId || undefined}
            onBlur={() => {
              // Mark field as touched
              const updated = [...list];
              updated[index].touched = true;
              setList(updated);
            }}
            onChange={(val) => {
              handleItemSelect(list, setList, val, index);
            }}
            optionFilterProp="children"
          >
            {itemList && itemList.length > 0 ? (
              itemList.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.name}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled>No items available</Select.Option>
            )}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      render: (_, record, index) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(val) => handleQtyChange(list, setList, index, val)}
        />
      ),
    },
    {
      title: "Action",
      render: (_, __, index) => (
        <Button
          danger
          type="text"
          icon={<Icons.DeleteOutlined />}
          onClick={() => removeRow(list, setList, index)}
        />
      ),
    },
  ];

  return (
    <div className="!relative">
      <Card className="!p-3 !m-4 !pb-10">
        <Row align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Button
              type="text"
              icon={<Icons.ArrowLeftOutlined />}
              onClick={() => navigate("/producation-order")}
              style={{ marginRight: 8 }}
            />
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Add Production Order
            </Title>
          </Col>
        </Row>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading..." />
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Title level={4}>Raw Materials</Title>
                <Table
                  dataSource={rawMaterials}
                  columns={getColumns(rawMaterials, setRawMaterials)}
                  pagination={false}
                  rowKey="id"
                  bordered
                  size="small"
                />
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => addNewRow(rawMaterials, setRawMaterials)}
                  style={{ marginTop: 12 }}
                  block
                >
                  Add Raw Material
                </Button>
              </Col>

              <Col xs={24} md={12}>
                <Title level={4}>Finished Goods</Title>
                <Table
                  dataSource={finishedGoods}
                  columns={getColumns(finishedGoods, setFinishedGoods)}
                  pagination={false}
                  rowKey="id"
                  bordered
                  size="small"
                />
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => addNewRow(finishedGoods, setFinishedGoods)}
                  style={{ marginTop: 12 }}
                  block
                >
                  Add Finished Good
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Card>

      <div className="flex items-center gap-5 py-4 px-12 border-t border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" onClick={() => form.submit()}>
          {postLoading ? "Saving..." : "Save Production Order"}
        </Button>
        <Button onClick={() => navigate("/producation-order")}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddProductionOrder;
