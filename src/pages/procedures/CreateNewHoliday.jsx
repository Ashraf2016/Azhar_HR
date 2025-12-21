import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import useRequireAuth from "../../lib/useRequireAuth";
import CustomDropdown from "@/components/CustomDropdown";

const CreateNewHoliday = () => {
  // 1. استخراج employeeID و serialNumber من المسار
  // serialNumber هو الـ ID الفريد للاجازة في وضع التعديل
  const { employeeID, serialNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useRequireAuth();

  // تحديد وضع التشغيل والتاريخ المُمرر
  const isEditMode = !!serialNumber;
  const pageTitle = isEditMode ? "تعديل بيانات الإجازة" : "إضافة إجازة جديدة";
  
  const passedData = location.state?.holidayData;

  // دالة تحويل التاريخ إلى صيغة حقل الإدخال
  const formatToInputDate = (dateStr) =>
    dateStr && !dateStr.includes("1899") ? dateStr.split("T")[0] : "";

  // 💡 تحديث حقول formData لتناسب هيكلية البيانات الجديدة
  const [formData, setFormData] = useState({
    // بيانات الموظف (ثابتة)
    employee_id: passedData?.employee_id || employeeID || "",
    
    // بيانات الإجازة
    grant_type: passedData?.grant_type || "اعتماد اجازة", // افتراض قيمة لـ Grant Type
    status: passedData?.status || "pending", // حالة الإجازة الجديدة دائماً "قيد الانتظار"
    leave_type: passedData?.leave_type || "", // نوع الإجازة (مثل: الحج، مرضية، إلخ)
    country_name: passedData?.country_name || "", // بلد الإجازة
    from_date: formatToInputDate(passedData?.from_date), // تاريخ البداية
    to_date: formatToInputDate(passedData?.to_date), // تاريخ النهاية
    travel_status: passedData?.travel_status || "", // حالة السفر (مثل: مع عدم العمل)
    
    // بيانات القرار
    execution_order_number: passedData?.execution_order_number || "", // رقم أمر التنفيذ
    execution_order_date: formatToInputDate(passedData?.execution_order_date), // تاريخ أمر التنفيذ
    
    // بيانات إضافية
    duration_days: passedData?.duration_days || "", // قد يتم حسابه آلياً لاحقاً
    notes: passedData?.notes || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [types, setTypes] = useState([]); // أنواع الإجازات
  const [leave_types, setLeaveTypes] = useState([]); 
  const [travelStatuses, setTravelStatuses] = useState([]); // حالات السفر

  // 2. تعبئة رقم الملف الجامعي عند الإضافة فقط
  useEffect(() => {
    if (employeeID && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        employee_id: employeeID,
      }));
    }
  }, [employeeID, isEditMode]);
  
  // جلب أنواع الإجازات وحالات السفر من API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // 💡 نقطة نهاية جلب أنواع الإجازات
        const typesRes = await axiosInstance.get("/holidays/options");
        setTypes(typesRes.data.grant_types);
        setLeaveTypes(typesRes.data.leave_types)
        
      } catch (err) {
        console.error("خطأ في جلب الخيارات الإضافية:", err);
      }
    };
    fetchOptions();
  }, []);

  // تحديث البيانات
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. إرسال البيانات (PUT للتعديل، POST للإضافة)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const method = isEditMode ? "put" : "post";
    // 💡 نقطة نهاية الإضافة أو التعديل للإجازات
    // (serialNumber هو الـ ID الفريد للاجازة)
    const url = isEditMode
        ? `/holidays/${serialNumber}` 
        : "/holidays";

    try {
      const res = await axiosInstance[method](url, formData);

      const successMessage = isEditMode
            ? "✅ تم تعديل الإجازة بنجاح!"
            : "✅ تم إنشاء الإجازة بنجاح!";
      setMessage(successMessage);
      
      // في حالة التعديل، نعود لصفحة العرض بعد ثانية
      if (isEditMode) {
          // 💡 التوجيه إلى صفحة عرض الإجازات
          setTimeout(() => navigate(`/holidays/${employeeID}`), 1000);
          return;
      }
      
      // تفريغ الحقول في حالة الإضافة الجديدة فقط
      setFormData((prev) => ({
        ...prev, // نحافظ على employee_id
        grant_type: "اعتماد اجازة",
        leave_type: "",
        country_name: "",
        from_date: "",
        to_date: "",
        travel_status: "",
        execution_order_number: "",
        execution_order_date: "",
        duration_days: "",
        notes: "",
      }));
    } catch (err) {
      console.error(err);
      const errorMessage =
            err.response?.data?.message || (isEditMode
            ? "❌ حدث خطأ أثناء تعديل الإجازة. تأكد من البيانات."
            : "❌ حدث خطأ أثناء إنشاء الإجازة. تأكد من البيانات.");
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#fdfbff] bg-[url(/p-bg.png)] flex flex-col items-center">
        <div className="w-full max-w-4xl flex justify-end text-lg p-2">
            <button
                onClick={() => (employeeID ? navigate(`/profile/${employeeID}`) : navigate(-1))}
                className="text-blue-600 hover:underline cursor-pointer"
            >
                ← العودة إلى صفحة الموظف
            </button>
        </div>
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl border border-gray-200" dir="rtl">

        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          {pageTitle}
        </h1>

        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
            {/* القسم الأول: البيانات الأساسية للإجازة */}
            <div className="col-span-1 md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                البيانات الأساسية
                </h2>
            </div>

            {/* رقم الملف الجامعي (ثابت) */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">رقم الملف الجامعي</label>
                <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                readOnly
                className="border rounded-xl p-3 bg-gray-100 text-gray-700 cursor-not-allowed shadow-inner"
                />
            </div>

            {/* نوع الإجازة (leave_type) */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">نوع الإجازة</label>
                <CustomDropdown
                  options={[{ value: "", label: "اختر نوع الإجازة" }, ...types.map(t => ({ value: t, label: t }))]}
                  value={formData.grant_type || ""}
                  onChange={(val) => setFormData(prev => ({ ...prev, grant_type: val }))}
                  placeholder="اختر نوع الإجازة"
                />
            </div>
            
            {/* 💡 نوع المنح (grant_type) - ثابتة غالباً */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">سبب الاجازة </label>
                <input
                type="text"
                name="leave_type"
                placeholder="مثال: اعتماد اجازة"
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {/* <select
                name="leave_type"
                value={formData.leave_type}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                <option value="">اختر سبب الإجازة</option>
                {leave_types.map((leaveType, index) => (
                    <option key={index} value={leaveType}>
                        {leaveType}
                    </option>
                ))}
                </select> */}
            </div>

            {/* 💡 بلد الإجازة (country_name) */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">بلد الإجازة (في حال السفر)</label>
                <input
                type="text"
                name="country_name"
                placeholder="مثال: المملكة العربية السعودية"
                value={formData.country_name}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
            
            

            {/* مدة الإجازة (duration_days) */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">مدة الإجازة (بالأيام)</label>
                <input
                type="number"
                name="duration_days"
                placeholder="عدد الأيام"
                value={formData.duration_days}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>


            {/* القسم الثاني: تفاصيل المدة والقرار */}
            <div className="col-span-1 md:col-span-2 mt-2">
                <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                تفاصيل المدة والقرار
                </h2>
            </div>

            {/* تاريخ بداية الإجازة (from_date) */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">تاريخ بداية الإجازة</label>
                <input
                type="date"
                name="from_date"
                value={formData.from_date}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* تاريخ نهاية الإجازة (to_date) */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">تاريخ نهاية الإجازة</label>
                <input
                type="date"
                name="to_date"
                value={formData.to_date}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* رقم أمر التنفيذ (execution_order_number) */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">رقم أمر التنفيذ</label>
                <input
                type="text"
                name="execution_order_number"
                placeholder="رقم أمر التنفيذ"
                value={formData.execution_order_number}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* تاريخ أمر التنفيذ (execution_order_date) */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">تاريخ أمر التنفيذ</label>
                <input
                type="date"
                name="execution_order_date"
                value={formData.execution_order_date}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>


            {/* ملاحظات (notes) */}
            <div className="col-span-1 md:col-span-2 flex flex-col">
                <label className="font-medium text-gray-700 mb-1">ملاحظات</label>
                <textarea
                name="notes"
                placeholder="أدخل أي ملاحظات إضافية"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
            </div>

            {/* زر الإرسال */}
            <div className="col-span-1 md:col-span-2 flex justify-end items-center mt-4">
                <button
                type="submit"
                disabled={loading}
                className={`${
                    loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } text-white font-semibold py-2 px-6 rounded-xl shadow transition duration-200`}
                >
                {loading 
                    ? "جاري الإرسال..." 
                    : isEditMode ? "💾 حفظ التعديلات" : "➕ إضافة الإجازة"}
                </button>
            </div>
            </form>

        {message && (
          <p
            className={`mt-6 text-center font-medium text-lg ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateNewHoliday;