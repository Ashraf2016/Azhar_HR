import { useState } from "react";

export function useGenerateCareer(employeeId) {
  const [isGenerating, setIsGenerating] = useState(false);

  // علشان أعمل PDF خاص بالتدرج الوظيفي
  const generatePDF = async () => {
    setIsGenerating(true);

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
        name: data.name || "غير محدد",
        fileNumber: data.fileNumber || employeeId || "غير محدد",
        nationalID: data.nationalID || "غير محدد",
        birthdate: data.birthdate ? formatDate(data.birthdate) : "غير محدد",
        gender: data?.gender || "غير محدد",
        birthCountry: data?.birthCountry || "غير محدد",
        address: data.address || "غير محدد",
        governorate: data.governorate || "غير محدد",
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

      const { pdf } = await import("@react-pdf/renderer");
      const { default: MyDocument } = await import(
        `../pdf/document?v=${Date.now()}`
      );

      const blob = await pdf(
        <MyDocument key={Date.now()} pdfData={pdfData} />
      ).toBlob();

      downloadBlob(blob, `${data.name || "employee"}-career`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("حدث خطأ أثناء توليد ملف التدرج الوظيفي.");
    } finally {
      setIsGenerating(false);
    }
  };

  // علشان اجيب الـ current position
  const getLatestCareerEntry = (careerProgression) => {
    if (!careerProgression || careerProgression.length === 0) return null;
    const sortedEntries = [...careerProgression].sort(
      (a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation)
    );
    return sortedEntries[0];
  };

  // تحميل الملف
  const downloadBlob = (blob, filename) => {
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
  };

  // دالة تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString || dateString === "1899-11-30T00:00:00.000Z") {
      return "غير محدد";
    }
    try {
      return new Date(dateString).toLocaleDateString("en-US");
    } catch {
      return "غير محدد";
    }
  };

  return { generatePDF, isGenerating };
}
