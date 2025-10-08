import { Card, Row, Col, Button, Spin, Typography, Table } from "antd";
import Icons from "../../assets/icon";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBillById } from "../../redux/slice/bill/billSlice";
import { getCompany } from "../../redux/slice/company/companySlice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";

const { Title, Text } = Typography;

const BillView = () => {
  const navigate = useNavigate();
  const { billId } = useParams();
  const dispatch = useDispatch();
  const { companyId } = useSelector((state) => state.auth);
  const { bill, loading: billLoading, error: billError } = useSelector(
    (state) => state.bill
  ); // Changed from bills to bill
  const {
    companyData: company,
    loading: companyLoading,
    error: companyError,
  } = useSelector((state) => state.company);

  useEffect(() => {
    if (companyId && billId) {
      dispatch(getBillById({ billId, companyId }));
      dispatch(getCompany(companyId));
    }
  }, [dispatch, billId, companyId]);

  const handleDownload = () => {
    const input = document.getElementById("bill-download-section");
    if (!input) {
      console.error("Element with ID 'bill-download-section' not found.");
      return;
    }

    const originalStyles = {};
    const elements = input.querySelectorAll("*");
    elements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el);
      originalStyles[el] = {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
      };
      if (computedStyle.backgroundColor.includes("oklch")) {
        el.style.backgroundColor = "#ffffff";
      }
      if (computedStyle.color.includes("oklch")) {
        el.style.color = "#000000";
      }
    });

    const originalWidth = input.style.width;
    const originalHeight = input.style.height;
    input.style.width = "210mm";
    input.style.height = ""; // Let content determine height
    input.style.overflow = "hidden";

    html2canvas(input, {
      scale: 2,
      useCors: true,
      logging: true,
      windowWidth: 210,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = 210;
      const pdfHeight = 297;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      position -= 297;

      const contentHeight = canvas.height / 2; // Adjust for scale
      const pagesNeeded = Math.ceil(contentHeight / pdfHeight);

      if (pagesNeeded > 1) {
        for (let i = 1; i < pagesNeeded; i++) {
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
          position -= 297;
        }
      }

      elements.forEach((el) => {
        if (originalStyles[el]) {
          el.style.backgroundColor = originalStyles[el].backgroundColor;
          el.style.color = originalStyles[el].color;
        }
      });
      input.style.width = originalWidth;
      input.style.height = originalHeight;
      input.style.overflow = "";

      pdf.save(`bill-${bill?.billNumber || "Bill"}.pdf`);
    }).catch((error) => {
      console.error("Error in html2canvas or jsPDF:", error);
      elements.forEach((el) => {
        if (originalStyles[el]) {
          el.style.backgroundColor = originalStyles[el].backgroundColor;
          el.style.color = originalStyles[el].color;
        }
      });
      input.style.width = originalWidth;
      input.style.height = originalHeight;
      input.style.overflow = "";
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Item Code",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "HSN/SAC",
      dataIndex: "hsnCode",
      key: "hsnCode",
    },
    {
      title: "Qty",
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
      title: "Tax Rate(%)",
      dataIndex: "taxRate",
      key: "taxRate",
      render: (value) => `${value}%`,
    },
    {
      title: "Amount",
      dataIndex: "lineTotal",
      key: "lineTotal",
      render: (value) => `₹${value.toFixed(2)}`,
    },
  ];

  const taxSummary = [
    {
      hsnSac: bill?.items[0]?.hsnCode || "",
      quantity: bill?.items[0]?.quantity || 0,
      taxableValue: bill?.totals?.subtotal || 0,
      cgstTax: {
        rate:
          bill?.totals?.cgst > 0
            ? (bill.totals.cgst / (bill.totals.subtotal / 100)).toFixed(2)
            : 0,
        amount: bill?.totals?.cgst || 0,
      },
      sgstTax: {
        rate:
          bill?.totals?.sgst > 0
            ? (bill.totals.sgst / (bill.totals.subtotal / 100)).toFixed(2)
            : 0,
        amount: bill?.totals?.sgst || 0,
      },
      totalTax: bill?.totals?.totalTax || 0,
    },
    {
      hsnSac: "Total",
      quantity:
        bill?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
      taxableValue: bill?.totals?.subtotal || 0,
      cgstTax: { rate: "", amount: bill?.totals?.cgst || 0 },
      sgstTax: { rate: "", amount: bill?.totals?.sgst || 0 },
      totalTax: bill?.totals?.totalTax || 0,
    },
  ];

  if (billLoading || companyLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (billError || companyError) {
    return (
      <div className="text-center text-red-500">
        Error: {billError || companyError}
      </div>
    );
  }

  if (!bill || !company) {
    return <div className="text-center">No data found.</div>;
  }

  return (
    <div className="p-4 bg-gray-100 !space-y-4">
      {/* Header Card */}
      <div className="p-3 bg-white shadow-lg rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<Icons.ArrowLeftOutlined />}
            onClick={() => navigate("/bills")}
          />
          <div className="text-xl font-semibold">Bill #{bill.billNumber}</div>
        </div>
      </div>

      {/* Downloadable Bill Section */}
      <div className="grid grid-cols-5 gap-x-4">
        <div
          id="bill-download-section"
          className="bg-white p-5 rounded-lg shadow-lg !w-full col-span-4"
        >
          <div className="border p-4 rounded-md">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold border-b border-black pb-2">
                  Tax Bill
                </h2>
                <table className="mt-2">
                  <tr>
                    <td className="pr-4">Bill No</td>
                    <td>: {bill.billNumber}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Vendor Code</td>
                    <td>: {bill.vendorId._id}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Vendor Name</td>
                    <td>: {bill.vendorName}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Vendor Contact No</td>
                    <td>: {bill.vendorId.contactPerson || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Date</td>
                    <td>: {moment(bill.billDate).format("DD/MM/YYYY")}</td>
                  </tr>
                </table>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {company.companyName || "ABSS"}
                </div>
                <p>
                  {company.address?.street1 || "A-807, Empire Business Hub"}
                  <br />
                  {company.address?.street2 || "Science City Road, Sola"}
                  <br />
                  {company.address?.city || "Ahmedabad"}, [
                  {company.address?.state || "GJ"}] -{" "}
                  {company.address?.pinCode || "360004"}
                  <br />
                  GSTIN: {company.gstNo || "27ABCDE1234F1Z5"}
                  <br />
                  PAN No: {company.panNo || "BJPFC1243E"}
                  <br />
                  Contact No: {bill.vendorId.contactPerson || "7229028694"}
                </p>
              </div>
            </div>
            <div className="mb-6">
              <table className="w-full">
                <tr>
                  <td className="border border-black p-2">
                    Bill To
                    <br />
                    {bill.vendorName}
                    <br />
                    {bill.vendorId.name || bill.vendorId.contactPerson}
                  </td>
                  <td className="border border-black p-2">
                    Ship To
                    <br />
                    {bill.vendorName}
                    <br />
                    {bill.vendorId.name || bill.vendorId.contactPerson}
                  </td>
                  <td className="border border-black p-2">
                    Other Information
                    <br />
                    Payment Terms: {bill.paymentTerms.paymentTerms || "Due On Receipt"}
                  </td>
                </tr>
              </table>
            </div>
            <div className="mb-6">
              <Table
                columns={columns}
                dataSource={bill.items}
                pagination={false}
                bordered
                rowKey="itemId"
              />
            </div>
            <div className="mb-6 flex">
              <table className="border-collapse mr-2">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-black p-2">HSN/SAC</th>
                    <th className="border border-black p-2">Qty</th>
                    <th className="border border-black p-2">Taxable value</th>
                    <th className="border border-black p-2">CGST Tax</th>
                    <th className="border border-black p-2">SGST Tax</th>
                    <th className="border border-black p-2">Total Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {taxSummary.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-black p-2">{item.hsnSac}</td>
                      <td className="border border-black p-2">{item.quantity}</td>
                      <td className="border border-black p-2">
                        ₹{item.taxableValue.toFixed(2)}
                      </td>
                      <td className="border border-black p-2">
                        Rate: {item.cgstTax.rate}%
                        {item.cgstTax.rate ? <br /> : ""}Amount: ₹
                        {item.cgstTax.amount.toFixed(2)}
                      </td>
                      <td className="border border-black p-2">
                        Rate: {item.sgstTax.rate}%
                        {item.sgstTax.rate ? <br /> : ""}Amount: ₹
                        {item.sgstTax.amount.toFixed(2)}
                      </td>
                      <td className="border border-black p-2">
                        ₹{item.totalTax.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="w-1/2 border-collapse">
                <tbody>
                  <tr>
                    <td className="border border-black p-2">Basic Amount</td>
                    <td className="border border-black p-2">
                      ₹{bill.totals.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2">CGST</td>
                    <td className="border border-black p-2">
                      ₹{bill.totals.cgst.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2">SGST</td>
                    <td className="border border-black p-2">
                      ₹{bill.totals.sgst.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2">Total Tax</td>
                    <td className="border border-black p-2">
                      ₹{bill.totals.totalTax.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2">Document Total</td>
                    <td className="border border-black p-2">
                      ₹{bill.totals.grandTotal.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between">
              <div className="">
                <p>
                  Terms & Conditions:
                  <br />
                  {company.termsAndConditions || bill.termsAndConditions || "1) Advance Payment"}
                </p>
              </div>
              <div className="text-end">
                <p>For {company.companyName}</p>
                <div className="text-2xl font-bold">{company.companyName}</div>
                <p className="mt-2">Authorized Signatory</p>
              </div>
            </div>
          </div>
          <p className="pt-5 px-5">Powered by ABSS</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg h-max !space-y-3 col-span-1">
          <Button type="primary" onClick={handleDownload} className="w-full">
            Download PDF
          </Button>
          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/bill/edit/${billId}`)}
            className="bg-blue-500 hover:bg-blue-600 w-full"
          >
            Edit
          </Button>
          <Button
            onClick={() => navigate("/bill")}
            className="border-gray-300 w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillView;