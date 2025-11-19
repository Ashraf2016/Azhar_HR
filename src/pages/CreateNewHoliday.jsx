// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom"; 
// // تأكد من أنك ستستخدم useNavigate لتنفيذ عملية العودة بعد الحفظ مثلاً، 
// // لكن لن تحتاجها للانتقال من هذا المكون إذا كنت تستخدمه كصفحة منفصلة.

// // ======================================================================
// // [1] مكون التنبيه المنبثق (Toast Component)
// // (يجب نقله هنا لأنه يستخدم في هذا المكون)
// // ======================================================================
// const ToastNotification = ({ message, type, onClose }) => {
//     let bgColor = '';
//     let icon = '';
//     let textColor = '';

//     if (type === 'success') {
//         bgColor = 'bg-green-100 border-green-400';
//         textColor = 'text-green-700';
//         icon = '✅';
//     } else if (type === 'error') {
//         bgColor = 'bg-red-100 border-red-400';
//         textColor = 'text-red-700';
//         icon = '❌';
//     } else {
//         bgColor = 'bg-gray-100 border-gray-400';
//         textColor = 'text-gray-700';
//         icon = 'ℹ️';
//     }

//     return (
//         <div 
//             className="fixed top-5 right-5 z-[100] transition-opacity duration-300 ease-out"
//             dir="rtl"
//         >
//             <div className={`flex items-center ${bgColor} border-r-4 p-4 rounded shadow-lg max-w-sm`} role="alert">
//                 <div className={`${textColor} font-bold text-xl ml-3`}>{icon}</div>
//                 <p className={`font-semibold text-sm ${textColor} flex-grow`}>
//                     {message}
//                 </p>
//                 <button 
//                     onClick={onClose} 
//                     className={`ml-4 ${textColor} opacity-80 hover:opacity-100 transition`}
//                     aria-label="Close"
//                 >
//                     <svg className="h-5 w-5 fill-current" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1 1 0 0 1-1.414 0L10 11.414l-2.93 2.93a1 1 0 0 1-1.414-1.414l2.93-2.93-2.93-2.93a1 1 0 0 1 1.414-1.414l2.93 2.93 2.93-2.93a1 1 0 0 1 1.414 1.414l-2.93 2.93 2.93 2.93a1 1 0 0 1 0 1.414z"/></svg>
//                 </button>
//             </div>
//         </div>
//     );
// };

// // ======================================================================
// // [2] مكون حقل الإدخال (InputField Component)
// // (يجب نقله هنا لأنه يستخدم في هذا المكون)
// // ======================================================================
// const InputField = ({ label, name, value, readOnly = false, onChange, type = "text", required = false }) => (
//     <div className="flex flex-col">
//         <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
//             {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         <input
//             type={type}
//             id={name}
//             name={name}
//             value={value}
//             readOnly={readOnly}
//             onChange={onChange}
//             required={required}
//             className={`p-2 border border-gray-300 rounded-lg ${readOnly ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
//         />
//     </div>
// );


// // ======================================================================
// // [3] المكون الرئيسي: CreateNewHoliday
// // ======================================================================
// const CreateNewHoliday = () => {
//     // جلب رقم الملف من الـ URL
//     const { employeeID } = useParams();
//     const navigate = useNavigate();

//     // ------------------------- حالات الإجازة الجديدة والتحميل -------------------------
//     const [employeeInfo, setEmployeeInfo] = useState(null);
//     const [leaveOptions, setLeaveOptions] = useState([]); 
//     const [loadingOptions, setLoadingOptions] = useState(true);
    
//     // 🛑 الحالة الجديدة لرسالة التنبيه (Toast Notification)
//     const [toastMessage, setToastMessage] = useState({ show: false, message: '', type: '' });

//     // ------------------------- حالات إضافة إجازة جديدة -------------------------
//     const [newHolidayData, setNewHolidayData] = useState({
//         university_file_number: employeeID,
//         applicant_name: "",
//         serial_number: "", 
//         grant_type: "اعتماد اجازة", 
//         leave_code: "", 
//         leave_type: "", 
//         country_code: "", 
//         country_name: "", 
//         duration_days: "",
//         leave_method: "", 
//         from_date: "", 
//         to_date: "",   
//         receipt_date: "", 
//         execution_order_number: "", 
//         execution_order_date: "", 
//         travel_status: "مع عدم العمل", 
//         notes: "",
//     });

//     // ------------------------- دالة جلب خيارات الإجازة -------------------------
//     const fetchLeaveOptions = async () => {
//         try {
//             setLoadingOptions(true);
//             const res = await axios.get("https://university.roboeye-tec.com/holidays/options");
            
//             const cleanOptions = res.data.leave_types
//                 .map(opt => opt.trim())
//                 .filter(opt => opt && !opt.includes('لا يوجد') && !opt.includes('لايوجد') && !opt.includes('لا بوجد') && opt !== 'لا');

//             setLeaveOptions([...new Set(cleanOptions)].sort()); 
//         } catch (err) {
//             console.error("Error fetching leave options:", err);
//             setToastMessage({ show: true, message: 'فشل تحميل خيارات الإجازات.', type: 'error' });
//         } finally {
//             setLoadingOptions(false);
//         }
//     };

//     // ------------------------- دالة جلب معلومات الموظف -------------------------
//     const fetchEmployeeInfo = async () => {
//         try {
//             const res = await axios.get(
//                 `https://university.roboeye-tec.com/employee/statement/${employeeID}`
//             );
//             const info = res.data.employeeInfo;
//             setEmployeeInfo(info);
            
//             setNewHolidayData(prev => ({
//                 ...prev,
//                 applicant_name: info.name || "",
//             }));
//         } catch (err) {
//             console.error(err);
//         }
//     };
    
//     // ------------------------- تأثيرات تحميل البيانات -------------------------
//     useEffect(() => {
//         if (employeeID) {
//             fetchEmployeeInfo();
//             fetchLeaveOptions();
//         }
//     }, [employeeID]);


//     // ------------------------- دالة الإدخال -------------------------
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewHolidayData(prev => ({ ...prev, [name]: value }));
//     };

//     // ------------------------- دالة الحفظ -------------------------
//     const handleCreateHoliday = async (e) => {
//         e.preventDefault();

//         // التحقق من الحقول الإلزامية
//         if (!newHolidayData.leave_type || !newHolidayData.from_date || !newHolidayData.to_date) {
//             setToastMessage({ show: true, message: 'الرجاء ملء حقول نوع الإجازة وتاريخ البدء وتاريخ الانتهاء.', type: 'error' });
//             return;
//         }
        
//         try {
//             const payload = {
//                 ...newHolidayData,
//                 university_file_number: employeeID,
//                 duration_days: newHolidayData.duration_days ? parseInt(newHolidayData.duration_days, 10) : null,
                
//                 // التأكد من إرسال جميع الحقول النصية كـ "" إذا كانت فارغة
//                 serial_number: newHolidayData.serial_number || "",
//                 leave_code: newHolidayData.leave_code || "",
//                 country_code: newHolidayData.country_code || "",
//                 country_name: newHolidayData.country_name || "",
//                 leave_method: newHolidayData.leave_method || "",
//                 execution_order_number: newHolidayData.execution_order_number || "",
//                 receipt_date: newHolidayData.receipt_date || "",
//                 execution_order_date: newHolidayData.execution_order_date || "",
//             };

//             await axios.post(
//                 "https://university.roboeye-tec.com/holidays",
//                 payload
//             );

//             setToastMessage({ show: true, message: 'تم إنشاء الإجازة بنجاح! 🎉', type: 'success' });
            
//             // بدلاً من إغلاق المودال، سنقوم بالعودة إلى الصفحة السابقة
//             setTimeout(() => navigate(-1), 1500); 

//         } catch (err) {
//             console.error("Error creating holiday:", err.response?.data || err.message);
//             const errorMessage = `فشل إنشاء الإجازة: ${err.response?.data?.message || err.message}`;
//             setToastMessage({ show: true, message: errorMessage, type: 'error' });
//         }
//     };


//     // دالة لإخفاء التوست تلقائياً
//     useEffect(() => {
//         if (toastMessage.show) {
//             const timer = setTimeout(() => {
//                 setToastMessage(prev => ({ ...prev, show: false }));
//             }, 5000); // 5 ثواني
//             return () => clearTimeout(timer);
//         }
//     }, [toastMessage.show]);
    
//     // إذا لم يكن هناك employeeID أو لم يتم تحميل البيانات بعد
//     if (!employeeInfo && loadingOptions) {
//         return <p className="text-center mt-10">جاري تحميل بيانات الموظف وخيارات الإجازات...</p>;
//     }
    
//     // ======================================================================
//     // الواجهة البصرية (JSX)
//     // ======================================================================
//     return (
//         <div className="min-h-screen w-[90%] m-auto text-right py-10" dir="rtl">
//             <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl m-auto p-8">
                
//                 {/* الرأس */}
//                 <div className="p-0 pb-2">
//                     <h2 className="text-2xl font-bold text-indigo-700 border-b pb-3 mb-4">
//                         إنشاء إجازة جديدة للموظف: {employeeInfo?.name}
//                     </h2>
//                     <p className="text-gray-600 mb-6">يرجى ملء جميع الحقول الإلزامية (*) لإنشاء الإجازة.</p>
//                 </div>

//                 {/* النموذج الفعلي */}
//                 <form onSubmit={handleCreateHoliday} className="space-y-6">
                    
//                     {/* بيانات تلقائية - للقراءة فقط */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <InputField label="رقم الملف الجامعي" name="university_file_number" value={employeeID || ""} readOnly />
//                         <InputField label="اسم مقدم الطلب" name="applicant_name" value={newHolidayData.applicant_name} readOnly />
//                         <InputField label="نوع المنح (ثابت)" name="grant_type" value={newHolidayData.grant_type} readOnly />
//                     </div>

//                     {/* حقول الإدخال الأساسية */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-lg bg-gray-50">
//                         <div className="col-span-full"><h3 className="font-semibold text-gray-700">بيانات الإجازة الأساسية</h3></div>
                        
//                         {/* نوع الإجازة (Select) */}
//                         <div className="flex flex-col">
//                             <label htmlFor="leave_type" className="text-sm font-medium text-gray-700 mb-1">نوع الإجازة <span className="text-red-500">*</span></label>
//                             <select
//                                 id="leave_type"
//                                 name="leave_type"
//                                 value={newHolidayData.leave_type}
//                                 onChange={handleInputChange}
//                                 className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                                 required
//                                 disabled={loadingOptions}
//                             >
//                                 <option value="" disabled>--- اختر نوع الإجازة ---</option>
//                                 {leaveOptions.map((option, idx) => (
//                                     <option key={idx} value={option}>{option}</option>
//                                 ))}
//                             </select>
//                              {loadingOptions && (
//                                 <p className="text-red-500 text-xs mt-1">جاري تحميل الخيارات...</p>
//                             )}
//                         </div>

//                         {/* حالة السفر */}
//                         <div className="flex flex-col">
//                             <label htmlFor="travel_status" className="text-sm font-medium text-gray-700 mb-1">حالة السفر</label>
//                             <select
//                                 id="travel_status"
//                                 name="travel_status"
//                                 value={newHolidayData.travel_status}
//                                 onChange={handleInputChange}
//                                 className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                             >
//                                 <option value="مع عدم العمل">مع عدم العمل</option>
//                                 <option value="مع العمل">مع العمل</option>
//                             </select>
//                         </div>
                        
//                         <InputField 
//                             label="اسم البلد" 
//                             name="country_name" 
//                             value={newHolidayData.country_name} 
//                             onChange={handleInputChange} 
//                             placeholder="مثل: السعودية"
//                         />
                        
//                         <InputField 
//                             label="مدة الإجازة (يوم)" 
//                             name="duration_days" 
//                             value={newHolidayData.duration_days} 
//                             onChange={handleInputChange} 
//                             type="number"
//                         />
//                     </div>

//                     {/* حقول التواريخ */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-lg bg-gray-50">
//                         <div className="col-span-full"><h3 className="font-semibold text-gray-700">التواريخ</h3></div>

//                         <InputField 
//                             label="من تاريخ" 
//                             name="from_date" 
//                             value={newHolidayData.from_date} 
//                             onChange={handleInputChange} 
//                             type="date"
//                             required
//                         />
//                         <InputField 
//                             label="إلى تاريخ" 
//                             name="to_date" 
//                             value={newHolidayData.to_date} 
//                             onChange={handleInputChange} 
//                             type="date"
//                             required
//                         />
//                         <InputField 
//                             label="تاريخ أمر التنفيذ" 
//                             name="execution_order_date" 
//                             value={newHolidayData.execution_order_date} 
//                             onChange={handleInputChange} 
//                             type="date"
//                         />
//                         <InputField 
//                             label="تاريخ الإيصال" 
//                             name="receipt_date" 
//                             value={newHolidayData.receipt_date} 
//                             onChange={handleInputChange} 
//                             type="date"
//                         />
//                     </div>

//                     {/* حقول البيانات الإضافية */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-lg bg-gray-50">
//                         <div className="col-span-full"><h3 className="font-semibold text-gray-700">بيانات إدارية إضافية</h3></div>
                        
//                         <InputField label="رقم أمر التنفيذ" name="execution_order_number" value={newHolidayData.execution_order_number} onChange={handleInputChange} />
//                         <InputField label="الرقم التسلسلي" name="serial_number" value={newHolidayData.serial_number} onChange={handleInputChange} />
//                         <InputField label="كود الإجازة" name="leave_code" value={newHolidayData.leave_code} onChange={handleInputChange} />
//                         <InputField label="طريقة الإجازة" name="leave_method" value={newHolidayData.leave_method} onChange={handleInputChange} />
//                         <InputField label="كود البلد" name="country_code" value={newHolidayData.country_code} onChange={handleInputChange} />

//                         {/* الملاحظات */}
//                         <div className="flex flex-col col-span-full">
//                             <label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-1">ملاحظات إضافية</label>
//                             <textarea
//                                 id="notes"
//                                 name="notes"
//                                 value={newHolidayData.notes}
//                                 onChange={handleInputChange}
//                                 rows={2}
//                                 className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                             ></textarea>
//                         </div>
//                     </div>
                    
//                     {/* أزرار التحكم */}
//                     <div className="flex justify-end space-x-3 pt-4 border-t">
//                         <button
//                             type="button"
//                             onClick={() => navigate(-1)}
//                             className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
//                         >
//                             إلغاء والعودة
//                         </button>
//                         <button
//                             type="submit"
//                             className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
//                             disabled={loadingOptions}
//                         >
//                             {loadingOptions ? "جاري التحميل..." : "حفظ الإجازة"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
            
//             {/* عرض رسالة التنبيه */}
//             {toastMessage.show && <ToastNotification message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(prev => ({ ...prev, show: false }))} />}

//         </div>
//     );
// };

// export default CreateNewHoliday;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "@/axiosInstance";

const CreateNewHoliday = () => {
  // 1. استخراج employeeID و serialNumber من المسار
  // serialNumber هو الـ ID الفريد للاجازة في وضع التعديل
  const { employeeID, serialNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // تحديد وضع التشغيل والتاريخ المُمرر
  const isEditMode = !!serialNumber;
  const pageTitle = isEditMode ? "تعديل بيانات الإجازة" : "إضافة إجازة جديدة";
  
  // البيانات الأولية (قد تحتوي على بيانات التعديل المُمررة)
  // ملاحظة: يُفترض أن البيانات المُمررة (holidayData) تأتي بنفس صيغة الـ API الجديدة
  const passedData = location.state?.holidayData;

  // دالة تحويل التاريخ إلى صيغة حقل الإدخال
  const formatToInputDate = (dateStr) =>
    dateStr && !dateStr.includes("1899") ? dateStr.split("T")[0] : "";

  // 💡 تحديث حقول formData لتناسب هيكلية البيانات الجديدة
  const [formData, setFormData] = useState({
    // بيانات الموظف (ثابتة)
    university_file_number: passedData?.university_file_number || employeeID || "",
    
    // بيانات الإجازة
    grant_type: passedData?.grant_type || "اعتماد اجازة", // افتراض قيمة لـ Grant Type
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
        university_file_number: employeeID,
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
        ...prev, // نحافظ على university_file_number
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
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center items-start">
        {/* زر الرجوع أعلى اليسار */}
        <div className="">
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
                name="university_file_number"
                value={formData.university_file_number}
                readOnly
                className="border rounded-xl p-3 bg-gray-100 text-gray-700 cursor-not-allowed shadow-inner"
                />
            </div>

            {/* نوع الإجازة (leave_type) */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">نوع الإجازة</label>
                <select
                name="grant_type"
                value={formData.grant_type}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                <option value="">اختر نوع الإجازة</option>
                {types.map((grantType, index) => (
                    <option key={index} value={grantType}>
                        {grantType}
                    </option>
                ))}
                </select>
            </div>
            
            {/* 💡 نوع المنح (grant_type) - ثابتة غالباً */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">سبب الاجازة </label>
                {/* <input
                type="text"
                name="grant_type"
                placeholder="مثال: اعتماد اجازة"
                value={formData.grant_type}
                onChange={handleChange}
                className="border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                /> */}
                <select
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
                </select>
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