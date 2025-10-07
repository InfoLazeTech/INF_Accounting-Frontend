import { Card, Row, Col, Button, Spin, Typography, Descriptions, Table, Divider } from "antd";
import Icons from "../../assets/icon"; // Ensure this is correctly set up
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getInvoiceById } from "../../redux/slice/invoice/invoiceSlice"; // Adjust path as needed
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";

const { Title, Text } = Typography;

const InvoiceView = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const dispatch = useDispatch();
    const { companyId } = useSelector((state) => state.auth);
  const { invoice, loading, error } = useSelector((state) => state.invoice);

  // Fetch invoice data on mount
  useEffect(() => {
    dispatch(getInvoiceById({ invoiceId, companyId}));
  }, [dispatch, invoiceId]);

  // Handle PDF download
  const handleDownload = () => {
    const input = document.getElementById("invoice-download-section");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${invoice?.invoiceNumber || "INV"}.pdf`);
    });
  };

  // Table columns for items
  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (value) => `₹${value.toFixed(2)}`,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (value, record) => `${value}${record.discountType === "percentage" ? "%" : "₹"}`,
    },
    {
      title: "Tax Rate",
      dataIndex: "taxRate",
      key: "taxRate",
      render: (value) => `${value}%`,
    },
    {
      title: "Line Total",
      dataIndex: "lineTotal",
      key: "lineTotal",
      render: (value) => `₹${value.toFixed(2)}`,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center">
        No invoice data found.
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Header Card */}
      <Card className="p-4 m-4 shadow-lg rounded-lg">
        <Row align="middle" justify="space-between">
          <Col>
            <Row align="middle" gutter={8}>
              <Col>
                <Button
                  type="text"
                  icon={<Icons.ArrowLeftOutlined />}
                  onClick={() => navigate("/invoice")}
                />
              </Col>
              <Col>
                <Title level={4} className="mb-0">
                  Invoice #{invoice.invoiceNumber}
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
                  onClick={() => navigate(`/invoice/edit/${invoiceId}`)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Edit
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => navigate("/invoice")}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Download PDF
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Downloadable Invoice Section */}
      <div id="invoice-download-section" className="bg-white p-8 m-4 rounded-lg shadow-lg">
        <Row justify="space-between" className="mb-6">
          <Col>
            <Title level={3} className="mb-2">Invoice</Title>
            <Text strong>Invoice Number: </Text>
            <Text>{invoice.invoiceNumber}</Text>
            <br />
            <Text strong>Company: </Text>
            <Text>{invoice.companyId.companyName}</Text>
          </Col>
          <Col>
            <Text strong>Invoice Date: </Text>
            <Text>{moment(invoice.invoiceDate).format("DD MMM YYYY")}</Text>
            <br />
            <Text strong>Due Date: </Text>
            <Text>{moment(invoice.dueDate).format("DD MMM YYYY")}</Text>
            <br />
            <Text strong>Status: </Text>
            <Text className={invoice.status === "draft" ? "text-yellow-500" : "text-green-500"}>
              {invoice.status.toUpperCase()}
            </Text>
            <br />
            <Text strong>Payment Status: </Text>
            <Text className={invoice.paymentStatus === "unpaid" ? "text-red-500" : "text-green-500"}>
              {invoice.paymentStatus.toUpperCase()}
            </Text>
          </Col>
        </Row>

        <Divider />

        {/* Customer Information */}
        <Descriptions
          title="Customer Information"
          bordered
          column={1}
          className="mb-6"
          labelStyle={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
        >
          <Descriptions.Item label="Customer Name">{invoice.customerName}</Descriptions.Item>
          <Descriptions.Item label="Contact Person">{invoice.customerId.contactPerson}</Descriptions.Item>
          <Descriptions.Item label="Email">{invoice.customerId.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{invoice.customerId.phone}</Descriptions.Item>
          <Descriptions.Item label="Delivery Address">
            {`${invoice.deliveryAddress.street}, ${invoice.deliveryAddress.city}, ${invoice.deliveryAddress.state}, ${invoice.deliveryAddress.pincode}, ${invoice.deliveryAddress.country}`}
          </Descriptions.Item>
        </Descriptions>

        {/* Items Table */}
        <Table
          columns={columns}
          dataSource={invoice.items}
          pagination={false}
          className="mb-6"
          rowKey="itemId"
          bordered
          title={() => <Title level={5}>Items</Title>}
        />

        {/* Totals */}
        <Row justify="end" className="mb-6">
          <Col span={12}>
            <Descriptions
              bordered
              column={1}
              labelStyle={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
            >
              <Descriptions.Item label="Subtotal">₹{invoice.totals.subtotal.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Total Discount">₹{invoice.totals.totalDiscount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="SGST">₹{invoice.totals.sgst.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="CGST">₹{invoice.totals.cgst.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="IGST">₹{invoice.totals.igst.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Total Tax">₹{invoice.totals.totalTax.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Shipping Charges">₹{invoice.totals.shippingCharges.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Other Charges">₹{invoice.totals.otherCharges.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Grand Total">
                <Text strong className="text-lg">₹{invoice.totals.grandTotal.toFixed(2)}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        {/* Payment Terms and Notes */}
        <Descriptions
          title="Payment Terms & Notes"
          bordered
          column={1}
          labelStyle={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
        >
          <Descriptions.Item label="Payment Method">{invoice.paymentTerms.paymentMethod.replace("_", " ").toUpperCase()}</Descriptions.Item>
          <Descriptions.Item label="Payment Terms">{invoice.paymentTerms.paymentTerms}</Descriptions.Item>
          <Descriptions.Item label="Notes">{invoice.paymentTerms.notes}</Descriptions.Item>
          <Descriptions.Item label="Delivery Notes">{invoice.deliveryNotes}</Descriptions.Item>
          <Descriptions.Item label="Terms & Conditions">{invoice.termsAndConditions}</Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};

export default InvoiceView;