import React, { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import { useParams, useNavigate } from "react-router-dom"; 

const CustomNotification = ({ message, type, onClose }) => {
  if (!message) return null;

  const baseClasses = "fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl text-white font-bold text-lg z-50 transition-all duration-300";
  
  let styleClasses = "";
  switch (type) {
    case "success":
      styleClasses = "bg-green-600";
      break;
    case "error":
      styleClasses = "bg-red-600";
      break;
    case "loading":
      styleClasses = "bg-blue-600";
      break;
    default:
      styleClasses = "bg-gray-700";
  }

  return (
    <div className={`${baseClasses} ${styleClasses}`} onClick={onClose}>
      {message}
    </div>
  );
};
// -----------------------------------------------------

const AdminReviewPage = () => {
  const { employeeID } = useParams();
  const navigate = useNavigate();
    
  const [pendingRequests, setPendingRequests] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null); 


  // ⭐️ دالة عرض الإشعار
  const showNotification = (message, type = 'default') => {
    setNotification({ message, type });
    // إخفاء الإشعار بعد 4 ثوانٍ
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // 🟢 جلب الطلبات المعلقة
  const fetchPendingRequests = async () => {
    try {
      const res = await axiosInstance.get(`/employee/status-statement/${employeeID}`);
      setUserInfo(res.data);

      const data = res.data?.careerProgression || [];
      const pending = data.filter((item) => item.status === "pending");
      setPendingRequests(pending);
    } catch (err) {
      console.error("❌ حدث خطأ أثناء جلب البيانات:", err);
      showNotification("فشل تحميل طلبات الموظف!", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🟡 تحديث الحالة (موافقة / رفض)
  const handleUpdateStatus = async (jobId, action) => {
    const actionName = action === "approve" ? "الموافقة" : "الرفض";
    
    showNotification(`جاري تنفيذ ${actionName} على الطلب...`, "loading"); // إشعار التحميل

    try {
      const url = `/employee/job/${jobId}/${action}`;
      const res = await axiosInstance.put(url);

      console.log("✅ تم تحديث الحالة:", res.data);

      // إزالة الطلب من القائمة بعد التحديث
      setPendingRequests((prev) => prev.filter((item) => item.jobId !== jobId));
      
      showNotification(`تم تنفيذ ${actionName} بنجاح ✅`, "success"); // إشعار النجاح

    } catch (err) {
      console.error("❌ فشل في تحديث الحالة:", err);
      showNotification(`فشل تنفيذ ${actionName}. حدث خطأ ❗`, "error"); // إشعار الخطأ
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // 🕓 أثناء التحميل
  if (loading) {
    return <div className="text-center text-gray-500 mt-20 text-xl">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 " dir="rtl">
        
      {/* 🎯 عرض مكون الإشعار */}
      <CustomNotification 
        message={notification?.message} 
        type={notification?.type} 
        onClose={() => setNotification(null)}
      />

      {/* 🔙 زر العودة للخلف - تم إضافته هنا */}
      <div dir="ltr">
        <button 
            onClick={() => navigate(-1)}
            className=" sm:top-6 sm:right-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold  py-2 px-4 rounded-full transition duration-150 flex items-center shadow-md"
          >
            <span>🔙</span>
            <span className="mr-2">العودة للخلف</span>
          </button>
    </div>
      
      {/* 🧮 عنوان الصفحة الرئيسي */}
      <div className="mb-8 text-center mt-12 sm:mt-0"> {/* تم تعديل الهامش العلوي لترك مساحة للزر */}
        <h1 className="text-3xl font-extrabold text-gray-900 border-b-2 border-indigo-500 pb-2 inline-block">
          مراجعة طلبات الترقية والفصل وانهاء الخدمة
        </h1>
      </div>

      {/* 🧾 معلومات الموظف - داخل بطاقة بيضاء */}
      <div className="bg-white p-5 shadow-lg rounded-xl border border-gray-200 mb-8">
        <h3 className="text-xl font-bold mb-4 text-indigo-700 border-b pb-2">تفاصيل الموظف</h3>
        <div className="flex flex-wrap justify-around gap-x-12 gap-y-3 text-gray-700">
          <div className="font-medium">
            <span className="text-gray-500">الاسم:</span> <span className="font-bold text-gray-900">{userInfo?.name || "—"}</span>
          </div>
          <div className="font-medium">
            <span className="text-gray-500">رقم الملف:</span> <span className="font-bold text-gray-900">{userInfo?.fileNumber || "—"}</span>
          </div>
        </div>
      </div>

      {/* 📋 جدول الطلبات */}
      {pendingRequests.length === 0 ? (
        <div className="bg-green-50 p-6 rounded-xl border border-green-300 text-center shadow-md">
          <p className="text-lg font-semibold text-green-700">لا توجد طلبات معلقة حالياً. جميع الطلبات مراجعة ✅</p>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-sm font-semibold text-gray-600 tracking-wider 6">#</th>
                  <th className="px-3 py-3 text-sm font-semibold text-gray-600 tracking-wider text-right">الوظيفة / نوع الطلب</th>
                  <th className="px-3 py-3 text-sm font-semibold text-gray-600 tracking-wider text-right hidden sm:table-cell">القسم</th>
                  <th className="px-3 py-3 text-sm font-semibold text-gray-600 tracking-wider text-right hidden lg:table-cell">الكلية</th>
                  <th className="px-3 py-3 text-sm font-semibold text-gray-600 tracking-wider text-right hidden md:table-cell">الملاحظات</th>
                  <th className="px-3 py-3 text-sm font-semibold text-gray-600 tracking-wider ">الحالة</th>
                  <th className="px-3 py-3 text-sm font-semibold text-gray-600 tracking-wider ">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRequests.map((item, index) => (
                  <tr key={item.jobId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">{index + 1}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{item.jobTitle}</td>
                    <td className="px-4 py-4 text-sm text-gray-700 hidden sm:table-cell">{item.department}</td>
                    <td className="px-4 py-4 text-sm text-gray-700 hidden lg:table-cell">{item.faculty}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell italic max-w-xs overflow-hidden text-ellipsis">{item.notes || "—"}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-yellow-600 text-center">
                      قيد التنفيذ
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(item.jobId, "approve")}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition duration-150 shadow-md disabled:opacity-50"
                          disabled={notification?.type === 'loading'}
                        >
                          موافقة ✅
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(item.jobId, "reject")}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition duration-150 shadow-md disabled:opacity-50"
                          disabled={notification?.type === 'loading'}
                        >
                          رفض ❌
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewPage;