import { Button, Card, Col, Form, Input, Modal, Radio, Row, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Icons from '../../assets/icon';
import CustomInput from '../../component/commonComponent/CustomInput';
import { addStock, getItem, removeStock } from '../../redux/slice/item/itemSlice';

const { Title } = Typography;

function ManageStock() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId } = useSelector((state) => state.auth);

  const { items, loading, postLoading } = useSelector((state) => state.item);

  useEffect(() => {
    dispatch(getItem({ companyId })); // If API requires companyId, otherwise remove
  }, [dispatch, companyId]);

  const onFinish = async (values) => {
    const data = {
      companyId,
      itemId: values.itemId,
      quantity: Number(values.quantity),
    };
    try {
      if (values.inventoryType === "add") {
        await dispatch(addStock(data)).unwrap();
      } else {
        await dispatch(removeStock(data)).unwrap();
      }
      navigate("/item");
    } catch (error) {
      console.log("Error updating stock:", error);
    }
  };



  return (
    <div className="!relative">
      <Card className="!p-3 !m-4 !pb-10">
        {/* Header */}
        <Row align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Button
              type="text"
              icon={<Icons.ArrowLeftOutlined />}
              onClick={() => navigate("/item")}
              style={{ marginRight: 8 }}
            />
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Manage Stock
            </Title>
          </Col>
        </Row>

        {/* Form */}
        {/* {loading && itemId ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading..." />
          </div>
        ) : ( */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="min-h-[70vh] !px-2"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Stock Type"
                name="inventoryType"
                initialValue="add"
                rules={[{ required: true, message: "Please select inventory type" }]}
                labelCol={{ span: 24 }}
              >
                <Radio.Group
                  // onChange={(e) => setStockType(e.target.value)}
                  // value={stockType}
                  style={{ display: "flex", gap: "20px", marginTop: "4px" }}
                >
                  <Radio value="add">
                    Add Stock
                  </Radio>
                  <Radio value="remove">
                    Remove Stock
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Item Name"
                name="itemId"
                rules={[{ required: true, message: "Please select an item" }]}
              >
                <Select
                  placeholder="Select Item"
                  showSearch
                  optionFilterProp="children"
                  loading={loading}
                >
                  {items?.map((item) => (
                    <Select.Option key={item._id} value={item._id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <CustomInput
                type="number"
                name="quantity"
                label="Item Quntity"
                placeholder="Enter Item Quntity"
                rules={[
                  { required: true, message: "Please enter Sale Price" },
                ]}
              />
            </Col>
          </Row>
        </Form>
        {/* )} */}
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" loading={postLoading} onClick={() => form.submit()}>
          Update Stock
        </Button>
        <Button onClick={() => navigate("/item")}>Cancel</Button>
      </div>
    </div>
  )
}

export default ManageStock