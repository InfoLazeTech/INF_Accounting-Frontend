import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Typography,
  DatePicker,
  message,
  Table,
  Select,
  InputNumber,
  Spin,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../component/commonComponent/CustomInput";
import Icons from "../../assets/icon";
import {
  addBill,
  getBillById,
  updateBill,
} from "../../redux/slice/bill/billSlice";
import { getItem } from "../../redux/slice/item/itemSlice";
// import { getCustomersVendors } from "../../redux/slice/customer/customerVendorSlice";

import { getVendorDropdown } from "../../redux/slice/customer/customerVendorSlice";
import { getCompany } from "../../redux/slice/company/companySlice";

const { Title } = Typography;

const AddBill = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { billId } = useParams();
  const { companyId } = useSelector((state) => state.auth);
  const { bill, loading, postLoading } = useSelector((state) => state.bill);
  const { items: itemList } = useSelector((state) => state.item);
  const { customers } = useSelector((state) => state.customerVendor);

  const { dropdownVendors, dropLoading } = useSelector(
    (state) => state.customerVendor
  );

  const { companyData } = useSelector((state) => state.company);
  const [items, setItems] = useState([
    {
      id: Date.now(),
      itemId: "",
      itemName: "",
      hsnCode: "",
      sku: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      lineTotal: 0,
    },
  ]);
  const [extraCharges, setExtraCharges] = useState({
    shipping: 0,
    other: 0,
  });

  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [vendorState, setVendorState] = useState("");
  const [companyState, setCompanyState] = useState("");
  const [isSameState, setIsSameState] = useState(true);
  const [vendorShippingAddress, setVendorShippingAddress] = useState({});

  // Fetch bill data for editing
  useEffect(() => {
    if (billId) {
      dispatch(getBillById({ companyId, billId }));
    }
  }, [billId, dispatch, companyId]);

  // Fetch items and vendors
  useEffect(() => {
    if (companyId) {
      dispatch(getItem({ companyId }));
      dispatch(getVendorDropdown({ companyId }));
      dispatch(getCompany(companyId));
      if (billId) {
        dispatch(getBillById({ companyId, billId }));
      }
    } else {
      console.error("companyId is undefined");
      message.error("Company ID is missing. Please log in again.");
      navigate("/login");
    }
  }, [dispatch, companyId, billId, navigate]);
  useEffect(() => {
    if (companyData) {
      setCompanyState(companyData.address?.state || "");
    }
  }, [companyData]);

  // Populate form with bill data when editing
  useEffect(() => {
    if (billId && bill) {
      form.setFieldsValue({
        vendorName: bill.vendorName || "",
        billNumber: bill.billNumber || "",
        billDate: bill.billDate ? dayjs(bill.billDate) : null,
        dueDate: bill.dueDate ? dayjs(bill.dueDate) : null,
        customerNotes: bill.customerNotes || "",
        termsAndConditions: bill.termsAndConditions || "",
        paymentTerms: bill.paymentTerms?.paymentTerms || "",
      });
      setSelectedVendorId(bill.vendorId?._id || "");
      setItems(
        bill.items?.map((item) => ({
          id: Date.now() + Math.random(),
          itemId: item.itemId,
          itemName: item.itemName,
          hsnCode: item.hsnCode || "",
          sku: item.sku || "",
          description: item.description || "",
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          lineTotal: item.quantity * item.unitPrice || item.lineTotal,
        })) || items
      );
      setExtraCharges({
        shipping: bill.totals?.shippingCharges || 0,
        other: bill.totals?.otherCharges || 0,
      });
      setVendorState(bill.vendorAddress?.state || "");

      setIsSameState(bill.totals?.igst ? false : true);
    }
  }, [billId, bill, form]);

  useEffect(() => {
    if (vendorState && companyState) {
      setIsSameState(vendorState === companyState);
    }
  }, [vendorState, companyState]);

  useEffect(() => {
    if (billId && selectedVendorId) {
      handleVendorSelect(selectedVendorId);
    }
  }, [billId, selectedVendorId]);

  const handleVendorSelect = (vendorId) => {
    setSelectedVendorId(vendorId);

    const selectedVendor = dropdownVendors.find((v) => v._id === vendorId);
    if (!selectedVendor) return;

    const shipping = selectedVendor.shippingAddress || billing;
    setVendorShippingAddress(shipping);

    setVendorState(shipping.state || billing.state || "");
    form.setFieldsValue({ vendorName: selectedVendor.companyName });
  };

  // Handle item selection
  const handleItemSelect = (value, index) => {
    const selected = itemList.find((i) => i._id === value);
    if (!selected) return;
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      itemId: selected._id,
      itemName: selected.name || "",
      hsnCode: selected.hsnCode || "",
      sku: selected.sku || "",
      description: selected.description || "",
      unitPrice: selected.purchasePrice || 0,
      taxRate: selected.taxRate || 0,
      quantity: 1,
      lineTotal: selected.purchasePrice || 0, // Set lineTotal to unitPrice
    };
    setItems(updated);
  };

  // Handle changes to item fields
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    const { quantity = 1, unitPrice = 0 } = updated[index];
    updated[index].lineTotal = quantity * unitPrice; // Line total is subtotal only
    setItems(updated);
  };

  // Add new item row
  const addNewItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        itemId: "",
        itemName: "",
        hsnCode: "",
        sku: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
        lineTotal: 0,
      },
    ]);
  };

  // Remove item row
  const removeItem = (index) => {
    if (items.length === 1) {
      return message.warning("At least one item is required");
    }
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Calculate totals
  const totals = items.reduce(
    (acc, item) => {
      const qty = item.quantity || 0;
      const price = item.unitPrice || 0;
      const subtotal = qty * price;
      const tax = (subtotal * (item.taxRate || 0)) / 100;
      acc.subtotal += subtotal;
      acc.totalTax += tax;
      if (isSameState) {
        acc.sgst += tax / 2;
        acc.cgst += tax / 2;
      } else {
        acc.igst += tax;
      }
      acc.grandTotal += subtotal + tax;
      return acc;
    },
    {
      subtotal: 0,
      totalTax: 0,
      sgst: 0,
      cgst: 0,
      igst: 0,
      grandTotal: 0,
    }
  );
  const finalGrandTotal =
    totals.grandTotal +
    Number(extraCharges.shipping) +
    Number(extraCharges.other);

  // Validate items before submission
  const validateItems = () => {
    return items.every((item) => item.itemId && item.hsnCode);
  };

  // Form submission
  const onFinish = async (values) => {
    if (!companyId) {
      message.error("Company ID is missing. Please log in again.");
      navigate("/login");
      return;
    }

    if (!selectedVendorId) {
      message.error("Please select a vendor");
      return;
    }

    if (!validateItems()) {
      message.error("All items must have a selected item and HSN code");
      return;
    }

    const selectedVendor = customers.find((v) => v._id === selectedVendorId);
    const payload = {
      companyId,
      vendorId: selectedVendorId,
      vendorName: values.vendorName || "",
      billNumber: values.billNumber,
      billDate: values.billDate
        ? values.billDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        : undefined,
      dueDate: values.dueDate
        ? values.dueDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        : undefined,
      customerNotes: values.customerNotes,
      termsAndConditions: values.termsAndConditions,
      paymentTerms: {
        paymentTerms: values.paymentTerms,
        dueDate: values.dueDate
          ? values.dueDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ")
          : undefined,
      },
      items: items.map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        hsnCode: item.hsnCode,
        sku: item.sku,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        lineTotal: item.lineTotal, // Subtotal only
      })),
      totals: {
        subtotal: totals.subtotal,
        sgst: isSameState ? totals.sgst : 0,
        cgst: isSameState ? totals.cgst : 0,
        igst: isSameState ? 0 : totals.igst,
        totalTax: totals.totalTax,
        shippingCharges: extraCharges.shipping,
        otherCharges: extraCharges.other,
        grandTotal: finalGrandTotal,
      },
    };

    try {
      console.log("Submitting payload:", payload);
      if (billId) {
        await dispatch(updateBill({ billId: billId, data: payload })).unwrap();
        message.success("Bill updated successfully");
      } else {
        await dispatch(addBill(payload)).unwrap();
        message.success("Bill added successfully");
      }
      navigate("/bill");
    } catch (err) {
      console.error("API error:", err);
      message.error(err || "Failed to save bill");
    }
  };

  // Table columns
  const columns = [
    {
      title: "Item",
      dataIndex: "itemName",
      render: (_, record, index) => (
        <Select
          placeholder="Select item"
          style={{ width: "100%" }}
          value={record.itemId || undefined}
          onChange={(val) => handleItemSelect(val, index)}
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
    // {
    //   title: "Tax Rate",
    //   dataIndex: "taxRate",
    //   render: (_, record, index) => (
    //     <InputNumber
    //       min={0}
    //       value={record.taxRate}
    //       onChange={(val) => handleItemChange(index, "taxRate", val)}
    //     />
    //   ),
    // },
    {
      title: "Tax Details",
      dataIndex: "taxDetails",
      render: (_, record) => {
        const taxAmount =
          (record.quantity * record.unitPrice * record.taxRate) / 100 || 0;
        const taxRate = record.taxRate ? record.taxRate.toFixed(2) : "0.00";
        return `${taxRate}% (₹${taxAmount.toFixed(2)})`;
      },
    },
    {
      title: "Amount",
      dataIndex: "lineTotal",
      render: (val) => (val ? val.toFixed(2) : "0.00"),
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
        {/* Header */}
        <Row align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Button
              type="text"
              icon={<Icons.ArrowLeftOutlined />}
              onClick={() => navigate("/bill")}
              style={{ marginRight: 8 }}
            />
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              {billId ? "Edit Purchase Bill" : "Add Purchase Bill"}
            </Title>
          </Col>
        </Row>

        {/* Form */}
        {loading && billId ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading..." />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              billDate: dayjs(),
            }}
            className="min-h-[70vh] !px-2"
          >
            <Title level={4}>Purchase Bill Information</Title>
            <Row gutter={16}>
              <Col span={8}>
                <CustomInput
                  type="select"
                  name="vendorName"
                  label="Vendor Name"
                  placeholder="Select vendor"
                  options={
                    dropdownVendors && dropdownVendors.length > 0
                      ? dropdownVendors.map((vendor) => ({
                        label: vendor.companyName || vendor.name,
                        value: vendor._id,
                      }))
                      : [
                        {
                          label: "No vendors available",
                          value: "",
                          disabled: true,
                        },
                      ]
                  }
                  rules={[
                    { required: true, message: "Please select a vendor" },
                  ]}
                  onChange={handleVendorSelect}
                />
              </Col>
              {billId && (
                <Col span={8}>
                  <CustomInput
                    type="text"
                    name="billNumber"
                    label="Bill Number"
                    placeholder="Enter bill number"
                    disabled={true}
                  />
                </Col>
              )}
              <Col span={8}>
                <CustomInput
                  type="date"
                  name="billDate"
                  label="Bill Date"
                  placeholder="Select bill date"
                  rules={[
                    { required: true, message: "Please select bill date" },
                  ]}
                />
              </Col>
            </Row>
            {selectedVendorId && (
              <Row gutter={0} className="mb-5">
                <Col span={12}>
                  <div style={{ fontSize: 14, lineHeight: "20px" }}>
                    <strong style={{ display: "block", marginBottom: 4 }}>Shipping Address</strong>

                    <div>
                      <p style={{ margin: 0 }}>
                        {vendorShippingAddress.street || "-"}, {vendorShippingAddress.city || "-"}
                      </p>
                      <p style={{ margin: "2px 0" }}>
                        {vendorShippingAddress.state || "-"}, {vendorShippingAddress.zip || "-"}
                      </p>
                      <p style={{ margin: 0 }}>
                        {vendorShippingAddress.country || "-"}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            )}
            <Row gutter={16}>
              <Col span={8}>
                <CustomInput
                  type="date"
                  name="dueDate"
                  label="Due Date"
                  placeholder="Select due date"
                  rules={[
                    { required: true, message: "Please select due date" },
                  ]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="select"
                  name="paymentTerms"
                  label="Payment Terms"
                  placeholder="Select payment terms"
                  options={[
                    { label: "Prepaid", value: "Prepaid" },
                    { label: "Net 15", value: "Net 15" },
                    { label: "Net 30", value: "Net 30" },
                    { label: "Custom", value: "Custom" },
                  ]}
                  rules={[
                    { required: true, message: "Please select payment terms" },
                  ]}
                />
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
                      placeholder="Enter customer notes"
                    />
                  </Col>
                  <Col span={12}>
                    <CustomInput
                      type="textarea"
                      name="termsAndConditions"
                      label="Terms and Conditions"
                      placeholder="Enter terms and conditions"
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
                    {isSameState ? (
                      <>
                        <Row justify="space-between">
                          <Col>SGST</Col>
                          <Col>₹{totals.sgst.toFixed(2)}</Col>
                        </Row>
                        <Row justify="space-between">
                          <Col>CGST</Col>
                          <Col>₹{totals.cgst.toFixed(2)}</Col>
                        </Row>
                      </>
                    ) : (
                      <Row justify="space-between">
                        <Col>IGST</Col>
                        <Col>₹{totals.igst.toFixed(2)}</Col>
                      </Row>
                    )}
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
                            setExtraCharges({
                              ...extraCharges,
                              other: val || 0,
                            })
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
        )}
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" onClick={() => form.submit()}>
          {postLoading ? (
            <span>Loading...</span>
          ) : billId ? (
            "Update Bill"
          ) : (
            "Save Bill"
          )}
        </Button>
        <Button onClick={() => navigate("/bill")}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddBill;
