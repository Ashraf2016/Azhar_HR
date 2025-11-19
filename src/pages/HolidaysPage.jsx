// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// // تأكد من أن مسار الصورة صحيح بناءً على هيكل مشروعك
// import Logo from "../assets/Logo.png"; 

// // ========================= مكون الرسالة المنبثقة (POPUP) =========================

// const MessagePopup = ({ message, type }) => {
//     // تحديد الألوان والأيقونات بناءً على النوع
//     const isSuccess = type === 'success';
//     const bgColor = isSuccess ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800';
//     const icon = isSuccess ? '✅' : '❌';

//     return (
//         <div className="fixed bottom-5 right-5 flex items-center justify-center z-[1000] transition-opacity duration-300">
//             <div className={`border-r-4 ${bgColor} rounded-lg shadow-2xl w-full max-w-sm`} role="alert" dir="rtl">
//                 <div className="p-4 flex items-center">
//                     <div className="text-2xl ml-3 flex-shrink-0">{icon}</div>
//                       <div>
//                           <p className="font-bold text-md">{isSuccess ? 'عملية ناجحة' : 'عملية فاشلة'}</p>
//                           <p className="text-sm">{message}</p>
//                       </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ========================= مكون تأكيد الحذف (MODAL) ========================
// const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
//     return (
//         <div className="fixed inset-0 bg-gray-600/50 bg-opacity-75 flex items-center justify-center z-[1000]" dir="rtl">
//             <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 transform transition-all">
//                 <div className="text-center">
//                     <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
//                         <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16.333c-.77 1.333.192 3 1.732 3z"></path>
//                         </svg>
//                     </div>
//                     <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">تأكيد الحذف</h3>
//                     <div className="mt-2">
//                         <p className="text-sm text-gray-500">
//                             هل أنت متأكد من أنك تريد حذف هذه الإجازة؟ لا يمكن التراجع عن هذا الإجراء.
//                         </p>
//                     </div>
//                 </div>
//                 <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse justify-center gap-3">
//                     <button
//                         type="button"
//                         className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
//                         onClick={onConfirm}
//                     >
//                         نعم، احذفها
//                     </button>
//                     <button
//                         type="button"
//                         className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
//                         onClick={onCancel}
//                     >
//                         إلغاء
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // ======================================================================
// // ======================= مكون حقل الإدخال الصغير (مساعد) =======================
// // ======================================================================
// const InputField = ({ label, name, value, onChange, type = "text", readOnly = false, required = false }) => (
//     <div className="flex flex-col">
//         <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
//             {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         <input
//             id={name}
//             name={name}
//             type={type}
//             value={value || ""}
//             onChange={onChange}
//             readOnly={readOnly}
//             required={required}
//             // يجب أن تكون قيمة حقل التاريخ بالتنسيق YYYY-MM-DD
//             className={`p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${readOnly ? 'bg-gray-100' : 'bg-white'}`}
//         />
//     </div>
// );

// const EmployeeHolidaysPage = () => {
//   const { employeeID } = useParams();
//   const navigate = useNavigate();
//   
//   // ------------------------- حالات الإجازات والتحميل -------------------------
//   const [holidays, setHolidays] = useState([]);
//   const [employeeInfo, setEmployeeInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   
//   // ------------------------- حالات خيارات الإجازة -------------------------
//   const [leaveOptions, setLeaveOptions] = useState([]); 

//   // ✅ الحالة الجديدة لرسالة النافذة المنبثقة (Popup)
//   const [popupMessage, setPopupMessage] = useState({
//     show: false,
//     type: '', // 'success' أو 'error'
//     message: ''
//   });

//   // ------------------------- حالات الإضافة/التعديل -------------------------
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   // ✅ الحالة الجديدة لتتبع معرف الإجازة المراد تعديلها (null = إنشاء)
//   const [editingHolidayId, setEditingHolidayId] = useState(null);
//   // ✅ الحالة لتأكيد الحذف
//   const [holidayToDelete, setHolidayToDelete] = useState(null); 


//   const [newHolidayData, setNewHolidayData] = useState({
//     university_file_number: employeeID,
//     applicant_name: "",
//     serial_number: "", 
//     grant_type: "اعتماد اجازة", 
//     leave_code: "", 
//     leave_type: "", 
//     country_code: "", 
//     country_name: "", 
//     duration_days: "",
//     leave_method: "", 
//     from_date: "", 
//     to_date: "",  
//     receipt_date: "", 
//     execution_order_number: "", 
//     execution_order_date: "", 
//     travel_status: "مع عدم العمل", 
//     notes: "",
//   });

//   // ------------------------- دوال مساعدة -------------------------
//   const formatDate = (dateStr) => {
//     if (!dateStr || dateStr.includes("1899")) return "-";
//     return new Date(dateStr).toLocaleDateString("ar-EG");
//   };

//   // دالة لتحويل تاريخ إلى تنسيق HTML YYYY-MM-DD
//   const formatToHtmlDate = (dateStr) => {
//     if (!dateStr || dateStr.includes("1899")) return "";
//     try {
//         return new Date(dateStr).toISOString().substring(0, 10);
//     } catch (e) {
//         return "";
//     }
//   };
//   
//   // ------------------------- دالة لإخفاء الـ Popup -------------------------
//   const hidePopup = useCallback(() => {
//     setPopupMessage({ show: false, type: '', message: '' });
//   }, []);


//   // ------------------------- دالة لعرض وإخفاء الـ Popup تلقائيًا -------------------------
//   const showAndHidePopup = useCallback((type, message) => {
//     setPopupMessage({ show: true, type, message });
//     setTimeout(hidePopup, 5000); 
//   }, [hidePopup]);

//   // ------------------------- دالة لإعادة تعيين وإغلاق النافذة المنبثقة -------------------------
//   const closeModal = useCallback(() => {
//     setIsModalOpen(false);
//     setEditingHolidayId(null); // هام للعودة لوضع الإنشاء
//     // إعادة تعيين بيانات النموذج
//     setNewHolidayData(prev => ({ 
//         ...prev, 
//         serial_number: "", leave_code: "", leave_type: "", country_code: "", country_name: "", 
//         duration_days: "", leave_method: "", from_date: "", to_date: "", receipt_date: "", 
//         execution_order_number: "", execution_order_date: "", travel_status: "مع عدم العمل", notes: "",
//     }));
//   }, []);


//   // ------------------------- دالة جلب الإجازات -------------------------
//   const fetchHolidays = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `https://university.roboeye-tec.com/holidays/employee/${employeeID}`
//       );
//       setHolidays(res.data);
//       setError("");
//     } catch (err) {
//       console.error(err);
//       setError("حدث خطأ أثناء تحميل بيانات الإجازات.");
//     } finally {
//       setLoading(false);
//     }
//   }, [employeeID]);

//   // ------------------------- دالة جلب خيارات الإجازة -------------------------
//   const fetchLeaveOptions = async () => {
//     try {
//         const res = await axios.get("https://university.roboeye-tec.com/holidays/options");
//         
//         const cleanOptions = res.data.leave_types
//             .map(opt => opt.trim())
//             .filter(opt => opt && !opt.includes('لا يوجد') && !opt.includes('لايوجد') && !opt.includes('لا بوجد') && opt !== 'لا');

//         setLeaveOptions([...new Set(cleanOptions)].sort()); 
//     } catch (err) {
//         console.error("Error fetching leave options:", err);
//     }
//   };

//   // ------------------------- تأثيرات تحميل البيانات -------------------------
//   useEffect(() => {
//     if (employeeID) {
//       fetchHolidays();
//       fetchLeaveOptions();
//     }
//   }, [employeeID, fetchHolidays]);

//   useEffect(() => {
//     const fetchEmployeeInfo = async () => {
//       try {
//         const res = await axios.get(
//           `https://university.roboeye-tec.com/employee/statement/${employeeID}`
//         );
//         const info = res.data.employeeInfo;
//         setEmployeeInfo(info);
//         
//         setNewHolidayData(prev => ({
//             ...prev,
//             applicant_name: info.name || "",
//         }));
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     if (employeeID) fetchEmployeeInfo();
//   }, [employeeID]);

//   // ------------------------- دوال الإجازة الجديدة -------------------------
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewHolidayData(prev => ({ ...prev, [name]: value }));
//   };


//   // ----------------------------------------------------------------------
//   // ✅ [وظيفة جديدة] فتح النافذة في وضع التعديل (Edit) وجلب البيانات
//   // ----------------------------------------------------------------------
//   const handleEditClick = async (holiday) => {
//     setEditingHolidayId(holiday.id); 
//     hidePopup();

//     try {
//         // جلب تفاصيل الإجازة بالكامل
//         const response = await axios.get(`https://university.roboeye-tec.com/holidays/${holiday.id}`);
//         const holidayDetails = response.data; 

//         // تعبئة حالة النموذج ببيانات الإجازة المجلوبة
//         setNewHolidayData({
//             university_file_number: employeeID,
//             applicant_name: employeeInfo?.name || "",
//             serial_number: holidayDetails.serial_number || "",
//             grant_type: holidayDetails.grant_type || "اعتماد اجازة", 
//             leave_code: holidayDetails.leave_code || "",
//             leave_type: holidayDetails.leave_type || "", 
//             country_code: holidayDetails.country_code || "",
//             country_name: holidayDetails.country_name || "",
//             duration_days: holidayDetails.duration_days || "",
//             leave_method: holidayDetails.leave_method || "", 
//             // تحويل التواريخ إلى تنسيق HTML 'YYYY-MM-DD'
//             from_date: formatToHtmlDate(holidayDetails.from_date), 
//             to_date: formatToHtmlDate(holidayDetails.to_date),  
//             receipt_date: formatToHtmlDate(holidayDetails.receipt_date), 
//             execution_order_number: holidayDetails.execution_order_number || "", 
//             execution_order_date: formatToHtmlDate(holidayDetails.execution_order_date), 
//             travel_status: holidayDetails.travel_status || "مع عدم العمل", 
//             notes: holidayDetails.notes || "",
//         });

//         setIsModalOpen(true);
//     } catch (err) {
//         console.error("Error fetching holiday details for edit:", err);
//         showAndHidePopup('error', 'فشل تحميل بيانات الإجازة للتعديل.');
//     }
//   };


//   // ----------------------------------------------------------------------
//   // ✅ [وظيفة مُعدَّلة] حفظ/تحديث الإجازة (POST / PUT)
//   // ----------------------------------------------------------------------
//   const handleSaveHoliday = async (e) => {
//     e.preventDefault();
//     hidePopup();

//     if (!newHolidayData.leave_type || !newHolidayData.from_date || !newHolidayData.to_date) {
//         showAndHidePopup(
//           'error',
//           'الرجاء ملء حقول نوع الإجازة وتاريخ البدء وتاريخ الانتهاء المطلوبة.',
//         );
//         return;
//     }
//     
//     try {
//       const payload = {
//         ...newHolidayData,
//         university_file_number: employeeID,
//         duration_days: newHolidayData.duration_days ? parseInt(newHolidayData.duration_days, 10) : null,
//         
//         serial_number: newHolidayData.serial_number || "",
//         leave_code: newHolidayData.leave_code || "",
//         country_code: newHolidayData.country_code || "",
//         country_name: newHolidayData.country_name || "",
//         leave_method: newHolidayData.leave_method || "",
//         execution_order_number: newHolidayData.execution_order_number || "",
//         receipt_date: newHolidayData.receipt_date || "",
//         execution_order_date: newHolidayData.execution_order_date || "",
//       };

//       const apiUrl = "https://university.roboeye-tec.com/holidays";

//       if (editingHolidayId) {
//           // وضع التعديل (PUT)
//           await axios.put(`${apiUrl}/${editingHolidayId}`, payload);
//           showAndHidePopup('success', 'تم تحديث بيانات الإجازة بنجاح! ✏️');
//       } else {
//           // وضع الإنشاء (POST)
//           await axios.post(apiUrl, payload);
//           showAndHidePopup('success', 'تم إنشاء الإجازة بنجاح! 🎉');
//       }

//       closeModal(); // إغلاق وإعادة تعيين النموذج
//       await fetchHolidays(); 

//     } catch (err) {
//       const isEdit = !!editingHolidayId;
//       const action = isEdit ? 'تحديث' : 'إنشاء';
//       const errorMessage = `فشل ${action} الإجازة: ${err.response?.data?.message || err.message}`;
//       showAndHidePopup(
//         'error',
//         errorMessage,
//       );
//     }
//   };

//   // ------------------------- دوال الحذف -------------------------
//   const confirmDelete = (holidayId) => {
//     setHolidayToDelete(holidayId);
//   };

//   const handleDeleteHoliday = async () => {
//     const idToDelete = holidayToDelete;

//     if (!idToDelete) return;

//     setHolidayToDelete(null); 
//     hidePopup(); 

//     try {
//       await axios.delete(
//         `https://university.roboeye-tec.com/holidays/${idToDelete}`
//       );

//       showAndHidePopup('success', 'تم حذف الإجازة بنجاح! 🗑️');
//       fetchHolidays(); 

//     } catch (err) {
//       const errorMessage = `فشل حذف الإجازة: ${err.response?.data?.message || err.message}`;
//       showAndHidePopup(
//         'error',
//         errorMessage,
//       );
//     }
//   };

//   const cancelDelete = () => {
//     setHolidayToDelete(null);
//   };

//   const today = new Date().toLocaleDateString("ar-EG");


//   return (
//     <div className="min-h-screen w-[90%] m-auto text-right" dir="rtl">
//       {/*... الهيدر وبقية العناصر ...*/}
//       <header className="flex items-start justify-between border-b border-gray-300 py-4">
//         {/* الجزء العربي */}
//         <div className="text-right leading-tight text-gray-800">
//           <p className="font-semibold text-lg">جامعة الأزهر</p>
//           <p>الإدارة العامة للشؤون الإدارية</p>
//           <p>إدارة الموارد البشرية</p>
//           <p>وحدة تطوير وتحديث بيانات الجامعة</p>
//         </div>

//         {/* اللوجو + العنوان */}
//         <div className="flex flex-col items-center justify-center text-center">
//           <img
//             src={Logo}
//             alt="Al-Azhar University Logo"
//             className="w-24 h-24 object-contain mb-2"
//           />
//           <h1 className="text-2xl font-bold text-gray-800">بيان إجازات</h1>
//         </div>

//         {/* الجزء الإنجليزي */}
//         <div className="text-left leading-tight text-gray-800" dir="ltr">
//           <p className="font-semibold text-lg">Al-Azhar University</p>
//           <p>General Administration for Administrative Affairs</p>
//           <p>Human Resources Department</p>
//           <p>University Data Development and Update Unit</p>
//         </div>
//       </header>

//       {/* بيانات الموظف */}
//       {employeeInfo && (
//         <div className="mt-5 text-gray-800 w-[60%] m-auto">
//           <div className="flex justify-between">
//             <h2 className="text-lg">الاسم: {employeeInfo.name || "-"}</h2>
//             <h2 className="text-lg">رقم الملف : {employeeInfo.universityFileNumber || "-"}</h2>
//           </div>
//           
//         </div>
//       )}

//       {/* الأزرار */}
//       <div className="flex justify-end gap-3 mt-4 print:hidden">
//         
//         <button
//           onClick={() => {
//             setEditingHolidayId(null); // تأكد من أنه وضع إنشاء
//             setIsModalOpen(true);
//           }}
//           className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
//         >
//           ➕ إنشاء إجازة جديدة
//         </button>

//         <button
//           onClick={() => window.print()}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
//         >
//           🖨️ طباعة
//         </button>

//         <button
//           onClick={() => navigate(-1)}
//           className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
//         >
//           ⬅️ عودة
//         </button>
//       </div>

//       {/* الجدول */}
//       <div className="px-6 pb-10 mt-8">
//         {loading ? (
//           <p className="text-center text-gray-600">جاري التحميل...</p>
//         ) : error ? (
//           <p className="text-center text-red-600">{error}</p>
//         ) : (
//           <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//             <table className="min-w-full text-sm border border-gray-200">
//               <thead className="bg-gray-100 text-gray-700 font-semibold">
//                 <tr>
//                   <th className="px-4 py-2 border text-center">م</th>
//                   <th className="px-4 py-2 border text-center">نوع المنح</th>
//                   <th className="px-4 py-2 border text-center">نوع الإجازة</th>
//                   <th className="px-4 py-2 border text-center">مدة الإجازة (يوم)</th>
//                   <th className="px-4 py-2 border text-center">تاريخ المنح</th>
//                   <th className="px-4 py-2 border text-center">من</th>
//                   <th className="px-4 py-2 border text-center">إلى</th>
//                   <th className="px-4 py-2 border text-center">رقم أمر التنفيذ</th>
//                   <th className="px-4 py-2 border text-center">تاريخ أمر التنفيذ</th>
//                   <th className="px-4 py-2 border text-center">حالة السفر</th>
//                   <th className="px-4 py-2 border text-center">ملاحظات</th>
//                   <th className="px-4 py-2 border text-center print:hidden">تعديل</th> 
//                   <th className="px-4 py-2 border text-center print:hidden">حذف</th> 
//                 </tr>
//               </thead>
//               <tbody>
//                 {holidays.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan="13" 
//                       className="text-center py-6 text-gray-600 font-medium"
//                     >
//                       لا توجد إجازات لهذا الموظف
//                     </td>
//                   </tr>
//                 ) : (
//                   holidays.map((h, index) => (
//                     <tr key={h.id || index} className="hover:bg-gray-50 transition">
//                       <td className="px-4 py-4 border text-right">{h.serial_number || index + 1}</td>
//                       <td className="px-4 py-4 border text-right">{h.grant_type}</td>
//                       <td className="px-4 py-4 border text-right">{h.leave_type}</td>
//                       <td className="px-4 py-4 border text-center">{h.duration_days || "-"}</td>
//                       <td className="px-4 py-4 border text-right">{formatDate(h.leave_method)}</td>
//                       <td className="px-4 py-4 border text-right">{formatDate(h.from_date)}</td>
//                       <td className="px-4 py-4 border text-right">{formatDate(h.to_date)}</td>
//                       <td className="px-4 py-4 border text-center">{h.execution_order_number}</td>
//                       <td className="px-4 py-4 border text-right">{formatDate(h.execution_order_date)}</td>
//                       <td className="px-4 py-4 border text-right">{h.travel_status}</td>
//                       <td className="px-4 py-4 border text-right">{h.notes || "-"}</td>
//                       
//                       {/* عمود الإجراءات */}
//                       <td className="px-4 py-4 border text-center print:hidden flex items-center justify-center space-x-2 space-x-reverse">
//                         {/* ✅ زر التعديل */}
//                         <button
//                             onClick={() => handleEditClick(h)} 
//                             className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full text-xs transition duration-200"
//                             title="تعديل الإجازة"
//                         >
//                             ✏️
//                         </button>
//                         
//                       </td>
//                       <td className="text-center border print:hidden">
//                             {/* زر الحذف */}
//                         <button
//                             onClick={() => confirmDelete(h.id)} 
//                             className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs transition duration-200"
//                             title="حذف الإجازة"
//                         >
//                             🗑️
//                         </button>
//                         </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* قسم التوقيعات يظهر فقط عند الطباعة */}
//       <div className="hidden print:block mt-16">
//         <div className="flex justify-between text-center text-sm font-medium text-gray-900 my-20 ">
//           <div className="border flex items-center px-3 py-1 w-40">
//             مدير عام الشؤون الإدارية
//           </div>
//           <div className="border flex items-center px-3 py-1 w-40">
//             مدير الموارد البشرية
//           </div>
//           <div className="border flex items-center px-3 py-1 w-40">
//             رئيس قسم الملفات
//           </div>
//           <div className="border flex items-center px-3 py-1 w-40">
//             مسؤول الكمبيوتر
//           </div>
//         </div>

//         <div className="text-right mt-4 pt-5 text-sm text-gray-700">
//           تحريراً في: {today}
//         </div>
//         
//       </div>

//       {/* ====================================================================== */}
//       {/* ========================= نموذج إنشاء/تعديل إجازة (Modal) ========================= */}
//       {/* ====================================================================== */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
//           
//           <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col" dir="rtl">
//             
//             {/* الرأس - متغير بناءً على وضع التعديل/الإنشاء */}
//             <div className="p-6 pb-2">
//                 <h2 className="text-xl font-bold text-indigo-700 border-b pb-3 mb-4">
//                     {editingHolidayId ? 'تعديل بيانات الإجازة' : 'إضافة إجازة جديدة'} للموظف: {employeeInfo?.name}
//                 </h2>
//             </div>

//             {/* جسم النموذج: overflow-y-auto لتمكين التمرير */}
//             <form onSubmit={handleSaveHoliday} className="space-y-4 overflow-y-auto px-6 pt-0 pb-4 flex-grow">
//               
//               {/* بيانات تلقائية - للقراءة فقط */}
//               <div className="grid grid-cols-3 gap-4">
//                 <InputField label="رقم الملف الجامعي" name="university_file_number" value={employeeID} readOnly />
//                 <InputField label="اسم مقدم الطلب" name="applicant_name" value={newHolidayData.applicant_name} readOnly />
//                 <InputField label="نوع المنح (ثابت)" name="grant_type" value={newHolidayData.grant_type} readOnly />
//               </div>

//               {/* حقول الإدخال الأساسية */}
//               <div className="grid grid-cols-4 gap-4 border p-3 rounded-lg bg-gray-50">
//                 <div className="col-span-4"><h3 className="font-semibold text-gray-700">بيانات الإجازة الأساسية</h3></div>
//                 
//                 {/* نوع الإجازة (Select) */}
//                 <div className="flex flex-col">
//                   <label htmlFor="leave_type" className="text-sm font-medium text-gray-700 mb-1">نوع الإجازة <span className="text-red-500">*</span></label>
//                   <select
//                     id="leave_type"
//                     name="leave_type"
//                     value={newHolidayData.leave_type}
//                     onChange={handleInputChange}
//                     className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                     required
//                   >
//                     <option value="" disabled>--- اختر نوع الإجازة ---</option>
//                     {leaveOptions.map((option, idx) => (
//                         <option key={idx} value={option}>{option}</option>
//                     ))}
//                   </select>
//                    {leaveOptions.length === 0 && (
//                       <p className="text-red-500 text-xs mt-1">جاري تحميل الخيارات...</p>
//                   )}
//                 </div>
//                 
//                 {/* حالة السفر */}
//                 <div className="flex flex-col">
//                     <label htmlFor="travel_status" className="text-sm font-medium text-gray-700 mb-1">حالة السفر</label>
//                     <select
//                         id="travel_status"
//                         name="travel_status"
//                         value={newHolidayData.travel_status}
//                         onChange={handleInputChange}
//                         className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                     >
//                         <option value="مع عدم العمل">مع عدم العمل</option>
//                         <option value="مع العمل">مع العمل</option>
//                     </select>
//                 </div>
//                 
//                 <InputField 
//                     label="من تاريخ" 
//                     name="from_date" 
//                     type="date"
//                     value={newHolidayData.from_date} 
//                     onChange={handleInputChange} 
//                     required
//                 />
//                 <InputField 
//                     label="إلى تاريخ" 
//                     name="to_date" 
//                     type="date"
//                     value={newHolidayData.to_date} 
//                     onChange={handleInputChange} 
//                     required
//                 />
//                 <InputField 
//                     label="مدة الإجازة (يوم)" 
//                     name="duration_days" 
//                     type="number"
//                     value={newHolidayData.duration_days} 
//                     onChange={handleInputChange} 
//                 />

//                 {/* حقول اختيارية */}
//                 <div className="col-span-4 mt-4"><h3 className="font-semibold text-gray-700 border-t pt-3">بيانات إضافية</h3></div>

//                 <InputField label="رقم أمر التنفيذ" name="execution_order_number" value={newHolidayData.execution_order_number} onChange={handleInputChange} />
//                 <InputField label="تاريخ أمر التنفيذ" name="execution_order_date" type="date" value={newHolidayData.execution_order_date} onChange={handleInputChange} />
//                 
//                 <InputField label="الرقم المسلسل" name="serial_number" value={newHolidayData.serial_number} onChange={handleInputChange} />
//                 <InputField label="كود الإجازة" name="leave_code" value={newHolidayData.leave_code} onChange={handleInputChange} />

//                 <InputField label="كود الدولة" name="country_code" value={newHolidayData.country_code} onChange={handleInputChange} />
//                 <InputField label="اسم الدولة" name="country_name" value={newHolidayData.country_name} onChange={handleInputChange} />
//                 <InputField label="طريقة الإجازة" name="leave_method" value={newHolidayData.leave_method} onChange={handleInputChange} />
//                 <InputField label="تاريخ الاستلام" name="receipt_date" type="date" value={newHolidayData.receipt_date} onChange={handleInputChange} />
//               </div>


//               {/* حقل الملاحظات */}
//               <div>
//                 <label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
//                 <textarea
//                     id="notes"
//                     name="notes"
//                     rows="3"
//                     value={newHolidayData.notes}
//                     onChange={handleInputChange}
//                     className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-full"
//                 ></textarea>
//               </div>

//               {/* تذييل النموذج: أزرار الإغلاق والحفظ (ثابت) */}
//             <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end gap-3 flex-shrink-0">
//                 <button
//                     type="button"
//                     onClick={closeModal}
//                     className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium transition"
//                 >
//                     إلغاء
//                 </button>
//                 <button
//                     type="submit"
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition disabled:opacity-50"
//                     disabled={leaveOptions.length === 0}
//                 >
//                     {editingHolidayId ? 'حفظ التعديلات' : (leaveOptions.length === 0 ? "جاري التحميل..." : "إنشاء الإجازة")}
//                 </button>
//             </div>
//             </form>
//           </div>
//         </div>
//       )}
//       
//       {/* استدعاء النافذة المنبثقة لتأكيد الحذف */}
//       {holidayToDelete && (
//         <DeleteConfirmationModal 
//           onConfirm={handleDeleteHoliday} 
//           onCancel={cancelDelete} 
//         />
//       )}
//       
//       {/* استدعاء النافذة المنبثقة للرسائل */}
//       {popupMessage.show && (
//         <MessagePopup 
//             message={popupMessage.message}
//             type={popupMessage.type}
//         />
//       )}


//       {/* CSS خاص بالطباعة */}
//       <style>
//         {`
//           @media print {
//             .print\\:hidden {
//               display: none !important;
//             }

//             .print\\:block {
//               display: block !important;
//             }

//             body {
//               margin: 0;
//               padding: 0;
//             }

//             .min-h-screen {
//               min-height: 0;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default EmployeeHolidaysPage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import axiosInstance from "@/axiosInstance";

const EmployeeHolidaysPage = () => {
    const { employeeID } = useParams();
    const navigate = useNavigate();
    const [holidays, setHolidays] = useState([]); 
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // حالات حذف
    const [deleteMessage, setDeleteMessage] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // States للـ Popup
    const [showPopup, setShowPopup] = useState(false);
    // سيحتفظ هذا بـ ID الإجازة (h.id) عند الضغط على زر الحذف
    const [selectedSerial, setSelectedSerial] = useState(null); 

    // جلب بيانات الإجازات
    const fetchHolidays = async () => { 
        try {
            setLoading(true);
            setError("");
            const res = await axiosInstance.get(
                `/employee/statement/${employeeID}`,
            );
            // لاحظي: تم تغيير المصدر إلى res.data.holidays بناءً على الكود الذي أرسلتيه
            setHolidays(res.data.holidays); 
            setEmployeeInfo(res.data.employeeInfo);
        } catch (err) {
            console.error(err);
            setError(" حدث خطأ أثناء تحميل بيانات الإجازات ."); 
        } finally {
            setLoading(false);
        }
    };

    // دالة تنفيذ عملية الحذف
    const handleDelete = async (holidayId) => { // ID الإجازة
        setIsDeleting(true);
        setDeleteMessage("");

        try {
            // 💡 التعديل: استخدام المسار المطلوب /holidays/{id}
            const url = `/holidays/${holidayId}`; 
            await axiosInstance.delete(url);

            setDeleteMessage("✅ تم حذف الإجازة بنجاح!"); 
            await fetchHolidays();
        } catch (err) {
            console.error("Delete Error:", err);
            const message = err.response?.data?.message;

            if (message === "Access token required" || message === "Invalid or expired token" || message ==="Access denied. Required permission: holiday:delete") {
                setDeleteMessage("❌ فشل الحذف: لا تملك الصلاحية الكافية لإجراء هذا الحذف.");
            } else {
                setDeleteMessage("❌ حدث خطأ غير متوقع أثناء عملية الحذف.");
                
            }
        } finally {
            setIsDeleting(false);
            setTimeout(() => setDeleteMessage(""), 5000);
        }
    };

    // 💡 دالة لفتح نافذة تأكيد الحذف
    const confirmDelete = (holidayId) => {
        setSelectedSerial(holidayId);
        setShowPopup(true);
    };

    // 💡 دالة التعديل
    const handleEditClick = (holidayData) => {
        // نفترض أن serial_number هو المعرّف الفريد المطلوب في مسار التعديل
        navigate(`/holidays/edit/${employeeID}/${holidayData.id}`, {
            state: { holidayData: holidayData }
        });
    };

    useEffect(() => {
        if (employeeID) fetchHolidays();
    }, [employeeID]);

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr.includes("1899")) return "-";
        return new Date(dateStr).toLocaleDateString("ar-EG");
    };

    const today = new Date().toLocaleDateString("ar-EG");

    return (
        <div className="min-h-screen w-[90%] m-auto text-right" dir="rtl">
            {/* الهيدر */}
            <header className="flex items-start justify-between border-b border-gray-300 py-4">
                <div className="text-right leading-tight text-gray-800">
                    <p className="font-semibold text-lg">جامعة الأزهر</p>
                    <p>الإدارة العامة للشؤون الإدارية</p>
                    <p>إدارة الموارد البشرية</p>
                    <p>وحدة تطوير وتحديث بيانات الجامعة</p>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                    <img
                        src={Logo}
                        alt="Al-Azhar University Logo"
                        className="w-24 h-24 object-contain mb-2"
                    />
                    <h1 className="text-2xl font-bold text-gray-800">بيان حالة بالإجازات </h1> 
                </div>

                <div className="text-left leading-tight text-gray-800" dir="ltr">
                    <p className="font-semibold text-lg">Al-Azhar University</p>
                    <p>General Administration for Administrative Affairs</p>
                    <p>Human Resources Department</p>
                    <p>University Data Development and Update Unit</p>
                </div>
            </header>

            {/* بيانات الموظف */}
            {employeeInfo && (
                <div className="mt-5 text-gray-800 w-[90%] m-auto" dir="rtl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-right p-4 border border-gray-200 rounded-lg bg-gray-50">

                        <h2 className="text-md font-semibold ">الاسم: <span className="font-normal text-gray-800">{employeeInfo.name || "-"}</span></h2>
                        <h2 className="text-md font-semibold ">النوع: <span className="font-normal text-gray-800">{employeeInfo.gender || "-"}</span></h2>
                        <h2 className="text-md font-semibold ">تاريخ الميلاد: <span className="font-normal text-gray-800">{formatDate(employeeInfo.birthdate) || "-"}</span></h2>

                        <h2 className="text-md font-semibold ">الرقم القومى : <span className="font-normal text-gray-800">{employeeInfo.nationalID || "-"}</span></h2>
                        <h2 className="text-md font-semibold ">العنوان: <span className="font-normal text-gray-800">{employeeInfo.address || "-"}</span></h2>
                        <h2 className="text-md font-semibold ">المحافظة: <span className="font-normal text-gray-800">{employeeInfo.governorate || "-"}</span></h2>

                        <h2 className="text-md font-semibold ">رقم الملف : <span className="font-normal text-gray-800">{employeeInfo.universityFileNumber || "-"}</span></h2>

                    </div>
                </div>
            )}

            {/* أزرار */}
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

            {/* رسالة الحذف */}
            {deleteMessage && (
                <p
                    className={`mt-4 text-center font-medium text-lg ${
                        deleteMessage.includes("✅") ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {deleteMessage}
                </p>
            )}

            {/* جدول الإجازات */}
            <div className="px-6 pb-10 mt-8">
                {loading ? (
                    <p className="text-center text-gray-600">جاري التحميل...</p>
                ) : error ? (
                    <p className="text-center text-red-600">{error}</p>
                ) : (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full text-sm border border-gray-200">
                            <thead className="bg-gray-100 text-gray-700 font-semibold">
                                <tr>
                                    <th className="px-4 py-2 border text-center">م</th>
                                    <th className="px-4 py-2 border text-center">نوع الإجازة</th>
                                    <th className="px-4 py-2 border text-center">سبب الاجازة</th>
                                    <th className="px-4 py-2 border text-center">مدة الإجازة (يوم)</th>
                                    <th className="px-4 py-2 border text-center">تاريخ المنح</th>
                                    <th className="px-4 py-2 border text-center">من</th>
                                    <th className="px-4 py-2 border text-center">إلى</th>
                                    <th className="px-4 py-2 border text-center">رقم أمر التنفيذ</th>
                                    <th className="px-4 py-2 border text-center">تاريخ أمر التنفيذ</th>
                                    <th className="px-4 py-2 border text-center">حالة السفر</th>
                                    <th className="px-4 py-2 border text-center">ملاحظات</th>
                                    <th className="px-4 py-2 border text-center print:hidden">تعديل</th> 
                                    <th className="px-4 py-2 border text-center print:hidden">حذف</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {holidays.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="13" // 💡 تم التعديل ليطابق عدد الأعمدة (13)
                                            className="text-center py-6 text-gray-600 font-medium"
                                        >
                                            لا توجد إجازات لهذا الموظف
                                        </td>
                                    </tr>
                                ) : (
                                    holidays.map((h, index) => (
                                        <tr key={h.id || index} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-4 border text-center">{h.serial_number || index + 1}</td>
                                            <td className="px-4 py-4 border text-right">{h.grant_type || "-"}</td>
                                            <td className="px-4 py-4 border text-right">{h.leave_type || "-"}</td>
                                            <td className="px-4 py-4 border text-center">{h.duration_days || "-"}</td>
                                            <td className="px-4 py-4 border text-right">{formatDate(h.leave_method)}</td>
                                            <td className="px-4 py-4 border text-right">{formatDate(h.from_date)}</td>
                                            <td className="px-4 py-4 border text-right">{formatDate(h.to_date)}</td>
                                            <td className="px-4 py-4 border text-center">{h.execution_order_number || "-"}</td>
                                            <td className="px-4 py-4 border text-right">{formatDate(h.execution_order_date)}</td>
                                            <td className="px-4 py-4 border text-right">{h.travel_status || "-"}</td>
                                            <td className="px-4 py-4 border text-right">{h.notes || "-"}</td>
                                        
                                            {/* عمود التعديل */}
                                            <td className="px-4 py-4 border text-center print:hidden">
                                                <button
                                                    onClick={() => handleEditClick(h)} 
                                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg text-xs transition duration-200 font-semibold"
                                                    title="تعديل الإجازة"
                                                >
                                                    ✏️ تعديل
                                                </button>
                                            </td>
                                            
                                            {/* عمود الحذف */}
                                            <td className="px-4 py-4 border text-center print:hidden">
                                                <button
                                                    onClick={() => confirmDelete(h.id)} // 💡 يستخدم h.id
                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-xs transition duration-200 font-semibold"
                                                    title="حذف الإجازة"
                                                >
                                                    🗑️ حذف
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ======= Popup حذف ======= */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            هل أنت متأكد من الحذف؟
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            لا يمكن التراجع عن هذا الإجراء بعد الحذف.
                        </p>

                        <div className="flex justify-between gap-3">
                            <button
                                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg"
                                onClick={() => setShowPopup(false)}
                            >
                                إلغاء
                            </button>

                            <button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                                onClick={async () => {
                                    setShowPopup(false);
                                    // 💡 نمرر ID الإجازة المخزّن في selectedSerial إلى دالة الحذف
                                    await handleDelete(selectedSerial); 
                                }}
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* منطقة توقيعات الطباعة */}
            <div className="hidden print:block mt-16">
                <div className="flex justify-between text-center text-sm font-medium text-gray-900 my-20 ">
                    <div className="border flex items-center px-3 py-1 w-40">مدير عام الشؤون الإدارية</div>
                    <div className="border flex items-center px-3 py-1 w-40">مدير الموارد البشرية</div>
                    <div className="border flex items-center px-3 py-1 w-40">رئيس قسم الملفات</div>
                    <div className="border flex items-center px-3 py-1 w-40">مسؤول الكمبيوتر</div>
                </div>

                <div className="text-right mt-4 pt-5 text-sm text-gray-700">
                    تحريراً في: {today}
                </div>
            </div>

            {/* CSS للطباعة */}
            <style>
                {`
                    @media print {
                        .print\\:hidden { display: none !important; }
                        .print\\:block { display: block !important; }
                    }
                `}
            </style>
        </div>
    );
};

export default EmployeeHolidaysPage;