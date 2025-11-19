// import { useState } from "react";
// import { pdf } from "@react-pdf/renderer";
// import MyDocument from "../pdf/document";

// export function useGenerateCareer(employeeId) {
//   const [isGenerating, setIsGenerating] = useState(false);

//   // علشان أعمل PDF خاص بالتدرج الوظيفي
//   const generatePDF = async () => {
//     setIsGenerating(true);
//      console.log("تدرج وظيفي"+employeeId)
//     try {

//       const response = await fetch(
//         `https://university.roboeye-tec.com/employee/status-statement/99098`
//       );
//       if (!response.ok) throw new Error("فشل في الاتصال بالخادم");

//       const data = await response.json();
//       console.log("التدرج الوظيفى", data);

//       if (!data || data.length === 0) {
//         alert("لا توجد بيانات للتدرج الوظيفي");
//         return;
//       }

//       const latestCareer = getLatestCareerEntry(data.careerProgression);

//       const pdfData = {
//         name: data.name || "غير محدد",
//         fileNumber: data?.fileNumber || "99098" || "غير محدد",
//         nationalID: data.nationalID || "غير محدد",
//         birthdate: data.birthdate ? formatDate(data.birthdate) : "غير محدد",
//         gender: data?.gender || "غير محدد",
//         birthCountry: data?.birthCountry || "غير محدد",
//         address: data.address || "غير محدد",
//         governorate: data.governorate || "غير محدد",
//         currentPosition: {
//           jobTitle: latestCareer?.jobTitle || "غير محدد",
//           department: latestCareer?.department || "غير محدد",
//           faculty: latestCareer?.faculty || "غير محدد",
//           dateOfOccupation: latestCareer?.dateOfOccupation
//             ? formatDate(latestCareer.dateOfOccupation)
//             : "غير محدد",
//           notes: latestCareer?.notes || "",
//         },
//         careerProgression:
//           data.careerProgression?.map((career) => ({
//             no: career.No,
//             jobTitle: career.jobTitle || "",
//             department: career.department || "",
//             faculty: career.faculty || "",
//             dateOfOccupation: formatDate(career.dateOfOccupation) || "",
//             dateOfStartJob: formatDate(career.dateOfStartJob) || "",
//             expirationDate: formatDate(career.expirationDateOfOccupation) || "",
//             notes: career.notes || "",
//           })) || [],
//         previousPosition: data.previousPosition
//           ? {
//               title: data.previousPosition.title || "",
//               startingDate: formatDate(data.previousPosition.startingDate) || "",
//               endDate: formatDate(data.previousPosition.endDate) || "",
//               serviceType: data.previousPosition.serviceType || "",
//             }
//           : null,
//         academicQualifications: data.academicQualifications || [],
//         generatedDate: new Date().toLocaleDateString("ar-SA"),
//         generatedTime: new Date().toLocaleTimeString("ar-SA"),
//       };

//       // const { pdf } = await import("@react-pdf/renderer");
//       // const { default: MyDocument } = await import(
//       //   `../pdf/document?v=${Date.now()}`
//       // );
//       // const { default: MyDocument } = await import("../pdf/document");

//       // const blob = await pdf(
//       //   <MyDocument key={Date.now()} pdfData={pdfData} />
//       // ).toBlob();

//       const blob = await pdf(<MyDocument pdfData={pdfData} />).toBlob();
//       window.location.reload()
//       downloadBlob(blob, `${data.name || "employee"}-career`);

//     } catch (error) {
//       console.error("PDF Generation Error:", error);
//       alert(error.message);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // علشان اجيب الـ current position
//   const getLatestCareerEntry = (careerProgression) => {
//     if (!careerProgression || careerProgression.length === 0) return null;
//     const sortedEntries = [...careerProgression].sort(
//       (a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation)
//     );
//     return sortedEntries[0];
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
//     setTimeout(() => URL.revokeObjectURL(url), 1000);
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

//   return { generatePDF, isGenerating };
// }


// // import { pdf } from "@react-pdf/renderer";
// // import MyDocument from "../pdf/document";

// // let isGenerating = false;

// // async function generateCareerPDF(employeeId) {
// //   if (isGenerating) return;
// //   isGenerating = true;

// //   try {
// //     const response = await fetch(
// //       `https://university.roboeye-tec.com/employee/status-statement/${employeeId}`
// //     );
// //     if (!response.ok) throw new Error("فشل في الاتصال بالخادم");

// //     const data = await response.json();
// //     if (!data || data.length === 0) {
// //       alert("لا توجد بيانات للتدرج الوظيفي");
// //       return;
// //     }

// //     const latestCareer = getLatestCareerEntry(data.careerProgression);

// //     const pdfData = {
// //       name: data.name || "غير محدد",
// //       fileNumber: data.fileNumber || employeeId || "غير محدد",
// //       currentPosition: {
// //         jobTitle: latestCareer?.jobTitle || "غير محدد",
// //         department: latestCareer?.department || "غير محدد",
// //       },
// //       careerProgression: data.careerProgression || [],
// //     };

// //     const blob = await pdf(<MyDocument key={Date.now()} pdfData={pdfData} />).toBlob();
// //     downloadBlob(blob, `${data.name || "employee"}-career`);

// //   } catch (error) {
// //     console.error("PDF Generation Error:", error);
// //     alert("حدث خطأ أثناء توليد ملف التدرج الوظيفي.");
// //   } finally {
// //     isGenerating = false;
// //   }
// // }

// // // الدوال المساعدة
// // function getLatestCareerEntry(careerProgression) {
// //   if (!careerProgression || careerProgression.length === 0) return null;
// //   return [...careerProgression].sort(
// //     (a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation)
// //   )[0];
// // }

// // function downloadBlob(blob, filename) {
// //   const url = URL.createObjectURL(blob);
// //   const link = document.createElement("a");
// //   link.href = url;
// //   link.download = `${filename}-${new Date().toISOString().replace(/[:.]/g, "-")}.pdf`;
// //   document.body.appendChild(link);
// //   link.click();
// //   document.body.removeChild(link);
// //   setTimeout(() => URL.revokeObjectURL(url), 1000);
// // }


// ...................................................................

import { pdf } from "@react-pdf/renderer";
import MyDocument from "../pdf/document";

// دالة توليد PDF للتدرج الوظيفي
export async function generateCareerPDF(employeeId) {
  console.log("تدرج وظيفي " + employeeId);

  try {
    const response = await fetch(
      `https://university.roboeye-tec.com/employee/status-statement/${employeeId}`
    );
    if (!response.ok) throw new Error("فشل في الاتصال بالخادم");

    const data = await response.json();
    console.log("التدرج الوظيفى", data);

    if (!data || data.length === 0) {
      alert("لا توجد بيانات للتدرج الوظيفي");
      return;
    }

    const latestCareer = getLatestCareerEntry(data.careerProgression);

    const pdfData = {
      name: data?.name || "غير محدد",
      fileNumber: data?.fileNumber || employeeId || "غير محدد",
      nationalID: data?.nationalID || "غير محدد",
      birthdate: data?.birthdate ? formatDate(data.birthdate) : "غير محدد",
      gender: data?.gender || "غير محدد",
      birthCountry: data?.birthCountry || "غير محدد",
      address: data?.address || "غير محدد",
      governorate: data?.governorate || "غير محدد",
      currentPosition: {
        jobTitle: latestCareer?.jobTitle || "غير محدد",
        department: latestCareer?.department || "غير محدد",
        faculty: latestCareer?.faculty || "غير محدد",
        dateOfOccupation: latestCareer?.dateOfOccupation
          ? formatDate(latestCareer.dateOfOccupation)
          : "غير محدد",
        notes: latestCareer?.notes || "",
      },
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
      previousPosition: data.previousPosition
        ? {
            title: data.previousPosition.title || "",
            startingDate: formatDate(data.previousPosition.startingDate) || "",
            endDate: formatDate(data.previousPosition.endDate) || "",
            serviceType: data.previousPosition.serviceType || "",
          }
        : null,
      academicQualifications: data.academicQualifications || [],
      generatedDate: new Date().toLocaleDateString("ar-SA"),
      generatedTime: new Date().toLocaleTimeString("ar-SA"),
    };

    // توليد PDF
    const blob = await pdf(<MyDocument pdfData={pdfData} />).toBlob();
    downloadBlob(blob, `${data.name || "employee"}-career`);
    window.location.reload()
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert(error.message);
  }
}

// 🟢 دوال مساعدة
function getLatestCareerEntry(careerProgression) {
  if (!careerProgression || careerProgression.length === 0) return null;
  return [...careerProgression].sort(
    (a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation)
  )[0];
}

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

