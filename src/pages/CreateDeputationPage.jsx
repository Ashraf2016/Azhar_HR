// import React, { useState, useEffect } from "react";
// // import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "@/axiosInstance";
// const AddDeputationPage = () => {
//   const { employeeID } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     university_file_number: "",
//     type: "",
//     deputed_country: "",
//     university_name: "",
//     deputation_date: "",
//     to_date: "",
//     renewal_year: "",
//     execution_order_number: "",
//     execution_order_date: "",
//     notes: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [types, setTypes] = useState([]);

//   // تعبئة رقم الملف الجامعي
//   useEffect(() => {
//     if (employeeID) {
//       setFormData((prev) => ({
//         ...prev,
//         university_file_number: employeeID,
//       }));
//     }
//   }, [employeeID]);

//   // جلب أنواع الإعارات من API
//   useEffect(() => {
//     const fetchTypes = async () => {
//       try {
//         const res = await axiosInstance.get("/deputation/types")
//         setTypes(res.data);
//       } catch (err) {
//         console.error("خطأ في جلب أنواع الإعارة:", err);
//       }
//     };

//     fetchTypes();
//   }, []);

//   // تحديث البيانات
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // إرسال البيانات
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await axiosInstance.post("/deputation/add", 
//             formData,
//             {
//               headers: {
//                 "Content-Type": "application/json", 
//               },
//             }
//         );


//       setMessage("✅ تم إنشاء الإعارة بنجاح!");
//       console.log(res.data);
     

//       setFormData({
//         university_file_number: employeeID || "",
//         type: "",
//         deputed_country: "",
//         university_name: "",
//         deputation_date: "",
//         to_date: "",
//         renewal_year: "",
//         execution_order_number: "",
//         execution_order_date: "",
//         notes: "",
//       });
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ حدث خطأ أثناء إنشاء الإعارة. تأكد من البيانات  .");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 flex justify-center items-start" >
//          {/* زر الرجوع أعلى اليسار */}
//         <div className="mb-4 mx-2">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-xl cursor-pointer shadow transition duration-200"
//           >
//             ⬅️ رجوع
//           </button>
//         </div>
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl border border-gray-200" dir="rtl">

//         <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
//           إضافة إعارة جديدة
//         </h1>

//         <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 md:grid-cols-2 gap-6"
//             >
//             {/* القسم الأول */}
//             <div className="col-span-1 md:col-span-2">
//                 <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
//                 البيانات الأساسية
//                 </h2>
//             </div>

//             {/* رقم الملف الجامعي */}
//             <div className="flex flex-col">
//                 <label className="font-medium text-gray-700 mb-1">رقم الملف الجامعي</label>
//                 <input
//                 type="number"
//                 name="university_file_number"
//                 placeholder="رقم الملف الجامعي"
//                 value={formData.university_file_number}
//                 readOnly
//                 className="border rounded-xl p-3 bg-gray-100 text-gray-700 cursor-not-allowed shadow-inner"
//                 />
//             </div>

//             {/* نوع الإعارة */}
//             <div className="flex flex-col">
//                 <label className="font-medium text-gray-700 mb-1">نوع الإعارة</label>
//                 <select
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 >
//                 <option value="">اختر نوع الإعارة</option>
//                 {types.map((deputationType, index) => (
//                     <option key={index} value={deputationType}>
//                         {deputationType}
//                     </option>
//                 ))}
//                 </select>
//             </div>

//             {/* الدولة المعار إليها */}
//             <div className="flex flex-col">
//                 <label className="font-medium text-gray-700 mb-1">الدولة المعار إليها</label>
//                 <input
//                 type="text"
//                 name="deputed_country"
//                 placeholder="مثال: Germany"
//                 value={formData.deputed_country}
//                 onChange={handleChange}
//                 className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* اسم الجامعة */}
//             <div className="flex flex-col">
//                 <label className="font-medium text-gray-700 mb-1">اسم الجامعة أو الجهة</label>
//                 <input
//                 type="text"
//                 name="university_name"
//                 placeholder="مثال: Technical University of Munich"
//                 value={formData.university_name}
//                 onChange={handleChange}
//                 className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* القسم الثاني */}
//             <div className="col-span-1 md:col-span-2 mt-2">
//                 <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
//                 تفاصيل المدة والتنفيذ
//                 </h2>
//             </div>

//             {/* تاريخ الإعارة */}
//             <div className="flex flex-col">
//                 <label className="font-medium text-gray-700 mb-1">تاريخ الإعارة</label>
//                 <input
//                 type="date"
//                 name="deputation_date"
//                 value={formData.deputation_date}
//                 onChange={handleChange}
//                 className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* حتى تاريخ */}
//             <div className="flex flex-col">
//                 <label className="font-medium text-gray-700 mb-1">حتى تاريخ</label>
//                 <input
//                 type="date"
//                 name="to_date"
//                 value={formData.to_date}
//                 onChange={handleChange}
//                 className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* عام التجديد */}
//             <div className="flex flex-col">
//                 <label className="font-medium text-gray-700 mb-1">عام التجديد</label>
//                 <input
//                 type="text"
//                 name="renewal_year"
//                 placeholder="مثال: 2025"
//                 value={formData.renewal_year}
//                 onChange={handleChange}
//                 className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* رقم أمر التنفيذ */}
//             <div className="flex flex-col">
//                 <label className="font-medium text-gray-700 mb-1">رقم أمر التنفيذ</label>
//                 <input
//                 type="text"
//                 name="execution_order_number"
//                 placeholder="مثال: EXO-2025-001"
//                 value={formData.execution_order_number}
//                 onChange={handleChange}
//                 className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* تاريخ أمر التنفيذ */}
//             <div className="flex flex-col">
//                 <label className="font-medium text-gray-700 mb-1">تاريخ أمر التنفيذ</label>
//                 <input
//                 type="date"
//                 name="execution_order_date"
//                 value={formData.execution_order_date}
//                 onChange={handleChange}
//                 className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* ملاحظات */}
//             <div className="col-span-1 md:col-span-2 flex flex-col">
//                 <label className="font-medium text-gray-700 mb-1">ملاحظات</label>
//                 <textarea
//                 name="notes"
//                 placeholder="أدخل أي ملاحظات إضافية"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 rows="3"
//                 className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 ></textarea>
//             </div>

//             {/* زر الإرسال */}
//             <div className="col-span-1 md:col-span-2 flex justify-end items-center mt-4">
//                 <button
//                 type="submit"
//                 disabled={loading}
//                 className={`${
//                     loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//                 } text-white font-semibold py-2 px-6 rounded-xl shadow transition duration-200`}
//                 >
//                 {loading ? "جاري الإرسال..." : "➕ إضافة الإعارة"}
//                 </button>
//             </div>
//             </form>

//         {message && (
//           <p
//             className={`mt-6 text-center font-medium text-lg ${
//               message.includes("✅") ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddDeputationPage;



import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // 💡 إضافة useLocation
import axiosInstance from "@/axiosInstance";

const AddDeputationPage = () => {
  // 1. استخراج employeeID و serialNumber من المسار
  const { employeeID, serialNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // 💡 استخدام useLocation لجلب البيانات المُمررة

  // تحديد وضع التشغيل والتاريخ المُمرر
  const isEditMode = !!serialNumber;
  const pageTitle = isEditMode ? "تعديل بيانات الإعارة" : "إضافة إعارة جديدة";
  
  // البيانات الأولية (قد تحتوي على بيانات التعديل المُمررة)
  const passedData = location.state?.deputationData;

  // دالة تحويل التاريخ إلى صيغة حقل الإدخال
  const formatToInputDate = (dateStr) =>
    dateStr && !dateStr.includes("1899") ? dateStr.split("T")[0] : "";

  const [formData, setFormData] = useState({
    university_file_number: passedData?.universityFileNumber || employeeID || "",
    type: passedData?.type || "",
    deputed_country: passedData?.deputedCountry || "",
    university_name: passedData?.universityName || "",
    // استخدام البيانات المُمررة مباشرة
    deputation_date: formatToInputDate(passedData?.deputationDate), 
    to_date: formatToInputDate(passedData?.deputationEndDate),
    renewal_year: passedData?.renewalYear || "",
    execution_order_number: passedData?.executionOrderNumber || "",
    execution_order_date: formatToInputDate(passedData?.executionOrderDate),
    notes: passedData?.notes || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [types, setTypes] = useState([]);

  // 2. تعبئة رقم الملف الجامعي عند الإضافة فقط (وإزالة كود الجلب الفاشل)
  useEffect(() => {
    // تعبئة رقم الملف الجامعي إذا كان وضع إضافة
    if (employeeID && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        university_file_number: employeeID,
      }));
    }
  }, [employeeID, isEditMode]);
  
  // جلب أنواع الإعارات من API
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axiosInstance.get("/deputation/types")
        setTypes(res.data);
      } catch (err) {
        console.error("خطأ في جلب أنواع الإعارة:", err);
      }
    };
    fetchTypes();
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
    // الـ URL للتعديل يستخدم serialNumber و employeeID
    const url = isEditMode
        ? `/deputation/${employeeID}/${serialNumber}`
        : "/deputation/add";

    try {
      const res = await axiosInstance[method](url, 
            formData,
            {
              headers: {
                "Content-Type": "application/json", 
              },
            }
        );

      const successMessage = isEditMode
            ? "✅ تم تعديل الإعارة بنجاح!"
            : "✅ تم إنشاء الإعارة بنجاح!";
      setMessage(successMessage);
      console.log(res.data);
     
      // في حالة التعديل، نعود لصفحة العرض بعد ثانية
      if (isEditMode) {
            // التوجيه إلى صفحة العرض (employee/deputation/1234)
            setTimeout(() => navigate(`/employee/deputation/${employeeID}`), 1000);
            return;
      }
      
      // تفريغ الحقول في حالة الإضافة الجديدة فقط
      setFormData({
        university_file_number: employeeID || "",
        type: "",
        deputed_country: "",
        university_name: "",
        deputation_date: "",
        to_date: "",
        renewal_year: "",
        execution_order_number: "",
        execution_order_date: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      const errorMessage = isEditMode
            ? "❌ حدث خطأ أثناء تعديل الإعارة. تأكد من البيانات."
            : "❌ حدث خطأ أثناء إنشاء الإعارة. تأكد من البيانات.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center items-start" >
         {/* زر الرجوع أعلى اليسار */}
        <div className="mb-4 mx-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-xl cursor-pointer shadow transition duration-200"
          >
            ⬅️ رجوع
          </button>
        </div>
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl border border-gray-200" dir="rtl">

        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          {pageTitle} {/* العنوان */}
        </h1>

        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
            {/* القسم الأول */}
            <div className="col-span-1 md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                البيانات الأساسية
                </h2>
            </div>

            {/* رقم الملف الجامعي */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">رقم الملف الجامعي</label>
                <input
                type="number"
                name="university_file_number"
                placeholder="رقم الملف الجامعي"
                value={formData.university_file_number}
                readOnly
                className="border rounded-xl p-3 bg-gray-100 text-gray-700 cursor-not-allowed shadow-inner"
                />
            </div>

            {/* نوع الإعارة */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">نوع الإعارة</label>
                <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                <option value="">اختر نوع الإعارة</option>
                {types.map((deputationType, index) => (
                    <option key={index} value={deputationType}>
                        {deputationType}
                    </option>
                ))}
                </select>
            </div>

            {/* الدولة المعار إليها */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">الدولة المعار إليها</label>
                <input
                type="text"
                name="deputed_country"
                placeholder="مثال: Germany"
                value={formData.deputed_country}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* اسم الجامعة */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">اسم الجامعة أو الجهة</label>
                <input
                type="text"
                name="university_name"
                placeholder="مثال: Technical University of Munich"
                value={formData.university_name}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* القسم الثاني */}
            <div className="col-span-1 md:col-span-2 mt-2">
                <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                تفاصيل المدة والتنفيذ
                </h2>
            </div>

            {/* تاريخ الإعارة */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">تاريخ الإعارة</label>
                <input
                type="date"
                name="deputation_date"
                value={formData.deputation_date}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* حتى تاريخ */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">حتى تاريخ</label>
                <input
                type="date"
                name="to_date"
                value={formData.to_date}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* عام التجديد */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">عام التجديد</label>
                <input
                type="text"
                name="renewal_year"
                placeholder="مثال: 2025"
                value={formData.renewal_year}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* رقم أمر التنفيذ */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">رقم أمر التنفيذ</label>
                <input
                type="text"
                name="execution_order_number"
                placeholder="مثال: EXO-2025-001"
                value={formData.execution_order_number}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* تاريخ أمر التنفيذ */}
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

            {/* ملاحظات */}
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
                    : isEditMode ? "💾 حفظ التعديلات" : "➕ إضافة الإعارة"}
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

export default AddDeputationPage;