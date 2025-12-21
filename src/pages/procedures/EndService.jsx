import React, { useState, useEffect } from "react";
import axiosInstance from "@/axiosInstance";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const EndServicePage = () => {
  const { employeeId } = useParams();
  const location = useLocation();
  const { employeeName, currentRank } = location.state || {};
  const navigate = useNavigate();

  // ✅ التحقق من وجود بيانات الموظف
  if (!employeeName || !currentRank) {
    return (
      <p className="text-red-600 text-center mt-10">
        بيانات الموظف غير متوفرة
      </p>
    );
  }

  const defaultFormData = {
    id: employeeId || "",
    end_date: "",
    reason: "",
    job_title: "",
    order_number: "",
    order_date: "",
    notes: ""
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🟢 تحديث الـ id عند تغيير employeeId
  useEffect(() => {
    if (employeeId) {
      setFormData((prev) => ({
        ...prev,
        id: employeeId
      }));
    }
  }, [employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axiosInstance.put(
        "/employee/end-service",
        formData
      );

      setMessage("✅ تم إنهاء الخدمة بنجاح");
      console.log(response.data);

      // 🟢 إعادة ضبط الفورم بعد نجاح الإرسال
      setFormData({ ...defaultFormData });

    } catch (error) {
      setMessage("❌ حدث خطأ أثناء إنهاء الخدمة");
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

        <div className="mt-2 mb-6 p-4 bg-blue-100 rounded border border-blue-300">
          <h2 className="text-right">
            <span className="text-blue-600">اسم الموظف: </span>
            {employeeName}
          </h2>
          <p className="text-right">
            <span className="text-blue-600">الدرجة الحالية: </span>
            {currentRank}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          {/* رقم الملف الجامعي */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-600">
              رقم التعريف الشخصي
            </label>
            <input
              type="text"
              value={formData.id}
              readOnly
              className="mt-1 block w-full bg-gray-100 rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div> */}

          {/* تاريخ إنهاء الخدمة */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              تاريخ إنهاء الخدمة
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div>

          {/* سبب الانهاء */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              سبب إنهاء الخدمة
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

          {/* المسمى الوظيفي */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              المسمى الوظيفي
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

          {/* رقم القرار */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              رقم القرار
            </label>
            <input
              type="text"
              name="order_number"
              value={formData.order_number}
              onChange={(e) =>
                setFormData({ ...formData, order_number: e.target.value })
              }
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
              name="order_date"
              value={formData.order_date}
              onChange={(e) =>
                setFormData({ ...formData, order_date: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            {loading ? "جارٍ الإرسال..." : "إنهاء الخدمة"}
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
