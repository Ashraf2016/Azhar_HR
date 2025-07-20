import { Search, User, Mail, Phone, MapPin, Calendar, ChevronRight } from "lucide-react";
import person from "../assets/person.png";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { pdf } from "@react-pdf/renderer";

import { useEffect, useState } from "react";
import { getData } from "../services/api";
import MyDocument from "../pdf/document";

const EmployeeProfilePage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = React.useState(false);
  // Helper function to prepare PDF data from employee information
  const preparePDFData = (employeeData) => {
    if (!employeeData) return null;

    const latestCareer = getLatestCareerEntry(employeeData.careerProgression);

    return {
      // Employee basic information
      name: employeeData.name || "غير محدد",
      fileNumber: employeeData.fileNumber || employeeId || "غير محدد",
      nationalID: employeeData.nationalID || "غير محدد",
      birthdate: employeeData.birthdate ? formatDate(employeeData.birthdate) : "غير محدد",
      address: employeeData.address || "غير محدد",
      governorate: employeeData.governorate || "غير محدد",

      // Current position information
      currentPosition: {
        jobTitle: latestCareer?.jobTitle || "غير محدد",
        department: latestCareer?.department || "غير محدد",
        faculty: latestCareer?.faculty || "غير محدد",
        dateOfOccupation: latestCareer?.dateOfOccupation
          ? formatDate(latestCareer.dateOfOccupation)
          : "غير محدد",
        notes: latestCareer?.notes || "",
      },

      // Career progression
      careerProgression:
        employeeData.careerProgression?.map((career) => ({
          no: career.No,
          jobTitle: career.jobTitle,
          department: career.department,
          faculty: career.faculty,
          dateOfOccupation: formatDate(career.dateOfOccupation),
          dateOfStartJob: formatDate(career.dateOfStartJob),
          expirationDate: formatDate(career.expirationDateOfOccupation),
          notes: career.notes || "",
        })) || [],

      // Previous position
      previousPosition: employeeData.previousPosition
        ? {
            title: employeeData.previousPosition.title,
            startingDate: formatDate(employeeData.previousPosition.startingDate),
            endDate: formatDate(employeeData.previousPosition.endDate),
            serviceType: employeeData.previousPosition.serviceType,
          }
        : null,

      // Academic qualifications
      academicQualifications: employeeData.academicQualifications || [],

      // PDF metadata
      generatedDate: new Date().toLocaleDateString("ar-SA"),
      generatedTime: new Date().toLocaleTimeString("ar-SA"),
    };
  };

  const generatePDF = async () => {
    if (!employee) {
      alert("لا توجد بيانات موظف متاحة لإنشاء PDF");
      return;
    }

    setIsGenerating(true);
    try {
      // Prepare employee data for PDF
      const pdfData = preparePDFData(employee);

      if (!pdfData) {
        throw new Error("فشل في تحضير بيانات الموظف");
      }

      // Create PDF blob with employee data
      const blob = await pdf(<MyDocument pdfData={pdfData} />).toBlob();

      // Create download link with employee name
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Use employee name in filename
      const fileName = `${employee.name || "employee"}-career-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      link.download = fileName;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("حدث خطأ في إنشاء ملف PDF. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getData(`employee/status-statement/${employeeId}`)
      .then((data) => {
        console.log(data);
        setEmployee(data);
      })
      .catch((error) => {
        console.error("Error fetching employee:", error);
        setEmployee(null);
      })
      .finally(() => setLoading(false));
  }, [employeeId]);

  // Helper function to get the latest career progression entry (most recent first)
  const getLatestCareerEntry = (careerProgression) => {
    if (!careerProgression || careerProgression.length === 0) return null;
    // Sort by date and get the latest entry (descending)
    const sortedEntries = [...careerProgression].sort(
      (a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation)
    );
    return sortedEntries[0];
  };

  // Helper function to format date in en-US
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

  if (loading) return <div className="text-center py-12">جاري التحميل...</div>;
  if (!employee) return <div className="text-center py-12">لم يتم العثور على الموظف</div>;

  // Get the latest career entry for current position
  const latestCareer = getLatestCareerEntry(employee.careerProgression);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ChevronRight size={20} className="ml-1" />
          العودة إلى قائمة الموظفين
        </button>

        {/* profile header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex items-center">
              <img
                src={person}
                alt={employee.name || "موظف"}
                className="bg-white w-24 h-24 rounded-full object-cover border-4 border-gray-300 shadow-lg"
              />
              <div className="mr-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{employee.name || "غير محدد"}</h1>
                <p className="text-blue-100 text-lg">
                  <span className="text-blue-200">المنصب: </span>
                  {latestCareer?.jobTitle || "غير محدد"}
                </p>
                <p className="text-blue-200">
                  <span className="text-blue-300">الكلية: </span>
                  {latestCareer?.faculty || "غير محدد"}
                </p>
                <p className="text-blue-200">
                  <span className="text-blue-300">القسم: </span>
                  {latestCareer?.department || "غير محدد"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* profile details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* contact info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">المعلومات الشخصية</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <p className="text-sm text-gray-500">الاسم</p>
                  <p className="text-gray-900">{employee.name || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                  <p className="text-gray-900">{formatDate(employee.birthdate)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <p className="text-sm text-gray-500">رقم الملف</p>
                  <p className="text-gray-900">{employee.fileNumber || employeeId || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <p className="text-sm text-gray-500">العنوان</p>
                  <p className="text-gray-900">{employee.address || "غير محدد"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* job details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">المنصب الحالي</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <p className="text-sm text-gray-500">المنصب</p>
                  <p className="text-gray-900">{latestCareer?.jobTitle || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <p className="text-sm text-gray-500">القسم</p>
                  <p className="text-gray-900">{latestCareer?.department || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <p className="text-sm text-gray-500">تاريخ التعيين</p>
                  <p className="text-gray-900">{formatDate(latestCareer?.dateOfOccupation)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <p className="text-sm text-gray-500">الكلية</p>
                  <p className="text-gray-900">{latestCareer?.faculty || "غير محدد"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* بيان الحاله */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">بيان الحالة</h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              الاعارات
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              الاجازات
            </button>
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? "جاري إنشاء PDF..." : "التدرج الوظيفي"}
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              الجزاءات
            </button>
          </div>
        </div>
        {/* القرارات */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">القرارات</h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              ترقيه
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              انهاء خدمه
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors">
              فصل
            </button>
          </div>
        </div>
        {/* Career Progression */}
        {employee.careerProgression && employee.careerProgression.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">التدرج الوظيفي</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المنصب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      القسم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ التعيين
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ملاحظات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...employee.careerProgression]
                    .sort((a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation))
                    .map((career, index) => (
                      <tr key={career.No || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {career.No}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {career.jobTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {career.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(career.dateOfOccupation)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {career.notes || "-"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Previous Position */}
        {employee.previousPosition && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">المنصب السابق</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">المنصب</p>
                <p className="text-gray-900">{employee.previousPosition.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاريخ البداية</p>
                <p className="text-gray-900">
                  {formatDate(employee.previousPosition.startingDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاريخ النهاية</p>
                <p className="text-gray-900">{formatDate(employee.previousPosition.endDate)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfilePage;

