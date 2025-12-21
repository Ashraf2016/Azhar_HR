import React, { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import { useParams, useNavigate } from "react-router-dom"; 
import Logo from "../../assets/Logo.png";
import { usePermissions } from "../../contexts/PermissionsContext";

const EmployeeCareersPage = () => {
  const { hasPermission } = usePermissions();
  const { employeeID } = useParams();
  const navigate = useNavigate(); //  لتفعيل الرجوع للخلف
  const [careers, setCareers] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ تحميل بيانات التدرج الوظيفى
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await axiosInstance.get(
          `/employee/statement/${employeeID}`
        );
        setCareers(res.data.careerProgression);
        setEmployeeInfo(res.data.employeeInfo);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل بيانات التدرج الوظيفى.");
      } finally {
        setLoading(false);
      }
    };

    if (employeeID) fetchCareers();
  }, [employeeID]);


  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.includes("1899")) return "-";
    return new Date(dateStr).toLocaleDateString("ar-EG");
  };

  const today = new Date().toLocaleDateString("ar-EG");

  return (
    <div className="min-h-screen w-[90%] m-auto text-right" dir="rtl">
      {/* ✅ الهيدر */}
      <header className="flex items-start justify-between border-b border-gray-300 py-4">
        {/* الجزء العربي */}
        <div className="text-right leading-tight text-gray-800">
          <p className="font-semibold text-lg">جامعة الأزهر</p>
          <p>الإدارة العامة للشؤون الإدارية</p>
          <p>إدارة الموارد البشرية</p>
          <p>وحدة تطوير وتحديث بيانات الجامعة</p>
        </div>

        {/* اللوجو + العنوان */}
        <div className="flex flex-col items-center justify-center text-center">
          <img
            src={Logo}
            alt="Al-Azhar University Logo"
            className="w-24 h-24 object-contain mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-800">بيان التدرج الوظيفى</h1>
        </div>

        {/* الجزء الإنجليزي */}
        <div className="text-left leading-tight text-gray-800" dir="ltr">
          <p className="font-semibold text-lg">Al-Azhar University</p>
          <p>General Administration for Administrative Affairs</p>
          <p>Human Resources Department</p>
          <p>University Data Development and Update Unit</p>
        </div>
      </header>

      {/* ✅ بيانات الموظف */}
      {employeeInfo && (
        <div className="mt-5 text-gray-800 w-[90%] m-auto" dir="rtl">
            
            {/* ======================= قسم البيانات الشخصية    ======================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-right p-4 border border-gray-200 rounded-lg bg-gray-50">
                
                {/* الصف الأول */}
                <h2 className="text-md font-semibold ">الاسم: <span className="font-normal text-gray-800">{employeeInfo.name || "-"}</span></h2>
                <h2 className="text-md font-semibold ">النوع: <span className="font-normal text-gray-800">{employeeInfo.gender || "-"}</span></h2>
                <h2 className="text-md font-semibold ">تاريخ الميلاد: <span className="font-normal text-gray-800">{formatDate(employeeInfo.birthdate) || "-"}</span></h2>
                
                {/* الصف الثاني */}
                <h2 className="text-md font-semibold ">الرقم القومى : <span className="font-normal text-gray-800">{employeeInfo.nationalID || "-"}</span></h2>
                <h2 className="text-md font-semibold ">العنوان: <span className="font-normal text-gray-800">{employeeInfo.address || "-"}</span></h2>
                <h2 className="text-md font-semibold ">المحافظة: <span className="font-normal text-gray-800">{employeeInfo.governorate || "-"}</span></h2>
                {/* الصف الثالث */}
                <h2 className="text-md font-semibold ">رقم الملف : <span className="font-normal text-gray-800">{employeeInfo.universityFileNumber || "-"}</span></h2>
                
            </div>
            
        </div>
    )}

      {/* ✅ الأزرار */}
      <div className="flex justify-end gap-3 mt-4 print:hidden">
        {/* زر العودة للخلف */}
        {/* زر الطباعة */}
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
        >
          🖨️ طباعة
        </button>
        
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
        >
          ⬅️ عودة
        </button>

        
      </div>

      {/* ✅ الجدول */}
      <div className="px-6 pb-10 mt-8">
        {loading ? (
          <p className="text-center text-gray-600">جاري التحميل...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-2 border">م</th>
                  <th className="px-4 py-2 border">الوظيفة</th>
                  <th className="px-4 py-2 border">القسم</th>
                  <th className="px-4 py-2 border">الكلية</th>
                  <th className="px-4 py-2 border">اعتباراً من تاريخ</th>
                  <th className="px-4 py-2 border">حتى تاريخ</th>
                  <th className="px-4 py-2 border">تاريخ استلام العمل</th>
                  <th className="px-4 py-2 border">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {careers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="11"
                      className="text-center py-6 text-gray-600 font-medium"
                    >
                      لا توجد بيانات تدرج وظيفي لهذا الموظف
                    </td>
                  </tr>
                ) : (
                  careers
                    //  الوظائف"active" أو "historical"
                    .filter(
                      (h) =>
                        h.JobStatus?.toLowerCase() === "active" ||
                        h.JobStatus?.toLowerCase() === "historical"
                    )
                    .map((h, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition">
                        <td className="px-3 py-2 border text-center">{index+1}</td>
                        <td className="px-3 py-2 border">{h.jobTitle || "-"}</td>
                        <td className="px-3 py-2 border">{h.department || "-"}</td>
                        <td className="px-3 py-2 border text-center">
                          {h.faculty || "-"}
                        </td>
                        <td className="px-3 py-2 border">
                          {formatDate(h.dateOfOccupation)|| "-"}
                        </td>
                        <td className="px-3 py-2 border">
                          {formatDate(h.expirationDateOfOccupation)|| "-"}
                        </td>
                        <td className="px-3 py-2 border">
                          {formatDate(h.dateOfStartJob)|| "-"}
                        </td>
                        <td className="px-3 py-2 border">{h.notes || "-"}</td>
                      </tr>
                    ))
                )}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* ✅ قسم التوقيعات يظهر فقط عند الطباعة */}
      <div className="hidden print:block mt-16">
        <div className="flex justify-between text-center text-sm font-medium text-gray-900 my-20 ">
          <div className="border flex items-center px-3 py-1 w-40">
            مدير عام الشؤون الإدارية
          </div>
          <div className="border flex items-center px-3 py-1 w-40">
            مدير الموارد البشرية
          </div>
          <div className="border flex items-center px-3 py-1 w-40">
            رئيس قسم الملفات
          </div>
          <div className="border flex items-center px-3 py-1 w-40">
            مسؤول الكمبيوتر
          </div>
        </div>

        <div className="text-right mt-4 pt-5 text-sm text-gray-700">
          تحريراً في: {today}
        </div>
      </div>

      {/* ✅ CSS خاص بالطباعة */}
      {/* بحيث يخفى اى حاجه مش عايزاها عند الطباعة */}
      <style>
        {`
          @media print {
            .print\\:hidden {
              display: none !important;
            }
            .print\\:block {
              display: block !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default EmployeeCareersPage;
