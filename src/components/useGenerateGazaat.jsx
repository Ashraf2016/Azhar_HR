import { pdf } from "@react-pdf/renderer";
import PunishmentsDocument from "../pdf/PunishmentsDocument";

// دالة توليد PDF للجزاءات
export async function generateGazaatPDF(employeeId) {
  try {
    const response = await fetch(
      `https://university.roboeye-tec.com/employee/punishments/${employeeId}`
    );
    if (!response.ok) throw new Error("فشل في الاتصال بالخادم");

    const data = await response.json();
    console.log("الجزاءات:", data);

    // لو مفيش جزاءات
    if (!data.punishments || data.punishments.length === 0) {
      const pdfData = {
        name: data?.name || "غير محدد",
        gender: data?.gender || "غير محدد",
        birthdate: data?.birthdate || "غير محدد",
        birthCountry: data?.birthCountry || "غير محدد",
        fileNumber: employeeId || "غير محدد",
        governorate: data?.governorate || "غير محدد",
        punishments: [],
        message: "لا توجد جزاءات متاحة",
        generatedDate: new Date().toLocaleDateString("ar-SA"),
      };

      const blob = await pdf(
        <PunishmentsDocument pdfData={pdfData} />
      ).toBlob();

      downloadBlob(blob, `${pdfData.name || "employee"}-Gazaat-empty`);
      window.location.reload()
      return;
    }

    // لو في جزاءات
    const pdfData = {
      name: data?.name || "غير محدد",
      gender: data?.gender || "غير محدد",
      birthdate: data?.birthdate || "غير محدد",
      birthCountry: data?.birthCountry || "غير محدد",
      fileNumber: employeeId || "غير محدد",
      governorate: data?.governorate || "غير محدد",
      punishments: data.punishments.map((item, index) => ({
        no: index + 1,
        execution_order: item.execution_order || "غير محدد",
        execution_order_date: item.execution_order_date || "غير محدد",
        area_name: item?.area_name || "غير محدد",
        area_code: item?.area_code || "غير محدد",
        reasons: item?.reasons || "غير محدد",
        notes: item.notes || "",
      })),
      generatedDate: new Date().toLocaleDateString("ar-SA"),
    };

    const blob = await pdf(
      <PunishmentsDocument pdfData={pdfData} />
    ).toBlob();

    downloadBlob(blob, `${data.name || "employee"}-punishments`);
    window.location.reload()
  } catch (error) {
    console.error("Error fetching or generating Punishments PDF:", error);
    alert("حدث خطأ في جلب الجزاءات أو إنشاء PDF.");
  }
}

// تحميل الملف
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
