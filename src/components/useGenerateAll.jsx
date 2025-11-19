
// ..............................................................................
import { pdf } from "@react-pdf/renderer";
import AllDocuments from "../pdf/AllDocuments";

// دالة توليد PDF للإجازات
export async function generateEgazatPDF(employeeId) {
  console.log("إجازات " + employeeId);

  try {
    const response = await fetch(
      `https://university.roboeye-tec.com/employee/statement/${employeeId}`
    );
    if (!response.ok) throw new Error("فشل في الاتصال بالخادم");

    const data = await response.json();
    console.log("كل البيانات", data);

    // ✅ لو مفيش إجازات
    if (!data.holidays || data.holidays.length === 0) {
      const pdfData = {
        name: data?.name || "غير محدد",
        Egazat: [],
        birthCountry: data?.birthCountry || "غير محدد",
        birthdate: data?.birthdate || "غير محدد",
        fileNumber: data?.fileNumber || data?.university_file_number || "غير محدد",
        message: "لا توجد إجازات متاحة",
        governorate: data?.governorate || "غير محدد",
        nationalID: data?.nationalID || "غير محدد",
        nationalIDDate: formatDate(data?.nationalIDDate) || "غير محدد",
        generatedDate: new Date().toLocaleDateString("ar-SA"),
      };

      const blob = await pdf(<EjazatDocument pdfData={pdfData} />).toBlob();
      downloadBlob(blob, `${pdfData.name || "employee"}-egazat-empty`);
      window.location.reload()
      return;
    }

    // ✅ لو في إجازات
    const pdfData = {
      name: data?.name || "غير محدد",
      fileNumber: data?.fileNumber || data?.university_file_number || "غير محدد",
      Egazat: data.holidays.map((item, index) => ({
        no: index + 1,
        grant_type: item.grant_type || "غير محدد",
        leave_type: item.leave_type || "غير محدد",
        from_date: item.from_date || "غير محدد",
        to_date: item.to_date || "غير محدد",
        execution_order_date: item.execution_order_date || "غير محدد",
        fileNumber: item?.university_file_number || "غير محدد",
        execution_order_number: item?.execution_order_number || "غير محدد",
        duration_days: item.duration_days || "غير محدد",
        travel_status: item.travel_status || "غير محدد",
        notes: item.notes || "",
      })),
      generatedDate: new Date().toLocaleDateString("ar-SA"),
    };

    console.log("PDF DATA →", pdfData);

    const blob = await pdf(<EjazatDocument pdfData={pdfData} />).toBlob();
    downloadBlob(blob, `${data.name || "employee"}-Egazat`);
    window.location.reload()
  } catch (error) {
    console.error("Error fetching or generating Ejazat PDF:", error);
    alert(error.message);
  }
}

// 🟢 دوال مساعدة
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}


function formatDate(dateString) {
  if (!dateString || dateString === "1899-11-30T00:00:00.000Z") {
    return "غير محدد";
  }
  try {
    return new Date(dateString).toLocaleDateString("en-US");
  } catch {
    return "غير محدد";
  }
}




