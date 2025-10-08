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
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addInvoice,
  getInvoiceById,
} from "../../redux/slice/invoice/invoiceSlice";
import { getCustomersVendors } from "../../redux/slice/customer/customerVendorSlice";
import { getItem } from "../../redux/slice/item/itemSlice";
import { getCompany } from "../../redux/slice/company/companySlice";

const { Title } = Typography;

const AddInvoice = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { invoiceId } = useParams();
  const { postLoading } = useSelector((state) => state.invoice);
  const { invoice, loading: invoiceLoading } = useSelector(
    (state) => state.invoice
  );
  const { customers, loading: customerLoading } = useSelector(
    (state) => state.customerVendor
  );
  const { items: itemList, loading: itemLoading } = useSelector(
    (state) => state.item
  );
  const { companyData } = useSelector((state) => state.company);
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
  const [customerState, setCustomerState] = useState("");
  const [companyState, setCompanyState] = useState("");
  const [isSameState, setIsSameState] = useState(true);
  useEffect(() => {
    dispatch(getCustomersVendors({ companyId }));
    dispatch(getItem({ companyId }));
    dispatch(getCompany(companyId));
    if (invoiceId) {
      dispatch(getInvoiceById({ companyId, invoiceId }));
    }
  }, [dispatch, companyId, invoiceId]);
  useEffect(() => {
    if (companyData) {
      setCompanyState(companyData.address?.state || "");
    }
  }, [companyData]);

  useEffect(() => {
    if (invoiceId && invoice && !invoiceLoading) {
      form.setFieldsValue({
        customerId: invoice.customerId?._id,
        customerName: invoice.customerId?.name,
        invoiceDate: invoice.invoiceDate ? dayjs(invoice.invoiceDate) : null,
        dueDate: invoice.dueDate ? dayjs(invoice.dueDate) : null,
        paymentMethod: invoice.paymentTerms?.paymentMethod,
        paymentTerms: invoice.paymentTerms?.paymentTerms,
        paymentNotes: invoice.paymentTerms?.notes,
        customerNotes: invoice.deliveryNotes,
        termsConditions: invoice.termsAndConditions,
      });
      setItems(
        invoice.items.map((item, index) => ({
          id: Date.now() + index,
          itemId: item.itemId,
          name: item.itemName,
          hsnCode: item.hsnCode || "",
          sku: item.sku || "",
          description: item.description || "",
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          taxRate: item.taxRate || 0,
            lineTotal: item.quantity * item.unitPrice,
        }))
      );
      setExtraCharges({
        shipping: invoice.totals?.shippingCharges || 0,
        other: invoice.totals?.otherCharges || 0,
      });
    } else {
      form.setFieldsValue({
        customerName: "",
      });
    }
  }, [invoice, invoiceLoading, invoiceId, form]);
  useEffect(() => {
    if (customerState && companyState) {
      setIsSameState(customerState === companyState);
    }
  }, [customerState, companyState]);
  // When item is selected
  const handleItemSelect = (value, index) => {
    const selected = itemList.find((i) => i._id === value);
    if (!selected) return;
    const updated = [...items];
    const subtotal = 1 * (selected.salePrice || 0); // Quantity = 1 initially
    // const tax = (subtotal * (selected.taxRate || 0)) / 100;
    updated[index] = {
      ...updated[index],
      itemId: selected._id,
      name: selected.name,
      hsnCode: selected.hsnCode || "",
      sku: selected.sku || "",
      description: selected.description || "",
      unitPrice: selected.salePrice || 0,
      taxRate: selected.taxRate || 0,
      quantity: 1,
      discount: 0,
      lineTotal: subtotal ,
    };
    setItems(updated);
  };

  // When Customer is selected
  const handleCustomerSelect = (value) => {
    const selected = customers.find((c) => c._id === value);
    console.log("selected", selected);

    if (!selected) return;
    form.setFieldsValue({
      // customerId: selected._id,
      customerName: selected.companyName,
    });
    setCustomerState(
      selected.billingAddress?.state || selected.shippingAddress?.state || ""
    );
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
    updated[index].lineTotal = subtotal ;
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
      acc.subtotal += subtotal;
      acc.totalDiscount += discount;
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
      totalDiscount: 0,
      grandTotal: 0,
    }
  );

  const finalGrandTotal =
    totals.grandTotal +
    Number(extraCharges.shipping) +
    Number(extraCharges.other);

  const onFinish = async (values) => {
    try {
      const selectedCustomer = customers.find(
        (c) => c._id === values.customerId
      );
      if (!selectedCustomer) {
        console.error(
          "Selected customer not found. Customers:",
          customers,
          "Customer ID:",
          values.customerId
        );
        message.error("Selected customer not found");
        return;
      }
      const address =
        selectedCustomer.billingAddress ||
        selectedCustomer.shippingAddress ||
        {};
      if (!address.street || !address.city || !address.state || !address.zip) {
        console.error("Customer address is incomplete:", address);
        message.error(
          "Customer address is incomplete. Please update customer details."
        );
        return;
      }
      const payload = {
        companyId,
        customerId: values.customerId,
        customerName: values.customerName,
        customerContact: {
          email: selectedCustomer?.email || "",
          phone: selectedCustomer?.phone || "",
          alternatePhone: selectedCustomer?.alternatePhone || "",
        },
        customerAddress: {
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.zip,
          country: address.country || "India",
        },
        invoiceDate: values.invoiceDate
          ? dayjs(values.invoiceDate).toISOString()
          : dayjs().toISOString(),
        dueDate: values.dueDate
          ? dayjs(values.dueDate).toISOString()
          : undefined,
        referenceNumber: "",
        description: "",
        items: items.map((item) => ({
          itemId: item.itemId,
          itemName: item.name,
          hsnCode: item.hsnCode,
          sku: item.sku,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          discountType: "amount",
          taxRate: item.taxRate,
          lineTotal: item.lineTotal,
        })),
        totals: {
          subtotal: totals.subtotal,
          totalDiscount: totals.totalDiscount,
          sgst: totals.sgst,
          cgst: totals.cgst,
          igst: totals.igst || 0,
          totalTax: totals.totalTax,
          shippingCharges: extraCharges.shipping,
          otherCharges: extraCharges.other,
          grandTotal: finalGrandTotal,
        },
        paymentTerms: {
          dueDate: values.dueDate
            ? dayjs(values.dueDate).toISOString()
            : undefined,
          paymentMethod: values.paymentMethod || "bank_transfer",
          paymentTerms: values.paymentTerms || "Net 30",
          notes: values.paymentNotes || "",
        },
        status: "draft",
        paymentStatus: "unpaid",
        receivedAmount: 0,
        remainingAmount: finalGrandTotal,
        deliveryDate: undefined,
        deliveryAddress: {
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.zip,
          country: address.country || "India",
        },
        deliveryNotes: values.customerNotes || "",
        termsAndConditions: values.termsConditions || "",
        attachments: [],
      };
      console.log("Submitting payload:", payload);

      await dispatch(addInvoice(payload)).unwrap();
      message.success("Invoice created successfully");
      navigate("/invoice");
    } catch (err) {
      console.error("Error submitting invoice:", err);
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
    // {
    //   title: "Discount",
    //   dataIndex: "discount",
    //   render: (_, record, index) => (
    //     <InputNumber
    //       min={0}
    //       value={record.discount}
    //       onChange={(val) => handleItemChange(index, "discount", val)}
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
              {invoiceId ? "Edit Invoice" : "Add Invoice"}
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
              <CustomInput
                type="select"
                name="customerId"
                label="Customer Name"
                placeholder="Select Customer"
                options={customers.map((customer) => ({
                  value: customer._id,
                  label: customer.companyName,
                }))}
                onChange={handleCustomerSelect}
                showSearch
                optionFilterProp="label"
                loading={customerLoading}
                rules={[
                  { required: true, message: "Please select a customer" },
                ]}
              />
            </Col>

            <Col span={8}>
              <CustomInput
                type="date"
                name="invoiceDate"
                label="Invoice Date"
                placeholder="Select invoice date"
                format="YYYY-MM-DD"
                rules={[
                  { required: true, message: "Please select an invoice date" },
                ]}
              />
            </Col>

            <Col span={8}>
              <CustomInput
                type="date"
                name="dueDate"
                label="Due Date"
                placeholder="Select due date"
                format="YYYY-MM-DD"
                rules={[
                  { required: true, message: "Please select a due date" },
                ]}
              />
            </Col>
            <Col span={8}>
              <Form.Item name="customerName" className="hidden" />
            </Col>
          </Row>

          <Title level={4}>Payment Information</Title>
          <Row gutter={16}>
            <Col span={8}>
              <CustomInput
                type="select"
                name="paymentMethod"
                label="Payment Method"
                placeholder="Select payment method"
                rules={[
                  { required: true, message: "Please select a payment method" },
                ]}
                options={[
                  { value: "cash", label: "Cash" },
                  { value: "bank_transfer", label: "Bank Transfer" },
                  { value: "cheque", label: "Cheque" },
                  { value: "card", label: "Card" },
                  { value: "upi", label: "UPI" },
                  { value: "other", label: "Other" },
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
                  { value: "Prepaid", label: "Prepaid" },
                  { value: "Net 15", label: "Net 15" },
                  { value: "Net 30", label: "Net 30" },
                  { value: "Custom", label: "Custom" },
                ]}
                rules={[
                  { required: true, message: "Please select payment terms" },
                ]}
              />
            </Col>
            <Col span={8}>
              <CustomInput
                type="textarea"
                name="paymentNotes"
                label="Payment Notes"
                placeholder="Enter payment notes"
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
                    <Col>₹{totals.totalDiscount.toFixed(2)}</Col>
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
        <Button
          type="primary"
          onClick={() => form.submit()}
          loading={postLoading}
        >
          {invoiceId ? "Update Invoice" : "Save Invoice"}
        </Button>
        <Button onClick={() => navigate("/invoice")}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddInvoice;
