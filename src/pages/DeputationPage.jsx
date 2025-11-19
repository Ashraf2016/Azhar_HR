// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Logo from "../assets/Logo.png";
// import axiosInstance from "@/axiosInstance";

// const EmployeeDeputationPage = () => {
//     const { employeeID } = useParams();
//     const navigate = useNavigate();
//     const [deputation, setDeputation] = useState([]);
//     const [employeeInfo, setEmployeeInfo] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     // حالات حذف
//     const [deleteMessage, setDeleteMessage] = useState("");
//     const [isDeleting, setIsDeleting] = useState(false);

//     // States للـ Popup
//     const [showPopup, setShowPopup] = useState(false);
//     const [selectedSerial, setSelectedSerial] = useState(null);

//     // جلب البيانات
//     const fetchDeputation = async () => {
//         try {
//             setLoading(true);
//             setError("");
//             const res = await axiosInstance.get(
//                 `/employee/statement/${employeeID}`,
//             );

//             setDeputation(res.data.deputationData);
//             setEmployeeInfo(res.data.employeeInfo);
//         } catch (err) {
//             console.error(err);
//             setError(" حدث خطأ أثناء تحميل بيانات الاعارات .");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // دالة تنفيذ عملية الحذف
//     const handleDelete = async (serialNumber) => {
//         setIsDeleting(true);
//         setDeleteMessage("");

//         try {
//             const url = `/deputation/${employeeID}/${serialNumber}`;
//             await axiosInstance.delete(url);

//             setDeleteMessage("✅ تم حذف الإعارة بنجاح!");
//             await fetchDeputation();
//         } catch (err) {
//             console.error("Delete Error:", err);
//             const message = err.response?.data?.message;

//             if (message === "Access token required" || message === "Invalid or expired token") {
//                 setDeleteMessage("❌ فشل الحذف: لا تملك الصلاحية الكافية لإجراء هذا الحذف.");
//             } else {
//                 setDeleteMessage("❌ حدث خطأ غير متوقع أثناء عملية الحذف.");
//             }
//         } finally {
//             setIsDeleting(false);
//             setTimeout(() => setDeleteMessage(""), 5000);
//         }
//     };

//     useEffect(() => {
//         if (employeeID) fetchDeputation();
//     }, [employeeID]);

//     const formatDate = (dateStr) => {
//         if (!dateStr || dateStr.includes("1899")) return "-";
//         return new Date(dateStr).toLocaleDateString("ar-EG");
//     };

//     const today = new Date().toLocaleDateString("ar-EG");

//     return (
//         <div className="min-h-screen w-[90%] m-auto text-right" dir="rtl">
//             {/* الهيدر */}
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
//                         className="w-24 h-24 object-contain mb-2"
//                     />
//                     <h1 className="text-2xl font-bold text-gray-800">بيان حالة بالإعارات </h1>
//                 </div>

//                 <div className="text-left leading-tight text-gray-800" dir="ltr">
//                     <p className="font-semibold text-lg">Al-Azhar University</p>
//                     <p>General Administration for Administrative Affairs</p>
//                     <p>Human Resources Department</p>
//                     <p>University Data Development and Update Unit</p>
//                 </div>
//             </header>

//             {/* بيانات الموظف */}
//             {employeeInfo && (
//                 <div className="mt-5 text-gray-800 w-[90%] m-auto" dir="rtl">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-right p-4 border border-gray-200 rounded-lg bg-gray-50">

//                         <h2 className="text-md font-semibold ">الاسم: <span className="font-normal text-gray-800">{employeeInfo.name || "-"}</span></h2>
//                         <h2 className="text-md font-semibold ">النوع: <span className="font-normal text-gray-800">{employeeInfo.gender || "-"}</span></h2>
//                         <h2 className="text-md font-semibold ">تاريخ الميلاد: <span className="font-normal text-gray-800">{formatDate(employeeInfo.birthdate) || "-"}</span></h2>

//                         <h2 className="text-md font-semibold ">الرقم القومى : <span className="font-normal text-gray-800">{employeeInfo.nationalID || "-"}</span></h2>
//                         <h2 className="text-md font-semibold ">العنوان: <span className="font-normal text-gray-800">{employeeInfo.address || "-"}</span></h2>
//                         <h2 className="text-md font-semibold ">المحافظة: <span className="font-normal text-gray-800">{employeeInfo.governorate || "-"}</span></h2>

//                         <h2 className="text-md font-semibold ">رقم الملف : <span className="font-normal text-gray-800">{employeeInfo.universityFileNumber || "-"}</span></h2>

//                     </div>
//                 </div>
//             )}

//             {/* أزرار */}
//             <div className="flex justify-end gap-3 mt-4 print:hidden">
//                 <button
//                     onClick={() => window.print()}
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
//                 >
//                     🖨️ طباعة
//                 </button>

//                 <button
//                     onClick={() => navigate(-1)}
//                     className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
//                 >
//                     ⬅️ عودة
//                 </button>
//             </div>

//             {/* رسالة الحذف */}
//             {deleteMessage && (
//                 <p
//                     className={`mt-4 text-center font-medium text-lg ${
//                         deleteMessage.includes("✅") ? "text-green-600" : "text-red-600"
//                     }`}
//                 >
//                     {deleteMessage}
//                 </p>
//             )}

//             {/* جدول الإعارات */}
//             <div className="px-6 pb-10 mt-8">
//                 {loading ? (
//                     <p className="text-center text-gray-600">جاري التحميل...</p>
//                 ) : error ? (
//                     <p className="text-center text-red-600">{error}</p>
//                 ) : (
//                     <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//                         <table className="min-w-full text-sm border border-gray-200">
//                             <thead className="bg-gray-100 text-gray-700 font-semibold">
//                                 <tr>
//                                     <th className="px-4 py-2 border text-center">م</th>
//                                     <th className="px-4 py-2 border text-center">نوع الإعارة</th>
//                                     <th className="px-4 py-2 border text-center">الدولة المعار إليها</th>
//                                     <th className="px-4 py-2 border text-center">جهة الإعارة</th>
//                                     <th className="px-4 py-2 border text-center">تاريخ الإعارة</th>
//                                     <th className="px-4 py-2 border text-center">حتى تاريخ</th>
//                                     <th className="px-4 py-2 border text-center">عام التجديد</th>
//                                     <th className="px-4 py-2 border text-center">تاريخ استلام العمل</th>
//                                     <th className="px-4 py-2 border text-center print:hidden">إجراء</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {deputation.length === 0 ? (
//                                     <tr>
//                                         <td
//                                             colSpan="9"
//                                             className="text-center py-6 text-gray-600 font-medium"
//                                         >
//                                             لا توجد اعارات لهذا الموظف
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     deputation.map((h, index) => (
//                                         <tr key={index} className="hover:bg-gray-50 transition">
//                                             <td className="px-3 py-2 border text-center">{index + 1}</td>
//                                             <td className="px-3 py-2 border">{h.deputationType || "-"}</td>
//                                             <td className="px-3 py-2 border">{h.deputedCountry || "-"}</td>
//                                             <td className="px-3 py-2 border text-center">{h.universityName || "-"}</td>
//                                             <td className="px-3 py-2 border">{formatDate(h.deputationDate) || "-"}</td>
//                                             <td className="px-3 py-2 border">{formatDate(h.deputationEndDate) || "-"}</td>
//                                             <td className="px-3 py-2 border">{h.renewalYear || "-"}</td>
//                                             <td className="px-3 py-2 border">{formatDate(h.deputationStartDate) || "-"}</td>

//                                             <td className="px-3 py-2 border text-center print:hidden">
//                                                 <button
//                                                     onClick={() => {
//                                                         setSelectedSerial(h.serialNumber);
//                                                         setShowPopup(true);
//                                                     }}
//                                                     disabled={isDeleting}
//                                                     className="bg-red-500 hover:bg-red-600 text-white cursor-pointer text-xs font-semibold px-3 py-1 rounded-lg transition duration-200 disabled:opacity-50"
//                                                 >
//                                                     {isDeleting ? "جاري..." : "🗑️ حذف"}
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

//             {/* ======= Popup حذف ======= */}
//             {showPopup && (
//                 <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-center items-center z-50">
//                     <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center">
//                         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                             هل أنت متأكد من الحذف؟
//                         </h2>
//                         <p className="text-sm text-gray-600 mb-6">
//                             لا يمكن التراجع عن هذا الإجراء بعد الحذف.
//                         </p>

//                         <div className="flex justify-between gap-3">
//                             <button
//                                 className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg"
//                                 onClick={() => setShowPopup(false)}
//                             >
//                                 إلغاء
//                             </button>

//                             <button
//                                 className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
//                                 onClick={async () => {
//                                     setShowPopup(false);
//                                     await handleDelete(selectedSerial);
//                                 }}
//                             >
//                                 حذف
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* منطقة توقيعات الطباعة */}
//             <div className="hidden print:block mt-16">
//                 <div className="flex justify-between text-center text-sm font-medium text-gray-900 my-20 ">
//                     <div className="border flex items-center px-3 py-1 w-40">مدير عام الشؤون الإدارية</div>
//                     <div className="border flex items-center px-3 py-1 w-40">مدير الموارد البشرية</div>
//                     <div className="border flex items-center px-3 py-1 w-40">رئيس قسم الملفات</div>
//                     <div className="border flex items-center px-3 py-1 w-40">مسؤول الكمبيوتر</div>
//                 </div>

//                 <div className="text-right mt-4 pt-5 text-sm text-gray-700">
//                     تحريراً في: {today}
//                 </div>
//             </div>

//             {/* CSS للطباعة */}
//             <style>
//                 {`
//                     @media print {
//                         .print\\:hidden { display: none !important; }
//                         .print\\:block { display: block !important; }
//                     }
//                 `}
//             </style>
//         </div>
//     );
// };

// export default EmployeeDeputationPage;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import axiosInstance from "@/axiosInstance";

const EmployeeDeputationPage = () => {
    const { employeeID } = useParams();
    const navigate = useNavigate();
    const [deputation, setDeputation] = useState([]);
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // حالات حذف
    const [deleteMessage, setDeleteMessage] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // States للـ Popup
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSerial, setSelectedSerial] = useState(null);

    // جلب البيانات
    const fetchDeputation = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axiosInstance.get(
                `/employee/statement/${employeeID}`,
            );

            setDeputation(res.data.deputationData);
            setEmployeeInfo(res.data.employeeInfo);
        } catch (err) {
            console.error(err);
            setError(" حدث خطأ أثناء تحميل بيانات الاعارات .");
        } finally {
            setLoading(false);
        }
    };

    // دالة تنفيذ عملية الحذف
    const handleDelete = async (serialNumber) => {
        setIsDeleting(true);
        setDeleteMessage("");

        try {
            const url = `/deputation/${employeeID}/${serialNumber}`;
            await axiosInstance.delete(url);

            setDeleteMessage("✅ تم حذف الإعارة بنجاح!");
            await fetchDeputation();
        } catch (err) {
            console.error("Delete Error:", err);
            const message = err.response?.data?.message;

            if (message === "Access token required" || message === "Invalid or expired token" || message ==="Access denied. Required permission: deputation:delete") {
                setDeleteMessage("❌ فشل الحذف: لا تملك الصلاحية الكافية لإجراء هذا الحذف.");
            } else {
                setDeleteMessage("❌ حدث خطأ غير متوقع أثناء عملية الحذف.");
                
            }
        } finally {
            setIsDeleting(false);
            setTimeout(() => setDeleteMessage(""), 5000);
        }
    };

    useEffect(() => {
        if (employeeID) fetchDeputation();
    }, [employeeID]);

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr.includes("1899")) return "-";
        // تحويل التاريخ إلى صيغة قابلة للعرض، وتجاهل أي توقيتات
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
                    <h1 className="text-2xl font-bold text-gray-800">بيان حالة بالإعارات </h1>
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

            {/* جدول الإعارات */}
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
                                    <th className="px-4 py-2 border text-center">نوع الإعارة</th>
                                    <th className="px-4 py-2 border text-center">الدولة المعار إليها</th>
                                    <th className="px-4 py-2 border text-center">جهة الإعارة</th>
                                    <th className="px-4 py-2 border text-center">تاريخ الإعارة</th>
                                    <th className="px-4 py-2 border text-center">حتى تاريخ</th>
                                    <th className="px-4 py-2 border text-center">عام التجديد</th>
                                    <th className="px-4 py-2 border text-center">تاريخ استلام العمل</th>
                                    <th className="px-4 py-2 border text-center print:hidden">إجراء</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deputation.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="text-center py-6 text-gray-600 font-medium"
                                        >
                                            لا توجد اعارات لهذا الموظف
                                        </td>
                                    </tr>
                                ) : (
                                    deputation.map((h, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition">
                                            <td className="px-3 py-2 border text-center">{index + 1}</td>
                                            <td className="px-3 py-2 border">{h.deputationType || "-"}</td>
                                            <td className="px-3 py-2 border">{h.deputedCountry || "-"}</td>
                                            <td className="px-3 py-2 border text-center">{h.universityName || "-"}</td>
                                            <td className="px-3 py-2 border">{formatDate(h.deputationDate) || "-"}</td>
                                            <td className="px-3 py-2 border">{formatDate(h.deputationEndDate) || "-"}</td>
                                            <td className="px-3 py-2 border">{h.renewalYear || "-"}</td>
                                            <td className="px-3 py-2 border">{formatDate(h.deputationStartDate) || "-"}</td>

                                            <td className="px-3 py-2 border text-center print:hidden">
                                                {/* زر التعديل المُحدث ليمرر بيانات الإعارة */}
                                                <button
                                                    onClick={() => {
                                                        // تمرير كائن البيانات كاملاً عبر state لتجنب طلب GET الفاشل
                                                        navigate(`/deputation/edit/${employeeID}/${h.serialNumber}`, {
                                                            state: { deputationData: h } 
                                                        });
                                                    }}
                                                    className="bg-green-500 hover:bg-green-600 text-white cursor-pointer text-xs font-semibold px-3 py-1 rounded-lg transition duration-200 ml-2"
                                                >
                                                    ✏️ تعديل
                                                </button>

                                                {/* زر الحذف الحالي */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedSerial(h.serialNumber);
                                                        setShowPopup(true);
                                                    }}
                                                    disabled={isDeleting}
                                                    className="bg-red-500 hover:bg-red-600 text-white cursor-pointer text-xs font-semibold px-3 py-1 rounded-lg transition duration-200 disabled:opacity-50"
                                                >
                                                    {isDeleting ? "جاري..." : "🗑️ حذف"}
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

export default EmployeeDeputationPage;