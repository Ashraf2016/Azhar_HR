import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosInstance";

// ==================================================================
// (0) Popup Message Component
// ==================================================================
const PopupMessage = ({ type, message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed top-6 right-6 z-50 animate-slideIn">
            <div
                className={`px-6 py-4 rounded-xl shadow-lg text-white font-medium 
                ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
            >
                {message}
            </div>
        </div>
    );
};

// Tailwind Animation
const style = document.createElement("style");
style.innerHTML = `
    @keyframes slideIn {
        0% { transform: translateX(120%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    .animate-slideIn { animation: slideIn 0.5s ease forwards; }
`;
document.head.appendChild(style);

// ==================================================================
// (1) CollapsibleSection Component
// ==================================================================
const CollapsibleSection = ({ title, children, isOpen, toggleOpen, icon }) => {
    return (
        <div className="border border-gray-300 rounded-xl mb-6 overflow-hidden shadow-sm">
            <div
                className="bg-gray-100 p-4 cursor-pointer flex justify-between items-center hover:bg-gray-200 transition duration-200"
                onClick={toggleOpen}
                dir="rtl"
            >
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="ml-3 text-xl text-indigo-600">{icon}</span>
                    {title}
                </h3>
                <span className="text-gray-500 font-bold text-lg transition duration-200">
                    {isOpen ? "▲" : "▼"}
                </span>
            </div>

            <div
                className={`transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-screen opacity-100 p-6" : "max-h-0 opacity-0 p-0"
                }`}
                style={{
                    padding: isOpen ? "1.5rem 1.5rem" : "0 1.5rem",
                    pointerEvents: isOpen ? "auto" : "none",
                    visibility: isOpen ? "visible" : "hidden",
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                    {children}
                </div>
            </div>
        </div>
    );
};

// ==================================================================
// (2) FormField Component
// ==================================================================
const FormField = ({ label, children, isFullWidth = false, isRequired = false }) => (
    <div className={`flex flex-col ${isFullWidth ? "col-span-full" : "col-span-1"}`}>
        <label className="text-sm font-medium text-gray-700 mb-1">
            {label}
            {isRequired && <span className="text-red-500 mr-1">*</span>}
        </label>
        {children}
    </div>
);

// filteredDepartmentOption
// ==================================================================
// (3) extractBirthDateString
// ==================================================================
const extractBirthDateString = (nationalId) => {
    if (!/^\d{14}$/.test(nationalId)) return null;

    const century = nationalId[0];
    const year = nationalId.slice(1, 3);
    const month = nationalId.slice(3, 5);
    const day = nationalId.slice(5, 7);

    let fullYear =
        century === "2" ? `19${year}` : century === "3" ? `20${year}` : null;

    if (!fullYear) return null;

    const d = new Date(`${fullYear}-${month}-${day}`);
    if (isNaN(d.getTime())) return null;

    return `${fullYear}-${month}-${day}`;
};

// ==================================================================
// (4) AssistantsPage
// ==================================================================
const AssistantsPage = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    // Popup message state
    const [popup, setPopup] = useState({ type: "", message: "" });

    // Function to show popup
    const showPopup = (type, message) => {
        setPopup({ type, message });
        setTimeout(() => setPopup({ type: "", message: "" }), 5000);
    };

    // Collapsible sections
    const [isBasicOpen, setIsBasicOpen] = useState(true);
    const [isWorkOpen, setIsWorkOpen] = useState(false);
    const [isQualificationOpen, setIsQualificationOpen] = useState(false);

    // API states
    const [facultyOptions, setFacultyOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [academicDegreeOptions, setAcademicDegreeOptions] = useState([]);

    const [loadingFaculties, setLoadingFaculties] = useState(true);
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [loadingAcademicDegrees, setLoadingAcademicDegrees] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        university_file_number: "",
        name: "",
        file_number: "",
        birth_date: null,
        birth_place: "",
        residence_place: "",
        residence_id_number: "",
        residence_governorate: "",
        gender: "",
        national_id_number: "",
        marital_status: "",
        military_status: "",
        hire_date: null,
        department_code: "",
        department_name: "",
        faculty_code: "",
        faculty_name: "",
        specialization_code: "",
        specialization_name: "",
        faculty_location: "",
        work_status: "",
        work_phone: "",
        mobile: "",
        notes: "",
        job_code: "",
        data_entry_user: username || "",
        data_updated: new Date(),
        qualification: {
            university_name: "",
            specialization: "",
            degree_type: "",
            grade: "",
            graduation_year: null,
            master_title: "",
            master_year: null,
            master_grade: "",
            PhD_title: "",
            PhD_year: null,
            PhD_grade: "",
        },
    });

    // Fetch faculties
    useEffect(() => {
        axiosInstance
            .get("/structure/faculty")
            .then((res) => setFacultyOptions(res.data))
            .catch(() => showPopup("error", "فشل تحميل بيانات الكليات"))
            .finally(() => setLoadingFaculties(false));
    }, []);

    // Fetch departments
    useEffect(() => {
        axiosInstance
            .get("/structure/department")
            .then((res) => setDepartmentOptions(res.data))
            .catch(() => showPopup("error", "فشل تحميل بيانات الأقسام"))
            .finally(() => setLoadingDepartments(false));
    }, []);

    // Fetch job degrees
    useEffect(() => {
        axiosInstance
            .get("/structure/academic-degree")
            .then((res) => setAcademicDegreeOptions(res.data))
            .catch(() => showPopup("error", "فشل تحميل الدرجات العلمية"))
            .finally(() => setLoadingAcademicDegrees(false));
    }, []);

    // Handle input general
    const handleChange = (e) => {
    const { name, value } = e.target;

    // في حالة تغيير الوظيفة الحالية
    if (name === "job_code") {
        const selected = academicDegreeOptions.find(
            (degree) => String(degree.job_code) === String(value)
        );

        setFormData((prev) => ({
            ...prev,
            job_code: value,
            current_position: selected ? selected.job_name : "",
        }));

        return; 
    }
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};


    // Handle qualification input
    const handleQualificationChange = (e) => {
        setFormData({
            ...formData,
            qualification: {
                ...formData.qualification,
                [e.target.name]: e.target.value,
            },
        });
    };

    // National ID auto extract birth date
    const handleNationalIdChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;

        const birthString =
            value.length === 14 ? extractBirthDateString(value) : null;

        setFormData({
            ...formData,
            national_id_number: value,
            birth_date: birthString ? new Date(birthString) : null,
        });
    };

    // Faculty selection
    const handleFacultyChange = (e) => {
        const selectedName = e.target.value;
        const selected = facultyOptions.find((f) => f.name === selectedName);

        setFormData({
            ...formData,
            faculty_name: selectedName,
            faculty_code: selected ? selected.code : "",
            department_name: "",
            department_code: "",
        });
    };

    // Department selection
    const handleDepartmentChange = (e) => {
        const selectedName = e.target.value;
        const selected = departmentOptions.find((d) => d.name === selectedName);

        setFormData({
            ...formData,
            department_name: selectedName,
            department_code: selected ? selected.dept_code : "",
        });
    };

    
    // Filter departments based on faculty
    const  filteredDepartmentOptions = departmentOptions.filter(
        (d) => String(d.fac_code) === String(formData.faculty_code)
    );

    // Date handler
    const handleDateChange = (name, value) => {
        setFormData({ ...formData, [name]: value ? new Date(value) : null });
    };

    // qualification date
    const handleQualificationDateChange = (name, value) => {
        setFormData({
            ...formData,
            qualification: {
                ...formData.qualification,
                [name]: value ? new Date(value) : null,
            },
        });
    };

    // ===========================================
    // ⭐ SUBMIT WITH POPUP ⭐
    // ===========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.national_id_number.length !== 14) {
            showPopup("error", "الرقم القومي يجب أن يكون 14 رقم");
            return;
        }

        const payload = {
            ...formData,
            birth_date: formData.birth_date
                ?.toISOString()
                .split("T")[0],
            hire_date: formData.hire_date
                ?.toISOString()
                .split("T")[0],
            data_updated: new Date().toISOString().split("T")[0],
        };

        try {
            await axiosInstance.post("employee/add", payload);

            showPopup("success", "تم إضافة الموظف بنجاح 🎉");

            // setTimeout(() => navigate("/"), 1200);
        } catch (err) {
            showPopup("error", "حدث خطأ أثناء حفظ البيانات ❌");
        }
    };

    // ==================================================================
    // Render
    // ==================================================================
    return (
        <div className="p-6 bg-[#fdfbff] min-h-screen">
            {/* Popup */}
            <PopupMessage type={popup.type} message={popup.message} />

            <div className="max-w-5xl mx-auto bg-white shadow-xl p-8 mt-8 rounded-2xl border border-gray-200">
                <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">
                    تعيين عضو هيئة تدريس جديد
                </h1>

                <form onSubmit={handleSubmit} className="text-right">

                     {/* =================================================== */}
                     {/* 1. البيانات الأساسية                               */}
                     {/* =================================================== */}
                     <CollapsibleSection
                         title="البيانات الأساسية"
                         isOpen={isBasicOpen}
                         toggleOpen={() => setIsBasicOpen(!isBasicOpen)}
                         icon="👤"
                     >
                         {/* حقول غير مطلوبة */}
                         <FormField label="الرقم الجامعي">
                             <input name="university_file_number" value={formData.university_file_number} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                         </FormField>
                        
                         {/* 💡 حقل الاسم (مطلوب) */}
                         <FormField label="الاسم" isRequired={true}>
                             <input name="name" value={formData.name} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required />
                         </FormField>
                        
                         {/* حقول غير مطلوبة */}
                         <FormField label="رقم الملف">
                             <input name="file_number" value={formData.file_number} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                         </FormField>
                        
                         {/* 💡 حقل محل الميلاد (مطلوب) */}
                         <FormField label="محل الميلاد" isRequired={true}>
                             <input name="birth_place" value={formData.birth_place} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required />
                         </FormField>
                        
                         {/* 💡 حقل محل الإقامة (مطلوب) */}
                         <FormField label="محل الإقامة" isRequired={true}>
                             <input name="residence_place" value={formData.residence_place} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required />
                         </FormField>
                        
                         {/* حقول غير مطلوبة */}
                         <FormField label="رقم الإقامة">
                             <input name="residence_id_number" value={formData.residence_id_number} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                         </FormField>
                        
                         {/* 💡 حقل محافظة الإقامة (مطلوب) */}
                         <FormField label="محافظة الإقامة" isRequired={true}>
                             <input name="residence_governorate" value={formData.residence_governorate} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required />
                         </FormField>
                        
                         {/* تاريخ الميلاد (ReadOnly) */}
                         <FormField label="تاريخ الميلاد">
                             <input
                                 type="date"
                                 name="birth_date"
                                 value={formData.birth_date ? formData.birth_date.toISOString().split("T")[0] : ""}
                                 readOnly={true} 
                                 className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 cursor-not-allowed"
                             />
                         </FormField>

                         {/* 💡 حقل النوع (مطلوب - تم تعديل القيمة الافتراضية) */}
                         <FormField label="النوع" isRequired={true}>
                             <select 
                                 name="gender" 
                                 value={formData.gender} 
                                 onChange={handleChange} 
                                 className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                 required
                             >
                                 <option value="">اختر النوع</option> {/* 💡 القيمة الفارغة تجعل الحقل مطلوباً */}
                                 <option value="male">ذكر</option>
                                 <option value="female">انثى</option>
                             </select>
                        </FormField>

                        {/* 💡 حقل الرقم القومي (مطلوب) */}
                        <FormField label="الرقم القومي (14 رقم)" isRequired={true}>
                            <input 
                                name="national_id_number" 
                                value={formData.national_id_number} 
                                onChange={handleNationalIdChange} 
                                maxLength={14} 
                                inputMode="numeric"
                                className={`p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                                    formData.national_id_number.length > 0 && formData.national_id_number.length !== 14
                                    ? 'border-red-500' 
                                    : ''
                                }`} 
                                required 
                            />
                            {formData.national_id_number.length > 0 && formData.national_id_number.length !== 14 && (
                                <p className="text-red-500 text-xs mt-1">يجب أن يكون الرقم القومي 14 رقم.</p>
                            )}
                        </FormField>
                        
                        {/* 💡 حقل الحالة الاجتماعية (مطلوب - تم تعديل القيمة الافتراضية) */}
                        <FormField label="الحالة الاجتماعية" isRequired={true}>
                            <select 
                                name="marital_status" 
                                value={formData.marital_status} 
                                onChange={handleChange} 
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">اختر الحالة</option> {/* 💡 القيمة الفارغة تجعل الحقل مطلوباً */}
                                <option value="single">أعزب</option>
                                <option value="married">متزوج</option>
                                <option value="divorced">مطلق</option>
                                <option value="widowed">أرمل</option>
                            </select>
                        </FormField>

                        {/* 💡 حقل الموقف من التجنيد (مطلوب - تم تعديل القيمة الافتراضية) */}
                        <FormField label="الموقف من التجنيد" isRequired={true}>
                            <select 
                                name="military_status" 
                                value={formData.military_status} 
                                onChange={handleChange} 
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">اختر الموقف</option> {/* 💡 القيمة الفارغة تجعل الحقل مطلوباً */}
                                <option value="أدى الخدمة العسكرية">أدى الخدمة العسكرية</option>
                                <option value="معفى نهائي">معفى نهائي</option>
                                <option value="معفى مؤقت">معفى مؤقت</option>
                                <option value="مؤجل تجنيد">مؤجل تجنيد</option>
                                <option value="غير مطلوب للتجنيد">غير مطلوب للتجنيد</option>
                                <option value="لا ينطبق (للسيدات)">لا ينطبق (للسيدات)</option>
                            </select>
                        </FormField>

                        {/* حقول غير مطلوبة */}
                        <FormField label="هاتف العمل">
                            <input name="work_phone" value={formData.work_phone} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                        </FormField>
                        <FormField label="الموبايل">
                            <input name="mobile" value={formData.mobile} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                        </FormField>
                        <FormField label="ملاحظات" isFullWidth={true}>
                            <textarea name="notes" value={formData.notes} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" rows="3" />
                        </FormField>
                    </CollapsibleSection>

                    
                    {/* =================================================== */}
                    {/* 2. بيانات المؤهل                                   */}
                    {/* =================================================== */}
                    <CollapsibleSection
                        title="بيانات المؤهل"
                        isOpen={isQualificationOpen}
                        toggleOpen={() => setIsQualificationOpen(!isQualificationOpen)}
                        icon="🎓"
                    >
                        {/* 💡 حقل الجامعة (مطلوب) */}
                        <FormField label="الجامعة" isRequired={true}>
                            <input 
                                name="university_name" 
                                value={formData.qualification.university_name} 
                                onChange={handleQualificationChange} 
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                                required
                            />
                        </FormField>
                        
                        {/* 💡 حقل التخصص (مطلوب) */}
                        <FormField label="التخصص" isRequired={true}>
                            <input 
                                name="specialization" 
                                value={formData.qualification.specialization} 
                                onChange={handleQualificationChange} 
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                                required
                            />
                        </FormField>
                        
                        
                        <FormField label="نوع الدرجة" isRequired={true}>
                            <select
                                name="degree_type"
                                value={formData.qualification.degree_type}
                                onChange={handleQualificationChange}
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">اختر نوع الدرجة</option>
                                <option value="بكالوريوس">بكالوريوس</option>
                                <option value="ماجستير">ماجستير</option>
                                <option value="دكتوراه">دكتوراه</option>
                            </select>
                        </FormField>


                        {/* 💡 حقل التقدير (مطلوب) */}
                        <FormField label="التقدير" isRequired={true}>
                            <select
                                name="grade"
                                value={formData.qualification.grade}
                                onChange={handleQualificationChange}
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">اختر التقدير</option>

                                <option value="امتياز مع مرتبة الشرف">امتياز مع مرتبة الشرف</option>
                                <option value="امتياز">امتياز</option>
                                <option value="جيد جدًا مع مرتبة الشرف">جيد جدًا مع مرتبة الشرف</option>
                                <option value="جيد جدًا">جيد جدًا</option>
                                <option value="جيد">جيد</option>
                                <option value="مقبول">مقبول</option>
                            </select>
                        </FormField>

                        
                        {/* 💡 حقل سنة التخرج (مطلوب) */}
                        <FormField label="سنة التخرج" isRequired={true}>
                            <input
                                type="date"
                                name="graduation_year"
                                value={formData.qualification.graduation_year ? formData.qualification.graduation_year.toISOString().split("T")[0] : ""}
                                onChange={(e) => handleQualificationDateChange("graduation_year", e.target.value)}
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </FormField>
                        
                        {/* حقول غير مطلوبة */}
                        <FormField label="عنوان الماجستير">
                            <input name="master_title" value={formData.qualification.master_title} onChange={handleQualificationChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                        </FormField>
                        <FormField label="سنة الماجستير">
                            <input
                                type="date"
                                name="master_year"
                                value={formData.qualification.master_year ? formData.qualification.master_year.toISOString().split("T")[0] : ""}
                                onChange={(e) => handleQualificationDateChange("master_year", e.target.value)}
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </FormField>
                        <FormField label="تقدير الماجستير">
                            <input name="master_grade" value={formData.qualification.master_grade} onChange={handleQualificationChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                        </FormField>

                        <FormField label="عنوان الدكتوراه">
                            <input name="PhD_title" value={formData.qualification.PhD_title} onChange={handleQualificationChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                        </FormField>
                        <FormField label="سنة الدكتوراه">
                            <input
                                type="date"
                                name="PhD_year"
                                value={formData.qualification.PhD_year ? formData.qualification.PhD_year.toISOString().split("T")[0] : ""}
                                onChange={(e) => handleQualificationDateChange("PhD_year", e.target.value)}
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </FormField>
                        <FormField label="تقدير الدكتوراه">
                            <input 
                                name="PhD_grade" 
                                value={formData.qualification.PhD_grade} 
                                onChange={handleQualificationChange} 
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                            />
                        </FormField>
                    </CollapsibleSection>
                    {/* =================================================== */}
                    {/* 3. بيانات العمل                                    */}
                    {/* =================================================== */}
                    <CollapsibleSection
                        title="بيانات العمل"
                        isOpen={isWorkOpen}
                        toggleOpen={() => setIsWorkOpen(!isWorkOpen)}
                        icon="🏢"
                    >
                        {/* 💡 حقل تاريخ التعيين (مطلوب) */}
                        <FormField label="تاريخ التعيين" isRequired={true}>
                            <input
                                type="date"
                                name="hire_date"
                                value={formData.hire_date ? formData.hire_date.toISOString().split("T")[0] : ""}
                                onChange={(e) => handleDateChange("hire_date", e.target.value)}
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </FormField>
                        
                        {/* حقل غير مطلوب */}
                        <FormField label="الوظيفة الحالية" isRequired={true}>
                            <select 
                                name="job_code" 
                                value={formData.job_code} 
                                onChange={handleChange} 
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={loadingAcademicDegrees}
                                required
                            >
                                <option value="">
                                    {loadingAcademicDegrees ? 'جاري تحميل الدرجات...' : 'اختر الوظيفة الحالية'}
                                </option>
                                {academicDegreeOptions.map((degree) => (
                                    <option key={degree.job_code} value={degree.job_code}>
                                        {degree.job_name}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                        
                        {/* 💡 حقل الكلية (مطلوب - تم تعديل القيمة الافتراضية) */}
                        <FormField label="الكلية" isRequired={true}>
                            <select 
                                name="faculty_name" 
                                value={formData.faculty_name} 
                                onChange={handleFacultyChange} 
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={loadingFaculties}
                                required
                            >
                                <option value="">
                                    {loadingFaculties ? 'جاري تحميل الكليات...' : 'اختر الكلية'} {/* 💡 القيمة الفارغة تجعل الحقل مطلوباً */}
                                </option>
                                {facultyOptions.map((faculty) => (
                                    <option key={faculty.code} value={faculty.name}>
                                        {faculty.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        {/* حقل كود الكلية (ReadOnly) */}
                        <FormField label="كود الكلية">
                            <input 
                                name="faculty_code" 
                                value={formData.faculty_code} 
                                readOnly={true}
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 cursor-not-allowed" 
                            />
                        </FormField>
                        
                        {/* 💡 حقل القسم (مطلوب - تم تعديل القيمة الافتراضية) */}
                        <FormField label="القسم" isRequired={true}>
                            <select 
                                name="department_name" 
                                value={formData.department_name} 
                                onChange={handleDepartmentChange} 
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={loadingDepartments || !formData.faculty_code} 
                                required
                            >
                                <option value="">
                                    {loadingDepartments ? 'جاري تحميل الأقسام...' : 
                                    !formData.faculty_code ? 'اختر كلية أولاً' : 
                                    'اختر القسم'} {/* 💡 القيمة الفارغة تجعل الحقل مطلوباً */}
                                </option>
                                {filteredDepartmentOptions.map((department) => (
                                    <option key={department.dept_code} value={department.name}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        {/* حقل كود القسم (ReadOnly) */}
                        <FormField label="كود القسم">
                            <input 
                                name="department_code" 
                                value={formData.department_code} 
                                readOnly={true} 
                                className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 cursor-not-allowed" 
                            />
                        </FormField>


                        {/* حقول غير مطلوبة */}
                        <FormField label="كود التخصص">
                            <input name="specialization_code" value={formData.specialization_code} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                        </FormField>
                        <FormField label="التخصص">
                            <input name="specialization_name" value={formData.specialization_name} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                        </FormField>
                        <FormField label="موقع الكلية">
                            <input name="faculty_location" value={formData.faculty_location} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                        </FormField>
                        <FormField label="حالة العمل">
                            <input name="work_status" value={formData.work_status} onChange={handleChange} className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                        </FormField>
                    </CollapsibleSection>



                    <button type="submit" className="w-full p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 mt-6 font-semibold transition duration-200 shadow-md">
                        💾 حفظ بيانات عضو هيئة التدريس
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AssistantsPage;
