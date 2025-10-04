import React, { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Spin,
  Typography,
  Descriptions,
  Tag,
} from "antd";
import Icons from "../../assets/icon";
import { getItemById } from "../../redux/slice/item/itemSlice"; // <-- make sure this thunk exists
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const { Title } = Typography;

const ItemView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const { item, loading } = useSelector((state) => state.item);
  useEffect(() => {
    if (itemId) {
      dispatch(getItemById(itemId));
    }
  }, [itemId, dispatch]);

  return (
    <div className="!relative">
      <Card className="!p-3 !m-4 !pb-10">
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Row align="middle" gutter={8}>
              <Col>
                <Button
                  type="text"
                  icon={<Icons.ArrowLeftOutlined />}
                  onClick={() => navigate("/item")}
                />
              </Col>
              <Col>
                <Title level={3} style={{ margin: 0 }}>
                  View Item
                </Title>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row gutter={8}>
              <Col>
                <Button
                  type="primary"
                  icon={<Icons.EditOutlined />}
                  onClick={() => navigate(`/item/edit/${itemId}`)}
                >
                  Edit
                </Button>
              </Col>
              <Col>
                <Button onClick={() => navigate("/item")}>Cancel</Button>
              </Col>
            </Row>
          </Col>
        </Row>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading..." />
          </div>
        ) : (
          <div className="min-h-[70vh] !px-2">
            <Descriptions
              title="Item Information"
              bordered
              column={1}
              labelStyle={{ fontWeight: 600, width: "25%" }}
            >
              <Descriptions.Item label="Item Code">
                {item?.itemId || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Item Name">
                {item?.name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {item?.category?.name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="HSN Code">
                {item?.hsnCode || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {item?.description || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {item?.isActive ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="red">Inactive</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Created Date">
                {item?.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "-"}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Stock Information"
              bordered
              column={1}
              style={{ marginTop: 24 }}
              labelStyle={{ fontWeight: 600, width: "25%" }}
            >
              <Descriptions.Item label="Opening Stock">
                {item?.openingStock ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Available Stock">
                {item?.availableStock ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Reorder Level">
                {item?.reorderLevel ?? "-"}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions
              title="Pricing Details"
              bordered
              column={1}
              style={{ marginTop: 24 }}
              labelStyle={{ fontWeight: 600, width: "25%" }}
            >
              <Descriptions.Item label="Purchase Price">
                {item?.purchasePrice
                  ? `₹ ${item.purchasePrice.toFixed(2)}`
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Selling Price">
                {item?.salePrice ? `₹ ${item.salePrice.toFixed(2)}` : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Tax Rate">
                {item?.taxRate ? `${item.taxRate}%` : "-"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ItemView;
