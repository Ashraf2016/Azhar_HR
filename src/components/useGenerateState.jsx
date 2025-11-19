import { pdf } from "@react-pdf/renderer";
import StateDocument from "../pdf/StateDocument";

// دالة توليد PDF للإعارات
export async function generateStatePDF(employeeId) {
  try {
    const response = await fetch(
      `https://university.roboeye-tec.com/employee/statement/${employeeId}`
    );
    if (!response.ok) throw new Error("فشل في الاتصال بالخادم");

    const data = await response.json();
    console.log("بيان الحالة", data);

    // ✅ لو مفيش إعارات
    if (!data.deputationData || data.deputationData.length === 0) {
      const pdfData = {
        name: data.employeeInfo?.name || "غير محدد",
        fileNumber: data.employeeInfo?.fileNumber || "غير محدد",
        birthdate: data.employeeInfo?.birthdate || "غير محدد",
        birthCountry: data.employeeInfo?.birthCountry || "غير محدد",
        governorate: data.employeeInfo?.governorate || "غير محدد",
        secondments: [],
        message: "لا توجد إعارات متاحة",
        gender: data.employeeInfo?.gender || "غير محدد",
        nationalIDDate: data.employeeInfo?.nationalIDDate || "غير محدد",
        currentPosition: data.employeeInfo?.currentPosition || "غير محدد",
        hireDate: formatDate(data.employeeInfo?.hireDate) || "غير محدد",
        generatedDate: new Date().toLocaleDateString("ar-SA"),
      };

      const blob = await pdf(<StateDocument pdfData={pdfData} />).toBlob();
      downloadBlob(blob, `${pdfData.name || "employee"}-State-empty`);
      window.location.reload()
      return;
    }

    // ✅ لو في إعارات
    const pdfData = {
      name: data.employeeInfo?.name || "غير محدد",
      fileNumber: data.employeeInfo?.fileNumber || "غير محدد",
      birthdate: data.employeeInfo?.birthdate || "غير محدد",
      secondments: data.deputationData.map((item, index) => ({
        no: index + 1,
        deputationDate: formatDate(item.deputationDate) || "",
        deputationEndDate: formatDate(item.deputationEndDate) || "",
        deputationStartDate: formatDate(item.deputationStartDate) || "",
        deputationType: item.deputationType || "",
        deputedCountry: item.deputedCountry || "",
        universityName: item.universityName || "",
        renewalYear: item.renewalYear || "",
        notes: item.notes || "",
      })),
      punishments: data.punishments.map((item, index) => ({
        no: index + 1,
        execution_order: item.execution_order || "غير محدد",
        execution_order_date: item.execution_order_date || "غير محدد",
        area_name: item?.area_name || "غير محدد",
        area_code: item?.area_code || "غير محدد",
        reasons: item?.reasons || "غير محدد",
        notes: item.notes || "",
      })),
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
      careerProgression:
        data.careerProgression?.map((career) => ({
          no: career.No,
          jobTitle: career.jobTitle || "",
          department: career.department || "",
          faculty: career.faculty || "",
          dateOfOccupation: formatDate(career.dateOfOccupation) || "",
          dateOfStartJob: formatDate(career.dateOfStartJob) || "",
          expirationDate: formatDate(career.expirationDateOfOccupation) || "",
          notes: career.notes || "",
        })) || [],

      currentPosition: data.employeeInfo?.currentPosition || "غير محدد",
      hireDate: formatDate(data.employeeInfo?.hireDate) || "غير محدد",
      generatedDate: new Date().toLocaleDateString("ar-SA"),
    };

    const blob = await pdf(<StateDocument pdfData={pdfData} />).toBlob();
    downloadBlob(blob, `${data.name || "employee"}-State`);
    window.location.reload()
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("حدث خطأ أثناء توليد ملف بيان الحالة.");
  }
}

// 🟢 دالة تحميل الملف
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

// 🟢 دالة تنسيق التاريخ
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

