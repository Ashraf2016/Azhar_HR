import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
// مكون بسيط لحقل الإدخال
const FormInput = ({ label, id, type = "text", placeholder, required = false }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      placeholder={placeholder}
      required={required}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
    />
  </div>
);

// المكون الرئيسي للصفحة
const SecondmentPage = () => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // يمكنك إضافة منطق إرسال البيانات (API call) هنا
    console.log("Form Data Submitted:", formData);
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert('تم إرسال طلب الانتداب بنجاح!');
      // يمكنك هنا إعادة تعيين النموذج (Reset Form)
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
        {/* زر العودة للخلف */}
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-500 absolute top-30 left-50 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
                >
                    ⬅️ عودة
         </button>
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-8">
        
        {/* --- العنوان الرئيسي والتصميم الأنيق --- */}
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-800 text-right">
            📋 طلب انتداب عضو هيئة تدريس
          </h1>
          <p className="mt-2 text-sm text-gray-500 text-right">
            يرجى ملء كافة الحقول المطلوبة بدقة لإتمام عملية الطلب.
          </p>
        </header>

        {/* --- النموذج الفعلي --- */}
        <form onSubmit={handleSubmit} onChange={handleChange} dir="rtl">
          
          {/* 1. بيانات الموظف الأساسية */}
          <section className="mb-8 p-6 bg-blue-50 rounded-lg border-r-4 border-blue-600 shadow-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              بيانات الموظف
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="الاسم الكامل" id="fullName" required placeholder="الاسم رباعي كما في الأوراق الرسمية" />
              <FormInput label="الرقم القومي" id="nationalID" required type="number" placeholder="14 رقم" />
              <FormInput label="الكلية/القسم الحالي" id="currentDept" required placeholder="مثال: كلية الهندسة - قسم العمارة" />
              <FormInput label="الدرجة العلمية" id="academicDegree" required placeholder="أستاذ، أستاذ مساعد، مدرس، إلخ" />
            </div>
          </section>

          {/* 2. بيانات جهة الانتداب */}
          <section className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              جهة الانتداب والمدة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="الجهة المنتدب إليها" id="secondmentInstitution" required placeholder="اسم الجامعة أو الهيئة المنتدب إليها" />
              <FormInput label="الكلية/القسم المنتدب إليه" id="secondmentDept" required placeholder="اسم القسم الجديد" />
              <FormInput label="تاريخ بدء الانتداب" id="startDate" required type="date" />
              <FormInput label="تاريخ انتهاء الانتداب" id="endDate" required type="date" />
            </div>
          </section>

          {/* 3. المرفقات (هذا سيكون حقل ملفات) */}
          <section className="mb-8 p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-600 shadow-md">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4">
              المرفقات الضرورية
            </h2>
            <FormInput 
              label="خطاب موافقة الجهة المنتدب إليها" 
              id="approvalLetter" 
              type="file" 
              required
            />
            <FormInput 
              label="صورة من السيرة الذاتية (CV)" 
              id="cvFile" 
              type="file" 
              required
            />
          </section>

          {/* زر الإرسال */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -mr-1 ml-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري الإرسال...
                </>
              ) : (
                'إرسال طلب الانتداب'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecondmentPage;