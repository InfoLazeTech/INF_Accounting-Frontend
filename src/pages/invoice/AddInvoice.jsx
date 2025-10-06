
import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Typography,
  DatePicker,
  message,
  Table,
  Select,
  InputNumber,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CustomInput from "../../component/commonComponent/CustomInput";
import Icons from "../../assets/icon";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addInvoice } from "../../redux/slice/invoice/invoiceSlice";
import { getCustomersVendors } from "../../redux/slice/customer/customerVendorSlice";
import { getItem } from "../../redux/slice/item/itemSlice";

const { Title } = Typography;

const AddInvoice = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postLoading } = useSelector((state) => state.invoice);
  const { customers, loading: customerLoading } = useSelector((state) => state.customerVendor);
  const { items: itemList, loading: itemLoading } = useSelector((state) => state.item);
  const { companyId } = useSelector((state) => state.auth);

  const [items, setItems] = useState([
    {
      id: 1,
      itemId: "",
      name: "",
      hsnCode: "",
      sku: "",
      description: "",
      quantity: 0,
      unitPrice: 0,
      discount: 0,
      taxRate: 0,
      lineTotal: 0,
    },
  ]);

  const [extraCharges, setExtraCharges] = useState({
    shipping: 0,
    other: 0,
  });

  useEffect(() => {
    dispatch(getCustomersVendors({ companyId }));
    dispatch(getItem({ companyId }));
  }, [dispatch, companyId]);

  // When item is selected
  const handleItemSelect = (value, index) => {
    const selected = itemList.find((i) => i._id === value);
    if (!selected) return;
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      itemId: selected._id,
      name: selected.name,
      hsnCode: selected.hsnCode || "",
      sku: selected.sku || "",
      description: selected.description || "",
      unitPrice: selected.unitPrice || 0,
      taxRate: selected.taxRate || 0,
      quantity: 1,
      discount: 0,
      lineTotal:
        (selected.unitPrice || 0) +
        ((selected.unitPrice || 0) * (selected.taxRate || 0)) / 100,
    };
    setItems(updated);
  };

  // When Customer is selected
  const handleCustomerSelect = (value) => {
    const selected = customers.find((c) => c._id === value);
    if (!selected) return;
    form.setFieldsValue({
      customerName: selected._id,
      customerGSTIN: selected.gstin || "",
      customerAddress: selected.address || "",
      customerEmail: selected.email || "",
    });
  };

  // Handle change for qty, price, discount, tax
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    const {
      quantity = 1,
      unitPrice = 0,
      discount = 0,
      taxRate = 0,
    } = updated[index];
    const subtotal = quantity * unitPrice - discount;
    const tax = (subtotal * taxRate) / 100;
    updated[index].lineTotal = subtotal + tax;
    setItems(updated);
  };

  const addNewItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        itemId: "",
        name: "",
        hsnCode: "",
        sku: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        taxRate: 0,
        lineTotal: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1)
      return message.warning("At least one item required");
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Totals calculation (including SGST/CGST split)
  const totals = items.reduce(
    (acc, item) => {
      const qty = item.quantity || 0;
      const price = item.unitPrice || 0;
      const discount = item.discount || 0;
      const subtotal = qty * price - discount;
      const tax = (subtotal * (item.taxRate || 0)) / 100;
      const sgst = tax / 2;
      const cgst = tax / 2;
      acc.subtotal += subtotal;
      acc.totalTax += tax;
      acc.sgst += sgst;
      acc.cgst += cgst;
      acc.discount += discount;
      acc.grandTotal += subtotal + tax;
      return acc;
    },
    { subtotal: 0, totalTax: 0, sgst: 0, cgst: 0, discount: 0, grandTotal: 0 }
  );

  const finalGrandTotal =
    totals.grandTotal +
    Number(extraCharges.shipping) +
    Number(extraCharges.other);

  const onFinish = async (values) => {
    try {
      const payload = {
        companyId,
        customerId: values.customerName,
        issueDate: values.InvoiceDate ? dayjs(values.InvoiceDate).format("YYYY-MM-DD") : undefined,
        dueDate: values.dueDate ? dayjs(values.dueDate).format("YYYY-MM-DD") : undefined,
        items: items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          taxRate: item.taxRate,
          lineTotal: item.lineTotal,
        })),
        totals: { ...totals, ...extraCharges, finalGrandTotal },
        customerNotes: values.customerNotes,
        termsConditions: values.termsConditions,
      };

      await dispatch(addInvoice(payload)).unwrap();
      message.success("Invoice created successfully");
      navigate("/invoice");
    } catch (err) {
      message.error(err || "Failed to create invoice");
    }
  };

  const columns = [
    {
      title: "Item",
      dataIndex: "name",
      render: (_, record, index) => (
        <Select
          placeholder="Select item"
          style={{ width: "100%" }}
          value={record.itemId || undefined}
          onChange={(val) => handleItemSelect(val, index)}
          loading={itemLoading}
        >
          {itemList.map((item) => (
            <Select.Option key={item._id} value={item._id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    { title: "HSN Code", dataIndex: "hsnCode" },
    { title: "SKU", dataIndex: "sku" },
    {
      title: "Qty",
      dataIndex: "quantity",
      render: (_, record, index) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(val) => handleItemChange(index, "quantity", val)}
        />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          value={record.unitPrice}
          onChange={(val) => handleItemChange(index, "unitPrice", val)}
        />
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          value={record.discount}
          onChange={(val) => handleItemChange(index, "discount", val)}
        />
      ),
    },
    {
      title: "Tax (%)",
      dataIndex: "taxRate",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          value={record.taxRate}
          onChange={(val) => handleItemChange(index, "taxRate", val)}
        />
      ),
    },
    {
      title: "Line Total",
      dataIndex: "lineTotal",
      render: (val) => val.toFixed(2),
    },
    {
      title: "Action",
      render: (_, __, index) => (
        <Button
          icon={<DeleteOutlined />}
          type="text"
          danger
          onClick={() => removeItem(index)}
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
              onClick={() => navigate("/invoice")}
              style={{ marginRight: 8 }}
            />
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Add Invoice
            </Title>
          </Col>
        </Row>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="min-h-[70vh] !px-2"
        >
          <Title level={4}>Invoice Information</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="customerName" label="Customer Name">
                <Select
                  placeholder="Select Customer"
                  onChange={handleCustomerSelect}
                  showSearch
                  optionFilterProp="children"
                  loading={customerLoading}
                >
                  {customers.map((customer) => (
                    <Select.Option key={customer._id} value={customer._id}>
                      {customer.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="InvoiceDate" label="Invoice Date">
                <DatePicker
                  className="w-full"
                  defaultValue={dayjs()}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dueDate" label="Due Date">
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Title level={4}>Item Details</Title>
          <Table
            dataSource={items}
            columns={columns}
            pagination={false}
            rowKey="id"
          />
          <Button
            type="primary"
            onClick={addNewItem}
            icon={<PlusOutlined />}
            style={{ marginTop: 12 }}
          >
            Add Item
          </Button>

          <Row gutter={24} style={{ marginTop: 32 }}>
            <Col span={16}>
              <Title level={4}>Additional Information</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <CustomInput
                    type="textarea"
                    name="customerNotes"
                    label="Customer Notes"
                    placeholder="Urgent delivery required"
                  />
                </Col>
                <Col span={12}>
                  <CustomInput
                    type="textarea"
                    name="termsConditions"
                    label="Terms & Conditions"
                    placeholder="Enter terms & conditions"
                  />
                </Col>
              </Row>
            </Col>

            {/* Summary Box */}
            <Col span={8}>
              <Card bordered className="!shadow-md !rounded-2xl">
                <Title level={5}>Summary</Title>
                <div className="space-y-2">
                  <Row justify="space-between">
                    <Col>Subtotal</Col>
                    <Col>₹{totals.subtotal.toFixed(2)}</Col>
                  </Row>
                  <Row justify="space-between">
                    <Col>Discount</Col>
                    <Col>₹{totals.discount.toFixed(2)}</Col>
                  </Row>
                  <Row justify="space-between">
                    <Col>SGST</Col>
                    <Col>₹{totals.sgst.toFixed(2)}</Col>
                  </Row>
                  <Row justify="space-between">
                    <Col>CGST</Col>
                    <Col>₹{totals.cgst.toFixed(2)}</Col>
                  </Row>
                  <Row justify="space-between">
                    <Col>Total Tax</Col>
                    <Col>₹{totals.totalTax.toFixed(2)}</Col>
                  </Row>
                  <Row justify="space-between" align="middle">
                    <Col>Shipping Charges</Col>
                    <Col>
                      <InputNumber
                        min={0}
                        value={extraCharges.shipping}
                        onChange={(val) =>
                          setExtraCharges({
                            ...extraCharges,
                            shipping: val || 0,
                          })
                        }
                      />
                    </Col>
                  </Row>
                  <Row justify="space-between" align="middle">
                    <Col>Other Charges</Col>
                    <Col>
                      <InputNumber
                        min={0}
                        value={extraCharges.other}
                        onChange={(val) =>
                          setExtraCharges({ ...extraCharges, other: val || 0 })
                        }
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Row justify="space-between">
                    <Col>
                      <strong>Grand Total</strong>
                    </Col>
                    <Col>
                      <strong>₹{finalGrandTotal.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        </Form>
      </Card>

      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" onClick={() => form.submit()} loading={postLoading}>
          Save Invoice
        </Button>
        <Button onClick={() => navigate("/invoice")}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddInvoice;
