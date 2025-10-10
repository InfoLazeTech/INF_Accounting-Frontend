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
  const {
    bill,
    loading: billLoading,
    error: billError,
  } = useSelector((state) => state.bill); 
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
    const originalOverflow = input.style.overflow;
    input.style.width = "210mm";
    input.style.height = "auto";
    input.style.overflow = "visible";
    html2canvas(input, {
       scale: 3,
      useCORS: true,
      logging: true,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        while (heightLeft > 0) {
          pdf.addPage();
          position = -(imgHeight - heightLeft);
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        // Restore original styles and dimensions
        elements.forEach((el) => {
          if (originalStyles[el]) {
            el.style.backgroundColor = originalStyles[el].backgroundColor;
            el.style.color = originalStyles[el].color;
          }
        });
        input.style.width = originalWidth;
        input.style.height = originalHeight;
        input.style.overflow = originalOverflow;

        pdf.save(`bill-${bill?.billNumber || "Bill"}.pdf`);
      })
      .catch((error) => {
        console.error("Error in html2canvas or jsPDF:", error);
        // Restore styles and dimensions on error
        elements.forEach((el) => {
          if (originalStyles[el]) {
            el.style.backgroundColor = originalStyles[el].backgroundColor;
            el.style.color = originalStyles[el].color;
          }
        });
        input.style.width = originalWidth;
        input.style.height = originalHeight;
        input.style.overflow = originalOverflow;
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
  const isInterState =
    (bill?.totals?.igst > 0) ||
    (bill?.totals?.totalTax > 0 && bill?.totals?.sgst === 0 && bill?.totals?.cgst === 0) ||
    (bill?.vendorId?.address?.state &&
      company?.address?.state &&
      bill.vendorId.address.state !== company.address.state);
  const taxSummary = bill?.items?.length
    ? [
        ...Object.values(
          bill.items.reduce((acc, item) => {
            const hsnSac = item.hsnCode;
            if (!acc[hsnSac]) {
              acc[hsnSac] = {
                hsnSac,
                quantity: 0,
                taxableValue: 0,
                cgstTax: isInterState
                  ? { rate: "", amount: 0 }
                  : { rate: item.taxRate / 2, amount: 0 },
                sgstTax: isInterState
                  ? { rate: "", amount: 0 }
                  : { rate: item.taxRate / 2, amount: 0 },
                igstTax: isInterState
                  ? { rate: item.taxRate, amount: 0 }
                  : { rate: "", amount: 0 },
                totalTax: 0,
              };
            }
            acc[hsnSac].quantity += item.quantity;
            acc[hsnSac].taxableValue += item.lineTotal;
            if (isInterState) {
              acc[hsnSac].igstTax.amount +=
                (item.lineTotal * item.taxRate) / 100;
            } else {
              acc[hsnSac].cgstTax.amount +=
                (item.lineTotal * item.taxRate) / 200;
              acc[hsnSac].sgstTax.amount +=
                (item.lineTotal * item.taxRate) / 200;
            }
            acc[hsnSac].totalTax += (item.lineTotal * item.taxRate) / 100;
            return acc;
          }, {})
        ),
        {
          hsnSac: "Total",
          quantity:
            bill.items.reduce((sum, item) => sum + (item.quantity || 0), 0) ||
            0,
          taxableValue: bill?.totals?.subtotal || 0,
          cgstTax: isInterState
            ? { rate: "", amount: 0 }
            : { rate: "", amount: bill?.totals?.cgst || 0 },
          sgstTax: isInterState
            ? { rate: "", amount: 0 }
            : { rate: "", amount: bill?.totals?.sgst || 0 },
          igstTax: isInterState
            ? { rate: "", amount: bill?.totals?.totalTax || 0 }
            : { rate: "", amount: 0 },
          totalTax: bill?.totals?.totalTax || 0,
        },
      ]
    : [];

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
                  <img className="h-20 w-60" src={company.logo} alt="" />
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
                  <td className="border border-[#e9e9e9] p-2">
                  <span className="font-semibold">Bill To:</span>
                    <br />
                    {bill.vendorName}
                    <br />
                    {bill.vendorId.address?.street || "N/A"},{" "}
                    {bill.vendorId.address?.city || "N/A"}
                  </td>
                  <td className="border border-[#e9e9e9] p-2">
                     <span className="font-semibold">Ship To:</span>
                    <br />
                    {bill.vendorName}
                    <br />
                    {bill.vendorId.address?.street || "N/A"},{" "}
                    {bill.vendorId.address?.city || "N/A"}
                  </td>
                  <td className="border border-[#e9e9e9] p-2">
                  <span className="font-semibold ">Other Information:</span>
                    <br />
                    Payment Terms:{" "}
                    {bill.paymentTerms?.paymentTerms || "Due On Receipt"}
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
              <table className="border-collapse  w-2/3 mr-2 border border-[#e9e9e9]">
                <thead>
                  <tr className="bg-[#fafafa]">
                    <th className="border border-[#e9e9e9] p-1  relative text-xs" rowSpan="2">
                      HSN/SAC
                    </th>
                    <th className="border border-[#e9e9e9] p-1  relative text-xs"rowSpan="2">Qty</th>
                    <th className="border border-[#e9e9e9] p-1 relative text-xs" rowSpan="2">
                      Taxable value
                    </th>
                   {isInterState ? (
                      <th
                        className="border border-[#e9e9e9] p-1  text-xs "
                        colSpan="2"
                      >
                        IGST{" "}
                      </th>
                    ) : (
                      <>
                        <th
                          className="border border-[#e9e9e9] p-1  text-xs "
                          colSpan="2"
                        >
                          CGST{" "}
                        </th>

                        <th
                          className="border border-[#e9e9e9] p-1  text-xs "
                          colSpan="2"
                        >
                          SGST{" "}
                        </th>
                      </>
                    )}
                    <th
                      className="border border-[#e9e9e9] p-1 relative text-xs "
                      rowSpan="2"
                    >
                      Total Tax
                    </th>
                  </tr>
                  <tr className="bg-[#fafafa]">
                    {isInterState ? (
                      <>
                        <th className="border border-[#e9e9e9] p-1 text-xs ">
                          Rate
                        </th>
                        <th className="border border-[#e9e9e9] p-1 text-xs ">
                          Amount
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="border border-[#e9e9e9] p-1 text-xs ">
                          Rate
                        </th>
                        <th className="border border-[#e9e9e9] p-1 text-xs ">
                          Amount
                        </th>
                        <th className="border border-[#e9e9e9] p-1 text-xs ">
                          Rate
                        </th>
                        <th className="border border-[#e9e9e9] p-1 text-xs ">
                          Amount
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {taxSummary.map((item, index) => (
                    <tr key={index} className="border border-[#e9e9e9]">
                      <td className="border border-[#e9e9e9] p-1 text-xs">
                        {item.hsnSac}
                      </td>
                      <td className="border border-[#e9e9e9] p-1 text-xs">
                        {item.quantity}
                      </td>
                      <td className="border border-[#e9e9e9] p-1 text-xs">
                        ₹{item.taxableValue.toFixed(2)}
                      </td>
                      {isInterState ? (
                        <>
                          <td className="border border-[#e9e9e9] p-1 text-xs">
                            {item.igstTax.rate}%
                          </td>
                          <td className="border border-[#e9e9e9] p-1 text-xs">
                            ₹{item.igstTax.amount.toFixed(2)}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border border-[#e9e9e9] p-1 text-xs">
                            {item.cgstTax.rate}%
                          </td>
                          <td className="border border-[#e9e9e9] p-1 text-xs">
                            ₹{item.cgstTax.amount.toFixed(2)}
                          </td>
                          <td className="border border-[#e9e9e9] p-1 text-xs">
                            {item.sgstTax.rate}%
                          </td>
                          <td className="border border-[#e9e9e9] p-1 text-xs">
                            ₹{item.sgstTax.amount.toFixed(2)}
                          </td>
                        </>
                      )}
                      <td className="border border-[#e9e9e9] p-1 text-xs">
                        ₹{item.totalTax.toFixed(2)}
                      </td>
                    </tr>
                  ))} 
                </tbody>
              </table>
              <table className="border-collapse  w-1/3">
                <tbody className="border border-[#e9e9e9]">
                  <tr>
                    <th className="border border-[#e9e9e9] bg-[#fafafa] p-1 text-xs">
                      Basic Amount
                    </th>
                    <td className="border border-[#e9e9e9] p-1 text-xs">
                      ₹{bill.totals.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  {isInterState ? (
                    <tr>
                      <th className="border border-[#e9e9e9] bg-[#fafafa] p-1 text-xs">
                        IGST
                      </th>
                      <td className="border border-[#e9e9e9] p-1 text-xs">
                        ₹{(bill.totals.totalTax || 0).toFixed(2)}
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr>
                        <th className="border border-[#e9e9e9] bg-[#fafafa] p-1 text-xs">
                          CGST
                        </th>
                        <td className="border border-[#e9e9e9] p-1 text-xs">
                          ₹{(bill.totals.cgst || 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <th className="border border-[#e9e9e9] bg-[#fafafa] p-1 text-xs">
                          SGST
                        </th>
                        <td className="border border-[#e9e9e9] p-1 text-xs">
                          ₹{(bill.totals.sgst || 0).toFixed(2)}
                        </td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <th className="border border-[#e9e9e9] bg-[#fafafa] p-1 text-xs">
                      Total Tax
                    </th>
                    <td className="border border-[#e9e9e9] p-1 text-xs">
                      ₹{bill.totals.totalTax.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-[#e9e9e9] bg-[#fafafa] p-1 text-xs">
                      Document Total
                    </th>
                    <td className="border border-[#e9e9e9] p-1 text-xs">
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
                  {company.termsAndConditions ||
                    bill.termsAndConditions ||
                    "1) Advance Payment"}
                </p>
              </div>
              <div className="text-end">
                <p>For {company.companyName}</p>
                <div className="text-2xl font-bold">
                  <img className="h-20 w-40" src={company.signature} alt="" />
                </div>
                <p className="mt-2">Authorized Signatory</p>
              </div>
            </div>
          </div>
          <p className="pt-5 px-5">Powered by INF</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg h-max !space-y-3">
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
