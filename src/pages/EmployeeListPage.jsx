// import EmployeeCard from "../components/EmployeeCard";
// import logo from "../assets/logo.png";
// import { getData, postData } from "../services/api";
// import { useNavigate } from "react-router-dom";
// import LoginPage from "../components/LoginPage";

// import { useState, useEffect } from "react";
// import {
//   Search,
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   ChevronLeft,
//   ChevronDown,
//   Filter,
//   Eye,
//   EyeOff,
//   X,
// } from "lucide-react";
// import FiltrationData from "../components/FiltrationData";
// import { useIsLoggedIn } from "../contexts/isLoggedinContext";

// const EmployeeListPage = () => {
//   const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn(false);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchEmployeeId, setSearchEmployeeId] = useState("");
//   const [selectedCollege, setSelectedCollege] = useState("1114");
//   const [selectedDepartment, setSelectedDepartment] = useState("142");
//   const [selectedDegree, setSelectedDegree] = useState("");
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [Pagination, setPagination] = useState([]);
//   const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
//   const [searchNationalId, setSearchNationalId] = useState("");

//   const [faculties, setFaculties] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [degrees, setDegrees] = useState([]);
//   const [loadingFaculties, setLoadingFaculties] = useState(false);
//   const [loadingDepartments, setLoadingDepartments] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);


//   const navigate = useNavigate();

//   useEffect(() => {
//     setLoadingFaculties(true);
//     //علشان اعرض كل الكليات
//     getData("structure/faculty")
//       .then((data) => {
//         setFaculties(Array.isArray(data) ? data : []);
//       })
//       .catch(console.error)
//       .finally(() => setLoadingFaculties(false));
//   }, []);

//   useEffect(() => {
//     setLoadingDepartments(true);
// //     يجيب أقسام الكلية اللي اختارها المستخدم
// // getData(...)	يجيب كل الأقسام لو المستخدم لسه ما اختارش كلية
//     const fetchDepartments = selectedCollege
//       ? postData("structure/department", { id: selectedCollege })
//       : getData("structure/department");
//     fetchDepartments
//       .then((data) => {
//         const departmentsArray = Array.isArray(data) ? data : [];
//         setDepartments(departmentsArray);
//       })
//       .catch(console.error)
//       .finally(() => setLoadingDepartments(false));
//   }, [selectedCollege]);


//   // ده علشان ابحث بال id 
//   useEffect(() => {
//   if (searchNationalId) {
//     getData(`employee/search_nid/${searchNationalId}`)
//       .then((data) => {
//         setFilteredEmployees(data ? [data] : []);
//         setPagination({});
//       })
//       .catch((err) => {
//         setFilteredEmployees([]);
//         console.error(err);
//       });
//   }
// }, [searchNationalId]);

//   useEffect(() => {
//     setLoadingDepartments(true);
//     getData("structure/academic-degree/")
//       .then((data) => {
//         const degreesArray = Array.isArray(data) ? data : [];
//         setDegrees(degreesArray);
//       })
//       .catch(console.error)
//       .finally(() => setLoadingDepartments(false));
//   }, []);

//   // Fetch employee by ID if searchEmployeeId is set
//   useEffect(() => {
//     if (searchEmployeeId) {
//       getData(`employee/search/${searchEmployeeId}`)
//         .then((data) => {
//           // If the API returns a single employee object, wrap it in an array
//           // setFilteredEmployees(data ? (Array.isArray(data) ? data : [data]) : []);
//           setFilteredEmployees(Array.isArray(data.employees) ? data.employees : []);
//           setPagination(data.pagination || {}); //  بيانات الصفحات

//         })
//         .catch((err) => {
//           setFilteredEmployees([]);
//           console.error(err);
//         });
//     }
//   }, [searchEmployeeId]);


// //   بمجرد فتح الصفحة:

// // هيتبعت طلب للسيرفر يطلب الموظفين اللي في:

// // الكلية رقم 1114

// // القسم رقم 142

// // وتخزين النتيجة في filteredEmployees، 


//   // Fetch initial employees on mount with default filters
//   useEffect(() => {
//     const params = {};
//     if ("1114") params.fac = "1114";
//     if ("142") params.dept = "142";
//     getData("employee/all", params)
//       .then((data) => {
//         // setFilteredEmployees(Array.isArray(data) ? data : []);
//         setFilteredEmployees(Array.isArray(data.employees) ? data.employees : []);
//         setPagination(data.pagination || {}); // لو عايزة تستخدمي بيانات الصفحات

//       })
//       .catch((err) => {
//         setFilteredEmployees([]);
//         console.error(err);
//       });
//   }, []);

//   const handleFilter = () => {
//     // No-op: filtering is now handled by API
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//     setTimeout(handleFilter, 0);
//   };

//   const handleCollegeChange = (facultyCode) => {
//     setSelectedCollege(facultyCode);
//     setSelectedDegree("");
//     setTimeout(handleFilter, 0);
//   };

//   const handleDepartmentChange = (departmentCode) => {
//     setSelectedDepartment(departmentCode);
//     setSelectedDegree("");
//     setTimeout(handleFilter, 0);
//   };

//   const handlePositionChange = (degree) => {
//     setSelectedDegree(degree);
//     setTimeout(handleFilter, 0);
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setSelectedCollege("");
//     setSelectedDepartment("");
//     setSelectedDegree("");
//     setFilteredEmployees([]);
//   };

//   const getFiltrationData = () => {
//     const faculty = faculties?.find(({ code }) => code === selectedCollege)?.name;

//     const department = departments?.find(
//       ({ dept_code }) => dept_code === +selectedDepartment
//     )?.name;

//     const degree = degrees?.find(({ job_code }) => job_code === selectedDegree)?.job_name;

//     if (!faculty && !department && !degree) {
//       return undefined;
//     }

//     return {
//       faculty,
//       department,
//       degree,
//     };
//   };

//   const openFilterDialog = () => {
//     setIsFilterDialogOpen(true);
//   };

//   const closeFilterDialog = () => {
//     setIsFilterDialogOpen(false);
//   };


//   //  الطلب اللي هيتبعت للسيرفر هيكون مخصص حسب اختيارات المستخدم.


//   const applyFilters = () => {
//     // Only include non-empty params
//     const params = {};
//     if (selectedCollege) params.fac = selectedCollege;
//     if (selectedDepartment) params.dept = selectedDepartment;
//     if (selectedDegree) params.degree = selectedDegree;
//     getData("employee/all", params)
//       .then((data) => {
//         // setFilteredEmployees(Array.isArray(data) ? data : []);
//         setFilteredEmployees(Array.isArray(data.employees) ? data.employees : []);
//         setSearchTerm(""); // مسح تصفية الاسم
//         setSearchEmployeeId(""); // مسح تصفية الرقم
//         console.log(data);
//       })
//       .catch((err) => {
//         setFilteredEmployees([]);
//         console.error(err);
//       });
//     closeFilterDialog();
//   };

//   const hasActiveFilters = searchTerm || selectedCollege || selectedDepartment || selectedDegree;

//   return isLoggedIn ? (
//     <>
//       <div className="min-h-screen bg-gray-50" dir="rtl">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               برنامج الشؤون الادارية لجامعة الازهر
//             </h1>
//             <p className="text-gray-600">إدارة وعرض أعضاء هيئة التدريس والموظفين بالجامعة</p>
//           </div>

//           {/* Search */}
//           <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//             <div className="relative flex-1 max-w-md flex gap-2">
//               <div className="relative flex-1">
//                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                   <Search className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="البحث عن الموظفين بالاسم ..."
//                   className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm transition-all duration-200 hover:shadow-md"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   disabled={!!searchEmployeeId}
//                 />
//               </div>
//               <div className="relative w-48">
//                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                   <Search className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="بحث برقم الموظف..."
//                   className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm transition-all duration-200 hover:shadow-md"
//                   value={searchEmployeeId}
//                   onChange={(e) => setSearchEmployeeId(e.target.value)}
//                 />
//                 {searchEmployeeId && (
//                   <button
//                     className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     onClick={() => setSearchEmployeeId("")}
//                     tabIndex={-1}
//                   >
//                     <X className="h-5 w-5" />
//                   </button>
//                 )}
//               </div>
//             </div>
//             <div className="relative w-48">
//               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="بحث بالرقم القومي..."
//                 className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm transition-all duration-200 hover:shadow-md"
//                 value={searchNationalId || ""}
//                 onChange={(e) => setSearchNationalId(e.target.value)}
//               />
//               {searchNationalId && (
//                 <button
//                   className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   onClick={() => {
//                     setSearchNationalId("");
//                     setFilteredEmployees([]);
//                   }}
//                   tabIndex={-1}
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               )}
//             </div>

//             {/* Filter button */}
//             <button
//               onClick={openFilterDialog}
//               className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
//                 hasActiveFilters
//                   ? "bg-blue-600 text-white hover:bg-blue-700"
//                   : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
//               }`}
//             >
//               <Filter className=" h-5 w-5" />
//               تصفية البحث
//               {hasActiveFilters && (
//                 <span className="bg-white text-blue-600 text-xs px-2 py-1 rounded-full font-bold">
//                   {
//                     [searchTerm, selectedCollege, selectedDepartment, selectedDegree].filter(
//                       Boolean
//                     ).length
//                   }
//                 </span>
//               )}
//             </button>

//             <button
//               onClick={clearFilters}
//               className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
//             >
//               مسح التصفية
//             </button>
//           </div>

//           {/* Filtration Data */}
//           <FiltrationData filtrationData={getFiltrationData()} />

//           {/* Employees */}
//           {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {(searchEmployeeId
//               ? filteredEmployees
//               :filteredEmployees.filter((employee) => {
//                 console.log("gg",employee)
//                     const matchName =
//                       searchTerm &&
//                       (
//                         employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                         employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                         employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                         employee.college?.toLowerCase().includes(searchTerm.toLowerCase())
//                       );

//                     const matchId = searchEmployeeId
//                       ? employee.university_file_number?.toString().includes(searchEmployeeId)
//                       : true;

//                     return (!searchTerm || matchName) && (!searchEmployeeId || matchId);
//                   })

//             ).map((employee, idx) => (
//               <EmployeeCard
//                 key={employee.id || employee.member_id || employee.email || idx}
//                 employee={employee}
//                 onClick={() =>
//                   navigate(`/profile/${employee.university_file_number}`, {
//                     state: { employee },
//                   })
//                 }
//               />
//             ))}
//           </div> */}

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {(searchEmployeeId
//               ? filteredEmployees // عرض مباشر لو فيه رقم موظف محدد
//               : filteredEmployees.filter((employee) => {
//                   const matchTerm =
//                     searchTerm &&
//                     (
//                       employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                       employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                       employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                       employee.college?.toLowerCase().includes(searchTerm.toLowerCase())
//                     );

//                   return !searchTerm || matchTerm;
//                 })
//             ).map((employee, idx) => (
//               <EmployeeCard
//                 key={employee.id || employee.member_id || employee.email || idx}
//                 employee={employee}
//                 onClick={() =>
//                   navigate(`/profile/${employee.university_file_number}`, {
//                     state: { employee },
//                   })
//                 }
//               />
//             ))}
//           </div>


//           {filteredEmployees.length === 0 && (
//             <div className="flex items-center justify-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Filter Dialog - Rendered outside main container */}
//       {isFilterDialogOpen && (
//         <div
//           className="fixed top-0 left-0 right-0 bottom-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4"
//           style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
//           onClick={closeFilterDialog}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative border border-gray-200"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
//               <h3 className="text-lg font-bold text-gray-900">تصفية البحث</h3>
//               <button
//                 onClick={closeFilterDialog}
//                 className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-100 p-1 rounded-full"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="p-6 space-y-6">
//               {/* فلتر الكلية */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">الكلية</label>
//                 <div className="relative">
//                   <select
//                     value={selectedCollege}
//                     onChange={(e) => handleCollegeChange(e.target.value)}
//                     className="block w-full pr-3 pl-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm transition-all duration-200 hover:shadow-md appearance-none cursor-pointer"
//                   >
//                     <option value="">جميع الكليات</option>
//                     {loadingFaculties ? (
//                       <option disabled>جاري التحميل...</option>
//                     ) : (
//                       faculties.map((faculty) => (
//                         <option key={faculty.code} value={faculty.code}>
//                           {faculty.name}
//                         </option>
//                       ))
//                     )}
//                   </select>
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <ChevronDown className="h-4 w-4 text-gray-400" />
//                   </div>
//                 </div>
//               </div>

//               {/* Department */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">القسم</label>
//                 <div className="relative">
//                   <select
//                     value={selectedDepartment}
//                     onChange={(e) => handleDepartmentChange(e.target.value)}
//                     className={`block w-full pr-3 pl-10 py-3 border border-gray-300 rounded-lg leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm transition-all duration-200 appearance-none cursor-pointer`}
//                   >
//                     <option value="">
//                       {loadingDepartments ? "جاري التحميل..." : "جميع الأقسام"}
//                     </option>
//                     {departments.map((department, idx) => (
//                       <option key={department.dept_code + "-" + idx} value={department.dept_code}>
//                         {department.name}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <ChevronDown className="h-4 w-4 text-gray-400" />
//                   </div>
//                 </div>
//               </div>

//               {/* Degree Filter */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">الدرجة</label>
//                 <div className="relative">
//                   <select
//                     value={selectedDegree}
//                     onChange={(e) => handlePositionChange(e.target.value)}
//                     className={`block w-full pr-3 pl-10 py-3 border border-gray-300 rounded-lg leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm transition-all duration-200 appearance-none cursor-pointer`}
//                   >
//                     <option value="">جميع الدرجات</option>
//                     {degrees.map((degree, idx) => (
//                       <option key={degree.job_code + "-" + idx} value={degree.job_code}>
//                         {degree.job_name}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <ChevronDown className="h-4 w-4 text-gray-400" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//               <button
//                 onClick={clearFilters}
//                 className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
//               >
//                 مسح التصفية
//               </button>
//               <button
//                 onClick={applyFilters}
//                 className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
//               >
//                 تطبيق التصفية
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   ) : (
    
//     <LoginPage/>
    
    
//   );
// };

// export default EmployeeListPage;





// // EmployeeListPage.jsx
// import { useEffect, useState } from "react";
// import { getData, postData } from "../services/api";
// import { useNavigate } from "react-router-dom";
// import EmployeeCard from "../components/EmployeeCard";
// import { Search } from "lucide-react";
// import LoginPage from "../components/LoginPage";
// import { useIsLoggedIn } from "../contexts/isLoggedinContext";
// // بحث مع select 
// import Select from "react-select";

// const EmployeeListPage = () => {
//   const [currentEmployees, setCurrentEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [searchName, setSearchName] = useState("");
//   const [searchEmployeeId, setSearchEmployeeId] = useState("");
//   const [searchNationalId, setSearchNationalId] = useState("");
//   const [selectedCollege, setSelectedCollege] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [colleges, setColleges] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [filtersApplied, setFiltersApplied] = useState(false); // ✅ خاص بمربع الفلاتر
//   const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn(false);  // خاص بمعرفة هل المستخدم سجل دخول ولا لأ
//   const [degrees, setDegrees] = useState([]);     // لحفظ الدرجات العلمية 
//   const [selectedDegree, setSelectedDegree] = useState("");



//   const navigate = useNavigate();

//   const fetchEmployees = async (page = 1) => {
//     setLoading(true);
//     try {
//       let query = `employee/all?page=${page}&limit=25`;
//       if (selectedCollege) query += `&fac=${selectedCollege}`;
//       if (selectedDepartment) query += `&dept=${selectedDepartment}`;
//       if (selectedDegree) query += `&degree=${selectedDegree}`;

//       const res = await getData(query);
//       const employees = res.employees || [];
//       setCurrentEmployees(employees);
//       setFilteredEmployees(employees);
//       setTotalPages(res.pagination?.totalPages || 1);
//     } catch (err) {
//       console.error(err);
//       setCurrentEmployees([]);
//       setFilteredEmployees([]);
//     } finally {
//       setLoading(false);
//     }
//   };


// //قائمة بالدرجات العلمية
//   useEffect(() => {
//     getData("structure/academic-degree")
//       .then((res) => setDegrees(res || []))
//       .catch((err) => console.error("فشل تحميل الدرجات العلمية:", err));
//   }, []);

//  const applyFilters = () => {
//   setFiltersApplied(true); // ✅ تفعيل الفلاتر
//   setCurrentPage(1);
//   fetchEmployees(1);
// };


//   useEffect(() => {
//     getData("structure/faculty")
//       .then((res) => setColleges(res || []))
//       .catch((err) => console.error("فشل تحميل الكليات:", err));
//   }, []);

//   useEffect(() => {
//     if (selectedCollege) {
//       postData("structure/department", { id: selectedCollege })
//         .then((res) => setDepartments(res || []))
//         .catch((err) => console.error("فشل تحميل الأقسام:", err));
//     } else {
//       setDepartments([]);
//     }
//   }, [selectedCollege]);

//   useEffect(() => {
//     if (!searchEmployeeId.trim() && !searchNationalId.trim()) {
//       fetchEmployees(currentPage);
//     }
//   }, [currentPage]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchEmployeeId.trim()) {
//         setLoading(true);
//         getData(`employee/search/${searchEmployeeId}`)
//           .then((data) => {
//             setFilteredEmployees(data ? [data] : []);
//           })
//           .catch((err) => {
//             console.error(err);
//             setFilteredEmployees([]);
//           })
//           .finally(() => setLoading(false));
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchEmployeeId]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchNationalId.trim()) {
//         setLoading(true);
//         getData(`employee/search_nid/${searchNationalId}`)
//           .then((data) => {
//             setFilteredEmployees(data ? [data] : []);
//           })
//           .catch((err) => {
//             console.error(err);
//             setFilteredEmployees([]);
//           })
//           .finally(() => setLoading(false));
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchNationalId]);

//   useEffect(() => {
//     if (!searchEmployeeId.trim() && !searchNationalId.trim() && searchName.trim()) {
//       const filtered = currentEmployees.filter((emp) =>
//         emp.name?.toLowerCase().includes(searchName.toLowerCase())
//       );
//       setFilteredEmployees(filtered);
//     } else if (!searchEmployeeId.trim() && !searchNationalId.trim() && !searchName.trim()) {
//       setFilteredEmployees(currentEmployees);
//     }
//   }, [searchName, searchEmployeeId, searchNationalId, currentEmployees]);

//   return isLoggedIn ? (
//     <> (
//     <div className="min-h-screen p-6 bg-gray-50 max-w-7xl w-full mx-auto" dir="rtl">
//       <div className="mb-8 ">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               برنامج الشؤون الادارية لجامعة الازهر
//             </h1>
//             <p className="text-gray-600">إدارة وعرض أعضاء هيئة التدريس والموظفين بالجامعة</p>
//           </div>
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="relative w-full">
//           <input
//             type="text"
//             placeholder="ابحث بالاسم..."
//             value={searchName}
//             onChange={(e) => setSearchName(e.target.value)}
//             className="p-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
//             disabled={!!searchEmployeeId.trim() || !!searchNationalId.trim()}
//           />
//           <Search className="absolute right-2 top-2.5 text-gray-400" size={18} />
//         </div>

//         <div className="relative w-full ">
//           <input
//             type="text"
//             placeholder="بحث برقم الموظف..."
//             value={searchEmployeeId}
//             onChange={(e) => setSearchEmployeeId(e.target.value)}
//             className="p-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
//           />
//           <Search className="absolute right-2 top-2.5 text-gray-400" size={18} />
//         </div>

//         <div className="relative w-full ">
//           <input
//             type="text"
//             placeholder="بحث بالرقم القومي..."
//             value={searchNationalId}
//             onChange={(e) => setSearchNationalId(e.target.value)}
//             className="p-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"

//           />
//           <Search className="absolute right-2 top-2.5 text-gray-400" size={18} />
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row gap-4 mb-4">
//         {/* <select
//           className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"

//           value={selectedCollege}
//           onChange={(e) => setSelectedCollege(e.target.value)}
//         >
//           <option value="">كل الكليات</option>
//           {colleges.map((college) => (
//             <option key={college.code} value={college.code}>{college.name}</option>
//           ))}
//         </select> */}
//         <Select
//           options={colleges.map((college) => ({
//             value: college.code,
//             label: college.name,
//           }))}
//           value={
//             selectedCollege
//               ? { value: selectedCollege, label: colleges.find((c) => c.code === selectedCollege)?.name }
//               : null
//           }
//           onChange={(selectedOption) => setSelectedCollege(selectedOption ? selectedOption.value : "")}
//           placeholder="اختر الكلية..."
//           className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
//           isClearable
//           isSearchable
//         />

//         <select
//           className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"

//           value={selectedDepartment}
//           onChange={(e) => setSelectedDepartment(e.target.value)}
//         >
//           <option value="">كل الأقسام</option>
//           {departments.map((dept) => (
//             <option key={dept.dept_code} value={dept.dept_code}>{dept.name}</option>
//           ))}
//         </select>
//         <select
//           className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
//           value={selectedDegree}
//           onChange={(e) => setSelectedDegree(e.target.value)}
//         >
//           <option value="">كل الدرجات العلمية</option>
//           {degrees.map((deg) => (
//             <option key={deg.job_code} value={deg.job_code}>{deg.job_name}</option>
//           ))}
//         </select>


//         <button
//           onClick={applyFilters}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
//         >
//           تطبيق التصفية
//         </button>
//         <button
//           onClick={() => {
//             setSelectedCollege("");
//             setSelectedDepartment("");
//             setSelectedDegree("");
//             setCurrentPage(1);
//             fetchEmployees(1);
//           }}
//           className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//         >
//           مسح التصفية
//         </button>

//       </div>

//       {filtersApplied && (selectedCollege || selectedDepartment) && (
//         <div className="mt-2 mb-6 p-4 bg-blue-100 rounded border border-blue-300 text-sm">
//           <p className="mb-1 font-semibold">الفلاتر المطبقة:</p>
//           <ul className="list-disc list-inside text-right">
//             {selectedCollege && (
//               <li>
//                 الكلية: {colleges.find((f) => f.code === selectedCollege)?.name || "غير معروف"}
//               </li>
//             )}
//             {selectedDepartment && (
//               <li>
//                 القسم: {departments.find((d) => String(d.dept_code) === String(selectedDepartment))?.name || "غير معروف"}
//               </li>
//             )}
//             {selectedDegree && (
//               <li>
//                 الدرجة العلمية: {degrees.find((d) => String(d.job_code) === String(selectedDegree))?.job_name || "غير معروف"}
//               </li>
//             )}

//           </ul>
//         </div>
//       )}

//       {loading ? (
//         <div className="text-center">جاري التحميل...</div>
//       ) : filteredEmployees.length === 0 ? (
//         <div className="text-center text-red-500">لا توجد نتائج</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredEmployees.map((employee, idx) => (
//             <EmployeeCard
//               key={employee.university_file_number || idx}
//               employee={employee}
//               onClick={() =>
//                 navigate(`/profile/${employee.university_file_number}`, {
//                   state: { employee },
//                 }) || 
//                 navigate(`/profile/${employee.jobData[0].university_file_number}`, {
//                   state: { employee },
//                 })
//               }
//             />
//           ))}
//         </div>
//       )}

//       {!searchEmployeeId && !searchNationalId && !searchName && (
//         <div className="flex justify-center items-center gap-4 mt-8">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//           >
//             السابق
//           </button>
//           <span>
//             الصفحة {currentPage} من {totalPages}
//           </span>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//           >
//             التالي
//           </button>
//         </div>
//       )}
//     </div>
//     </>
//   ) : (
    
//     <LoginPage/>
    
    
//   );
  
  
// };

// export default EmployeeListPage;




// EmployeeListPage.jsx
import { useEffect, useState } from "react";
import { getData, postData } from "../services/api";
import { useNavigate } from "react-router-dom";
import EmployeeCard from "../components/EmployeeCard";
import { Search } from "lucide-react";
import LoginPage from "../components/LoginPage";
import { useIsLoggedIn } from "../contexts/isLoggedinContext";
import Select from "react-select";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 

  // فلترة عند الضغط على زر
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);

  // حالة الخدمة مباشرة
  const [workStatus, setWorkStatus] = useState(""); // ""=الكل, "0"=داخل الخدمة, "1"=خارج الخدمة

  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useIsLoggedIn(false);
  const navigate = useNavigate();
  const PAGE_LIMIT = 25;

  // Fetch employees
  const fetchEmployees = async (page = 1, useFilters = false) => {
    setLoading(true);
    try {
      let query = `employee/all?page=${page}&limit=${PAGE_LIMIT}&sortBy=university_file_number&sortDir=desc`;

      // تطبيق الفلاتر عند الضغط على زر "تطبيق التصفية"
      if (useFilters) {
        if (selectedCollege) query += `&fac=${selectedCollege}`;
        if (selectedDepartment) query += `&dept=${selectedDepartment}`;
        if (selectedDegree) query += `&degree=${selectedDegree}`;
        if (workStatus !== "") query += `&out=${workStatus}`;
      }

      // // حالة الخدمة مباشرة
      // if (workStatus !== "") query += `&out=${workStatus}`;
      // else query += "&out=0"; // افتراضي داخل الخدمة

      // بحث live
      if (searchQuery.trim()) query += `&q=${encodeURIComponent(searchQuery.trim())}`;

      const res = await getData(query);
      setEmployees(res.employees || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setEmployees([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // جلب الكليات
  useEffect(() => {
    getData("structure/faculty")
      .then((res) => setColleges(res || []))
      .catch((err) => console.error("فشل تحميل الكليات:", err));
  }, []);

  // جلب الأقسام عند اختيار الكلية
  useEffect(() => {
    if (selectedCollege) {
      postData("structure/department", { id: selectedCollege })
        .then((res) => setDepartments(res || []))
        .catch((err) => console.error("فشل تحميل الأقسام:", err));
    } else {
      setDepartments([]);
    }
  }, [selectedCollege]);

  // جلب الدرجات العلمية
  useEffect(() => {
    getData("structure/academic-degree")
      .then((res) => setDegrees(res || []))
      .catch((err) => console.error("فشل تحميل الدرجات العلمية:", err));
  }, []);

//   // Fetch عند تغيير الصفحة
//   useEffect(() => {
//   // إذا كان الفلاتر مطبقة، نستخدم القيم الحالية كلها
//   fetchEmployees(currentPage, true); // true = apply all filters
// }, [workStatus]);


  // البحث الموحد live مع debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchEmployees(1, filtersApplied);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const applyFilters = () => {
    setFiltersApplied(true);
    setCurrentPage(1);
    fetchEmployees(1, true);
  };

  const clearFilters = () => {
    setSelectedCollege("");
    setSelectedDepartment("");
    setSelectedDegree("");
    setWorkStatus("");
    setSearchQuery("");
    setFiltersApplied(false);
    setCurrentPage(1);
    fetchEmployees(1, false);
  };

  return isLoggedIn ? (
    <div className="min-h-screen p-6 bg-gray-50 max-w-7xl w-full mx-auto" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          برنامج الشؤون الادارية لجامعة الازهر
        </h1>
        <p className="text-gray-600">إدارة وعرض أعضاء هيئة التدريس والموظفين بالجامعة</p>
      </div>

      {/* البحث الموحد */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="ابحث بالاسم أو الرقم القومي أو رقم الموظف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
          />
          <Search className="absolute right-2 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* الفلاتر */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Select
          options={colleges.map((college) => ({ value: college.code, label: college.name }))}
          value={
            selectedCollege
              ? { value: selectedCollege, label: colleges.find((c) => c.code === selectedCollege)?.name }
              : null
          }
          onChange={(selectedOption) => setSelectedCollege(selectedOption ? selectedOption.value : "")}
          placeholder="اختر الكلية..."
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
          isClearable
          isSearchable
        />

        <select
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">كل الأقسام</option>
          {departments.map((dept) => (
            <option key={dept.dept_code} value={dept.dept_code}>{dept.name}</option>
          ))}
        </select>

        <select
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
          value={selectedDegree}
          onChange={(e) => setSelectedDegree(e.target.value)}
        >
          <option value="">كل الدرجات العلمية</option>
          {degrees.map((deg) => (
            <option key={deg.job_code} value={deg.job_code}>{deg.job_name}</option>
          ))}
        </select>

       <div className="flex items-center gap-2">
        <span>داخل الخدمة</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={workStatus === "0"}
            onChange={() => setWorkStatus(workStatus === "0" ? "1" : "0")}
          />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
          <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all peer-checked:translate-x-7"></div>
        </label>
        <span>خارج الخدمة</span>
      </div>




       


        
      </div>
      <button onClick={applyFilters} className="px-4 m-3 py-2  bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
          تطبيق التصفية
        </button>
        <button onClick={clearFilters} className="px-4 py-2 m-3 bg-red-500 text-white rounded hover:bg-red-600">
          مسح التصفية
        </button>

      {/* الفلاتر المطبقة */}
      {(selectedCollege || selectedDepartment || selectedDegree || workStatus) && (
        <div className="mt-2 mb-6 p-4 bg-blue-100 rounded border border-blue-300 text-sm">
          <p className="mb-1 font-semibold">الفلاتر المطبقة:</p>
          <ul className="list-disc list-inside text-right">
            {selectedCollege && <li>الكلية: {colleges.find((c) => c.code === selectedCollege)?.name}</li>}
            {selectedDepartment && <li>القسم: {departments.find((d) => String(d.dept_code) === String(selectedDepartment))?.name}</li>}
            {selectedDegree && <li>الدرجة العلمية: {degrees.find((d) => String(d.job_code) === String(selectedDegree))?.job_name}</li>}
            {workStatus === "0" && <li>داخل الخدمة</li>}
            {workStatus === "1" && <li>خارج الخدمة</li>}
          </ul>
        </div>
      )}

      {loading ? (
        <div className="text-center">جاري التحميل...</div>
      ) : employees.length === 0 ? (
        <div className="text-center text-red-500">لا توجد نتائج</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee, idx) => (
            <EmployeeCard
              key={employee.university_file_number || idx}
              employee={employee}
              onClick={() => navigate(`/profile/${employee.university_file_number}`, { state: { employee } })}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            السابق
          </button>
          <span>الصفحة {currentPage} من {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  ) : (
    <LoginPage />
  );
};

export default EmployeeListPage;
