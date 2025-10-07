import { Card, Row, Col, Button, Typography, Table, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";

const { Title, Text } = Typography;

const BillView = () => {
  const navigate = useNavigate();

  // Sample data for the bill
  const billData = {
    billNo: "BILL-00013",
    vendorName: "TEKTRONICS EMS PRIVATE LIMITED",
    vendorContact: "29/09/2025",
    shipTo: "Demo Infolanze, A-807, Empire Business Hub, Science City Road, Sola, Ahmedabad - 380004 (GJ) - Gujarat",
    totalAmount: "₹105",
    dueAmount: "₹105",
    items: [
      {
        key: "1",
        itemCode: "I-00001",
        modelDescription: "Item for Production Data",
        hsnSac: "8501",
        qty: 1,
        unitPrice: 100.00,
        taxRate: "5%",
        amount: 100.00,
      },
    ],
    taxes: [
      { key: "1", type: "CGST", rate: "2.50%", amount: 2.50 },
      { key: "2", type: "SGST", rate: "2.50%", amount: 2.50 },
    ],
    bank: {
      bankName: "HDFC",
      accountCode: "ACC0003",
      ifsc: "HDFC0001234",
      accountName: "Current Main",
      accountNo: "123456789013",
    },
  };

  const columns = [
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
    { title: "Model/Description", dataIndex: "modelDescription", key: "modelDescription" },
    { title: "HSN/SAC", dataIndex: "hsnSac", key: "hsnSac" },
    { title: "Qty", dataIndex: "qty", key: "qty" },
    { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },
    { title: "Tax Rate(%)", dataIndex: "taxRate", key: "taxRate" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ];

  const taxColumns = [
    { title: "HSN/SAC", dataIndex: "hsnSac", key: "hsnSac" },
    { title: "Qty", dataIndex: "qty", key: "qty" },
    { title: "Taxable Value", dataIndex: "taxableValue", key: "taxableValue" },
    { title: "CGST Rate", dataIndex: "cgstRate", key: "cgstRate" },
    { title: "CGST Amount", dataIndex: "cgstAmount", key: "cgstAmount" },
    { title: "SGST Rate", dataIndex: "sgstRate", key: "sgstRate" },
    { title: "SGST Amount", dataIndex: "sgstAmount", key: "sgstAmount" },
    { title: "Total Tax Amount", dataIndex: "totalTaxAmount", key: "totalTaxAmount" },
  ];

  const taxData = [
    {
      key: "1",
      hsnSac: "8501",
      qty: 1,
      taxableValue: 100.00,
      cgstRate: "2.50%",
      cgstAmount: 2.50,
      sgstRate: "2.50%",
      sgstAmount: 2.50,
      totalTaxAmount: 5.00,
    },
  ];

  const handleDownload = () => {
    // Logic to trigger download (e.g., generate PDF or open new page)
    alert("Download functionality to be implemented");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="shadow-md">
        {/* Header */}
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <Button
              type="text"
              onClick={() => navigate("/bills")}
              className="text-gray-600 hover:text-gray-800"
            >
              ←
            </Button>
            <Text strong>Bill Details</Text>
            <Tag color="red" className="ml-2">
              Draft - Total Amount: {billData.totalAmount} - Due Amount: {billData.dueAmount}
            </Tag>
          </Col>
          <Col>
            <Button type="primary" onClick={handleDownload} className="mr-2 bg-blue-500 hover:bg-blue-600">
              Download
            </Button>
            <Button onClick={handlePrint} className="mr-2 text-gray-600 hover:text-gray-800">
              Print
            </Button>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Card title="Basic Info" className="mb-4">
              <p><Text strong>Bill No:</Text> {billData.billNo}</p>
              <p><Text strong>Vendor Name:</Text> {billData.vendorName}</p>
              <p><Text strong>Vendor Contact No:</Text> {billData.vendorContact}</p>
              <p><Text strong>Bill Date:</Text> {billData.vendorContact}</p>
            </Card>
            <Card title="Vendor Details">
              <p>{billData.shipTo}</p>
            </Card>
            <Card title="Items" className="mt-4">
              <Table columns={columns} dataSource={billData.items} pagination={false} />
            </Card>
            <Card title="Tax Details" className="mt-4">
              <Table columns={taxColumns} dataSource={taxData} pagination={false} />
              <p className="mt-2"><Text strong>Document Total:</Text> {billData.totalAmount}</p>
            </Card>
            <Card title="Bank Details" className="mt-4">
              <p><Text strong>Bank Name:</Text> {billData.bank.bankName}</p>
              <p><Text strong>Account Code:</Text> {billData.bank.accountCode}</p>
              <p><Text strong>IFSC No:</Text> {billData.bank.ifsc}</p>
              <p><Text strong>Account Name:</Text> {billData.bank.accountName}</p>
              <p><Text strong>Account No:</Text> {billData.bank.accountNo}</p>
            </Card>
            <p className="mt-4"><Text strong>Terms & Conditions:</Text> For Demo Infolanze</p>
          </Col>
          <Col span={8}>
            <Card title="Actions" className="mb-4">
              <Button type="primary" block className="mb-2 bg-blue-500 hover:bg-blue-600">
                Mark Bill As
              </Button>
              <Button block onClick={() => navigate(`/bill/edit/${billData.billNo}`)} className="text-gray-600 hover:text-gray-800">
                Edit
              </Button>
            </Card>
            <Card title="User Detail">
              <p>Created by: Demo Infolanze</p>
              <p>Created at: 29/09/2025</p>
            </Card>
            <Card title="Other Information" className="mt-4">
              <p>Payment Terms: Due on Receipt</p>
            </Card>
            <Card title="Inventory Impact" className="mt-4">
              <p>Stock Add</p>
            </Card>
            <Card title="Other Information" className="mt-4">
              <p>Division: default</p>
              <p>Branch: default</p>
              <p>Warehouse: default</p>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BillView;