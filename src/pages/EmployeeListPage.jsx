// import { useState, useRef, useEffect } from "react";
// import { getData, postData } from "../services/api";
// import axiosInstance from "@/axiosInstance";
// import { useNavigate } from "react-router-dom";
// import EmployeeCard from "../components/EmployeeCard";
// import LoginPage from "../components/LoginPage";
// import { useIsLoggedIn } from "../contexts/isLoggedinContext";
// import Select from "react-select";
// import { useFilters } from "../contexts/filtersContext";

// const EmployeeListPage = () => {
//   const [employees, setEmployees] = useState([]);
//   const [colleges, setColleges] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [degrees, setDegrees] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0); // نتائج الفلترة
//   const [fixedTotal, setFixedTotal] = useState(0); // العدد الكلي للجامعة 
//   const [loading, setLoading] = useState(false);

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const { isLoggedIn } = useIsLoggedIn(false);
//   const navigate = useNavigate();
//   const PAGE_LIMIT = 25;

//   const { filters, setFilters } = useFilters();
//   const {
//     nameQuery,
//     nidQuery,
//     ufnQuery,
//     selectedCollege,
//     selectedDepartment,
//     selectedDegree,
//     workStatus,
//   } = filters;

//   // 💡 حساب النسبة المئوية وقيمة الإزاحة الخاصة بالعداد الدائري لـ (المطابقون للتصفية)
//   const filteredPercentage = fixedTotal > 0 ? (totalItems / fixedTotal) * 100 : 0;
//   // محيط الدائرة (440) بناءً على نصف قطر 70.
//   const dashOffset = 440 - (440 * filteredPercentage) / 100; 
  
//   // 💡 الإزاحة الخاصة بالعداد الدائري لـ (الإجمالي الكلي) وهي 0 لتمثيل 100%
//   const totalDashOffset = 0; 
  

//   // جلب الموظفين
//   const fetchEmployees = async (page = 1) => {
//     setLoading(true);
//     try {
//       // 1. بناء الاستعلام بناءً على الفلاتر الحالية
//       let query = `employee/allSearch?page=${page}&limit=${PAGE_LIMIT}&sortBy=university_file_number&sortDir=desc`;

//       if (selectedCollege) query += `&fac=${selectedCollege}`;
//       if (selectedDepartment) query += `&dept=${selectedDepartment}`;
//       if (selectedDegree) query += `&degree=${selectedDegree}`;
//       if (workStatus !== "") query += `&out=${workStatus}`;
//       if (nameQuery.trim()) query += `&name=${encodeURIComponent(nameQuery.trim())}`;
//       if (nidQuery.trim()) query += `&nid=${encodeURIComponent(nidQuery.trim())}`;
//       if (ufnQuery.trim()) query += `&ufn=${encodeURIComponent(ufnQuery.trim())}`;


//       const res = await axiosInstance.get(query);
//       const data = res.data;

//       setEmployees(data.employees || []);
//       setTotalPages(data.pagination?.totalPages || 1);
//       setTotalItems(data.pagination?.totalItems || 0);

//       const noFilters =
//         !selectedCollege &&
//         !selectedDepartment &&
//         !selectedDegree &&
//         workStatus === "3" &&
//         !nameQuery.trim() &&
//         !nidQuery.trim() &&
//         !ufnQuery.trim();

//       if (noFilters && data.pagination?.totalItems > 0) {
//         setFixedTotal(data.pagination.totalItems);
//         localStorage.setItem("total", data.pagination.totalItems.toString());
//       }

//       const storedTotal = localStorage.getItem("total");
//       if (fixedTotal === 0 && storedTotal) {
//         setFixedTotal(parseInt(storedTotal));
//       }

//       // ملاحظة: إذا كان fixedTotal أكبر من 0، فهو يستخدم القيمة المخزنة في الـ state.

//     } catch (err) {
//       console.error(err);
//       setEmployees([]);
//       setTotalPages(1);
//       setTotalItems(0);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // [بقية الـ useEffects الخاصة بجلب البيانات والفلاتر... لا يوجد تغيير هنا]
//   
//       useEffect(() => {
//         axiosInstance.get("structure/faculty")
//           .then((res) => setColleges(res.data || []))
//           .catch((err) => console.error("فشل تحميل الكليات:", err));
//     }, []);

//     useEffect(() => {
//         if (selectedCollege) {
//             axiosInstance.post("structure/department", { id: selectedCollege })
//               .then((res) => setDepartments(res.data || []))
//               .catch((err) => console.error("فشل تحميل الأقسام:", err));
//         } else {
//             setDepartments([]);
//         }
//     }, [selectedCollege]);

//     useEffect(() => {
//         axiosInstance.get("structure/academic-degree")
//           .then((res) => setDegrees(res.data || []))
//           .catch((err) => console.error("فشل تحميل الدرجات العلمية:", err));
//     }, []);


//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setCurrentPage(1);
//       fetchEmployees(1);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [
//     nameQuery,
//     nidQuery,
//     ufnQuery,
//     selectedCollege,
//     selectedDepartment,
//     selectedDegree,
//     workStatus,
//   ]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
  
//   useEffect(() => {
//     const storedTotal = localStorage.getItem("total");
//     if (storedTotal) {
//       setFixedTotal(parseInt(storedTotal));
//     }
//   }, []);

//   const clearFilters = () => {
//     setFilters({
//       nameQuery: "",
//       nidQuery: "",
//       ufnQuery: "",
//       selectedCollege: "",
//       selectedDepartment: "",
//       selectedDegree: "",
//       workStatus: "3", // الكل
//     });
//     setCurrentPage(1);
//   };

//   return isLoggedIn ? (
//     <div className="min-h-screen p-6 bg-gray-60 w-[98%] mx-auto flex gap-6" dir="rtl">
//       {/* --------- الإحصائيات (Circular Progress) --------- */}
//       
//       <aside className="sticky top-10 w-64 bg-gray-100 shadow-xl rounded-xl p-3 h-fit border border-gray-200 space-y-4">
//         <h2 className="text-xl font-extrabold text-blue-800 mb-4 border-b-2 pb-2 text-center">
//           📊 ملخص البيانات
//         </h2>
      
//         {loading && (
//           <p className="text-center text-gray-500">جاري تحميل الملخص...</p>
//         )}

//         {/* 1. الإجمالي الكلي للجامعة (Circular) */}
//         <div className="flex justify-center  bg-white rounded-xl shadow-lg border border-gray-100">
//           <div className="relative w-40 h-40">
//             <svg className="w-full h-full transform -rotate-90">
//               {/* الدائرة الخلفية */}
//               <circle
//                 cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
//                 className="text-gray-200"
//               />
//               {/* دائرة التقدم الكاملة (100% لذا dashOffset = 0) */}
//               <circle
//                 cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
//                 strokeDasharray="440"
//                 strokeDashoffset={totalDashOffset}
//                 className="transition-all duration-700 text-[#06aed2]" // استخدمنا اللون الأخضر للـ Total
//                 strokeLinecap="round"
//               />
//             </svg>
//             {/* النص في المنتصف */}
//             <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
//               <p className="text-3xl font-extrabold text-gray-900">{fixedTotal > 0 ? fixedTotal : '...'}</p>
//               <p className="text-xs font-medium text-gray-500">
//                 100%
//               </p>
//             </div>
//           </div>
//         </div>
//         <p className="mt-[-10px] text-center text-sm font-bold text-gray-700">الإجمالي الكلي للجامعة</p>

//         {/* 2. الموظفون المطابقون للتصفية (Circular) */}
//         <div className="flex justify-center p-4 bg-white rounded-xl shadow-lg border border-gray-100">
//           <div className="relative w-40 h-40">
//             <svg className="w-full h-full transform -rotate-90">
//               {/* الدائرة الخلفية */}
//               <circle
//                 cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
//                 className="text-gray-200"
//               />
//               {/* دائرة التقدم الملونة (بناءً على التصفية) */}
//               <circle
//                 cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
//                 strokeDasharray="440"
//                 strokeDashoffset={dashOffset}
//                 className="transition-all duration-700 text-[#06aed2]"
//                 strokeLinecap="round"
//               />
//             </svg>
//             {/* النص في المنتصف */}
//             <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
//               <p className="text-4xl font-extrabold text-gray-900">{totalItems}</p>
//               <p className="text-xs font-medium text-gray-500">
//                 {filteredPercentage.toFixed(0)}%
//               </p>
//             </div>
//           </div>
//         </div>
//         <p className="mt-[-10px] text-center text-sm font-bold text-gray-700">المطابقون للتصفية</p>
        
//         {/* 3. عدد موظفي الصفحة الحالية (Simple Box) */}
//         <div className="p-3 bg-yellow-50 border-r-4 border-yellow-500 rounded-lg shadow-sm">
//           <p className="text-sm text-yellow-700 font-semibold">
//             عدد موظفي الصفحة الحالية:
//           </p>
//           <p className="text-3xl font-bold text-yellow-900 mt-1">
//             {employees.length}
//           </p>
//         </div>

//       </aside>

// {/* -------------------- */}

//       {/* --------- المحتوى الرئيسي --------- */}
//       <main className="flex-1">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             برنامج الشؤون الادارية لجامعة الازهر
//           </h1>
//           <p className="text-gray-600">إدارة وعرض أعضاء هيئة التدريس والموظفين بالجامعة</p>
//         </div>

//         {/* البحث */}
//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <input
//             type="text"
//             placeholder="ابحث بالاسم..."
//             value={nameQuery}
//             onChange={(e) => setFilters({ ...filters, nameQuery: e.target.value })}
//             className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
//           />
//           <input
//             type="text"
//             placeholder="ابحث بالرقم القومي..."
//             value={nidQuery}
//             onChange={(e) => setFilters({ ...filters, nidQuery: e.target.value })}
//             className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
//           />
//           <input
//             type="text"
//             placeholder="ابحث برقم الملف الجامعي..."
//             value={ufnQuery}
//             onChange={(e) => setFilters({ ...filters, ufnQuery: e.target.value })}
//             className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
//           />
//         </div>

//         {/* الفلاتر */}
//         <div className="flex flex-col md:flex-row gap-4 mb-4">
//           <Select
//             options={colleges.map((college) => ({ value: college.code, label: college.name }))}
//             value={
//               selectedCollege
//                 ? { value: selectedCollege, label: colleges.find((c) => c.code === selectedCollege)?.name }
//                 : null
//             }
//             onChange={(selectedOption) => setFilters({ ...filters, selectedCollege: selectedOption ? selectedOption.value : "" })}
//             placeholder="اختر الكلية..."
//             className="w-64"
//             isClearable
//             isSearchable
//           />

//           <select
//             className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
//             value={selectedDepartment}
//             onChange={(e) => setFilters({ ...filters, selectedDepartment: e.target.value })}
//           >
//             <option value="">كل الأقسام</option>
//             {departments.map((dept) => (
//               <option key={dept.dept_code} value={dept.dept_code}>{dept.name}</option>
//             ))}
//           </select>

//           <select
//             className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
//             value={selectedDegree}
//             onChange={(e) => setFilters({ ...filters, selectedDegree: e.target.value })}
//           >
//             <option value="">كل الدرجات العلمية</option>
//             {degrees.map((deg) => (
//               <option key={deg.job_code} value={deg.job_code}>{deg.job_name}</option>
//             ))}
//           </select>

//           {/* Dropdown للحالة */}
//           <div className="relative w-64" ref={dropdownRef}>
//             <div
//               className="border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer"
//               onClick={() => setDropdownOpen((prev) => !prev)}
//             >
//               <button className="w-full text-right px-3 py-2">
//                 {workStatus === "3" && "الكل"}
//                 {workStatus === "0" && "على رأس العمل"}
//                 {workStatus === "2" && "ليس على رأس العمل"}
//                 {workStatus === "1" && "خارج الخدمة"}
//               </button>
//             </div>

//             {dropdownOpen && (
//               <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
//                 <li
//                   className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setFilters({ ...filters, workStatus: "3" });
//                     setDropdownOpen(false);
//                   }}
//                 >
//                   الكل
//                 </li>
//                 <li className="group relative">
//                   <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
//                     داخل الخدمة ◂
//                   </div>
//                   <ul className="absolute right-full top-0 hidden group-hover:block bg-white border border-gray-300 rounded-lg shadow-lg min-w-[160px]">
//                     <li
//                       className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                       onClick={() => {
//                         setFilters({ ...filters, workStatus: "0" });
//                         setDropdownOpen(false);
//                       }}
//                     >
//                       على رأس العمل
//                     </li>
//                     <li
//                       className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                       onClick={() => {
//                         setFilters({ ...filters, workStatus: "2" });
//                         setDropdownOpen(false);
//                       }}
//                     >
//                       ليس على رأس العمل
//                     </li>
//                   </ul>
//                 </li>
//                 <li
//                   className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setFilters({ ...filters, workStatus: "1" });
//                     setDropdownOpen(false);
//                   }}
//                 >
//                   خارج الخدمة
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>

//         <button onClick={clearFilters} className="px-4 py-2 m-3 bg-red-500 text-white rounded hover:bg-red-600">
//           مسح التصفية
//         </button>

//         {/* الفلاتر المطبقة */}
//         {(selectedCollege || selectedDepartment || selectedDegree || workStatus !== "3") && (
//           <div className="mt-2 mb-6 p-4 bg-blue-100 rounded border border-blue-300 text-sm">
//             <p className="mb-1 font-semibold">الفلاتر المطبقة:</p>
//             <ul className="list-disc list-inside text-right">
//               {selectedCollege && <li>الكلية: {colleges.find((c) => c.code === selectedCollege)?.name}</li>}
//               {selectedDepartment && <li>القسم: {departments.find((d) => String(d.dept_code) === String(selectedDepartment))?.name}</li>}
//               {selectedDegree && <li>الدرجة العلمية: {degrees.find((d) => String(d.job_code) === String(selectedDegree))?.job_name}</li>}
//               {workStatus === "0" && <li>على رأس العمل</li>}
//               {workStatus === "2" && <li>ليس على رأس العمل</li>}
//               {workStatus === "1" && <li>خارج الخدمة</li>}
//               {workStatus === "3" && <li>الكل</li>}
//             </ul>
//           </div>
//         )}

//         {loading ? (
//           <div className="text-center">جاري التحميل...</div>
//         ) : employees.length === 0 ? (
//           <div className="text-center text-red-500">لا توجد نتائج</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {employees.map((employee, idx) => (
//               <EmployeeCard
//                 key={employee.id || idx}
//                 employee={employee}
//                 onClick={() =>
//                   navigate(`/profile/${employee.id}`, { state: { employee } })
//                 }
//               />
//             ))}
//           </div>
//         )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-4 mt-8">

//               {/* السابق */}
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => {
//                   const newPage = Math.max(currentPage - 1, 1);
//                   setCurrentPage(newPage);
//                   fetchEmployees(newPage);
//                 }}
//                 className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//               >
//                 السابق
//               </button>

//               {/* مربع إدخال رقم الصفحة */}
//               <div className="flex items-center gap-2">
//                 <span>اذهب إلى:</span>
//                 <input
//                   type="number"
//                   min="1"
//                   max={totalPages}
//                   value={currentPage}
//                   onChange={(e) => {
//                     let pageNumber = Number(e.target.value);

//                     // منع إدخال أرقام أقل من 1 أو أكبر من totalPages
//                     if (pageNumber < 1) pageNumber = 1;
//                     if (pageNumber > totalPages) pageNumber = totalPages;

//                     setCurrentPage(pageNumber);
//                     fetchEmployees(pageNumber);
//                   }}
//                   className="w-20 p-1 border rounded text-center"
//                 />
//                 <span>من {totalPages}</span>
//               </div>

//               {/* التالي */}
//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => {
//                   const newPage = Math.min(currentPage + 1, totalPages);
//                   setCurrentPage(newPage);
//                   fetchEmployees(newPage);
//                 }}
//                 className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//               >
//                 التالي
//               </button>

//             </div>
//           )}

// {/*         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-4 mt-8">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => {
//                 setCurrentPage((p) => Math.max(p - 1, 1));
//                 fetchEmployees(currentPage - 1);
//               }}
//               className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//             >
//               السابق
//             </button>
//             <span>الصفحة {currentPage} من {totalPages}</span>
//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => {
//                 setCurrentPage((p) => Math.min(p + 1, totalPages));
//                 fetchEmployees(currentPage + 1);
//               }}
//               className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//             >
//               التالي
//             </button>
//           </div>
//         )} */}

//       </main>
//     </div>
//   ) : (
//     <LoginPage />
//   );
// };

// export default EmployeeListPage;



import { useState, useRef, useEffect } from "react";
import axiosInstance from "@/axiosInstance";
import { useNavigate } from "react-router-dom";
import EmployeeCard from "../components/EmployeeCard";
import LoginPage from "../components/LoginPage";
import { useIsLoggedIn } from "../contexts/isLoggedinContext";
import Select from "react-select";
import { useFilters } from "../contexts/filtersContext";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // نتائج الفلترة
  const [fixedTotal, setFixedTotal] = useState(0); // العدد الكلي للجامعة 
  const [loading, setLoading] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { isLoggedIn } = useIsLoggedIn(false);
  const navigate = useNavigate();
  const PAGE_LIMIT = 25;

  const { filters, setFilters } = useFilters();
  const {
    nameQuery,
    nidQuery,
    ufnQuery,
    selectedCollege,
    selectedDepartment,
    selectedDegree,
    workStatus,
  } = filters;

  // 💡 حساب النسبة المئوية وقيمة الإزاحة الخاصة بالعداد الدائري لـ (المطابقون للتصفية)
  const filteredPercentage = fixedTotal > 0 ? (totalItems / fixedTotal) * 100 : 0;
  // محيط الدائرة (440) بناءً على نصف قطر 70.
  const dashOffset = 440 - (440 * filteredPercentage) / 100; 
  
  // 💡 الإزاحة الخاصة بالعداد الدائري لـ (الإجمالي الكلي) وهي 0 لتمثيل 100%
  const totalDashOffset = 0; 
  

  // جلب الموظفين
  const fetchEmployees = async (page = 1) => {
    setLoading(true);
    try {
      // 1. بناء الاستعلام بناءً على الفلاتر الحالية
      let query = `employee/allSearch?page=${page}&limit=${PAGE_LIMIT}&sortBy=university_file_number&sortDir=desc`;

      if (selectedCollege) query += `&fac=${selectedCollege}`;
      if (selectedDepartment) query += `&dept=${selectedDepartment}`;
      if (selectedDegree) query += `&degree=${selectedDegree}`;
      if (workStatus !== "") query += `&out=${workStatus}`;
      if (nameQuery.trim()) query += `&name=${encodeURIComponent(nameQuery.trim())}`;
      if (nidQuery.trim()) query += `&nid=${encodeURIComponent(nidQuery.trim())}`;
      if (ufnQuery.trim()) query += `&ufn=${encodeURIComponent(ufnQuery.trim())}`;


      const res = await axiosInstance.get(query);
      const data = res.data;

      setEmployees(data.employees || []);
      console.log("dd", data.pagination)
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalItems || 0);

      const noFilters =
        !selectedCollege &&
        !selectedDepartment &&
        !selectedDegree &&
        workStatus === "0" &&
        !nameQuery.trim() &&
        !nidQuery.trim() &&
        !ufnQuery.trim();

      if (noFilters && data.pagination?.totalItems > 0) {
        setFixedTotal(data.pagination.totalItems);
        localStorage.setItem("total", data.pagination.totalItems.toString());
      }

      const storedTotal = localStorage.getItem("total");
      if (fixedTotal === 0 && storedTotal) {
        setFixedTotal(parseInt(storedTotal));
      }

      // ملاحظة: إذا كان fixedTotal أكبر من 0، فهو يستخدم القيمة المخزنة في الـ state.

    } catch (err) {
      console.error(err);
      setEmployees([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };
  // [بقية الـ useEffects الخاصة بجلب البيانات والفلاتر... لا يوجد تغيير هنا]
  
      useEffect(() => {
        axiosInstance.get("structure/faculty")
          .then((res) => setColleges(res.data || []))
          .catch((err) => console.error("فشل تحميل الكليات:", err));
    }, []);

    useEffect(() => {
        if (selectedCollege) {
            axiosInstance.post("structure/department", { id: selectedCollege })
              .then((res) => setDepartments(res.data || []))
              .catch((err) => console.error("فشل تحميل الأقسام:", err));
        } else {
            setDepartments([]);
        }
    }, [selectedCollege]);

    useEffect(() => {
        axiosInstance.get("structure/academic-degree")
          .then((res) => setDegrees(res.data || []))
          .catch((err) => console.error("فشل تحميل الدرجات العلمية:", err));
    }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchEmployees(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [
    nameQuery,
    nidQuery,
    ufnQuery,
    selectedCollege,
    selectedDepartment,
    selectedDegree,
    workStatus,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    const storedTotal = localStorage.getItem("total");
    if (storedTotal) {
      setFixedTotal(parseInt(storedTotal));
    }
  }, []);

  const clearFilters = () => {
    setFilters({
      nameQuery: "",
      nidQuery: "",
      ufnQuery: "",
      selectedCollege: "",
      selectedDepartment: "",
      selectedDegree: "",
      workStatus: "3", // الكل
    });
    setCurrentPage(1);
  };

  return isLoggedIn ? (
    <div className="min-h-screen p-6 bg-gray-60 w-[98%] mx-auto flex gap-6" dir="rtl">
      {/* --------- الإحصائيات (Circular Progress) --------- */}
      
      <aside className="sticky top-10 w-64 bg-gray-100 shadow-xl rounded-xl p-3 h-fit border border-gray-200 space-y-4">
        <h2 className="text-xl font-extrabold text-blue-800 mb-4 border-b-2 pb-2 text-center">
          📊 ملخص البيانات
        </h2>
      
        {loading && (
          <p className="text-center text-gray-500">جاري تحميل الملخص...</p>
        )}

        {/* 1. الإجمالي الكلي للجامعة (Circular) */}
        <div className="flex justify-center  bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              {/* الدائرة الخلفية */}
              <circle
                cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
                className="text-gray-200"
              />
              {/* دائرة التقدم الكاملة (100% لذا dashOffset = 0) */}
              <circle
                cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
                strokeDasharray="440"
                strokeDashoffset={totalDashOffset}
                className="transition-all duration-700 text-[#06aed2]" // استخدمنا اللون الأخضر للـ Total
                strokeLinecap="round"
              />
            </svg>
            {/* النص في المنتصف */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
              <p className="text-3xl font-extrabold text-gray-900">{fixedTotal > 0 ? fixedTotal : '...'}</p>
              <p className="text-xs font-medium text-gray-500">
                100%
              </p>
            </div>
          </div>
        </div>
        <p className="mt-[-10px] text-center text-sm font-bold text-gray-700">الإجمالي الكلي للجامعة</p>

        {/* 2. الموظفون المطابقون للتصفية (Circular) */}
        <div className="flex justify-center p-4 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              {/* الدائرة الخلفية */}
              <circle
                cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
                className="text-gray-200"
              />
              {/* دائرة التقدم الملونة (بناءً على التصفية) */}
              <circle
                cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
                strokeDasharray="440"
                strokeDashoffset={dashOffset}
                className="transition-all duration-700 text-[#06aed2]"
                strokeLinecap="round"
              />
            </svg>
            {/* النص في المنتصف */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
              <p className="text-4xl font-extrabold text-gray-900">{totalItems}</p>
              <p className="text-xs font-medium text-gray-500">
                {filteredPercentage.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
        <p className="mt-[-10px] text-center text-sm font-bold text-gray-700">المطابقون للتصفية</p>
        
        {/* 3. عدد موظفي الصفحة الحالية (Simple Box) */}
        <div className="p-3 bg-yellow-50 border-r-4 border-yellow-500 rounded-lg shadow-sm">
          <p className="text-sm text-yellow-700 font-semibold">
            عدد موظفي الصفحة الحالية:
          </p>
          <p className="text-3xl font-bold text-yellow-900 mt-1">
            {employees.length}
          </p>
        </div>

      </aside>

{/* -------------------- */}

      {/* --------- المحتوى الرئيسي --------- */}
      <main className="flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            برنامج الشؤون الادارية لجامعة الازهر
          </h1>
          <p className="text-gray-600">إدارة وعرض أعضاء هيئة التدريس والموظفين بالجامعة</p>
        </div>

        {/* البحث */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="ابحث بالاسم..."
            value={nameQuery}
            onChange={(e) => setFilters({ ...filters, nameQuery: e.target.value })}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
          />
          <input
            type="text"
            placeholder="ابحث بالرقم القومي..."
            value={nidQuery}
            onChange={(e) => setFilters({ ...filters, nidQuery: e.target.value })}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
          />
          <input
            type="text"
            placeholder="ابحث برقم الملف الجامعي..."
            value={ufnQuery}
            onChange={(e) => setFilters({ ...filters, ufnQuery: e.target.value })}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
          />
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
            onChange={(selectedOption) => setFilters({ ...filters, selectedCollege: selectedOption ? selectedOption.value : "" })}
            placeholder="اختر الكلية..."
            className="w-64"
            isClearable
            isSearchable
          />

          <select
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
            value={selectedDepartment}
            onChange={(e) => setFilters({ ...filters, selectedDepartment: e.target.value })}
          >
            <option value="">كل الأقسام</option>
            {departments.map((dept) => (
              <option key={dept.dept_code} value={dept.dept_code}>{dept.name}</option>
            ))}
          </select>

          <select
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
            value={selectedDegree}
            onChange={(e) => setFilters({ ...filters, selectedDegree: e.target.value })}
          >
            <option value="">كل الدرجات العلمية</option>
            {degrees.map((deg) => (
              <option key={deg.job_code} value={deg.job_code}>{deg.job_name}</option>
            ))}
          </select>

          {/* Dropdown للحالة */}
          <div className="relative w-64" ref={dropdownRef}>
            <div
              className="border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <button className="w-full text-right px-3 py-2">
                {workStatus === "3" && "الكل"}
                {workStatus === "0" && "على رأس العمل"}
                {workStatus === "2" && "ليس على رأس العمل"}
                {workStatus === "1" && "خارج الخدمة"}
              </button>
            </div>

            {dropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <li
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setFilters({ ...filters, workStatus: "3" });
                    setDropdownOpen(false);
                  }}
                >
                  الكل
                </li>
                <li className="group relative">
                  <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                    داخل الخدمة ◂
                  </div>
                  <ul className="absolute right-full top-0 hidden group-hover:block bg-white border border-gray-300 rounded-lg shadow-lg min-w-[160px]">
                    <li
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFilters({ ...filters, workStatus: "0" });
                        setDropdownOpen(false);
                      }}
                    >
                      على رأس العمل
                    </li>
                    <li
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFilters({ ...filters, workStatus: "2" });
                        setDropdownOpen(false);
                      }}
                    >
                      ليس على رأس العمل
                    </li>
                  </ul>
                </li>
                <li
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setFilters({ ...filters, workStatus: "1" });
                    setDropdownOpen(false);
                  }}
                >
                  خارج الخدمة
                </li>
              </ul>
            )}
          </div>
        </div>

        <button onClick={clearFilters} className="px-4 py-2 m-3 bg-red-500 text-white rounded hover:bg-red-600">
          مسح التصفية
        </button>

        {/* الفلاتر المطبقة */}
        {(selectedCollege || selectedDepartment || selectedDegree || workStatus !== "3") && (
          <div className="mt-2 mb-6 p-4 bg-blue-100 rounded border border-blue-300 text-sm">
            <p className="mb-1 font-semibold">الفلاتر المطبقة:</p>
            <ul className="list-disc list-inside text-right">
              {selectedCollege && <li>الكلية: {colleges.find((c) => c.code === selectedCollege)?.name}</li>}
              {selectedDepartment && <li>القسم: {departments.find((d) => String(d.dept_code) === String(selectedDepartment))?.name}</li>}
              {selectedDegree && <li>الدرجة العلمية: {degrees.find((d) => String(d.job_code) === String(selectedDegree))?.job_name}</li>}
              {workStatus === "0" && <li>على رأس العمل</li>}
              {workStatus === "2" && <li>ليس على رأس العمل</li>}
              {workStatus === "1" && <li>خارج الخدمة</li>}
              {workStatus === "3" && <li>الكل</li>}
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
                key={employee.id || idx}
                employee={employee}
                onClick={() =>
                  navigate(`/profile/${employee.id}`, { state: { employee } })
                }
              />
            ))}
          </div>
        )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">

              {/* السابق */}
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  const newPage = Math.max(currentPage - 1, 1);
                  setCurrentPage(newPage);
                  fetchEmployees(newPage);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                السابق
              </button>

              {/* مربع إدخال رقم الصفحة */}
              <div className="flex items-center gap-2">
                <span>اذهب إلى:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    let pageNumber = Number(e.target.value);

                    // منع إدخال أرقام أقل من 1 أو أكبر من totalPages
                    if (pageNumber < 1) pageNumber = 1;
                    if (pageNumber > totalPages) pageNumber = totalPages;

                    setCurrentPage(pageNumber);
                    fetchEmployees(pageNumber);
                  }}
                  className="w-20 p-1 border rounded text-center"
                />
                <span>من {totalPages}</span>
              </div>

              {/* التالي */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  const newPage = Math.min(currentPage + 1, totalPages);
                  setCurrentPage(newPage);
                  fetchEmployees(newPage);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                التالي
              </button>

            </div>
          )}

{/*         {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                fetchEmployees(currentPage - 1);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              السابق
            </button>
            <span>الصفحة {currentPage} من {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, totalPages));
                fetchEmployees(currentPage + 1);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        )} */}

      </main>
    </div>
  ) : (
    <LoginPage />
  );
};

export default EmployeeListPage;