import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams ,useLocation ,useNavigate } from "react-router-dom";

const EndServicePage = () => {
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
    "university_file_number": "",
    "end_date": "",
    "reason": "",
    "job_title": "",
    "order_number": "",
    "order_date": "",
    "notes": ""
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
      "https://university.roboeye-tec.com/employee/end-service",
      formData
    );

    setMessage("✅ تم تسجيل انهاء الخدمة بنجاح");
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
            onClick={() => navigate(`/profile/${employeeId}`)}
            className="text-blue-600 hover:underline cursor-pointer"
            >
            ← العودة إلى صفحة الموظف
            </button>
        </div>
      <div className="w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-3">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
          إنهاء خدمة موظف
        </h1>
        <div className="mt-2 mb-6 p-4 bg-blue-100 rounded border border-blue-300 ">
            <h2 className="text-right">
                <span className="text-blue-600">اسم الموظف : </span>
                {employeeName}
            </h2>
            <p className="text-right">
                <span className="text-blue-600">
                    الدرجة الحالية : 
                </span>
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

          
          {/* تاريخ الانهاء*/}
          <div>
            <label className="block text-sm font-medium text-gray-600 ">
              تاريخ انهاء الخدمة
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>

          {/*سبب انهاء الخدمة */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              سبب إنهاء الخدمة
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>
          {/*المسمى الوظيفى الحالى*/}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              المسمى الوظيفى
            </label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>


          {/* رقم القرار */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              رقم القرار
            </label>
            <input
              type="text"
              name="order_number"
              value={formData.order_number}
              onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>

          {/* تاريخ القرار */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              تاريخ القرار
            </label>
            <input
              type="date"
              dir="rtl"
              name="order_date"
              value={formData.order_date}
              onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            {loading ? "جارٍ الإرسال..." : "انهاء الخدمة"}
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

export default EndServicePage;
