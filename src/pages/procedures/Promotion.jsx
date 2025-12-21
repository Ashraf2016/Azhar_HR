import React, { useState, useEffect } from "react";
import axiosInstance from "@/axiosInstance";
import { useParams ,useLocation ,useNavigate } from "react-router-dom";
import CustomDropdown from "@/components/CustomDropdown";


const PromotionPage = () => {
  const { employeeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { employeeName, currentRank } = location.state || {};

  // ✅ لو البيانات ناقصة نعرض رسالة خطأ ونوقف تحميل الصفحة
    if (!employeeName || !currentRank) {
    return (
        <p className="text-red-600 text-center mt-10">
        بيانات الموظف غير متوفرة
        </p>
    );
    }

  const [formData, setFormData] = useState({
    id: "",
    new_job_code: "",
    promotion_date: "",
    order_number: "",
    order_date: "",
    decision_authority: "",
    created_by: localStorage.getItem("username") || "", 
    actionType:"promotion"
  });


  const [jobCodes, setJobCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ جلب الأكواد من API
 useEffect(() => {
  const fetchJobCodes = async () => {
    try {
      const res = await axiosInstance.get("/structure/academic-degree");
      if (Array.isArray(res.data)) {

        // البحث عن كود الدرجة الحالية
        const currentRankObj = res.data.find(job => job.job_name === currentRank);
        const currentRankCode = currentRankObj ? currentRankObj.job_code : null;

        // فلترة الوظائف بحيث تكون أعلى من الدرجة الحالية
        const filteredJobs = currentRankCode
          ? res.data.filter(job => job.job_code > currentRankCode)
          : res.data;

        const options = filteredJobs.map(job => ({
          value: job.job_code,
          label: job.job_name,
        }));

        setJobCodes(options);
      }
    } catch (err) {
      console.error("خطأ في جلب الأكواد:", err);
    }
  };
  
  fetchJobCodes();
}, [currentRank]);



  // ✅ تعيين رقم الملف الجامعي من الـ URL
  useEffect(() => {
    if (employeeId) {
      setFormData((prev) => ({
        ...prev,
        id: employeeId,
      }));
    }
  }, [employeeId]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setLoading(true);

  try {
    const response = await axiosInstance.post(
      "/employee/promote",
      formData
    );

    setMessage("✅ تم تسجيل الترقية بنجاح");
    setFormData({
        id: employeeId,
        new_job_code: "",
        promotion_date: "",
        order_number: "",
        order_date: "",
        decision_authority: "",
        created_by: localStorage.getItem("username") || "",
        actionType: "promotion"
      });
    console.log(response.data);
  } catch (error) {
    setMessage("❌ حدث خطأ أثناء التسجيل");
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen  p-6 bg-[#fdfbff] bg-[url(/p-bg.png)]">
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
          ترقية الموظفين
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
          {/* <div>
            <label className="block text-sm font-medium text-gray-600">
              الرقم التعريفي لعضو هيئة التدريس
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              readOnly
              className="mt-1 block w-full bg-gray-100 rounded-lg border-gray-300 shadow-sm p-2"
            />
          </div> */}

          {/* كود الوظيفة الجديدة مع البحث */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
               الوظيفة الجديدة
            </label>
            <CustomDropdown
              options={[{ value: "", label: "اختر الوظيفة..." }, ...jobCodes]}
              value={formData.new_job_code || ""}
              onChange={(val) => setFormData((prev) => ({ ...prev, new_job_code: val }))}
              placeholder="اختر الوظيفة..."
            />
          </div>

          {/* تاريخ الترقية */}
          <div>
            <label className="block text-sm font-medium text-gray-600 ">
              تاريخ الترقية
            </label>
            <input
              type="date"
              name="promotion_date"
              value={formData.promotion_date}
              onChange={(e) => setFormData({ ...formData, promotion_date: e.target.value })}
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

          {/* جهة إصدار القرار */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              جهة إصدار القرار
            </label>
            <input
              type="text"
              name="decision_authority"
              value={formData.decision_authority}
              onChange={(e) => setFormData({ ...formData, decision_authority: e.target.value })}
              required
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
            {loading ? "جارٍ الإرسال..." : "تسجيل الترقية"}
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

export default PromotionPage;
