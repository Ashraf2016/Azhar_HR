// import {User, MapPin, Calendar, ChevronRight , Settings } from "lucide-react";
// import person from "../assets/person.png";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import React, { useEffect, useState } from "react";

// import axios from "axios";

// // الملف الخاص بالتدرج الوظيفى
// import { generateCareerPDF } from "../components/useGenerateCareer";
// // الملف الخاص بالاجازات
// import { generateEgazatPDF } from "../components/useGenerateEgazat";
// // الملف الخاص بالجزاءات
// import { generateGazaatPDF } from "../components/useGenerateGazaat";
// // الملف الخاص بالاعارات
// import { generateIaratPDF } from "../components/useGenerateIaratPDF";
// // الملف الخاص بالاعارات
// import { generateStatePDF } from "../components/useGenerateState";

// import { getData } from "../services/api";

// import Sidebar from "../components/Sidebar"


// const EmployeeProfilePage = () => {
//   const { employeeId } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   
//   // 💡 حالات التحميل
//   const [isGeneratingCareer, setIsGeneratingCareer] = useState(false); // تم تغيير اسمه من isGenerating
//   const [isGeneratingIarat, setIsGeneratingIarat] = useState(false);
//   const [isGeneratingEgaazat, setIsGeneratingEgaazat] = useState(false);
//   const [isGeneratingGazaat, setIsGeneratingGazaat] = useState(false);
//   const [isGeneratingState, setIsGeneratingState] = useState(false);

//   //overlay
//   const [showSidebar, setShowSidebar] = React.useState(false);

//  // 💡 حالة popup
//   const [popupMessage, setPopupMessage] = useState(null);
// // رسالة هل انت متأكد من حذف المنصب
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedJobId, setSelectedJobId] = useState(null);

//    // فتح المودال عند الضغط على "حذف"
//   const confirmDelete = (jobId) => {
//     setSelectedJobId(jobId);
//     setShowDeleteModal(true);
//   };

//   const showPopup = (message, type = "success") => {
//     setPopupMessage({ message, type });
//     setTimeout(() => setPopupMessage(null), 3000); // يختفي بعد ٣ ثواني
//   };


// //... (باقي الدوال المساعدة مثل getLatestCareerEntry و handleDelete) ...
//   const getLatestCareerEntry = (careerProgression) => {
//     if (!careerProgression || careerProgression.length === 0) return null;
//     const sortedEntries = [...careerProgression].sort(
//       (a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation)
//     );
//     return sortedEntries[0];
//   };

// const handleDelete = async () => {
//   if (!selectedJobId) return;

//   try {
//     await axios.delete(
//       `https://university.roboeye-tec.com/employee/job/${selectedJobId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );

//     // تحديث البيانات بعد الحذف
//     setEmployee((prev) => ({
//       ...prev,
//       careerProgression: prev.careerProgression.filter(
//         (c) => c.jobId !== selectedJobId
//       ),
//     }));

//     showPopup("تم حذف المنصب بنجاح ✅", "success");
//   } catch (error) {
//     console.error("حدث خطأ أثناء الحذف:", error);
//     showPopup("حدث خطأ أثناء الحذف ❌", "error");
//   } finally {
//     setShowDeleteModal(false);
//     setSelectedJobId(null);
//   }
// };



// // 💡 دوال توليد PDF (تأكد أنك تستخدم try...finally)
//   const handleGenerateCareer = async () => {
//     setIsGeneratingCareer(true);
//     try {
//       await generateCareerPDF(employeeId);
//     } catch (error) {
//       console.error("Career PDF Error:", error);
//       alert("حدث خطأ أثناء توليد ملف التدرج الوظيفي.");
//     } finally {
//       setIsGeneratingCareer(false);
//     }
//   };

//   const handleGenerateIarat = async () => {
//     setIsGeneratingIarat(true);
//     try {
//       await generateIaratPDF(employeeId);
//     } catch (error) {
//       console.error("Iarat PDF Error:", error);
//       alert("حدث خطأ أثناء توليد ملف الإعارات.");
//     } finally {
//       setIsGeneratingIarat(false);
//     }
//   };

//   const handleGenerateEgaazat = async () => {
//     setIsGeneratingEgaazat(true);
//     try {
//       await generateEgazatPDF(employeeId);
//     } catch (error) {
//       console.error("Egaazat PDF Error:", error);
//       alert("حدث خطأ أثناء توليد ملف الإجازات.");
//     } finally {
//       setIsGeneratingEgaazat(false);
//     }
//   };
//   const handleGenerateState = async () => {
//     setIsGeneratingState(true);
//     try {
//       await generateStatePDF(employeeId);
//     } catch (error) {
//       console.error("State PDF Error:", error);
//       alert("حدث خطأ أثناء توليد ملف بيان الحالة.");
//     } finally {
//       setIsGeneratingState(false);
//     }
//   };

//   const handleGenerateGazaat = async () => {
//     setIsGeneratingGazaat(true);
//     try {
//       await generateGazaatPDF(employeeId);
//     } catch (error) {
//       console.error("Gazaat PDF Error:", error);
//       alert("حدث خطأ أثناء توليد ملف الجزاءات.");
//     } finally {
//       setIsGeneratingGazaat(false);
//     }
//   };
// // ... (بقية الكومبوننت) ...
//   useEffect(() => {
//     setLoading(true);
//     getData(`employee/statement/${employeeId}`)
//       .then((data) => {
//         console.log("البيانات",data);
//         localStorage.setItem("data",JSON.stringify(data))
//         setEmployee(data);
//       })
//       .catch((error) => {
//         console.error("Error fetching employee:", error);
//         setEmployee(null);
//       })
//       .finally(() => setLoading(false));
//   }, [employeeId]);


//   

//   const formatDate = (dateString) => {
//     if (!dateString || dateString === "1899-11-30T00:00:00.000Z") {
//       return "غير محدد";
//     }
//     try {
//       return new Date(dateString).toLocaleDateString("en-GB");
//     } catch {
//       return "غير محدد";
//     }
//   };



//   if (loading) return <div className="text-center py-12">جاري التحميل...</div>;
//   if (!employee) return <div className="text-center py-12">لم يتم العثور على الموظف</div>;

//   const latestCareer = getLatestCareerEntry(employee.careerProgression);

//   return (
//     
//     <div className="min-h-screen bg-gray-50" dir="rtl">
//         {/* ✅ Popup */}
//         {popupMessage && (
//             <div
//             className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg z-50 transition-opacity
//             ${popupMessage.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
//             >
//             {popupMessage.message}
//             </div>
//         )}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Sidebar */}
//       <div className="hidden lg:block">
//         <Sidebar
//           employeeId={employeeId}
//           employeeName={employee.employeeInfo?.name || "غير محدد"}
//           currentRank={latestCareer?.jobTitle || "غير محدد"}

//           onGenerateIarat={handleGenerateIarat}
//           isGeneratingIarat={isGeneratingIarat}

//           onGenerateEgaazat={handleGenerateEgaazat}
//           isGeneratingEgaazat={isGeneratingEgaazat}

//           onGenerateGazaat={handleGenerateGazaat}
//           isGeneratingGazaat={isGeneratingGazaat}

//           onGeneratePDF={handleGenerateCareer}
//           isGenerating={isGeneratingCareer} // 💡 تم التغيير إلى isGeneratingCareer

//           onGenerateState={handleGenerateState}
//           isGeneratingState={isGeneratingState}
//         />


//          

//       </div>

//       {/* sidebar in small screens */}
//       <button
//       className="lg:hidden p-2 text-gray-600  text-right"
//       onClick={() => setShowSidebar(true)}
//     >
//       <Settings className="w-6 h-6 cursor-pointer" />
//     </button>

//     {/* الـ Sidebar */}
//       {showSidebar && (
//         <div className="fixed top-[64px] inset-x-0 bg-black-200 bg-opacity-50 z-40 lg:hidden"> 
//         <div className="w-64 bg-white h-[calc(100%-64px)] p-4">
//           <button onClick={() => setShowSidebar(false)} className="cursor-pointer">✕</button>
//           <Sidebar
//             employeeId={employeeId}
//             employeeName={employee.employeeInfo?.name || "غير محدد"}
//             currentRank={latestCareer?.jobTitle || "غير محدد"}

//             onGenerateIarat={handleGenerateIarat}
//             isGeneratingIarat={isGeneratingIarat}

//             onGenerateEgaazat={handleGenerateEgaazat}
//             isGeneratingEgaazat={isGeneratingEgaazat}

//             onGenerateGazaat={handleGenerateGazaat}
//             isGeneratingGazaat={isGeneratingGazaat}

//             onGeneratePDF={handleGenerateCareer}
//             isGenerating={isGeneratingCareer} // 💡 تم التغيير إلى isGeneratingCareer

//             onGenerateState={handleGenerateState}
//             isGeneratingState={isGeneratingState}
//           />


//         </div>
//       </div>

//       )}



//         {/* Main Content */}
//         <div className="lg:col-span-3">
//           <button
//             onClick={() => navigate(`/`)}
//             className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
//           >
//             <ChevronRight size={20} className="ml-1" />
//             العودة إلى قائمة الموظفين
//           </button>

//           {/* profile header */}
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
//               <div className="flex items-center">
//                 <img
//                   src={person}
//                   alt={employee.name || "موظف"}
//                   className="bg-white w-24 h-24 rounded-full object-cover border-4 border-gray-300 shadow-lg"
//                 />
//                 <div className="mr-6 text-white">
//                   <h1 className="text-3xl font-bold mb-2">{employee.employeeInfo.name || "غير محدد"}</h1>
//                   <p className="text-blue-100 text-lg">
//                     <span className="text-blue-200">المنصب: </span>
//                     {latestCareer?.jobTitle || "غير محدد"}
//                   </p>
//                   <p className="text-blue-200">
//                     <span className="text-blue-300">الكلية: </span>
//                     {latestCareer?.faculty || "غير محدد"}
//                   </p>
//                   <p className="text-blue-200">
//                     <span className="text-blue-300">القسم: </span>
//                     {latestCareer?.department || "غير محدد"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* contact info */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">المعلومات الشخصية</h2>
//             <div className="space-y-4">
//               <div className="flex items-center">
//                 <User className="h-5 w-5 text-gray-400 ml-3" />
//                 <div>
//                   <p className="text-sm text-gray-500">الاسم</p>
//                   <p className="text-gray-900">{employee.employeeInfo.name || "غير محدد"}</p>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <Calendar className="h-5 w-5 text-gray-400 ml-3" />
//                 <div>
//                   <p className="text-sm text-gray-500">تاريخ الميلاد</p>
//                   <p className="text-gray-900">{formatDate(employee.employeeInfo.birthdate)}</p>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <User className="h-5 w-5 text-gray-400 ml-3" />
//                 <div>
//                   <p className="text-sm text-gray-500">رقم الملف</p>
//                   <p className="text-gray-900">{employee.employeeInfo.fileNumber || employeeId || "غير محدد"}</p>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <MapPin className="h-5 w-5 text-gray-400 ml-3" />
//                 <div>
//                   <p className="text-sm text-gray-500">العنوان</p>
//                   <p className="text-gray-900">{employee.employeeInfo.address || "غير محدد"}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* job details */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">المنصب الحالي</h2>
//             <div className="space-y-4">
//               <div className="flex items-center">
//                 <User className="h-5 w-5 text-gray-400 ml-3" />
//                 <div>
//                   <p className="text-sm text-gray-500">المنصب</p>
//                   <p className="text-gray-900">{latestCareer?.jobTitle || "غير محدد"}</p>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <MapPin className="h-5 w-5 text-gray-400 ml-3" />
//                 <div>
//                   <p className="text-sm text-gray-500">القسم</p>
//                   <p className="text-gray-900">{latestCareer?.department || "غير محدد"}</p>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <Calendar className="h-5 w-5 text-gray-400 ml-3" />
//                 <div>
//                   <p className="text-sm text-gray-500">تاريخ التعيين</p>
//                   <p className="text-gray-900">{formatDate(latestCareer?.dateOfOccupation)}</p>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <User className="h-5 w-5 text-gray-400 ml-3" />
//                 <div>
//                   <p className="text-sm text-gray-500">الكلية</p>
//                   <p className="text-gray-900">{latestCareer?.faculty || "غير محدد"}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//     
//         {/* Career Progression */}
//     {employee.careerProgression && employee.careerProgression.length > 0 && (
//       <div className="mt-8 bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">التدرج الوظيفي</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   رقم
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   المنصب
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   القسم
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   تاريخ التعيين
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   ملاحظات
//                 </th>
// {/*                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   الإجراءات
//                 </th> */}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//                 {[...employee.careerProgression]
//                   // ✅ أولاً: فلترة البيانات
//                   .filter(
//                     (career) =>
//                       career.JobStatus?.toLowerCase() === "active" ||
//                       career.JobStatus?.toLowerCase() === "historical"
//                   )
//                   // ✅ ثانيًا: الترتيب حسب التاريخ (الأحدث أولاً)
//                   .sort((a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation))
//                   // ✅ ثالثًا: عرض النتائج بترقيم تسلسلي
//                   .map((career, index) => (
//                     <tr key={career.No || index}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
//                         {index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {career.jobTitle}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {career.department}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {formatDate(career.dateOfOccupation)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {career.notes || "-"}
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>

//           </table>
//         </div>
//       </div>
//     )}

//         {/* Previous Position */}
//         {employee.previousPosition && (
//           <div className="mt-8 bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">المنصب السابق</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">المنصب</p>
//                 <p className="text-gray-900">{employee.previousPosition.title}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">تاريخ البداية</p>
//                 <p className="text-gray-900">
//                   {formatDate(employee.previousPosition.startingDate)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">تاريخ النهاية</p>
//                 <p className="text-gray-900">{formatDate(employee.previousPosition.endDate)}</p>
//               </div>
//             </div>
//           </div>
//         )}
//         </div>
//       </div>
//     {/* ✅ Modal تأكيد الحذف */}
// {showDeleteModal && (
//   <div className="fixed inset-0 bg-black/50 bg-opacity flex items-center justify-center z-50">
//     <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
//       <h2 className="text-lg font-semibold mb-4">تأكيد الحذف</h2>
//       <p className="mb-6 text-gray-600">هل أنت متأكد من حذف هذا المنصب؟</p>
//       <div className="flex justify-center gap-4">
//         <button
//           onClick={handleDelete}
//           className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//         >
//           نعم، حذف
//         </button>
//         <button
//           onClick={() => setShowDeleteModal(false)}
//           className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
//         >
//           إلغاء
//         </button>
//       </div>
//     </div>
//   </div>
// )}

       
//     </div>
//   );
// };

// export default EmployeeProfilePage;


import { Search, User, Mail, Phone, MapPin, Calendar, ChevronRight , Settings } from "lucide-react";
import person from "../assets/person.png";
import { useParams, useNavigate } from "react-router-dom";
import React, { act, useEffect, useState } from "react";


// الملفات الخاصة بتوليد PDF
import { generateCareerPDF } from "../components/useGenerateCareer";
import { generateEgazatPDF } from "../components/useGenerateEgazat";
import { generateGazaatPDF } from "../components/useGenerateGazaat";
import { generateIaratPDF } from "../components/useGenerateIaratPDF";
import { generateStatePDF } from "../components/useGenerateState";

// import { getData } from "../services/api";
import axiosInstance from "@/axiosInstance";
import Sidebar from "../components/Sidebar";

const EmployeeProfilePage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // حالات توليد PDF
  const [isGeneratingCareer, setIsGeneratingCareer] = useState(false);
  const [isGeneratingIarat, setIsGeneratingIarat] = useState(false);
  const [isGeneratingEgaazat, setIsGeneratingEgaazat] = useState(false);
  const [isGeneratingGazaat, setIsGeneratingGazaat] = useState(false);
  const [isGeneratingState, setIsGeneratingState] = useState(false);

  // overlay
  const [showSidebar, setShowSidebar] = useState(false);

  // Popup
  const [popupMessage, setPopupMessage] = useState(null);

  // Modal حذف
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);


  const confirmDelete = (jobId) => {
    setSelectedJobId(jobId);
    setShowDeleteModal(true);
  };

  const showPopup = (message, type = "success") => {
    setPopupMessage({ message, type });
    setTimeout(() => setPopupMessage(null), 3000);
  };

  // const getLatestCareerEntry = (careerProgression) => {
  //   if (!careerProgression || careerProgression.length === 0) return null;
  //   const sortedEntries = [...careerProgression].sort(
  //     (a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation)
  //   );
  //   return sortedEntries[0];
  // };
  const getLatestCareerEntry = (careerProgression) => {
  if (!careerProgression || careerProgression.length === 0) return null;

  // فلترة الوظائف الـ Active فقط
  const activeJobs = careerProgression.filter(
    (job) => job.JobStatus?.toLowerCase() === "active"
  );

  if (activeJobs.length === 0) return null;

  // ترتيب الوظائف الـ Active حسب التاريخ
  const sortedEntries = [...activeJobs].sort(
    (a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation)
  );

  return sortedEntries[0];
};


  const handleDelete = async () => {
    if (!selectedJobId) return;

    try {
      await axiosInstance.delete(
        `/employee/job/${selectedJobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setEmployee((prev) => ({
        ...prev,
        careerProgression: prev.careerProgression.filter(
          (c) => c.jobId !== selectedJobId
        ),
      }));

      showPopup("تم حذف المنصب بنجاح ✅", "success");
    } catch (error) {
      console.error("حدث خطأ أثناء الحذف:", error);
      showPopup("حدث خطأ أثناء الحذف ❌", "error");
    } finally {
      setShowDeleteModal(false);
      setSelectedJobId(null);
    }
  };

  // دوال توليد PDF
  const handleGenerateCareer = async () => {
    setIsGeneratingCareer(true);
    try {
      await generateCareerPDF(employeeId);
    } catch (error) {
      console.error("Career PDF Error:", error);
      alert("حدث خطأ أثناء توليد ملف التدرج الوظيفي.");
    } finally {
      setIsGeneratingCareer(false);
    }
  };

  const handleGenerateIarat = async () => {
    setIsGeneratingIarat(true);
    try {
      await generateIaratPDF(employeeId);
    } catch (error) {
      console.error("Iarat PDF Error:", error);
      alert("حدث خطأ أثناء توليد ملف الإعارات.");
    } finally {
      setIsGeneratingIarat(false);
    }
  };

  const handleGenerateEgaazat = async () => {
    setIsGeneratingEgaazat(true);
    try {
      await generateEgazatPDF(employeeId);
    } catch (error) {
      console.error("Egaazat PDF Error:", error);
      alert("حدث خطأ أثناء توليد ملف الإجازات.");
    } finally {
      setIsGeneratingEgaazat(false);
    }
  };

  const handleGenerateState = async () => {
    setIsGeneratingState(true);
    try {
      await generateStatePDF(employeeId);
    } catch (error) {
      console.error("State PDF Error:", error);
      alert("حدث خطأ أثناء توليد ملف بيان الحالة.");
    } finally {
      setIsGeneratingState(false);
    }
  };

  const handleGenerateGazaat = async () => {
    setIsGeneratingGazaat(true);
    try {
      await generateGazaatPDF(employeeId);
    } catch (error) {
      console.error("Gazaat PDF Error:", error);
      alert("حدث خطأ أثناء توليد ملف الجزاءات.");
    } finally {
      setIsGeneratingGazaat(false);
    }
  };

  // جلب البيانات
  useEffect(() => {
    setLoading(true);

    axiosInstance.get(`employee/statement/${employeeId}`)
      .then((response) => {
        const data = response.data;
        console.log("بيانات الإجراءات اليومية:", data.careerProgression);
        setEmployee({
          ...data,
          dailyActions: data.careerProgression || [],
        });
      })

      .catch((error) => {
        console.error("Error fetching employee daily actions:", error);
        setEmployee(null);
      })
      .finally(() => setLoading(false));
  }, [employeeId]);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "1899-11-30T00:00:00.000Z") {
      return "غير محدد";
    }
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch {
      return "غير محدد";
    }
  };

  if (loading) return <div className="text-center py-12">جاري التحميل...</div>;
  if (!employee) return <div className="text-center py-12">لم يتم العثور على الموظف</div>;

  const latestCareer = getLatestCareerEntry(employee.careerProgression);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Popup */}
      {popupMessage && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg z-50 transition-opacity
          ${popupMessage.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          {popupMessage.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            employeeId={employeeId}
            employeeName={employee.employeeInfo?.name || "غير محدد"}
            currentRank={latestCareer?.jobTitle || "غير محدد"}
            onGenerateIarat={handleGenerateIarat}
            isGeneratingIarat={isGeneratingIarat}
            onGenerateEgaazat={handleGenerateEgaazat}
            isGeneratingEgaazat={isGeneratingEgaazat}
            onGenerateGazaat={handleGenerateGazaat}
            isGeneratingGazaat={isGeneratingGazaat}
            onGeneratePDF={handleGenerateCareer}
            isGenerating={isGeneratingCareer}
            onGenerateState={handleGenerateState}
            isGeneratingState={isGeneratingState}
          />
        </div>

        {/* Sidebar small screens */}
        <button
          className="lg:hidden p-2 text-gray-600 text-right"
          onClick={() => setShowSidebar(true)}
        >
          <Settings className="w-6 h-6 cursor-pointer" />
        </button>

        {showSidebar && (
          <div className="fixed top-[64px] inset-x-0 bg-black-200 bg-opacity-50 z-40 lg:hidden">
            <div className="w-64 bg-white h-[calc(100%-64px)] p-4">
              <button onClick={() => setShowSidebar(false)} className="cursor-pointer">✕</button>
              <Sidebar
                employeeId={employeeId}
                employeeName={employee.employeeInfo?.name || "غير محدد"}
                currentRank={latestCareer?.jobTitle || "غير محدد"}
                onGenerateIarat={handleGenerateIarat}
                isGeneratingIarat={isGeneratingIarat}
                onGenerateEgaazat={handleGenerateEgaazat}
                isGeneratingEgaazat={isGeneratingEgaazat}
                onGenerateGazaat={handleGenerateGazaat}
                isGeneratingGazaat={isGeneratingGazaat}
                onGeneratePDF={handleGenerateCareer}
                isGenerating={isGeneratingCareer}
                onGenerateState={handleGenerateState}
                isGeneratingState={isGeneratingState}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="lg:col-span-3">
          <button
            onClick={() => navigate(`/`)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ChevronRight size={20} className="ml-1" />
            العودة إلى قائمة الموظفين
          </button>

          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
              <div className="flex items-center">
                <img
                  src={person}
                  alt={employee.name || "موظف"}
                  className="bg-white w-24 h-24 rounded-full object-cover border-4 border-gray-300 shadow-lg"
                />
                <div className="mr-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">{employee.employeeInfo.name || "غير محدد"}</h1>
                  <p className="text-blue-100 text-lg">
                    <span className="text-blue-200">المنصب: </span>
                    {latestCareer?.jobTitle || "غير محدد"}
                  </p>
                  <p className="text-blue-200">
                    <span className="text-blue-300">الكلية: </span>
                    {latestCareer?.faculty || "غير محدد"}
                  </p>
                  <p className="text-blue-200">
                    <span className="text-blue-300">القسم: </span>
                    {latestCareer?.department || "غير محدد"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">المعلومات الشخصية</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">الاسم</p>
                    <p className="text-gray-900">{employee.employeeInfo.name || "غير محدد"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                    <p className="text-gray-900">{formatDate(employee.employeeInfo.birthdate)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">رقم الملف</p>
                    <p className="text-gray-900">{employee.employeeInfo.fileNumber || employeeId || "غير محدد"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">العنوان</p>
                    <p className="text-gray-900">{employee.employeeInfo.address || "غير محدد"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">المنصب الحالي</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">المنصب</p>
                    <p className="text-gray-900">{latestCareer?.jobTitle || "غير محدد"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">القسم</p>
                    <p className="text-gray-900">{latestCareer?.department || "غير محدد"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">تاريخ التعيين</p>
                    <p className="text-gray-900">{formatDate(latestCareer?.dateOfOccupation)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">الكلية</p>
                    <p className="text-gray-900">{latestCareer?.faculty || "غير محدد"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Career Progression */}
          {employee.careerProgression && employee.careerProgression.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">التدرج الوظيفي</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        رقم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المنصب
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        القسم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ التعيين
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ملاحظات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...employee.careerProgression]
                      .filter(
                        (career) =>
                          career.JobStatus?.toLowerCase() === "active" ||
                          career.JobStatus?.toLowerCase() === "historical"
                      )
                      .sort((a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation))
                      .map((career, index) => (
                        <tr key={career.No || index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {career.jobTitle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {career.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(career.dateOfOccupation)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {career.notes || "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Daily Actions */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">الإجراءات اليومية</h2>
            {employee.dailyActions && employee.dailyActions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        رقم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المنصب
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        القسم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ التعيين
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        حالة الطلب
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ملاحظات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...employee.dailyActions]
                      .filter((action) => action.JobStatus?.toLowerCase() === "pending")
                      .sort(
                        (a, b) =>
                          new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation)
                      )
                      .map((action, index) => (
                        <tr key={action.jobId || index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {action.jobTitle || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {action.department || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(action.dateOfOccupation)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            قيد التنفيذ
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {action.notes || "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">لا توجد إجراءات يومية حالياً</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
