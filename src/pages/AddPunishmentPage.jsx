import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "@/axiosInstance";

// ========================= مكون حقل الإدخال الصغير (مساعد) =======================
const InputField = ({ label, name, value, onChange, type = "text", readOnly = false, required = false, children }) => (
    <div className="flex flex-col">
        <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children || (
            <input
                id={name}
                name={name}
                type={type}
                value={value || ""}
                onChange={onChange}
                readOnly={readOnly}
                required={required}
                className={`p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${readOnly ? 'bg-gray-100' : 'bg-white'}`}
            />
        )}
    </div>
);

// ======================================================================
// ======================= دالة تحويل التاريخ (منقولة) ========================
// ======================================================================

// دالة لتحويل تاريخ إلى تنسيق HTML YYYY-MM-DD
const formatToHtmlDate = (dateStr) => {
    if (!dateStr || dateStr.includes("1899")) return "";
    try {
        // التأكد من أن الإدخال يمكن تحويله إلى تاريخ صالح
        return new Date(dateStr).toISOString().substring(0, 10);
    } catch (e) {
        return "";
    }
};

const AddPunishmentPage = () => {
    // 1. استخراج employeeID و punishmentID من المسار
    // punishmentID هو الـ ID الفريد للجزاء في وضع التعديل
    const { employeeID, punishmentID } = useParams();
    const navigate = useNavigate();
    
    // وضع التحرير
    const isEditMode = !!punishmentID;
    const pageTitle = isEditMode ? "تعديل بيانات الجزاء" : "إضافة جزاء جديد";

    // ------------------------- حالات خيارات الجزاء والرسائل -------------------------
    const [punishmentOptions, setPunishmentOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [employeeName, setEmployeeName] = useState("");

    const initialPunishmentData = {
        employee_id: employeeID,
        applicant_name: "",
        serial_number: "",
        area_code: "",
        area_name: "",
        reasons: "", // سبب الجزاء (من الخيارات)
        execution_order: "",
        execution_order_date: "",
        deputation_reasons: "", // سبب الانتداب (اسم حقل مضلل، يستخدم كملاحظة إضافية)
        notes: "",
    };

    const [newPunishmentData, setNewPunishmentData] = useState(initialPunishmentData);


    // ------------------------- دالة جلب خيارات الجزاء -------------------------
    const fetchPunishmentOptions = async () => {
        try {
            const res = await axiosInstance.get("/punishments/options");
            
            if (res.data && Array.isArray(res.data.area_names)) {
                 const cleanOptions = res.data.area_names
                     .map(opt => opt.trim())
                     .filter(opt => opt); 
                setPunishmentOptions([...new Set(cleanOptions)].sort());
            }

        } catch (err) {
            console.error("Error fetching punishment options:", err);
            // خيارات افتراضية في حالة الفشل
            setPunishmentOptions(["إنذار", "خصم من الراتب", "إيقاف عن العمل", "تأخير الترقية"]);
        }
    };

    // ------------------------- جلب بيانات الموظف والجزاء للتعديل -------------------------
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setMessage("");

            await fetchPunishmentOptions();

            // 1. جلب اسم الموظف
            try {
                const infoRes = await axiosInstance.get(
                    `/employee/statement/${employeeID}`
                );
                const info = infoRes.data.employeeInfo;
                setEmployeeName(info.name || "");
                setNewPunishmentData(prev => ({
                    ...prev,
                    applicant_name: info.name || "",
                }));
            } catch (err) {
                console.error("Error fetching employee info:", err);
            }

            // 2. جلب بيانات الجزاء في وضع التعديل
            if (isEditMode) {
                try {
                    // API: GET /punishments/1
                    const res = await axiosInstance.get(`/punishments/${punishmentID}`); 
                    const details = res.data; 

                    // تعبئة حالة النموذج ببيانات الجزاء المجلوبة
                    setNewPunishmentData(prev => ({
                        ...prev,
                        serial_number: details.serial_number || "",
                        area_code: details.area_code || "",
                        area_name: details.area_name || "",
                        reasons: details.reasons || "", 
                        execution_order: details.execution_order || "", 
                        execution_order_date: formatToHtmlDate(details.execution_order_date), 
                        deputation_reasons: details.deputation_reasons || "", 
                        notes: details.notes || "",
                    }));
                } catch (err) {
                    console.error("Error fetching punishment details for edit:", err);
                    setMessage('❌ فشل تحميل بيانات الجزاء للتعديل.');
                }
            }
            setLoading(false);
        };

        if (employeeID) {
            fetchData();
        }
    }, [employeeID, isEditMode, punishmentID]);


    // ------------------------- دوال الجزاء الجديد -------------------------
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPunishmentData(prev => ({ ...prev, [name]: value }));
    };

    // ----------------------------------------------------------------------
    // ✅ حفظ/تحديث الجزاء (POST / PUT)
    // ----------------------------------------------------------------------
    const handleSavePunishment = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage("");

        // تحقق بسيط من الحقول المطلوبة
        if (!newPunishmentData.reasons || !newPunishmentData.execution_order_date) {
            setMessage('❌ الرجاء ملء حقول سبب الجزاء وتاريخ أمر التنفيذ المطلوبة.');
            setIsSaving(false);
            return;
        }

        try {
            const payload = {
                ...newPunishmentData,
                employee_id: employeeID,
                // التأكد من أن جميع الحقول المرسلة غير فارغة
                serial_number: newPunishmentData.serial_number || "",
                area_code: newPunishmentData.area_code || "",
                area_name: newPunishmentData.area_name || "",
                execution_order: newPunishmentData.execution_order || "",
                deputation_reasons: newPunishmentData.deputation_reasons || "",
                notes: newPunishmentData.notes || "",
            };

            const apiUrl = "/punishments";

            if (isEditMode) {
                // وضع التعديل (PUT)
                // API: PUT /punishments/1
                await axiosInstance.put(`${apiUrl}/${punishmentID}`, payload);
                setMessage('✅ تم تحديث بيانات الجزاء بنجاح! ✏️');
            } else {
                // وضع الإنشاء (POST)
                // API: POST https://university.roboeye-tec.com/punishments
                await axiosInstance.post(apiUrl, payload); 
                setMessage('✅ تم إنشاء الجزاء بنجاح! 🎉');
            }

            // بعد النجاح، نعود لصفحة عرض الجزاءات
            setTimeout(() => navigate(`/punishments/${employeeID}`), 1500);

        } catch (err) {
            const action = isEditMode ? 'تحديث' : 'إنشاء';
            const errorMessage = `❌ فشل ${action} الجزاء: ${err.response?.data?.message || err.message}`; 
            setMessage(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-600">جاري تحميل البيانات...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 flex justify-center items-start" >
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
                <h1 className="text-3xl font-bold text-center text-indigo-800 mb-8">
                    {pageTitle}
                </h1>
                
                <form onSubmit={handleSavePunishment}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* الصف الأول (بيانات ثابتة للموظف) */}
                        <div className="col-span-full border-b pb-4 mb-2">
                            <h3 className="text-lg font-semibold text-indigo-600">بيانات الموظف الأساسية</h3>
                        </div>
                        <InputField
                            label="رقم ملف الجامعة"
                            name="employee_id"
                            value={newPunishmentData.employee_id}
                            readOnly={true}
                        />
                        <InputField
                            label="اسم المتقدم"
                            name="applicant_name"
                            value={newPunishmentData.applicant_name || employeeName}
                            readOnly={true}
                        />
                        <InputField
                            label="الرقم التسلسلي"
                            name="serial_number"
                            value={newPunishmentData.serial_number}
                            onChange={handleInputChange}
                        />
                        
                        {/* الصف الثاني (معلومات الجزاء الرئيسية) */}
                        <div className="col-span-full border-b pb-4 my-2">
                            <h3 className="text-lg font-semibold text-indigo-600">تفاصيل الجزاء</h3>
                        </div>

                        {/* حقل سبب الجزاء (Select) */}
                        <InputField
                            label="سبب الجزاء"
                            name="reasons"
                            required={true}
                        >
                            <select
                                id="reasons"
                                name="reasons"
                                value={newPunishmentData.reasons}
                                onChange={handleInputChange}
                                required
                                className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">اختر سبب الجزاء</option>
                                {punishmentOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            {punishmentOptions.length === 0 && !loading && (
                                 <p className="text-xs text-orange-500 mt-1">فشل تحميل خيارات الجزاء.</p>
                            )}
                        </InputField>

                        <InputField
                            label="رمز المنطقة"
                            name="area_code"
                            value={newPunishmentData.area_code}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="اسم المنطقة"
                            name="area_name"
                            value={newPunishmentData.area_name}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="رقم أمر التنفيذ"
                            name="execution_order"
                            value={newPunishmentData.execution_order}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="تاريخ أمر التنفيذ"
                            name="execution_order_date"
                            value={newPunishmentData.execution_order_date}
                            onChange={handleInputChange}
                            type="date"
                            required={true}
                        />
                        
                        {/* حقل سبب الانتداب (ملاحظات أوسع) */}
                        <div className="col-span-full flex flex-col">
                            <label htmlFor="deputation_reasons" className="text-sm font-medium text-gray-700 mb-1">
                                سبب الانتداب (إن وجد)
                            </label>
                            <textarea
                                id="deputation_reasons"
                                name="deputation_reasons"
                                rows="2"
                                value={newPunishmentData.deputation_reasons}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        {/* حقل الملاحظات (ملاحظات أوسع) */}
                        <div className="col-span-full flex flex-col">
                            <label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-1">
                                ملاحظات
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows="2"
                                value={newPunishmentData.notes}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)} // العودة إلى صفحة العرض
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition disabled:opacity-50"
                            disabled={isSaving}
                        >
                            {isSaving ? "جاري الحفظ..." : isEditMode ? '💾 حفظ التعديلات' : "➕ إنشاء الجزاء"}
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

export default AddPunishmentPage;