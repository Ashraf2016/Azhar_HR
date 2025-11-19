import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png"; 



const MessagePopup = ({ message, type }) => {
    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800';
    const icon = isSuccess ? '✅' : '❌';

    return (
        <div className="fixed bottom-5 right-5 flex items-center justify-center z-[1000] transition-opacity duration-300">
            <div className={`border-r-4 ${bgColor} rounded-lg shadow-2xl w-full max-w-sm`} role="alert" dir="rtl">
                <div className="p-4 flex items-center">
                    <div className="text-2xl ml-3 flex-shrink-0">{icon}</div>
                    <div>
                        <p className="font-bold text-md">{isSuccess ? 'عملية ناجحة' : 'عملية فاشلة'}</p>
                        <p className="text-sm">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ========================= مكون تأكيد الحذف (MODAL) ========================
const DeleteConfirmationModal = ({ onConfirm, onCancel, itemName }) => {
    return (
        <div className="fixed inset-0 bg-gray-600/50 bg-opacity-75 flex items-center justify-center z-[1000]" dir="rtl">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 transform transition-all">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16.333c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">تأكيد الحذف</h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            هل أنت متأكد من أنك تريد حذف هذا الجزاء ({itemName || "غير محدد"})؟ لا يمكن التراجع عن هذا الإجراء.
                        </p>
                    </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse justify-center gap-3">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onConfirm}
                    >
                        نعم، احذفه
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={onCancel}
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

// ======================================================================
// ======================= المكون الرئيسي =======================
// ======================================================================

const EmployeePunishmentsPage = () => {
    const { employeeID } = useParams();
    const navigate = useNavigate();

    // ------------------------- حالات الجزاءات والتحميل -------------------------
    const [punishments, setPunishments] = useState([]);
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ✅ الحالة الجديدة لرسالة النافذة المنبثقة (Popup)
    const [popupMessage, setPopupMessage] = useState({
        show: false,
        type: '', // 'success' أو 'error'
        message: ''
    });

    // ✅ الحالة لتأكيد الحذف
    const [punishmentToDelete, setPunishmentToDelete] = useState(null);
    const [punishmentToDeleteReason, setPunishmentToDeleteReason] = useState(null);


    // ------------------------- دوال مساعدة -------------------------
    const formatDate = (dateStr) => {
        if (!dateStr || dateStr.includes("1899")) return "-";
        // افتراض: يمكن استخدام toLocaleDateString مباشرة
        return new Date(dateStr).toLocaleDateString("ar-EG");
    };

    // ------------------------- دالة لإخفاء الـ Popup -------------------------
    const hidePopup = useCallback(() => {
        setPopupMessage({ show: false, type: '', message: '' });
    }, []);


    // ------------------------- دالة لعرض وإخفاء الـ Popup تلقائيًا -------------------------
    const showAndHidePopup = useCallback((type, message) => {
        setPopupMessage({ show: true, type, message });
        setTimeout(hidePopup, 5000);
    }, [hidePopup]);

    // ------------------------- دالة جلب الجزاءات -------------------------
    const fetchPunishments = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(
                `/punishments/employee/${employeeID}`
            );
            setPunishments(res.data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء تحميل بيانات الجزاءات.");
        } finally {
            setLoading(false);
        }
    }, [employeeID]);

    // ------------------------- تأثيرات تحميل البيانات -------------------------
    useEffect(() => {
        if (employeeID) {
            fetchPunishments();
        }
    }, [employeeID, fetchPunishments]);

    useEffect(() => {
        const fetchEmployeeInfo = async () => {
            try {
                const res = await axiosInstance.get(
                    `/employee/statement/${employeeID}`
                );
                const info = res.data.employeeInfo;
                setEmployeeInfo(info);
            } catch (err) {
                console.error(err);
            }
        };

        if (employeeID) fetchEmployeeInfo();
    }, [employeeID]);


    // ----------------------------------------------------------------------
    // ✅ النقل لصفحة التعديل (بدلاً من فتح Modal)
    // ----------------------------------------------------------------------
    const handleEditClick = (punishment) => {
        // نستخدم punishment.id كمعرف فريد للتعديل في المسار الجديد
        navigate(`/punishments/edit/${employeeID}/${punishment.id}`);
    };

    // ------------------------- دوال الحذف -------------------------
    const confirmDelete = (punishment) => {
        setPunishmentToDelete(punishment.id);
        setPunishmentToDeleteReason(punishment.reasons || punishment.serial_number || 'غير معروف');
    };

    const handleDeletePunishment = async () => {
        const idToDelete = punishmentToDelete;

        if (!idToDelete) return;

        setPunishmentToDelete(null);
        setPunishmentToDeleteReason(null);
        hidePopup();

        try {
            // API: DELETE /punishments/1
            await axiosInstance.delete(
                `/punishments/${idToDelete}`
            );
            showAndHidePopup('success', 'تم حذف الجزاء بنجاح! 🗑️');
            fetchPunishments(); // إعادة جلب القائمة
        } catch (err) {
            const errorMessage = `فشل حذف الجزاء: ${err.response?.data?.message || err.message}`;
            showAndHidePopup(
                'error',
                errorMessage,
            );
        }
    };

    const cancelDelete = () => {
        setPunishmentToDelete(null);
        setPunishmentToDeleteReason(null);
    };

    // ----------------------------------------------------------------------
    // ✅ النقل لصفحة الإضافة (بدلاً من فتح Modal)
    // ----------------------------------------------------------------------
    const handleAddClick = () => {
        navigate(`/employee/punishments/add/${employeeID}`);
    };


    const today = new Date().toLocaleDateString("ar-EG");

    return (
        <div className="min-h-screen w-[90%] m-auto text-right" dir="rtl">
            {/* الهيدر */}
            {/* ... (بقية الهيدر كما هو) ... */}
            <header className="flex items-start justify-between border-b border-gray-300 py-4">
                {/* الجزء العربي */}
                <div className="text-right leading-tight text-gray-800">
                    <p className="font-semibold text-lg">جامعة الأزهر</p>
                    <p>الإدارة العامة للشؤون الإدارية</p>
                    <p>إدارة الموارد البشرية</p>
                    <p>وحدة تطوير وتحديث بيانات الجامعة</p>
                </div>

                {/* اللوجو + العنوان */}
                <div className="flex flex-col items-center justify-center text-center">
                    <img
                        src={Logo}
                        alt="Al-Azhar University Logo"
                        className="w-24 h-24 object-contain mb-2"
                    />
                    <h1 className="text-2xl font-bold text-gray-800">بيان جزاءات</h1>
                </div>

                {/* الجزء الإنجليزي */}
                <div className="text-left leading-tight text-gray-800" dir="ltr">
                    <p className="font-semibold text-lg">Al-Azhar University</p>
                    <p>General Administration for Administrative Affairs</p>
                    <p>Human Resources Department</p>
                    <p>University Data Development and Update Unit</p>
                </div>
            </header>

            {/* بيانات الموظف */}
            {employeeInfo && (
                <div className="mt-5 text-gray-800 w-[60%] m-auto">
                    <div className="flex justify-between">
                        <h2 className="text-lg">الاسم: {employeeInfo.name || "-"}</h2>
                        <h2 className="text-lg">رقم الملف : {employeeInfo.universityFileNumber || "-"}</h2>
                    </div>
                </div>
            )}

            {/* الأزرار */}
            <div className="flex justify-end gap-3 mt-4 print:hidden">
                {/* زر إضافة جزاء جديد */}
                {/* <button
                    onClick={handleAddClick} // استدعاء دالة النقل لصفحة الإضافة
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
                >
                    ➕ إضافة جزاء جديد
                </button> */}

                {/* زر الطباعة */}
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
                >
                    🖨️ طباعة
                </button>

                {/* زر العودة للخلف */}
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
                >
                    ⬅️ عودة
                </button>
            </div>

            {/* الجدول */}
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
                                    <th className="px-4 py-2 border text-center">رقم تسلسلي</th>
                                    <th className="px-4 py-2 border text-center">سبب الجزاء</th>
                                    <th className="px-4 py-2 border text-center">المنطقة</th>
                                    <th className="px-4 py-2 border text-center">رقم أمر التنفيذ</th>
                                    <th className="px-4 py-2 border text-center">تاريخ أمر التنفيذ</th>
                                    <th className="px-4 py-2 border text-center">ملاحظات</th>
                                    <th className="px-4 py-2 border text-center print:hidden">تعديل</th>
                                    <th className="px-4 py-2 border text-center print:hidden">حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {punishments.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="text-center py-6 text-gray-600 font-medium"
                                        >
                                            لا توجد جزاءات مسجلة لهذا الموظف
                                        </td>
                                    </tr>
                                ) : (
                                    punishments.map((p, index) => (
                                        // يفترض أن الجزاءات لديها حقل 'id' فريد
                                        <tr key={p.id || index} className="hover:bg-gray-50 transition">
                                            <td className="px-3 py-2 border text-center">
                                                {index + 1}
                                            </td>
                                            <td className="px-3 py-2 border text-center">
                                                {p.serial_number || "-"}
                                            </td>
                                            <td className="px-3 py-2 border">{p.reasons || "-"}</td>
                                            <td className="px-3 py-2 border">{p.area_name || p.area_code || "-"}</td>
                                            <td className="px-3 py-2 border text-center">
                                                {p.execution_order || "-"}
                                            </td>
                                            <td className="px-3 py-2 border">
                                                {formatDate(p.execution_order_date)}
                                            </td>
                                            <td className="px-3 py-2 border">{p.notes || "-"}</td>
                                            <td className="px-3 py-2 border text-center print:hidden">
                                                <button
                                                    onClick={() => handleEditClick(p)}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                    title="تعديل"
                                                >
                                                    ✏️
                                                </button>
                                                
                                            </td>
                                            <td className="text-center border print:hidden">
                                                <button
                                                    onClick={() => confirmDelete(p)}
                                                    className="text-red-600 hover:text-red-900 font-medium"
                                                    title="حذف"
                                                >
                                                    🗑️
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

            {/* قسم التوقيعات يظهر فقط عند الطباعة */}
            <div className="hidden print:block mt-16">
                {/* ... (بقية التوقيعات كما هي) ... */}
                <div className="flex justify-between text-center text-sm font-medium text-gray-900 my-20 ">
                    <div className="border flex items-center px-3 py-1 w-40">
                        مدير عام الشؤون الإدارية
                    </div>
                    <div className="border flex items-center px-3 py-1 w-40">
                        مدير الموارد البشرية
                    </div>
                    <div className="border flex items-center px-3 py-1 w-40">
                        رئيس قسم الملفات
                    </div>
                    <div className="border flex items-center px-3 py-1 w-40">
                        مسؤول الكمبيوتر
                    </div>
                </div>

                <div className="text-right mt-4 pt-5 text-sm text-gray-700">
                    تحريراً في: {today}
                </div>
            </div>

            {/* CSS خاص بالطباعة */}
            <style>
                {`
                @media print {
                    .print\\:hidden {
                        display: none !important;
                    }
                }
                `}
            </style>

            {/* ======================= نافذة تأكيد الحذف ======================= */}
            {punishmentToDelete && (
                <DeleteConfirmationModal
                    onConfirm={handleDeletePunishment}
                    onCancel={cancelDelete}
                    itemName={punishmentToDeleteReason}
                />
            )}

            {/* ======================= رسالة التنبيه المنبثقة ======================= */}
            {popupMessage.show && (
                <MessagePopup
                    message={popupMessage.message}
                    type={popupMessage.type}
                />
            )}
        </div>
    );
};

export default EmployeePunishmentsPage;