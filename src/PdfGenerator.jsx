import React, { useState, useRef } from "react";

const PDFGenerator = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "INV-001",
    date: "2025-07-02",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    items: [
      { description: "Web Development", quantity: 1, price: 1000, total: 1000 },
      { description: "UI/UX Design", quantity: 2, price: 500, total: 1000 },
      { description: "Consulting", quantity: 5, price: 100, total: 500 },
    ],
  });

  const [reportData] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      department: "Engineering",
      salary: 75000,
      startDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Bob Smith",
      department: "Marketing",
      salary: 65000,
      startDate: "2023-03-22",
    },
    {
      id: 3,
      name: "Carol Davis",
      department: "Sales",
      salary: 70000,
      startDate: "2023-02-10",
    },
    {
      id: 4,
      name: "David Wilson",
      department: "Engineering",
      salary: 80000,
      startDate: "2023-04-05",
    },
    {
      id: 5,
      name: "Eva Brown",
      department: "HR",
      salary: 60000,
      startDate: "2023-01-30",
    },
  ]);

  const [contractData, setContractData] = useState({
    clientName: "Acme Corporation",
    projectTitle: "Website Development",
    startDate: "2025-07-15",
    endDate: "2025-10-15",
    budget: 25000,
    terms: [
      "Payment will be made in 3 installments",
      "Client will provide all necessary content",
      "Revisions limited to 3 rounds per deliverable",
      "Final payment due upon project completion",
    ],
  });

  const invoiceRef = useRef();

  // Load external scripts dynamically
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Generate PDF from HTML using html2pdf.js
  const generateHTMLToPDF = async () => {
    try {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
      );

      const element = invoiceRef.current;
      const opt = {
        margin: 1,
        filename: "invoice.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      window.html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating HTML to PDF:", error);
    }
  };

  // Generate PDF using @react-pdf/renderer
  const generateReactPDF = async () => {
    try {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"
      );

      // Note: @react-pdf/renderer is not available via CDN in the same way
      // This is a demonstration of how you would structure the code
      // In a real application, you would install it via npm: npm install @react-pdf/renderer

      // Simulated PDF generation for demo purposes
      const pdfContent = generateReactPDFContent();
      const blob = new Blob([pdfContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "contract.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating React PDF:", error);
      // Show instructions for real implementation
      alert(
        "This is a demo. In a real app, install @react-pdf/renderer via npm and use it server-side or with proper bundling."
      );
    }
  };

  // Generate React PDF content structure (demonstration)
  const generateReactPDFContent = () => {
    return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(CONTRACT AGREEMENT) Tj
0 -30 Td
(Client: ${contractData.clientName}) Tj
0 -20 Td
(Project: ${contractData.projectTitle}) Tj
0 -20 Td
(Budget: ${contractData.budget.toLocaleString()}) Tj
0 -20 Td
(Start Date: ${contractData.startDate}) Tj
0 -20 Td
(End Date: ${contractData.endDate}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000100 00000 n 
0000000200 00000 n 
0000000400 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
500
%%EOF`;
  };
  const generateTablePDF = async () => {
    try {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"
      );

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text("Employee Report", 14, 22);

      // Add metadata
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 35);

      // Prepare table data
      const tableColumns = ["ID", "Name", "Department", "Salary", "Start Date"];
      const tableRows = reportData.map((employee) => [
        employee.id,
        employee.name,
        employee.department,
        `$${employee.salary.toLocaleString()}`,
        employee.startDate,
      ]);

      // Generate table
      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 45,
        theme: "striped",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 12,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 10,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 45 },
      });

      // Add summary
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(14);
      doc.text("Summary:", 14, finalY);
      doc.setFontSize(12);
      doc.text(`Total Employees: ${reportData.length}`, 14, finalY + 10);

      const avgSalary =
        reportData.reduce((sum, emp) => sum + emp.salary, 0) /
        reportData.length;
      doc.text(
        `Average Salary: $${avgSalary.toLocaleString()}`,
        14,
        finalY + 20
      );

      doc.save("employee-report.pdf");
    } catch (error) {
      console.error("Error generating table PDF:", error);
    }
  };

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, price: 0, total: 0 },
      ],
    }));
  };

  const updateItem = (index, field, value) => {
    setInvoiceData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };

      if (field === "quantity" || field === "price") {
        newItems[index].total =
          newItems[index].quantity * newItems[index].price;
      }

      return { ...prev, items: newItems };
    });
  };

  const removeItem = (index) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const totalAmount = invoiceData.items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          PDF Generator Examples
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* HTML to PDF Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              HTML to PDF (html2pdf.js)
            </h2>

            <div className="mb-4">
              <button
                onClick={generateHTMLToPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Download Invoice PDF
              </button>
            </div>

            {/* Invoice Preview */}
            <div
              ref={invoiceRef}
              className="border border-gray-300 p-6 bg-white"
              style={{ minHeight: "400px" }}
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
                <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={invoiceData.customerName}
                    onChange={(e) =>
                      setInvoiceData((prev) => ({
                        ...prev,
                        customerName: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) =>
                      setInvoiceData((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <table className="w-full mb-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">
                      Description
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Qty
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      Price
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      Total
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(index, "description", e.target.value)
                          }
                          className="w-full p-1 border-0 bg-transparent"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full p-1 border-0 bg-transparent text-center"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full p-1 border-0 bg-transparent text-right"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        ${item.total.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={addItem}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                >
                  Add Item
                </button>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    Total: ${totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table PDF Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Table PDF (jsPDF + AutoTable)
            </h2>

            <div className="mb-4">
              <button
                onClick={generateTablePDF}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Download Employee Report PDF
              </button>
            </div>

            {/* Data Preview */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-right">Salary</th>
                    <th className="p-3 text-left">Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((employee, index) => (
                    <tr
                      key={employee.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="p-3">{employee.id}</td>
                      <td className="p-3">{employee.name}</td>
                      <td className="p-3">{employee.department}</td>
                      <td className="p-3 text-right">
                        ${employee.salary.toLocaleString()}
                      </td>
                      <td className="p-3">{employee.startDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
              <p className="text-sm text-gray-600">
                Total Employees: {reportData.length}
              </p>
              <p className="text-sm text-gray-600">
                Average Salary: $
                {(
                  reportData.reduce((sum, emp) => sum + emp.salary, 0) /
                  reportData.length
                ).toLocaleString()}
              </p>
            </div>
          </div>

          {/* React PDF Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              React PDF (@react-pdf/renderer)
            </h2>

            <div className="mb-4">
              <button
                onClick={generateReactPDF}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Download Contract PDF
              </button>
            </div>

            {/* Contract Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={contractData.clientName}
                  onChange={(e) =>
                    setContractData((prev) => ({
                      ...prev,
                      clientName: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={contractData.projectTitle}
                  onChange={(e) =>
                    setContractData((prev) => ({
                      ...prev,
                      projectTitle: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={contractData.startDate}
                    onChange={(e) =>
                      setContractData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={contractData.endDate}
                    onChange={(e) =>
                      setContractData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget ($)
                </label>
                <input
                  type="number"
                  value={contractData.budget}
                  onChange={(e) =>
                    setContractData((prev) => ({
                      ...prev,
                      budget: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Contract Preview */}
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-bold text-center mb-4">
                CONTRACT AGREEMENT
              </h3>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>Client:</strong> {contractData.clientName}
                </p>
                <p>
                  <strong>Project:</strong> {contractData.projectTitle}
                </p>
                <p>
                  <strong>Budget:</strong> $
                  {contractData.budget.toLocaleString()}
                </p>
                <p>
                  <strong>Duration:</strong> {contractData.startDate} to{" "}
                  {contractData.endDate}
                </p>

                <div className="mt-4">
                  <p className="font-semibold mb-2">Terms & Conditions:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    {contractData.terms.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* React PDF Code Example */}
            <div className="mt-4 bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
              <pre>{`// Example @react-pdf/renderer structure
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#FFFFFF', padding: 30 },
  header: { fontSize: 20, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  text: { fontSize: 12, marginBottom: 5 }
});

// const ContractPDF = ({ data }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.header}>CONTRACT AGREEMENT</Text>
//       <View style={styles.section}>
//         <Text style={styles.text}>Client: {data.clientName}</Text>
//         <Text style={styles.text}>Project: {data.projectTitle}</Text>
//         <Text style={styles.text}>Budget: {
//           data.budget.toLocaleString()
//         }</Text>
//       </View>
//     </Page>
//   </Document>
// );`}</pre>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Installation & Setup
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">html2pdf.js</h3>
              <code className="text-xs bg-blue-100 p-2 rounded block mb-2">
                npm install html2pdf.js
              </code>
              <p className="text-xs text-blue-700">
                Or use CDN (as shown in demo)
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                jsPDF + AutoTable
              </h3>
              <code className="text-xs bg-green-100 p-2 rounded block mb-2">
                npm install jspdf jspdf-autotable
              </code>
              <p className="text-xs text-green-700">
                Or use CDN (as shown in demo)
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">
                @react-pdf/renderer
              </h3>
              <code className="text-xs bg-purple-100 p-2 rounded block mb-2">
                npm install @react-pdf/renderer
              </code>
              <p className="text-xs text-purple-700">
                Requires proper bundling setup
              </p>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Usage Instructions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                HTML to PDF (html2pdf.js)
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Converts any HTML element to PDF</li>
                <li>• Preserves styling and layout</li>
                <li>• Good for invoices, reports, forms</li>
                <li>• Works client-side</li>
                <li>• Easy to implement</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Table PDF (jsPDF + AutoTable)
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Programmatically creates PDF tables</li>
                <li>• More control over formatting</li>
                <li>• Better for data-heavy reports</li>
                <li>• Automatic page breaks</li>
                <li>• Great performance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                React PDF (@react-pdf/renderer)
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React-like component syntax</li>
                <li>• Server-side rendering support</li>
                <li>• Precise layout control</li>
                <li>• Professional document creation</li>
                <li>• Best for complex documents</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Important Notes:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • <strong>@react-pdf/renderer</strong> demo shows structure only
                - requires npm installation and proper bundling
              </li>
              <li>
                • <strong>html2pdf.js</strong> and <strong>jsPDF</strong> work
                directly via CDN as demonstrated
              </li>
              <li>
                • For production apps, install packages via npm for better
                performance and reliability
              </li>
              <li>
                • @react-pdf/renderer is best for server-side PDF generation or
                Next.js apps
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFGenerator;
