import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Spin,
  Typography,
  message,
  Modal,
  Input,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "../../component/commonComponent/CustomInput";
import Icons from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  getItem,
  getItemById,
  updateItem,
} from "../../redux/slice/item/itemSlice";
import { addcategory, getcategory } from "../../redux/slice/category/categorySlice";

const { Title } = Typography;
const AddItem = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
    const { customerId } = useParams();
  const { companyId } = useSelector((state) => state.auth);

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    const categorayData = {
        name: newCategoryName,
        companyId,
    };
      await dispatch(addcategory( categorayData)).unwrap();
      setNewCategoryName("");
      closeModal();
       dispatch(getcategory({ companyId }))
  };

  const { item, loading, postLoading } = useSelector(
    (state) => state.item || {}
  );
  useEffect(() => {
    if (itemId) {
      dispatch(getItemById(itemId));
    }
  }, [itemId, dispatch]);

  useEffect(() => {
    if (itemId && item) {
      form.setFieldsValue({
        sku: item.sku || "",
        name: item.name || "",
        description: item.description || "",
        category: item.category?._id || "",
        unitOfMeasure: item.unitOfMeasure || "pcs",
        purchasePrice: item.purchasePrice || 0,
        salePrice: item.salePrice || 0,
        taxRate: item.taxRate || 0,
        openingStock: item.openingStock || 0,
        availableStock: item.availableStock || 0,
        reorderLevel: item.reorderLevel || 0,
        isActive: item.isActive ?? true,
      });
    }
  }, [itemId, item, form]);

  const onFinish = async (values) => {
      const payload = {
    companyId,
    sku: values.sku || "",
    name: values.name || "",
    description: values.description || "",
    category: values.category || "",
    unitOfMeasure: values.unitOfMeasure || "pcs",
    purchasePrice: values.purchasePrice || 0,
    salePrice: values.salePrice || 0,
    taxRate: values.taxRate || 0,
    openingStock: values.openingStock || 0,
    availableStock: values.availableStock || 0,
    reorderLevel: values.reorderLevel || 0,
    isActive: values.isActive ?? true,
  };
    try {
      if (itemId) {
        await dispatch(updateItem({ id: itemId, data: payload })).unwrap();
        message.success("Item updated successfully");
      } else {
        await dispatch(addItem(payload)).unwrap();
        message.success("Item added successfully");
      }
      navigate("/item");
    } catch (err) {
      message.error(err);
    }
  };
  const { categorys } = useSelector((state) => state.category || {});
useEffect(() => {
  if (companyId) {
    dispatch(getcategory({ companyId }));
  }
}, [dispatch, companyId]);

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
              {itemId ? "Edit Item" : "Add Item"}
            </Title>
          </Col>
        </Row>

        {/* Form */}
        {loading && itemId ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading..." />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="min-h-[70vh] !px-2"
          >
            <Row gutter={16}>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="sku"
                  label="SKU"
                  placeholder="Enter SKU"
                  rules={[{ required: true, message: "Please enter SKU" }]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="name"
                  label="Item Name"
                  placeholder="Enter item name"
                  rules={[{ required: true, message: "Please enter name" }]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="description"
                  label="Description"
                  placeholder="Enter description"
                />
              </Col>
            </Row>

            <Row gutter={16} className="items-center">
              <Col span={8}>
                <CustomInput
                  type="select"
                  name="unitOfMeasure"
                  label="Unit of Measure"
                  placeholder="Select unit"
                  options={[
                    { label: "pcs", value: "pcs" },
                    { label: "kg", value: "kg" },
                    { label: "liter", value: "liter" },
                    { label: "box", value: "box" },
                    { label: "meter", value: "meter" },
                    { label: "pack", value: "pack" },
                  ]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="select"
                  name="category"
                  label="Category"
                  placeholder="Select category"
                  options={categorys.map((cat) => ({
                    label: cat.name,
                    value: cat._id,
                  }))}
                />
              </Col>
              <Col span={8}>
                <Button
                  type="default"
                  icon={<Icons.PlusCircleOutlined className="" />}
                  onClick={openModal}
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <CustomInput
                  type="number"
                  name="purchasePrice"
                  label="Purchase Price"
                  placeholder="Enter purchase price"
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="number"
                  name="salePrice"
                  label="Sale Price"
                  placeholder="Enter sale price"
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="number"
                  name="taxRate"
                  label="Tax Rate (%)"
                  placeholder="Enter tax rate"
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <CustomInput
                  type="number"
                  name="openingStock"
                  label="Opening Stock"
                  placeholder="0"
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="number"
                  name="availableStock"
                  label="Available Stock"
                  placeholder="0"
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="number"
                  name="reorderLevel"
                  label="Reorder Level"
                  placeholder="0"
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="radio"
                  name="isActive"
                  label="Status"
                  options={[
                    { label: "Active", value: true },
                    { label: "Inactive", value: false },
                  ]}
                  default={true}
                />
              </Col>
            </Row>
          </Form>
        )}
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" onClick={() => form.submit()}>
          {postLoading ? (
            <span>Loading...</span>
          ) : itemId ? (
            "Update Item"
          ) : (
            "Save Item"
          )}
        </Button>
        <Button onClick={() => navigate("/item")}>Cancel</Button>
      </div>
      <Modal
        title="Add New Category"
        open={isModalOpen}
        onOk={handleAddCategory}
        onCancel={closeModal}
        okText="Add"
      >
        <Input
          placeholder="Enter category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default AddItem;
