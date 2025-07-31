import { Search, User, Mail, Phone, MapPin, Calendar, ChevronRight , Settings } from "lucide-react";
import person from "../assets/person.png";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { pdf } from "@react-pdf/renderer";



import { useEffect, useState } from "react";
import { getData } from "../services/api";
import MyDocument from "../pdf/document";
import IaraatDocument from "../pdf/LoansDoc";
import PunishmentsDocument from "../pdf/PunishmentsDocument";
import EjazatDocument from "../pdf/EjazatDocument";


import Sidebar from "../components/Sidebar"
// Sidebar Component

const EmployeeProfilePage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  

  // علشان أنشئ ملفات pdf في بيان الحالة 
  const [isGenerating, setIsGenerating] = React.useState(false);
  // const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingIarat, setIsGeneratingIarat] = useState(false);
  const [isGeneratingEgaazat, setIsGeneratingEgaazat] = useState(false);
  const [isGeneratingGaza2at, setIsGeneratingGaza2at] = useState(false);

  //overlay
  const [showSidebar, setShowSidebar] = React.useState(false);



  const generatePDFWrapper = async (Component, pdfData, filename) => {
  try {
    const blob = await pdf(<Component pdfData={pdfData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("حدث خطأ أثناء توليد الملف.");
  }
};


  //ده خاص بالتدرج الوظيفى لعضو هيئة التدريس
  const generatePDF = async () => {
  setIsGenerating(true);

  try {
    const response = await fetch(`https://university.roboeye-tec.com/employee/status-statement/${employeeId}`);
    if (!response.ok) throw new Error("فشل في الاتصال بالخادم");

    const data = await response.json();
    console.log("التدرج الوظيفى", data);

    if (!data || data.length === 0) {
      alert("لا توجد بيانات");
      return;
    }

    const latestCareer = getLatestCareerEntry(data.careerProgression);
    const pdfData = {
      name: data.name || "غير محدد",
      fileNumber: data.fileNumber || employeeId || "غير محدد",
      nationalID: data.nationalID || "غير محدد",
      birthdate: data.birthdate ? formatDate(data.birthdate) : "غير محدد",
      address: data.address || "غير محدد",
      governorate: data.governorate || "غير محدد",
      currentPosition: {
        jobTitle: latestCareer?.jobTitle || "غير محدد",
        department: latestCareer?.department || "غير محدد",
        faculty: latestCareer?.faculty || "غير محدد",
        dateOfOccupation: latestCareer?.dateOfOccupation
          ? formatDate(latestCareer.dateOfOccupation)
          : "غير محدد",
        notes: latestCareer?.notes || "",
      },
      careerProgression:
        data.careerProgression?.map((career) => ({
          no: career.No,
          jobTitle: career.jobTitle,
          department: career.department,
          faculty: career.faculty,
          dateOfOccupation: formatDate(career.dateOfOccupation),
          dateOfStartJob: formatDate(career.dateOfStartJob),
          expirationDate: formatDate(career.expirationDateOfOccupation),
          notes: career.notes || "",
        })) || [],
      previousPosition: data.previousPosition
        ? {
            title: data.previousPosition.title,
            startingDate: formatDate(data.previousPosition.startingDate),
            endDate: formatDate(data.previousPosition.endDate),
            serviceType: data.previousPosition.serviceType,
          }
        : null,
      academicQualifications: data.academicQualifications || [],
      generatedDate: new Date().toLocaleDateString("ar-SA"),
      generatedTime: new Date().toLocaleTimeString("ar-SA"),
    };

    await generatePDFWrapper(
      MyDocument,
      pdfData,
      `${data.name || "employee"}-career-${new Date().toISOString().replace(/[:.]/g, "-")}.pdf`
    );

  } catch (error) {
    console.error("Error fetching or generating التدرج الوظيفى PDF:", error);
    alert("حدث خطأ في جلب التدرج الوظيفى أو إنشاء PDF.");
  } finally {
    setIsGenerating(false);
  }
};


//علشان اجيب ال current position
  const getLatestCareerEntry = (careerProgression) => {
    if (!careerProgression || careerProgression.length === 0) return null;
    const sortedEntries = [...careerProgression].sort(
      (a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation)
    );
    return sortedEntries[0];
  };

  
  //   if (!employee) {
  //     alert("لا توجد بيانات موظف متاحة لإنشاء PDF");
  //     return;
  //   }
    
  //   try {
  //     console.log("ee",employee)
  //     const pdfData = preparePDFData(employee);
  //     if (!pdfData) throw new Error("فشل في تحضير بيانات الموظف");
  //     const blob = await pdf(<MyDocument pdfData={pdfData} />).toBlob();
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     const fileName = `${employee.name || "employee"}-career-report-${
  //       new Date().toISOString().split("T")[0]
  //     }.pdf`;
  //     link.download = fileName;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //       setTimeout(() => {
  //         URL.revokeObjectURL(url);
  //       }, 1000); 

  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     alert("حدث خطأ في إنشاء ملف PDF. يرجى المحاولة مرة أخرى.");
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };



// //ده خاص بالإعارات الخاصة بعضو هيئة التدريس
const generateIaratPDF = async () => {
  setIsGeneratingIarat(true);

  try {
    const response = await fetch(`https://university.roboeye-tec.com/employee/deputation-statement/${employeeId}`);
    if (!response.ok) throw new Error("فشل في الاتصال بالخادم");

    const data = await response.json();
    console.log("الإعارات", employeeId);

    if (!data.deputationData || data.deputationData.length === 0) {
      alert("لا توجد إعارات متاحة.");
      return;
    }

    const pdfData = {
      name: data?.name || "غير محدد",
      fileNumber: data?.fileNumber || "غير محدد",
      birthdate: data?.birthdate || "غير محدد",
      secondments: data.deputationData.map((item, index) => ({
        no: index + 1,
        deputationDate: formatDate(item.deputationDate),
        deputationEndDate: formatDate(item.deputationEndDate),
        deputationStartDate: formatDate(item.deputationStartDate),
        deputationType: item.deputationType,
        deputedCountry: item.deputedCountry,
        universityName: item.universityName,
        renewalYear: item.renewalYear,
        notes: item.notes || "",
      })),
      currentPosition: data?.currentPosition || "غير محدد",
      hireDate: formatDate(data?.hireDate) || "غير محدد",
      generatedDate: new Date().toLocaleDateString("ar-SA"),
    };

    await generatePDFWrapper(
      IaraatDocument,
      pdfData,
      `${data.name || "employee"}-iaraat-${new Date().toISOString().replace(/[:.]/g, "-")}.pdf`
    );
    
  } catch (error) {
    console.error("Error fetching or generating Iarat PDF:", error);
    alert("حدث خطأ في جلب الإعارات أو إنشاء PDF.");
  } finally {
    setIsGeneratingIarat(false);
  }
};


// خاص بالجزائات بتاعت الموظف
const generatePunPDF = async () => {
  setIsGeneratingGaza2at(true);

  try {
    const response = await fetch(`https://university.roboeye-tec.com/employee/punishments/${employeeId}`);
    if (!response.ok) throw new Error("فشل في الاتصال بالخادم");

    const data = await response.json();
    console.log("الجزاءات:", employeeId);

    if (!data || data.length === 0) {
      alert("لا توجد جزاءات متاحة.");
      return;
    }

    const pdfData = {
      
      punishments: data.map((item, index) => ({
        no: index + 1,
        name: item?.applicant_name|| "غير محدد",
        execution_order: item.execution_order || "غير محدد",
        execution_order_date: formatDate(item.execution_order_date) || "غير محدد",
        execution_order_date: item.execution_order_date || "غير محدد",
        fileNumber: item?.file_number || "غير محدد",
        reasons : item?.reasons || "غير محدد",
        notes: item.notes || "",
      })),
      
      generatedDate: new Date().toLocaleDateString("ar-SA"),
    };
    await generatePDFWrapper(
      PunishmentsDocument,
      pdfData,
      `${data.name || "employee"}-punishments-${new Date().toISOString().replace(/[:.]/g, "-")}.pdf`
    );
//       const blob = await pdf(
//         <React.Suspense fallback={<div>جاري التحميل...</div>}>
//           <PunishmentsDocument pdfData={pdfData} />
//         </React.Suspense>
//       ).toBlob();

//     // const blob = await pdf(<PunishmentsDocument pdfData={pdfData} />).toBlob();
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     const now = new Date().toISOString().replace(/[:.]/g, "-");  // آمن لاسم الملف

//     link.download = `${data.name || "employee"}-punishments-${now}.pdf`;

//     // link.download = `${data.name || "employee"}-punishments-${new Date().toISOString().split("T")[0]}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// setTimeout(() => {
//   URL.revokeObjectURL(url);
// }, 1000); // أعطي مهلة بسيطة


  } catch (error) {
    console.error("Error fetching or generating Punishments PDF:", error);
    alert("حدث خطأ في جلب الجزاءات أو إنشاء PDF.");
  } finally {
    setIsGeneratingGaza2at(false);
  }
};


// خاص باجازات الموظف
const generateEgazatPDF = async () => {
  setIsGeneratingEgaazat(true);

  try {
    const response = await fetch(`https://university.roboeye-tec.com/employee/holidays/${employeeId}`);
    if (!response.ok) throw new Error("فشل في الاتصال بالخادم");

    const data = await response.json();
    console.log("الاجازات", employeeId);

    if (!data || data.length === 0) {
      alert("لا توجد اجازات متاحة.");
      return;
    }

    const pdfData = {
      name: data?.name|| "غير محدد",
      Egazat: data.holidays.map((item, index) => ({
        no: index + 1,
        grant_type: item.grant_type || "غير محدد",
        leave_type: item.leave_type || "غير محدد",
        from_date: formatDate(item.from_date) || "غير محدد",
        to_date: formatDate(item.to_date) || "غير محدد",
        execution_order_date : formatDate(item.execution_order_date)||"غير محدد",
        fileNumber: item?.university_file_number || "غير محدد",
        execution_order_number : item?.execution_order_number || "غير محدد",
        duration_days : item.duration_days || "غير محدد",
        travel_status : item.travel_status || "غير محدد",
        notes: item.notes || "",
      })),
      
      generatedDate: new Date().toLocaleDateString("ar-SA"),
    };

    await generatePDFWrapper(
      EjazatDocument,
      pdfData,
      `${data.name || "employee"}-Ejazat-${new Date().toISOString().replace(/[:.]/g, "-")}.pdf`
    );
    // const blob = await pdf(
    //   <React.Suspense fallback={<div>جاري التحميل...</div>}>
    //     <EjazatDocument pdfData={pdfData} />
    //   </React.Suspense>
    // ).toBlob();

    // // const blob = await pdf(<EjazatDocument pdfData={pdfData} />).toBlob();
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.href = url;
    // // link.download = `${data.name || "employee"}-Egazat-${new Date().toISOString().split("T")[0]}.pdf`;
    // const now = new Date().toISOString().replace(/[:.]/g, "-");  

    // link.download = `${data.name || "employee"}-Egazat-${now}.pdf`;

    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // setTimeout(() => {
    //   URL.revokeObjectURL(url);
    // }, 1000); // أعطي مهلة بسيطة


  } catch (error) {
    console.error("Error fetching or generating Ejazat PDF:", error);
    alert("حدث خطأ في جلب الاجازات أو إنشاء PDF.");
  } finally {
    setIsGeneratingEgaazat(false);
  }
};




  useEffect(() => {
    setLoading(true);
    getData(`employee/status-statement/${employeeId}`)
      .then((data) => {
        console.log(data);
        setEmployee(data);
      })
      .catch((error) => {
        console.error("Error fetching employee:", error);
        setEmployee(null);
      })
      .finally(() => setLoading(false));
  }, [employeeId]);


  

  const formatDate = (dateString) => {
    if (!dateString || dateString === "1899-11-30T00:00:00.000Z") {
      return "غير محدد";
    }
    try {
      return new Date(dateString).toLocaleDateString("en-US");
    } catch {
      return "غير محدد";
    }
  };

  if (loading) return <div className="text-center py-12">جاري التحميل...</div>;
  if (!employee) return <div className="text-center py-12">لم يتم العثور على الموظف</div>;

  const latestCareer = getLatestCareerEntry(employee.careerProgression);

  return (
    
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar */}
      <div className="hidden lg:block">
        {/* <Sidebar onGeneratePDF={generatePDF} isGenerating={isGenerating} /> */}
        <Sidebar
          onGeneratePDF={generatePDF}
          isGenerating={isGenerating}
          onGenerateIarat={generateIaratPDF}
          isGeneratingIarat={isGeneratingIarat}
          onGenerateGazaat={generatePunPDF}
          isGeneratingGaza2at={isGeneratingGaza2at}
          onGenerateEgaazat={generateEgazatPDF}
          isGeneratingEgaazat={isGeneratingEgaazat}
        />

         

      </div>

      {/* sidebar in small screens */}
      <button
      className="lg:hidden p-2 text-gray-600  text-right"
      onClick={() => setShowSidebar(true)}
    >
      <Settings className="w-6 h-6 cursor-pointer" />
    </button>

    {/* الـ Sidebar */}
      {showSidebar && (
        <div className="fixed top-[64px] inset-x-0 bg-black-200 bg-opacity-50 z-40 lg:hidden"> 
        {/* top-[64px] = ارتفاع الـ nav */}
        <div className="w-64 bg-white h-[calc(100%-64px)] p-4">
          <button onClick={() => setShowSidebar(false)} className="cursor-pointer">✕</button>
          {/* <Sidebar onGeneratePDF={generatePDF} isGenerating={isGenerating} /> */}
          <Sidebar
            onGeneratePDF={generatePDF}
            isGenerating={isGenerating}
            onGenerateIarat={generateIaratPDF}
            isGeneratingIarat={isGeneratingIarat}
            onGenerateGazaat={generatePunPDF}
            isGeneratingGaza2at={isGeneratingGaza2at}
            onGenerateEgaazat={generateEgazatPDF}
            isGeneratingEgaazat={isGeneratingEgaazat}
          />


        </div>
      </div>

      )}



        {/* Main Content */}
        <div className="lg:col-span-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ChevronRight size={20} className="ml-1" />
            العودة إلى قائمة الموظفين
          </button>

          {/* profile header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
              <div className="flex items-center">
                <img
                  src={person}
                  alt={employee.name || "موظف"}
                  className="bg-white w-24 h-24 rounded-full object-cover border-4 border-gray-300 shadow-lg"
                />
                <div className="mr-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">{employee.name || "غير محدد"}</h1>
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
          {/* contact info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">المعلومات الشخصية</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <p className="text-sm text-gray-500">الاسم</p>
                  <p className="text-gray-900">{employee.name || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                  <p className="text-gray-900">{formatDate(employee.birthdate)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <p className="text-sm text-gray-500">رقم الملف</p>
                  <p className="text-gray-900">{employee.fileNumber || employeeId || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <p className="text-sm text-gray-500">العنوان</p>
                  <p className="text-gray-900">{employee.address || "غير محدد"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* job details */}
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
        {/* بيان الحاله */}
        {/* <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">بيان الحالة</h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              الاعارات
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              الاجازات
            </button>
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? : "التدرج الوظيفي"}
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              الجزاءات
            </button>
          </div>
        </div> */}
        {/* القرارات */}
        {/* <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">القرارات</h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              ترقيه
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              انهاء خدمه
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors">
              فصل
            </button>
          </div>
        </div> */}
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
                    .sort((a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation))
                    .map((career, index) => (
                      <tr key={career.No || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {career.No}
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
        {/* Previous Position */}
        {employee.previousPosition && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">المنصب السابق</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">المنصب</p>
                <p className="text-gray-900">{employee.previousPosition.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاريخ البداية</p>
                <p className="text-gray-900">
                  {formatDate(employee.previousPosition.startingDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاريخ النهاية</p>
                <p className="text-gray-900">{formatDate(employee.previousPosition.endDate)}</p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
