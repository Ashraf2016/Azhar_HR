// import React, { useEffect, useState } from "react";
// // Mock dependencies for single-file environment
// const useParams = () => ({ employeeID: '55' });
// const useNavigate = () => (path, options) => {
//     console.log(`Navigating to: ${path}`, options);
//     // In a real environment, this would handle actual routing
// };
// import Logo from "../assets/Logo.png";
// const axiosInstance = {
//     get: async (url) => {
//         // Mock API logic for /secondments/{employeeID}
//         if (url.includes('/secondments/55')) {
//             await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
//             return {
//                 data: {
//                     // Mock data structure based on user request
//                     secondments: [
//                         { id: 6, employee_id: 55, university: "جامعة سيناء", faculty_name: "الطب", memo_date: "2025-11-22T00:00:00.000Z", start_date: "2025-11-15T00:00:00.000Z", end_date: "2025-11-19T00:00:00.000Z" },
//                         { id: 7, employee_id: 55, university: "جامعة القاهرة", faculty_name: "الهندسة", memo_date: "2025-10-01T00:00:00.000Z", start_date: "2025-10-10T00:00:00.000Z", end_date: "2025-12-31T00:00:00.000Z" },
//                     ],
//                     employeeInfo: { name: "أحمد محمد علي", gender: "ذكر", birthdate: "1980-05-15T00:00:00.000Z", nationalID: "12345678901234", address: "شارع النيل", governorate: "القاهرة", universityFileNumber: "U55" }
//                 }
//             };
//         }
//         return { data: {} };
//     },
//     delete: async (url) => {
//         // Mock API logic for /secondments/{id}
//         await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
//         if (url.includes('/secondments/7')) {
//             // Simulate permission error for secondment ID 7
//             throw { response: { data: { message: "Access denied. Required permission: secondment:delete" } } };
//         }
//         return { status: 200 };
//     }
// };


// const EmployeeSecondmentsPage = () => {
//     // Get employee ID from URL parameters
//     const { employeeID } = useParams();
//     // Hook for programmatic navigation
//     const navigate = useNavigate();

//     // State for secondment data
//     const [secondments, setSecondments] = useState([]); 
//     // State for employee basic info
//     const [employeeInfo, setEmployeeInfo] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     // Delete operation states
//     const [deleteMessage, setDeleteMessage] = useState("");
//     const [isDeleting, setIsDeleting] = useState(false);

//     // Popup (confirmation modal) states
//     const [showPopup, setShowPopup] = useState(false);
//     // Stores the ID of the secondment to be deleted
//     const [selectedSecondmentId, setSelectedSecondmentId] = useState(null); 

//     // Function to fetch secondments data
//     const fetchSecondments = async () => { 
//         try {
//             setLoading(true);
//             setError("");
//             // 💡 API Call: Adjusted to /secondments/{employeeID}
//             const res = await axiosInstance.get(
//                 `/secondments/${employeeID}`,
//             );
            
//             // Assuming the API returns an array named 'secondments'
//             setSecondments(res.data.secondments || []); 
//             setEmployeeInfo(res.data.employeeInfo);
//         } catch (err) {
//             console.error(err);
//             setError("حدث خطأ أثناء تحميل بيانات الانتدابات."); 
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Function to execute the delete operation
//     const handleDeleteSecondment = async (secondmentId) => { 
//         setIsDeleting(true);
//         setDeleteMessage("");

//         try {
//             // 💡 API Call: Adjusted to /secondments/{id}
//             const url = `/secondments/${secondmentId}`; 
//             await axiosInstance.delete(url);

//             setDeleteMessage("✅ تم حذف الانتداب بنجاح!"); 
//             // Re-fetch data to update the table
//             await fetchSecondments();
//         } catch (err) {
//             console.error("Delete Error:", err);
//             const message = err.response?.data?.message;

//             if (message === "Access token required" || message === "Invalid or expired token" || message ==="Access denied. Required permission: secondment:delete") {
//                 setDeleteMessage("❌ فشل الحذف: لا تملك الصلاحية الكافية لإجراء هذا الحذف.");
//             } else {
//                 setDeleteMessage("❌ حدث خطأ غير متوقع أثناء عملية الحذف.");
                
//             }
//         } finally {
//             setIsDeleting(false);
//             // Clear status message after 5 seconds
//             setTimeout(() => setDeleteMessage(""), 5000);
//         }
//     };

//     // Function to open the confirmation popup
//     const confirmDelete = (secondmentId) => {
//         setSelectedSecondmentId(secondmentId);
//         setShowPopup(true);
//     };

//     // Function to handle the edit button click and navigate
//     const handleEditClick = (secondmentData) => {
//         // Navigate to the edit page using the secondment ID
//         // 💡 Navigation Path: Adjusted to /secondments/edit/{employeeID}/{secondmentID}
//         navigate(`/secondments/edit/${employeeID}/${secondmentData.id}`, {
//             state: { secondmentData: secondmentData }
//         });
//     };

//     // Fetch data on component mount or employeeID change
//     useEffect(() => {
//         if (employeeID) fetchSecondments();
//     }, [employeeID]);

//     // Helper function to format date strings
//     const formatDate = (dateStr) => {
//         if (!dateStr || dateStr.includes("1899")) return "-";
//         // Convert to Date object and format to Arabic locale date string
//         return new Date(dateStr).toLocaleDateString("ar-EG", { 
//             year: 'numeric', 
//             month: 'long', 
//             day: 'numeric' 
//         });
//     };

//     const today = new Date().toLocaleDateString("ar-EG");

//     return (
//         <div className="min-h-screen w-[90%] m-auto text-right font-sans" dir="rtl">
//             {/* Header Section */}
//             <header className="flex items-start justify-between border-b border-gray-300 py-4">
//                 <div className="text-right leading-tight text-gray-800">
//                     <p className="font-semibold text-lg">جامعة الأزهر</p>
//                     <p>الإدارة العامة للشؤون الإدارية</p>
//                     <p>إدارة الموارد البشرية</p>
//                     <p>وحدة تطوير وتحديث بيانات الجامعة</p>
//                 </div>

//                 <div className="flex flex-col items-center justify-center text-center">
//                     <img
//                         src={Logo}
//                         alt="Al-Azhar University Logo"
//                         className="w-24 h-24 object-contain mb-2 rounded-full shadow-md"
//                     />
//                     <h1 className="text-2xl font-bold text-gray-800">بيان حالة بالانتدابات </h1> 
//                 </div>

//                 <div className="text-left leading-tight text-gray-800" dir="ltr">
//                     <p className="font-semibold text-lg">Al-Azhar University</p>
//                     <p>General Administration for Administrative Affairs</p>
//                     <p>Human Resources Department</p>
//                     <p>University Data Development and Update Unit</p>
//                 </div>
//             </header>

//             {/* Employee Information */}
//             {employeeInfo && (
//                 <div className="mt-5 text-gray-800 w-full" dir="rtl">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-right p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-inner">

//                         <h2 className="text-md font-semibold ">الاسم: <span className="font-normal text-gray-800">{employeeInfo.name || "-"}</span></h2>
//                         <h2 className="text-md font-semibold ">النوع: <span className="font-normal text-gray-800">{employeeInfo.gender || "-"}</span></h2>
//                         <h2 className="text-md font-semibold ">تاريخ الميلاد: <span className="font-normal text-gray-800">{formatDate(employeeInfo.birthdate) || "-"}</span></h2>

//                         <h2 className="text-md font-semibold ">الرقم القومى : <span className="font-normal text-gray-800">{employeeInfo.nationalID || "-"}</span></h2>
//                         <h2 className="text-md font-semibold ">العنوان: <span className="font-normal text-gray-800">{employeeInfo.address || "-"}</span></h2>
//                         <h2 className="text-md font-semibold ">المحافظة: <span className="font-normal text-gray-800">{employeeInfo.governorate || "-"}</span></h2>

//                         <h2 className="text-md font-semibold ">رقم الملف الجامعي : <span className="font-normal text-gray-800">{employeeInfo.universityFileNumber || "-"}</span></h2>

//                     </div>
//                 </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex justify-end gap-3 mt-6 print:hidden">
//                 <button
//                     onClick={() => window.print()}
//                     className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition duration-200 flex items-center"
//                 >
//                     <span className="ml-2">🖨️</span> طباعة
//                 </button>

//                 <button
//                     onClick={() => navigate(-1)}
//                     className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition duration-200 flex items-center"
//                 >
//                     <span className="ml-2">⬅️</span> عودة
//                 </button>
//             </div>

//             {/* Delete Status Message */}
//             {deleteMessage && (
//                 <p
//                     className={`mt-4 text-center font-medium text-lg p-3 rounded-lg shadow-md ${
//                         deleteMessage.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//                     }`}
//                 >
//                     {deleteMessage}
//                 </p>
//             )}

//             {/* Secondments Table */}
//             <div className="px-6 pb-10 mt-8">
//                 {loading ? (
//                     <p className="text-center text-gray-600 p-8 text-xl">جاري تحميل بيانات الانتدابات...</p>
//                 ) : error ? (
//                     <p className="text-center text-red-600 p-8 text-xl border border-red-300 bg-red-50 rounded-lg">{error}</p>
//                 ) : (
//                     <div className="overflow-x-auto bg-white shadow-2xl rounded-lg border border-gray-100">
//                         <table className="min-w-full text-sm">
//                             <thead className="bg-blue-600 text-white font-bold sticky top-0">
//                                 <tr>
//                                     <th className="px-4 py-3 border border-blue-700 text-center">م</th>
//                                     <th className="px-4 py-3 border border-blue-700 text-center">رقم الانتداب</th>
//                                     <th className="px-4 py-3 border border-blue-700 text-center">الجامعة المنتدب إليها</th>
//                                     <th className="px-4 py-3 border border-blue-700 text-center">الكلية/القسم</th>
//                                     <th className="px-4 py-3 border border-blue-700 text-center">تاريخ المذكرة</th>
//                                     <th className="px-4 py-3 border border-blue-700 text-center">تاريخ البدء</th>
//                                     <th className="px-4 py-3 border border-blue-700 text-center">تاريخ الانتهاء</th>
//                                     <th className="px-4 py-3 border border-blue-700 text-center print:hidden">تعديل</th> 
//                                     <th className="px-4 py-3 border border-blue-700 text-center print:hidden">حذف</th> 
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {secondments.length === 0 ? (
//                                     <tr>
//                                         <td
//                                             colSpan="9" 
//                                             className="text-center py-6 text-gray-600 font-medium bg-gray-50"
//                                         >
//                                             لا توجد بيانات انتدابات لهذا الموظف
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     secondments.map((s, index) => (
//                                         <tr key={s.id || index} className="hover:bg-blue-50 transition duration-150 border-b border-gray-200">
//                                             <td className="px-4 py-4 border text-center font-medium">{index + 1}</td>
//                                             <td className="px-4 py-4 border text-center">{s.id || "-"}</td>
//                                             <td className="px-4 py-4 border text-right">{s.university || "-"}</td>
//                                             <td className="px-4 py-4 border text-right">{s.faculty_name || "-"}</td>
//                                             <td className="px-4 py-4 border text-right">{formatDate(s.memo_date)}</td>
//                                             <td className="px-4 py-4 border text-right">{formatDate(s.start_date)}</td>
//                                             <td className="px-4 py-4 border text-right">{formatDate(s.end_date)}</td>
                                            
//                                             {/* Edit Column */}
//                                             <td className="px-4 py-4 border text-center print:hidden">
//                                                 <button
//                                                     onClick={() => handleEditClick(s)} 
//                                                     className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg text-xs transition duration-200 font-semibold shadow-md"
//                                                     title="تعديل الانتداب"
//                                                 >
//                                                     ✏️ تعديل
//                                                 </button>
//                                             </td>
                                            
//                                             {/* Delete Column */}
//                                             <td className="px-4 py-4 border text-center print:hidden">
//                                                 <button
//                                                     onClick={() => confirmDelete(s.id)} // Use the secondment ID
//                                                     className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-xs transition duration-200 font-semibold shadow-md"
//                                                     title="حذف الانتداب"
//                                                     disabled={isDeleting}
//                                                 >
//                                                     🗑️ حذف
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             {/* ======= Delete Confirmation Popup ======= */}
//             {showPopup && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
//                     <div className="bg-white rounded-xl shadow-2xl p-8 w-96 text-center transform transition-all duration-300 scale-100" dir="rtl">
//                         <h2 className="text-xl font-bold text-red-700 mb-4">
//                             ⚠️ تأكيد عملية الحذف
//                         </h2>
//                         <p className="text-md text-gray-700 mb-6">
//                             هل أنت متأكد من حذف الانتداب رقم: **{selectedSecondmentId}**؟ 
//                             لا يمكن التراجع عن هذا الإجراء.
//                         </p>

//                         <div className="flex justify-between gap-4">
//                             <button
//                                 className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition duration-200"
//                                 onClick={() => setShowPopup(false)}
//                             >
//                                 إلغاء
//                             </button>

//                             <button
//                                 className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
//                                 disabled={isDeleting}
//                                 onClick={async () => {
//                                     setShowPopup(false);
//                                     // Pass the stored secondment ID to the delete function
//                                     await handleDeleteSecondment(selectedSecondmentId); 
//                                 }}
//                             >
//                                 {isDeleting ? 'جاري الحذف...' : 'تأكيد الحذف'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Print Signature Area */}
//             <div className="hidden print:block mt-16">
//                 <div className="flex justify-between text-center text-sm font-medium text-gray-900 my-20 ">
//                     <div className="border flex items-center px-3 py-1 w-40 h-10 justify-center shadow-inner">مدير عام الشؤون الإدارية</div>
//                     <div className="border flex items-center px-3 py-1 w-40 h-10 justify-center shadow-inner">مدير الموارد البشرية</div>
//                     <div className="border flex items-center px-3 py-1 w-40 h-10 justify-center shadow-inner">رئيس قسم الملفات</div>
//                     <div className="border flex items-center px-3 py-1 w-40 h-10 justify-center shadow-inner">مسؤول الكمبيوتر</div>
//                 </div>

//                 <div className="text-right mt-4 pt-5 text-sm text-gray-700">
//                     تحريراً في: {today}
//                 </div>
//             </div>

//             {/* CSS for Print */}
//             <style>
//                 {`
//                     @media print {
//                         .print\\:hidden { display: none !important; }
//                         .print\\:block { display: block !important; }
//                         body { background: white !important; }
//                         /* Ensure table borders and headers are visible in print */
//                         table, th, td { border-color: #a0a0a0 !important; }
//                         thead { background-color: #e0e7ff !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
//                     }
//                 `}
//             </style>
//         </div>
//     );
// };

// export default EmployeeSecondmentsPage;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";
import axiosInstance from '@/axiosInstance'; 

const EmployeeSecondmentsPage = () => {
    const { employeeID } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const employeeInfo = location.state;
    const [secondments, setSecondments] = useState([]); 
    // const [employeeInfo, setEmployeeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deleteMessage, setDeleteMessage] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [selectedSecondmentId, setSelectedSecondmentId] = useState(null); 

    // 💡 Fetch real data from API
    const fetchSecondments = async () => { 
        try {
            setLoading(true);
            setError("");

            const res = await axiosInstance.get(`/secondments/${employeeID}`);
            
            setSecondments(res.data || []); 

        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء تحميل بيانات الانتدابات."); 
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSecondment = async (secondmentId) => { 
        setIsDeleting(true);
        setDeleteMessage("");

        try {
            await axiosInstance.delete(`/secondments/${secondmentId}`);

            setDeleteMessage("✅ تم حذف الانتداب بنجاح!"); 
            await fetchSecondments();
        } catch (err) {
            console.error("Delete Error:", err);
            const message = err.response?.data?.message;

            if (message === "Access token required" || message === "Invalid or expired token" || message ==="Access denied. Required permission: secondment:delete") {
                setDeleteMessage("❌ فشل الحذف: لا تملك الصلاحية الكافية لإجراء هذا الحذف.");
            } else {
                setDeleteMessage("❌ حدث خطأ غير متوقع أثناء عملية الحذف.");
            }
        } finally {
            setIsDeleting(false);
            setTimeout(() => setDeleteMessage(""), 5000);
        }
    };

    const confirmDelete = (secondmentId) => {
        setSelectedSecondmentId(secondmentId);
        setShowPopup(true);
    };

    const handleEditClick = (secondmentData) => {
        navigate(`/secondment/edit/${employeeID}/${secondmentData.id}`, {
            state: { secondmentData }
        });
    };

    useEffect(() => {
        if (employeeID) fetchSecondments();
    }, [employeeID]);

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr.includes("1899")) return "-";
        return new Date(dateStr).toLocaleDateString("ar-EG", { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const today = new Date().toLocaleDateString("ar-EG");

    return (
        <div className="min-h-screen w-[90%] m-auto text-right font-sans" dir="rtl">
            {/* Header Section */}
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
                        className="w-24 h-24 object-contain mb-2 rounded-full shadow-md"
                    />
                    <h1 className="text-2xl font-bold text-gray-800">بيان حالة بالانتدابات </h1> 
                </div>

                <div className="text-left leading-tight text-gray-800" dir="ltr">
                    <p className="font-semibold text-lg">Al-Azhar University</p>
                    <p>General Administration for Administrative Affairs</p>
                    <p>Human Resources Department</p>
                    <p>University Data Development and Update Unit</p>
                </div>
            </header>

            {/* Employee Information */}
            {employeeInfo && (
                <div className="mt-5 text-gray-800 w-full" dir="rtl">
                    <div className="flex justify-around gap-y-3 gap-x-6 text-right  p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-inner">

                        <h2 className="text-md font-semibold ">الاسم: <span className="font-normal text-gray-800">{employeeInfo.employeeName || "-"}</span></h2>
                        <h2 className="text-md font-semibold ">الدرجة الحالية: <span className="font-normal text-gray-800">{employeeInfo.currentRank || "-"}</span></h2>
                        

                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition duration-200 flex items-center"
                >
                    <span className="ml-2">🖨️</span> طباعة
                </button>

                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition duration-200 flex items-center"
                >
                    <span className="ml-2">⬅️</span> عودة
                </button>
            </div>

            {deleteMessage && (
                <p
                    className={`mt-4 text-center font-medium text-lg p-3 rounded-lg shadow-md ${
                        deleteMessage.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                >
                    {deleteMessage}
                </p>
            )}

            {/* Secondments Table */}
            <div className="px-6 pb-10 mt-8">
                {loading ? (
                    <p className="text-center text-gray-600 p-8 text-xl">جاري تحميل بيانات الانتدابات...</p>
                ) : error ? (
                    <p className="text-center text-red-600 p-8 text-xl border border-red-300 bg-red-50 rounded-lg">{error}</p>
                ) : (
                    <div className="overflow-x-auto bg-white shadow-2xl rounded-lg border border-gray-100">
                        <table className="min-w-full text-sm">
                            <thead className="bg-blue-600 text-white font-bold sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 border border-blue-700 text-center">م</th>
                                    {/* <th className="px-4 py-3 border border-blue-700 text-center">رقم الانتداب</th> */}
                                    <th className="px-4 py-3 border border-blue-700 text-center">الجامعة المنتدب إليها</th>
                                    <th className="px-4 py-3 border border-blue-700 text-center">الكلية</th>
                                    <th className="px-4 py-3 border border-blue-700 text-center">تاريخ المذكرة</th>
                                    <th className="px-4 py-3 border border-blue-700 text-center">تاريخ البدء</th>
                                    <th className="px-4 py-3 border border-blue-700 text-center">تاريخ الانتهاء</th>
                                    <th className="px-4 py-3 border border-blue-700 text-center print:hidden">تعديل</th> 
                                    <th className="px-4 py-3 border border-blue-700 text-center print:hidden">حذف</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {secondments.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-6 text-gray-600 font-medium bg-gray-50">
                                            لا توجد بيانات انتدابات لهذا الموظف
                                        </td>
                                    </tr>
                                ) : (
                                    secondments.map((s, index) => (
                                        <tr key={s.id || index} className="hover:bg-blue-50 transition duration-150 border-b border-gray-200">
                                            <td className="px-4 py-4 border text-center font-medium">{index + 1}</td>
                                            {/* <td className="px-4 py-4 border text-center">{s.id || "-"}</td> */}
                                            <td className="px-4 py-4 border text-right">{s.university || "-"}</td>
                                            <td className="px-4 py-4 border text-right">{s.faculty_name || "-"}</td>
                                            <td className="px-4 py-4 border text-right">{formatDate(s.memo_date)}</td>
                                            <td className="px-4 py-4 border text-right">{formatDate(s.start_date)}</td>
                                            <td className="px-4 py-4 border text-right">{formatDate(s.end_date)}</td>
                                            <td className="px-4 py-4 border text-center print:hidden">
                                                <button
                                                    onClick={() => handleEditClick(s)} 
                                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg text-xs transition duration-200 font-semibold shadow-md"
                                                    title="تعديل الانتداب"
                                                >
                                                    ✏️ تعديل
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 border text-center print:hidden">
                                                <button
                                                    onClick={() => confirmDelete(s.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-xs transition duration-200 font-semibold shadow-md"
                                                    title="حذف الانتداب"
                                                    disabled={isDeleting}
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

            {/* ======= Delete Confirmation Popup ======= */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-96 text-center transform transition-all duration-300 scale-100" dir="rtl">
                        <h2 className="text-xl font-bold text-red-700 mb-4">
                            ⚠️ تأكيد عملية الحذف
                        </h2>
                        <p className="text-md text-gray-700 mb-6">
                            هل أنت متأكد من حذف الانتداب
                            لا يمكن التراجع عن هذا الإجراء.
                        </p>

                        <div className="flex justify-between gap-4">
                            <button
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition duration-200"
                                onClick={() => setShowPopup(false)}
                            >
                                إلغاء
                            </button>

                            <button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
                                disabled={isDeleting}
                                onClick={async () => {
                                    setShowPopup(false);
                                    await handleDeleteSecondment(selectedSecondmentId); 
                                }}
                            >
                                {isDeleting ? 'جاري الحذف...' : 'تأكيد الحذف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Signature Area */}
            <div className="hidden print:block mt-16">
                <div className="flex justify-between text-center text-sm font-medium text-gray-900 my-20 ">
                    <div className="border flex items-center px-3 py-1 w-40 h-10 justify-center shadow-inner">مدير عام الشؤون الإدارية</div>
                    <div className="border flex items-center px-3 py-1 w-40 h-10 justify-center shadow-inner">مدير الموارد البشرية</div>
                    <div className="border flex items-center px-3 py-1 w-40 h-10 justify-center shadow-inner">رئيس قسم الملفات</div>
                    <div className="border flex items-center px-3 py-1 w-40 h-10 justify-center shadow-inner">مسؤول الكمبيوتر</div>
                </div>

                <div className="text-right mt-4 pt-5 text-sm text-gray-700">
                    تحريراً في: {today}
                </div>
            </div>

            <style>
                {`
                    @media print {
                        .print\\:hidden { display: none !important; }
                        .print\\:block { display: block !important; }
                        body { background: white !important; }
                        table, th, td { border-color: #a0a0a0 !important; }
                        thead { background-color: #e0e7ff !important;color:black ; -webkit-print-color-adjust: exact; color-adjust: exact; }
                    }
                `}
            </style>
        </div>
    );
};

export default EmployeeSecondmentsPage;
