import { useEffect, useState } from "react";
import { getData, postData } from "../services/api";
import { useNavigate } from "react-router-dom";
import Select from "react-select"; 
const AssistantsPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    university_file_number: "",
    name: "",
    file_number: "",
    insurance_number: "",
    birth_date: "",
    national_id_number: "",
    gender: "",
    marital_status: "",
    hire_date: "",
    current_position: "",
    department_name: "",
    faculty_name: "",
    work_status: "",
    mobile: "",
    data_entry_user: "",
  });

  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    getData("structure/faculty")
      .then((res) => setColleges(res || []))
      .catch((err) => console.error("فشل تحميل الكليات:", err));
  }, []);

  useEffect(() => {
    if (formData.faculty_name) {
      postData("structure/department", { id: formData.faculty_name })
        .then((res) => setDepartments(res || []))
        .catch((err) => console.error("فشل تحميل الأقسام:", err));
    } else {
      setDepartments([]);
    }
  }, [formData.faculty_name]);

  const extractBirthDateFromNID = (nid) => {
    if (nid.length < 7) return null;
    const centuryDigit = nid[0];
    const year = nid.slice(1, 3);
    const month = nid.slice(3, 5);
    const day = nid.slice(5, 7);
    let fullYear = "";
    if (centuryDigit === "2") fullYear = "19" + year;
    else if (centuryDigit === "3") fullYear = "20" + year;
    else return null;
    return `${fullYear}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


     // 1. التحقق أن جميع الحقول ممتلئة
    const requiredFields = Object.entries(formData);
    for (const [key, value] of requiredFields) {
      if (!value.trim()) {
        setPopupMessage("⚠️ من فضلك املأ جميع الحقول .");
        setShowPopup(true);
        return;
      }
    }
    const isValidNationalId = formData.national_id_number.length === 14 && /^\d+$/.test(formData.national_id_number);
    const isValidMobile = /^01[0125]\d{8}$/.test(formData.mobile);
    const nidBirth = extractBirthDateFromNID(formData.national_id_number);

    if (nidBirth !== formData.birth_date) {
      setPopupMessage("⚠️ تاريخ الميلاد لا يطابق الرقم القومي.");
      setShowPopup(true);
      return;
    }
    if (!isValidNationalId) {
      setPopupMessage("❌ الرقم القومي يجب أن يكون مكونًا من 14 رقمًا.");
      setShowPopup(true);
      return;
    }
    if (!isValidMobile) {
      setPopupMessage("❌ رقم الموبايل غير صحيح.");
      setShowPopup(true);
      return;
    }

    try {
      await postData("employee/add", formData);
      setPopupMessage("✅ تم تعيين المعيد بنجاح!");
      setShowPopup(true);
      setFormData({
        university_file_number: "",
        name: "",
        file_number: "",
        insurance_number: "",
        birth_date: "",
        national_id_number: "",
        gender: "",
        marital_status: "",
        hire_date: "",
        current_position: "",
        department_name: "",
        faculty_name: "",
        work_status: "",
        mobile: "",
        data_entry_user: "",
      });
    } catch (error) {
      console.error("خطأ أثناء إرسال البيانات:", error);
      setPopupMessage("❌ حدث خطأ أثناء التعيين.");
      setShowPopup(true);
    }
  };

  return (
    <div className="bg-[#fdfbff] bg-[url(/p-bg.png)]">
      <div className="max-w-3xl mx-auto bg-white shadow p-6 mt-8 rounded relative">
        <h2 className="text-2xl font-bold mb-6 text-center">نموذج تعيين معيدين</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="university_file_number" value={formData.university_file_number} onChange={handleChange} placeholder="الرقم الجامعي" className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none" />
          <input name="name" value={formData.name} onChange={handleChange} placeholder="الاسم" className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none" />
          <input name="file_number" value={formData.file_number} onChange={handleChange} placeholder="رقم الملف" className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none" />
          <input name="insurance_number" value={formData.insurance_number} onChange={handleChange} placeholder="رقم التأمين" className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none" />
          <input name="birth_date" value={formData.birth_date} onChange={handleChange} placeholder="تاريخ الميلاد (YYYY-MM-DD)" className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none" />
          <input name="national_id_number" value={formData.national_id_number} onChange={handleChange} placeholder="الرقم القومي" className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none">
            <option value="">اختر النوع</option>
            <option value="Male">ذكر</option>
            <option value="Female">أنثى</option>
          </select>
          <select name="marital_status" value={formData.marital_status} onChange={handleChange} className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none">
            <option value="">الحالة الاجتماعية</option>
            <option value="Single">أعزب</option>
            <option value="Married">متزوج</option>
            <option value="Widowed">أرمل</option>
            <option value="Married">مطلق</option>
          </select>
          <input name="hire_date" value={formData.hire_date} onChange={handleChange} placeholder="تاريخ التعيين (YYYY-MM-DD)" className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none" />
          <input name="current_position" value={formData.current_position} onChange={handleChange} placeholder="الوظيفة الحالية" className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none" />
          <select name="department_name" value={formData.department_name} onChange={handleChange} className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none">
            <option value="">اختر القسم</option>
            {departments.map((d) => (
              <option key={d.dept_code} value={d.name}>{d.name}</option>
            ))}
          </select>
          
           <Select dir="rtl"
            options={colleges.map((f) => ({ value: f.code, label: f.name }))}
            value={
              formData.faculty_name
                ? {
                    value: formData.faculty_name,
                    label: colleges.find((f) => f.code === formData.faculty_name)?.name,
                  }
                : null
            }
            onChange={(selectedOption) =>
              setFormData((prev) => ({
                ...prev,
                faculty_name: selectedOption ? selectedOption.value : "",
              }))
            }
            placeholder="اختر الكلية..."
            isClearable
            isSearchable
            className="col-span-1 text-right"
          />
          <select name="work_status" value={formData.work_status} onChange={handleChange} className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none">
            <option value="">حالة العمل</option>
            <option value="Active">نشط</option>
            <option value="On Leave">في إجازة</option>
            <option value="Retired">محال للمعاش</option>
          </select>
          <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="رقم الموبايل" className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none" />
          <input name="data_entry_user" value={formData.data_entry_user} onChange={handleChange} placeholder="اسم مستخدم الإدخال" className="p-2 border rounded text-right w-full focus:ring-2 focus:outline-none" />
          <div className="col-span-full text-center mt-4">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              حفظ البيانات
            </button>
          </div>
        </form>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
              <p className="text-lg font-semibold mb-4">{popupMessage}</p>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantsPage;
