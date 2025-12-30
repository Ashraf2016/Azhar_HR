import React, { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";

const EmployeeAllStatesPage = () => {
  const { employeeID } = useParams();
  const navigate = useNavigate();

  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [deputation, setDeputation] = useState([]);
  const [careers, setCareers] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [punishments, setPunishments] = useState([]);
  const [secondments, setSecondments] = useState([]); // <-- قسم الانتدابات الجديد
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = "google-font-amiri";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [statementRes, secondmentsRes] = await Promise.all([
          axiosInstance.get(`/employee/statement/${employeeID}`),
          // axiosInstance.get(`/holidays/employee/${employeeID}`),
          // axiosInstance.get(`/punishments/employee/${employeeID}`),
          axiosInstance.get(`/secondments/${employeeID}`), // <-- جلب بيانات الانتدابات
        ]);

        setEmployeeInfo(statementRes.data.employeeInfo);
        setDeputation(statementRes.data.deputationData || []);
        setCareers(statementRes.data.careerProgression || []);
        setHolidays(statementRes.data.holidays || []);
        setPunishments(statementRes.data.punishments || []);
        setSecondments(secondmentsRes.data || []); // <-- تخزين بيانات الانتدابات
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل بيانات الموظف.");
      } finally {
        setLoading(false);
      }
    };

    if (employeeID) fetchAllData();
  }, [employeeID]);

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.includes("1899")) return "-";
    return new Date(dateStr).toLocaleDateString("ar-EG");
  };

  const today = new Date().toLocaleDateString("ar-EG");
  if (loading)
    return <p className="text-center text-gray-600 mt-10">جاري تحميل البيانات...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="min-h-screen w-[95%] m-auto text-right" dir="rtl" style={{ fontFamily: '"Amiri", serif' }}>
      {/* ✅ الهيدر */}
      <header className="flex items-center justify-between border-b border-gray-300 py-4">
        <div className="text-right leading-tight text-gray-800 w-1/3">
          <p className="font-bold text-lg">جامعة الأزهر</p>
          <p>الإدارة العامة للشؤون الإدارية</p>
          <p>إدارة الموارد البشرية</p>
          <p>وحدة تطوير وتحديث بيانات الجامعة</p>
        </div>

        <div className="flex flex-col items-center justify-center text-center w-1/3">
          <img src={Logo} alt="Al-Azhar University Logo" className="w-24 h-24 object-contain mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">بيان حالة شامل</h1>
        </div>

        <div className="text-left leading-tight text-gray-800 w-1/3" dir="ltr">
          <p className="font-bold text-lg">Al-Azhar University</p>
          <p>General Administration for Administrative Affairs</p>
          <p>Human Resources Department</p>
          <p>University Data Development and Update Unit</p>
        </div>
      </header>

      {/* ✅ بيانات الموظف */}
      {employeeInfo && (
        <div className="mt-5 text-gray-800 w-[90%] m-auto border border-gray-200 rounded-lg bg-gray-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-right">
            <h2 className="text-md font-bold">الاسم: <span className="font-normal">{employeeInfo.name || "-"}</span></h2>
            <h2 className="text-md font-bold">النوع: <span className="font-normal">{employeeInfo.gender || "-"}</span></h2>
            <h2 className="text-md font-bold">تاريخ الميلاد: <span className="font-normal">{formatDate(employeeInfo.birthdate)}</span></h2>
            <h2 className="text-md font-bold">الرقم القومي: <span className="font-normal">{employeeInfo.nationalID || "-"}</span></h2>
            <h2 className="text-md font-bold">العنوان: <span className="font-normal">{employeeInfo.address || "-"}</span></h2>
            <h2 className="text-md font-bold">المحافظة: <span className="font-normal">{employeeInfo.governorate || "-"}</span></h2>
            <h2 className="text-md font-bold">رقم الملف: <span className="font-normal">{employeeInfo.universityFileNumber || "-"}</span></h2>
          </div>
        </div>
      )}

      {/* ✅ الأزرار */}
      <div className="flex justify-end gap-3 mt-4 print:hidden">
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

      {/* ✅ قسم الإعارات */}
      <Section title="بيان الإعارات" data={deputation} columns={[
        "م", "نوع الإعارة", "الدولة", "جهة الإعارة", "تاريخ الإعارة", "حتى تاريخ", "عام التجديد", "تاريخ استلام العمل"
      ]} renderRow={(h, index) => (
        <>
          <td className="p-2">{index+1}</td>
          <td className="p-2">{h.deputationType}</td>
          <td className="p-2">{h.deputedCountry}</td>
          <td className="p-2">{h.universityName}</td>
          <td className="p-2">{formatDate(h.deputationDate)}</td>
          <td className="p-2">{formatDate(h.deputationEndDate)}</td>
          <td className="p-2">{h.renewalYear}</td>
          <td className="p-2">{formatDate(h.deputationStartDate)}</td>
        </>
      )} />

      {/* ✅ قسم التدرج الوظيفي */}
      <Section
        title="بيان التدرج الوظيفي"
        data={careers.filter(
          (c) =>
            c.JobStatus?.toLowerCase() === "active" ||
            c.JobStatus?.toLowerCase() === "historical"
        )}
        columns={[
          "م",
          "الوظيفة",
          "القسم",
          "الكلية",
          "اعتبارًا من",
          "حتى تاريخ",
          "تاريخ استلام العمل",
          "ملاحظات",
        ]}
        renderRow={(c, index) => (
          <>
            <td className="p-2">{index+1}</td>
            <td className="p-2">{c.jobTitle}</td>
            <td className="p-2">{c.department}</td>
            <td className="p-2">{c.faculty}</td>
            <td className="p-2">{formatDate(c.dateOfOccupation)}</td>
            <td className="p-2">{formatDate(c.expirationDateOfOccupation)}</td>
            <td className="p-2">{formatDate(c.dateOfStartJob)}</td>
            <td className="p-2">{c.notes}</td>
          </>
        )}
      />

      {/* ✅ قسم الإجازات */}
      <Section title="بيان الإجازات" data={holidays} columns={[
        "م", "نوع الاجازة", "سبب الإجازة", "المدة", "من", "إلى", "رقم أمر التنفيذ", "ملاحظات"
      ]} renderRow={(h, index) => (
        <>
          <td className="p-2">{index+1}</td>
          <td className="p-2">{h.grant_type}</td>
          <td className="p-2">{h.leave_type}</td>
          <td className="p-2">{h.duration_days}</td>
          <td className="p-2">{formatDate(h.from_date)}</td>
          <td className="p-2">{formatDate(h.to_date)}</td>
          <td className="p-2">{h.execution_order_number}</td>
          {/* <td className="p-2">{h.travel_status}</td> */}
          <td className="p-2">{h.notes}</td>
        </>
      )} />

      {/* ✅ قسم الجزاءات */}
      <Section title="بيان الجزاءات" data={punishments} columns={[
        "م", "نوع الجزاء", "السبب", "رقم أمر التنفيذ", "تاريخ أمر التنفيذ", "ملاحظات"
      ]} renderRow={(p, index) => (
        <>
          <td className="p-2">{index+1}</td>
          <td className="p-2">{p.type}</td>
          <td className="p-2">{p.reasons || "-"}</td>
          <td className="p-2">{p.execution_order}</td>
          <td className="p-2">{formatDate(p.execution_order_date)}</td>
          <td className="p-2">{p.notes}</td>
        </>
      )} />

      {/* ✅ قسم الانتدابات الجديد */}
      <Section
        title="بيان الانتدابات"
        data={secondments}
        columns={[
          "م",
          "الجامعة / جهة الانتداب",
          "الكلية",
          "تاريخ البدء",
          "تاريخ الانتهاء"
        ]}
        renderRow={(s, index) => (
          <>
            <td className="p-2">{index + 1}</td>
            <td className="p-2">{s.university || "-"}</td>
            <td className="p-2">{s.faculty_name || "-"}</td>
            <td className="p-2">{formatDate(s.start_date)}</td>
            <td className="p-2">{formatDate(s.end_date)}</td>
          </>
        )}
      />

      {/* ✅ التوقيعات */}
      <div className="hidden print:block mt-16">
        <div className="flex justify-between text-center text-sm font-medium text-gray-900 my-20">
          <div className="border flex items-center px-3 py-1 w-40">مدير عام الشؤون الإدارية</div>
          <div className="border flex items-center px-3 py-1 w-40">مدير الموارد البشرية</div>
          <div className="border flex items-center px-3 py-1 w-40">رئيس قسم الملفات</div>
          <div className="border flex items-center px-3 py-1 w-40">مسؤول الكمبيوتر</div>
        </div>
        <div className="text-right mt-4 pt-5 text-sm text-gray-700">تحريراً في: {today}</div>
      </div>
    </div>
  );
};

// 🔸 مكون فرعي لعرض الجداول
const Section = ({ title, data, columns, renderRow }) => (
  <div className="my-4">
    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">{title}</h2>
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-100 text-gray-700 font-bold">
          <tr>{columns.map((col, i) => <th key={i} className="px-4 py-2 border">{col}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center py-6 text-gray-600">لا توجد بيانات</td></tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 text-right">
                {renderRow(row, i)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default EmployeeAllStatesPage;
