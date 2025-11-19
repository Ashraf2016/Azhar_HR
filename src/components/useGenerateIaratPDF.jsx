// import { useState } from "react";

// export function useGenerateIaratPDF(employeeId) {
//   const [isGeneratingIarat, setIsGeneratingIarat] = useState(false);

//   // علشان أعمل PDF خاص بالإعارات
//   const generateIaratPDF = async () => {
//     setIsGeneratingIarat(true);

//     try {
//       const response = await fetch(
//         `https://university.roboeye-tec.com/employee/deputation-statement/${employeeId}`
//       );
//       if (!response.ok) throw new Error("فشل في الاتصال بالخادم");

//       const data = await response.json();
//       console.log("الإعارات", employeeId);

//       // لو مفيش بيانات إعارات
//       if (!data.deputationData || data.deputationData.length === 0) {
//         const pdfData = {
//           name: data?.name || "غير محدد",
//           fileNumber: data?.fileNumber || "غير محدد",
//           birthdate: data?.birthdate || "غير محدد",
//           birthCountry: data?.birthCountry || "غير محدد",
//           governorate: data?.governorate || "غير محدد",
//           secondments: [], // مفيش بيانات إعارات
//           message: "لا توجد إعارات متاحة", // هنستخدمها في الـ PDF
//           gender: data?.gender || "غير محدد",
//           nationalIDDate: data?.nationalIDDate || "غير محدد",
//           currentPosition: data?.currentPosition || "غير محدد",
//           hireDate: formatDate(data?.hireDate) || "غير محدد",
//           generatedDate: new Date().toLocaleDateString("ar-SA"),
//         };

//         const { pdf } = await import("@react-pdf/renderer");
//         const { default: IaraatDocument } = await import(
//           `../pdf/LoansDoc?v=${Date.now()}`
//         );

//         const blob = await pdf(
//           <IaraatDocument key={Date.now()} pdfData={pdfData} />
//         ).toBlob();

//         downloadBlob(blob, `${pdfData.name || "employee"}-iaraat-empty`);
//         setIsGeneratingIarat(false);
//         return;
//       }

//       // لو في بيانات إعارات
//       const pdfData = {
//         name: data?.name || "غير محدد",
//         fileNumber: data?.fileNumber || "غير محدد",
//         birthdate: data?.birthdate || "غير محدد",
//         secondments: data.deputationData.map((item, index) => ({
//           no: index + 1,
//           deputationDate: formatDate(item.deputationDate) || "",
//           deputationEndDate: formatDate(item.deputationEndDate) || "",
//           deputationStartDate: formatDate(item.deputationStartDate) || "",
//           deputationType: item.deputationType || "",
//           deputedCountry: item.deputedCountry || "",
//           universityName: item.universityName || "",
//           renewalYear: item.renewalYear || "",
//           notes: item.notes || "",
//         })),
//         currentPosition: data?.currentPosition || "غير محدد",
//         hireDate: formatDate(data?.hireDate) || "غير محدد",
//         generatedDate: new Date().toLocaleDateString("ar-SA"),
//       };

//       const { pdf } = await import("@react-pdf/renderer");
//       const { default: IaraatDocument } = await import(
//         `../pdf/LoansDoc?v=${Date.now()}`
//       );

//       const blob = await pdf(
//         <IaraatDocument key={Date.now()} pdfData={pdfData} />
//       ).toBlob();

//       downloadBlob(blob, `${data.name || "employee"}-iaraat`);
//     } catch (error) {
//       console.error("PDF Generation Error:", error);
//       alert("حدث خطأ أثناء توليد ملف الإعارات.");
//     } finally {
//       setIsGeneratingIarat(false);
//     }
//   };

//   // تحميل الملف
//   const downloadBlob = (blob, filename) => {
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `${filename}-${new Date()
//       .toISOString()
//       .replace(/[:.]/g, "-")}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     setTimeout(() => {
//       URL.revokeObjectURL(url);
//     }, 1000);
//   };

//   // دالة تنسيق التاريخ
//   const formatDate = (dateString) => {
//     if (!dateString || dateString === "1899-11-30T00:00:00.000Z") {
//       return "غير محدد";
//     }
//     try {
//       return new Date(dateString).toLocaleDateString("en-US");
//     } catch {
//       return "غير محدد";
//     }
//   };

//   return { generateIaratPDF, isGeneratingIarat };
// }


// ............................................................................................
import { pdf } from "@react-pdf/renderer";
import IaraatDocument from "../pdf/LoansDoc";

// دالة توليد PDF للإعارات
export async function generateIaratPDF(employeeId) {
  try {
    const response = await fetch(
      `https://university.roboeye-tec.com/employee/deputation-statement/${employeeId}`
    );
    if (!response.ok) throw new Error("فشل في الاتصال بالخادم");

    const data = await response.json();
    console.log("الإعارات:", data);

    // ✅ لو مفيش إعارات
    if (!data.deputationData || data.deputationData.length === 0) {
      const pdfData = {
        name: data?.name || "غير محدد",
        fileNumber: data?.fileNumber || "غير محدد",
        birthdate: data?.birthdate || "غير محدد",
        birthCountry: data?.birthCountry || "غير محدد",
        governorate: data?.governorate || "غير محدد",
        secondments: [],
        message: "لا توجد إعارات متاحة",
        gender: data?.gender || "غير محدد",
        nationalIDDate: data?.nationalIDDate || "غير محدد",
        currentPosition: data?.currentPosition || "غير محدد",
        hireDate: formatDate(data?.hireDate) || "غير محدد",
        generatedDate: new Date().toLocaleDateString("ar-SA"),
      };

      const blob = await pdf(<IaraatDocument pdfData={pdfData} />).toBlob();
      downloadBlob(blob, `${pdfData.name || "employee"}-iaraat-empty`);
      window.location.reload()
      return;
    }

    // ✅ لو في إعارات
    const pdfData = {
      name: data?.name || "غير محدد",
      fileNumber: data?.fileNumber || "غير محدد",
      birthdate: data?.birthdate || "غير محدد",
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
      currentPosition: data?.currentPosition || "غير محدد",
      hireDate: formatDate(data?.hireDate) || "غير محدد",
      generatedDate: new Date().toLocaleDateString("ar-SA"),
    };

    const blob = await pdf(<IaraatDocument pdfData={pdfData} />).toBlob();
    downloadBlob(blob, `${data.name || "employee"}-iaraat`);
    window.location.reload()
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("حدث خطأ أثناء توليد ملف الإعارات.");
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

