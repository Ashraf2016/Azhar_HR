// import React, { useState } from 'react';
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import axiosInstance from '@/axiosInstance';

// // مكون حقل الإدخال
// const FormInput = ({ label, id, type = "text", required = false, value, readOnly = false, onChange }) => (
//   <div className="mb-4">
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       type={type}
//       name={id}
//       value={value || ""}
//       readOnly={readOnly}
//       required={required}
//       onChange={onChange}
//       className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
//       ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}
//       focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//     />
//   </div>
// );

// const SecondmentPage = () => {
//   const navigate = useNavigate();
//   const params = useParams();
//   const employeeId = params.employeeID; // مطابق للـ Route

//   const location = useLocation();
//   const { employeeName, currentRank } = location.state || {};

//   const initialState = {
//     employee_id: employeeId,
//     university: "",
//     faculty_name: "",
//     memo_date: "",
//     start_date: "",
//     end_date: ""
//   };

//   const [formData, setFormData] = useState(initialState);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ✅ Popup State
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupMessage, setPopupMessage] = useState("");

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       await axiosInstance.post("/secondments/add", formData);

//       setPopupMessage("✅ تم إرسال طلب الانتداب بنجاح");
//       setShowPopup(true);

//       // ✅ تفريغ الفورم بعد النجاح مع إبقاء رقم الموظف
//       setFormData({
//         ...initialState,
//         employee_id: employeeId
//       });

//     } catch (error) {
//       console.error(error);
//       setPopupMessage("❌ حدث خطأ أثناء الإرسال");
//       setShowPopup(true);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

//       <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="bg-gray-500 absolute top-20 left-20 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
//         >
//           ⬅️ عودة
//         </button>
//         <h1 className="text-2xl font-bold mb-4 text-right">
//           📋 طلب انتداب عضو هيئة تدريس
//         </h1>

//         {/* ✅ اسم الموظف ودرجته */}
//         <div className="bg-gray-100 p-4 rounded mb-6 text-right">
//           <p><strong>اسم الموظف:</strong> {employeeName || "غير متوفر"}</p>
//           <p><strong>الدرجة العلمية:</strong> {currentRank || "غير متوفرة"}</p>
//         </div>

//         <form onSubmit={handleSubmit} dir="rtl">

//           <FormInput
//             label="رقم الموظف"
//             id="employee_id"
//             required
//             value={formData.employee_id}
//             readOnly
//           />

//           <FormInput
//             label="اسم الجامعة المنتدب إليها"
//             id="university"
//             required
//             value={formData.university}
//             onChange={handleChange}
//           />

//           <FormInput
//             label="اسم الكلية"
//             id="faculty_name"
//             required
//             value={formData.faculty_name}
//             onChange={handleChange}
//           />

//           <FormInput
//             label="تاريخ المذكرة"
//             id="memo_date"
//             type="date"
//             value={formData.memo_date}
//             onChange={handleChange}
//           />

//           <FormInput
//             label="تاريخ بداية الانتداب"
//             id="start_date"
//             type="date"
//             required
//             value={formData.start_date}
//             onChange={handleChange}
//           />

//           <FormInput
//             label="تاريخ نهاية الانتداب"
//             id="end_date"
//             type="date"
//             required
//             value={formData.end_date}
//             onChange={handleChange}
//           />

//           <div className="text-center pt-4">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
//             </button>
//           </div>

//         </form>
//       </div>

//       {/* ✅ POPUP FULL SCREEN */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">

//             <h2 className="text-2xl font-bold mb-4">
//               إشعار النظام
//             </h2>

//             <p className="text-gray-700 mb-6">
//               {popupMessage}
//             </p>

//             <button
//               onClick={() => setShowPopup(false)}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               موافق
//             </button>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default SecondmentPage;


import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from '@/axiosInstance';

const FormInput = ({ label, id, type = "text", required = false, value, readOnly = false, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={id}
      value={value || ""}
      readOnly={readOnly}
      required={required}
      onChange={onChange}
      className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}
      focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
    />
  </div>
);

const SecondmentPage = () => {
  const navigate = useNavigate();
  const { employeeID, serialNumber } = useParams(); // serialNumber موجود لو التعديل
  const location = useLocation();
  const employeeinfo = location.state;
  const passedData = location.state?.secondmentData; // البيانات الممررة من صفحة أخرى للتعديل
console.log(employeeinfo)
  const isEditMode = !!serialNumber;

  // فورم البيانات
  const [formData, setFormData] = useState({
    employee_id: employeeID || "",
    university: "",
    faculty_name: "",
    memo_date: "",
    start_date: "",
    end_date: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // 📝 تحميل البيانات إذا كان في وضع التعديل
  useEffect(() => {
    if (isEditMode && passedData) {
      setFormData({
        employee_id: passedData.employee_id || employeeID || "",
        university: passedData.university || "",
        faculty_name: passedData.faculty_name || "",
        memo_date: passedData.memo_date ? passedData.memo_date.split("T")[0] : "",
        start_date: passedData.start_date ? passedData.start_date.split("T")[0] : "",
        end_date: passedData.end_date ? passedData.end_date.split("T")[0] : "",
      });
    }
  }, [isEditMode, passedData, employeeID]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPopupMessage("");

    try {
      if (isEditMode) {
        await axiosInstance.put(`/secondments/${serialNumber}`, formData);
        setPopupMessage("✅ تم تعديل طلب الانتداب بنجاح");
        navigate(`/secondment/${employeeID}`)
      } else {
        await axiosInstance.post("/secondments/add", formData);
        setPopupMessage("✅ تم إرسال طلب الانتداب بنجاح");
        // تفريغ الفورم بعد الإضافة
        setFormData({
          employee_id: employeeID,
          university: "",
          faculty_name: "",
          memo_date: "",
          start_date: "",
          end_date: ""
        });
      }
      setShowPopup(true);
    } catch (error) {
      console.error(error);
      setPopupMessage("❌ حدث خطأ أثناء الإرسال");
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8 relative">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 absolute top-6 left-6 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
        >
          ⬅️ عودة
        </button>
        <h1 className="text-2xl font-bold mb-4 text-right">
          📋 {isEditMode ? "تعديل طلب الانتداب" : "طلب انتداب عضو هيئة تدريس"}
        </h1>
        <div className='text-right py-3 mb-3'>
          <h2> الاسم : {employeeinfo.employeeName}</h2>
          <h2> الدرجة الحالية : {employeeinfo.currentRank}</h2>
        </div>
        <form onSubmit={handleSubmit} dir="rtl">

          <FormInput
            label="رقم الموظف"
            id="employee_id"
            required
            value={formData.employee_id}
            readOnly
          />

          <FormInput
            label="اسم الجامعة المنتدب إليها"
            id="university"
            required
            value={formData.university}
            onChange={handleChange}
          />

          <FormInput
            label="اسم الكلية"
            id="faculty_name"
            required
            value={formData.faculty_name}
            onChange={handleChange}
          />

          <FormInput
            label="تاريخ المذكرة"
            id="memo_date"
            type="date"
            value={formData.memo_date}
            onChange={handleChange}
          />

          <FormInput
            label="تاريخ بداية الانتداب"
            id="start_date"
            type="date"
            required
            value={formData.start_date}
            onChange={handleChange}
          />

          <FormInput
            label="تاريخ نهاية الانتداب"
            id="end_date"
            type="date"
            required
            value={formData.end_date}
            onChange={handleChange}
          />

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isSubmitting ? "جاري الإرسال..." : isEditMode ? "💾 حفظ التعديلات" : "إرسال الطلب"}
            </button>
          </div>

        </form>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">إشعار النظام</h2>
            <p className="text-gray-700 mb-6">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              موافق
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SecondmentPage;
