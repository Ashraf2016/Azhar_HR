import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams ,useLocation ,useNavigate } from "react-router-dom";

const TerminationPage = () => {
  const { employeeId } = useParams();
  const location = useLocation();
  const { employeeName, currentRank } = location.state || {};
  const navigate = useNavigate();

  // ✅ لو البيانات ناقصة نعرض رسالة خطأ ونوقف تحميل الصفحة
  if (!employeeName || !currentRank) {
    return (
      <p className="text-red-600 text-center mt-10">
        بيانات الموظف غير متوفرة
      </p>
    );
  }

  const [formData, setFormData] = useState({
    university_file_number: "",
    termination_date: "",
    reason: "",
    job_title: "",
    execution_order: "",
    execution_order_date: "",
    notes: "",
    created_by: localStorage.getItem("username") || "", // 🟢 إضافة هنا
    actionType:"Termination"
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ تعيين رقم الملف الجامعي من الـ URL
  useEffect(() => {
    if (employeeId) {
      setFormData((prev) => ({
        ...prev,
        university_file_number: employeeId,
      }));
    }
  }, [employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.put(
        "https://university.roboeye-tec.com/employee/terminate",
        formData
      );

      setMessage("✅ تم تسجيل فصل الموظف بنجاح");
      console.log(response.data);
    } catch (error) {
      setMessage("❌ حدث خطأ أثناء التسجيل");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-[#fdfbff] bg-[url(/p-bg.png)]">
      <div className="text-right w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          ← العودة إلى صفحة الموظف
        </button>
      </div>
      <div className="w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-3">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
          فصل موظف من الخدمة
        </h1>
        <div className="mt-2 mb-6 p-4 bg-blue-100 rounded border border-blue-300 ">
          <h2 className="text-right">
            <span className="text-blue-600">اسم الموظف : </span>
            {employeeName}
          </h2>
          <p className="text-right">
            <span className="text-blue-600">الدرجة الحالية : </span>
            {currentRank}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          {/* رقم الملف */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              رقم الملف الجامعي
            </label>
            <input
              type="text"
              name="university_file_number"
              value={formData.university_file_number}
              readOnly
              className="mt-1 block w-full bg-gray-100 rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>

          {/* تاريخ الفصل */}
          <div>
            <label className="block text-sm font-medium text-gray-600 ">
              تاريخ فصل الموظف
            </label>
            <input
              type="date"
              name="termination_date"
              value={formData.termination_date}
              onChange={(e) =>
                setFormData({ ...formData, termination_date: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>

          {/* سبب الفصل */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              سبب الفصل
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>

          {/* المسمى الوظيفى الحالى */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              المسمى الوظيفى
            </label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={(e) =>
                setFormData({ ...formData, job_title: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>

          {/* امر التنفيذ */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              امر التنفيذ
            </label>
            <input
              type="text"
              name="execution_order"
              value={formData.execution_order}
              onChange={(e) =>
                setFormData({ ...formData, execution_order: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>

          {/* تاريخ التنفيذ */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              تاريخ التنفيذ
            </label>
            <input
              type="date"
              dir="rtl"
              name="execution_order_date"
              value={formData.execution_order_date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  execution_order_date: e.target.value,
                })
              }
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 text-right"
            />
          </div>

          {/* ملاحظات */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              ملاحظات
            </label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              اسم المستخدم (مدخل البيانات)
            </label>
            <input
              type="text"
              name="created_by"
              value={formData.created_by}
              readOnly
              className="mt-1 block w-full bg-gray-100 rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            {loading ? "جارٍ الإرسال..." : "فصل"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default TerminationPage;
