import React from 'react';

const PdfViewer = () => {
  return (
    <div className="w-[800px] mx-auto border border-black p-5 bg-white">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-xl font-bold border-b border-black pb-2">Tax Invoice</h2>
          <table className="mt-2">
            <tr><td className="pr-4">Invoice No</td><td>: INV-00015</td></tr>
            <tr><td className="pr-4">Cust. Code</td><td>: 000</td></tr>
            <tr><td className="pr-4">Cust. Name</td><td>: MEET AGARWAL</td></tr>
            <tr><td className="pr-4">Cust. Contact No</td><td>: 1234567890</td></tr>
            <tr><td className="pr-4">Date</td><td>: 29/08/2025</td></tr>
          </table>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">ABSS</div>
          <p>A-807, Empire Business Hub<br />Science City Road, Sola<br />Ahmedabad, [GJ] - Gujarat, India - 360004<br />GSTIN: 27ABCDE1234F1Z5<br />PAN No: BJPFC1243E<br />Contact No: 7229028694</p>
        </div>
      </div>
      <div className="mb-5">
        <table className="w-full">
          <tr>
            <td className="border border-black p-2">Bill To<br />Infolanze<br />...</td>
            <td className="border border-black p-2">Ship To<br />Infolanze</td>
            <td className="border border-black p-2">Other Information<br />Payment Terms: Due On Receipt</td>
          </tr>
        </table>
      </div>
      <div className="mb-5">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-2">#</th>
              <th className="border border-black p-2">Item Code</th>
              <th className="border border-black p-2">Description</th>
              <th className="border border-black p-2">HSN/SAC</th>
              <th className="border border-black p-2">Qty</th>
              <th className="border border-black p-2">Unit Price</th>
              <th className="border border-black p-2">Tax Rate(%)</th>
              <th className="border border-black p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">1</td>
              <td className="border border-black p-2">fg00004</td>
              <td className="border border-black p-2">Fan Cell</td>
              <td className="border border-black p-2">85340000</td>
              <td className="border border-black p-2">50</td>
              <td className="border border-black p-2">200.00</td>
              <td className="border border-black p-2">12%</td>
              <td className="border border-black p-2">10000.00</td>
            </tr>
            <tr>
              <td className="border border-black p-2" colSpan="7">Total</td>
              <td className="border border-black p-2">10000.00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-5 flex">
        <table className="w-1/2 border-collapse mr-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-2">HSN/SAC</th>
              <th className="border border-black p-2">Qty</th>
              <th className="border border-black p-2">Taxable value</th>
              <th className="border border-black p-2">CGST Tax</th>
              <th className="border border-black p-2">SGST Tax</th>
              <th className="border border-black p-2">Total Tax Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">85340000</td>
              <td className="border border-black p-2">50</td>
              <td className="border border-black p-2">10000.00</td>
              <td className="border border-black p-2">Rate: 6%<br />Amount: 600.00</td>
              <td className="border border-black p-2">Rate: 6%<br />Amount: 600.00</td>
              <td className="border border-black p-2">1200.00</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Total</td>
              <td className="border border-black p-2">50</td>
              <td className="border border-black p-2">10000.00</td>
              <td className="border border-black p-2">600.00</td>
              <td className="border border-black p-2">600.00</td>
              <td className="border border-black p-2">1200.00</td>
            </tr>
          </tbody>
        </table>
        <table className="w-1/2 border-collapse">
          <tbody>
            <tr><td className="border border-black p-2">Basic Amount</td><td className="border border-black p-2">10000.00</td></tr>
            <tr><td className="border border-black p-2">CGST</td><td className="border border-black p-2">600.00</td></tr>
            <tr><td className="border border-black p-2">SGST</td><td className="border border-black p-2">600.00</td></tr>
            <tr><td className="border border-black p-2">Total Tax</td><td className="border border-black p-2">1200.00</td></tr>
            <tr><td className="border border-black p-2">Document Total</td><td className="border border-black p-2">11200.00</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mb-5">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-black p-2">Bank Name</td>
              <td className="border border-black p-2">Account Code</td>
              <td className="border border-black p-2">IFSC No</td>
              <td className="border border-black p-2">Account Name</td>
              <td className="border border-black p-2">Account No</td>
            </tr>
            <tr>
              <td className="border border-black p-2">HDFC</td>
              <td className="border border-black p-2">ACC0003</td>
              <td className="border border-black p-2">HDFC0001234</td>
              <td className="border border-black p-2">Current Main</td>
              <td className="border border-black p-2">123456789013</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-5">
        <p>Terms & Conditions:<br />1) Advance Payment</p>
      </div>
      <div className="text-center">
        <p>For Demo Infolanze</p>
        <p className="mt-2">Authorized Signatory</p>
        <div className="mt-4 text-2xl font-bold">ABSS</div>
        <p className="mt-2">Powered by ABSS</p>
      </div>
    </div>
  );
};

export default PdfViewer;