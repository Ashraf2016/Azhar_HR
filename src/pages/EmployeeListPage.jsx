import { useState, useRef, useEffect } from "react";
import axiosInstance from "@/axiosInstance";
import { useNavigate } from "react-router-dom";
import EmployeeCard from "../components/EmployeeCard";
import useRequireAuth from "../lib/useRequireAuth";
import Select from "react-select";
import { useFilters } from "../contexts/filtersContext";
import { Search, Filter, X, ChevronLeft, ChevronRight, Users, TrendingUp, FileText } from "lucide-react";
import CustomDropdown from "@/components/CustomDropdown";

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
  const [openCollege, setOpenCollege] = useState(false);
  const collegeRef = useRef(null);
  const [collegeQuery, setCollegeQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);  // ensure user is authenticated before this page issues any requests
  useRequireAuth();

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

      // Set the filtered results count from the paginated response
      setTotalItems(data.pagination?.totalItems || 0);

      // note: fixedTotal is the global total (from /employee/count-all)

      

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
            axiosInstance.get(`structure/department/${selectedCollege}`)
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
      if (collegeRef.current && !collegeRef.current.contains(event.target)) {
        setOpenCollege(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    // Fetch the global total number of employees and store in fixedTotal
    const fetchGlobalTotal = async () => {
      try {
        const res = await axiosInstance.get("/employee/count-all");
        const d = res.data;
        const total = d?.count ?? d?.total ?? d?.totalItems ?? d;
        console.debug("extracted global total:", total);
        const parsed = Number(total) || 0;
        if (!parsed) console.warn("/employee/count-all returned falsy total:", d);
        setFixedTotal(parsed);
      } catch (err) {
        console.error("فشل جلب العدد الكلي من /employee/count-all:", err);
      }
    };

    fetchGlobalTotal();
  }, []);

  // keep the input text synced with selectedCollege/code -> show college name
  useEffect(() => {
    if (selectedCollege) {
      const col = colleges.find(c => c.code === selectedCollege);
      setCollegeQuery(col ? col.name : "");
    } else {
      setCollegeQuery("");
    }
  }, [selectedCollege, colleges]);

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

  const hasActiveFilters =
    filters.selectedCollege ||
    filters.selectedDepartment ||
    filters.selectedDegree ||
    filters.workStatus !== "3" ||
    filters.nameQuery.trim() ||
    filters.nidQuery.trim() ||
    filters.ufnQuery.trim();    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                برنامج الشؤون الإدارية
              </h1>
              <p className="text-gray-600">جامعة الأزهر - إدارة أعضاء هيئة التدريس</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">الإحصائيات</h2>
                <TrendingUp className="text-blue-600" size={20} />
              </div>

              {/* Total Count Circle */}
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72" cy="72" r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="72" cy="72" r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="377"
                      strokeDashoffset="0"
                      className="text-blue-600 transition-all duration-700"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold text-gray-900">{fixedTotal}</p>
                    <p className="text-xs text-gray-500 mt-1">إجمالي</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-3">العدد الكلي</p>
              </div>

              {/* Filtered Count Circle */}
              <div className="text-center pt-4 border-t border-gray-100">
                <div className="relative inline-block">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72" cy="72" r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="72" cy="72" r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="377"
                      strokeDashoffset={dashOffset * 0.857}
                      className="text-green-500 transition-all duration-700"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
                    <p className="text-xs text-gray-500 mt-1">{filteredPercentage.toFixed(0)}%</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-3">المطابقون للفلترة</p>
              </div>

              {/* Current Page Count */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-amber-700 font-medium mb-1">الصفحة الحالية</p>
                    <p className="text-2xl font-bold text-amber-900">{employees.length}</p>
                  </div>
                  <Users className="text-amber-600" size={32} />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Search className="text-gray-400" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">البحث والتصفية</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="mr-auto text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Filter size={16} />
                  {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
                </button>
              </div>

              {/* Search Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="ابحث بالاسم..."
                  value={filters.nameQuery}
                  onChange={(e) => setFilters({ ...filters, nameQuery: e.target.value })}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <input
                  type="text"
                  placeholder="الرقم القومي..."
                  value={filters.nidQuery}
                  onChange={(e) => setFilters({ ...filters, nidQuery: e.target.value })}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <input
                  type="text"
                  placeholder="رقم الملف الجامعي..."
                  value={filters.ufnQuery}
                  onChange={(e) => setFilters({ ...filters, ufnQuery: e.target.value })}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="relative" ref={collegeRef}>
                      <input
                        type="text"
                        value={collegeQuery}
                        onChange={(e) => {
                          const v = e.target.value;
                          setCollegeQuery(v);
                          setOpenCollege(true);
                          // do NOT auto-select while typing; only clear selection when input emptied
                          if (v.trim() === "") setFilters({ ...filters, selectedCollege: "" });
                        }}
                        onFocus={() => setOpenCollege(true)}
                        placeholder={filters.selectedCollege ? (colleges.find(c => c.code === filters.selectedCollege)?.name || 'كل الكليات') : 'كل الكليات'}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-right hover:border-blue-500 transition-all outline-none"
                      />

                      {openCollege && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-52 overflow-auto">
                          <button
                            className="w-full text-right px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => { setFilters({ ...filters, selectedCollege: "" }); setCollegeQuery(""); setOpenCollege(false); }}
                          >
                            كل الكليات
                          </button>
                          {colleges
                            .filter(c => c.name.toLowerCase().includes(collegeQuery.toLowerCase()))
                            .map(c => (
                              <button
                                key={c.code}
                                onClick={() => { setFilters({ ...filters, selectedCollege: c.code }); setCollegeQuery(c.name); setOpenCollege(false); }}
                                className="w-full text-right px-4 py-2 hover:bg-gray-50 transition-colors"
                              >
                                {c.name}
                              </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <CustomDropdown
                      value={filters.selectedDepartment}
                      onChange={(val) =>
                        setFilters({ ...filters, selectedDepartment: val })
                      }
                      placeholder="كل الأقسام"
                      options={[
                        { value: "", label: "كل الأقسام" },
                        ...departments.map(d => ({
                          value: d.dept_code,
                          label: d.name
                        }))
                      ]}
                    />

                    <CustomDropdown
                      value={filters.selectedDegree}
                      onChange={(val) =>
                        setFilters({ ...filters, selectedDegree: val })
                      }
                      placeholder="كل الدرجات"
                      options={[
                        { value: "", label: "كل الدرجات" },
                        ...degrees.map(d => ({
                          value: d.job_code,
                          label: d.job_name
                        }))
                      ]}
                    />

                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-right hover:border-blue-500 transition-all"
                      >
                        {filters.workStatus === "3" && "الكل"}
                        {filters.workStatus === "0" && "على رأس العمل"}
                        {filters.workStatus === "2" && "ليس على رأس العمل"}
                        {filters.workStatus === "1" && "خارج الخدمة"}
                      </button>

                      {dropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl">
                          <button
                            onClick={() => { setFilters({ ...filters, workStatus: "3" }); setDropdownOpen(false); }}
                            className="w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                          >
                            الكل
                          </button>
                          <button
                            onClick={() => { setFilters({ ...filters, workStatus: "0" }); setDropdownOpen(false); }}
                            className="w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                          >
                            على رأس العمل
                          </button>
                          <button
                            onClick={() => { setFilters({ ...filters, workStatus: "2" }); setDropdownOpen(false); }}
                            className="w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                          >
                            ليس على رأس العمل
                          </button>
                          <button
                            onClick={() => { setFilters({ ...filters, workStatus: "1" }); setDropdownOpen(false); }}
                            className="w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                          >
                            خارج الخدمة
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 font-medium"
                    >
                      <X size={16} />
                      مسح جميع الفلاتر
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="font-semibold text-blue-900 mb-2">الفلاتر المطبقة:</p>
                <div className="flex flex-wrap gap-2">
                  {filters.selectedCollege && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {colleges.find(c => c.code === filters.selectedCollege)?.name}
                    </span>
                  )}
                  {filters.selectedDepartment && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {departments.find(d => d.dept_code === filters.selectedDepartment)?.name}
                    </span>
                  )}
                  {filters.selectedDegree && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {degrees.find(d => d.job_code === filters.selectedDegree)?.job_name}
                    </span>
                  )}
                  {filters.workStatus !== "3" && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {filters.workStatus === "0" && "على رأس العمل"}
                      {filters.workStatus === "2" && "ليس على رأس العمل"}
                      {filters.workStatus === "1" && "خارج الخدمة"}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Employee Cards */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">جاري التحميل...</p>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <p className="text-red-500 text-lg">لا توجد نتائج</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employees.map((employee) => {
                  // Determine work status display
                  const getWorkStatusInfo = (emp) => {
                    // Get the status from work_status field
                    const status = emp?.work_status || "غير محدد";
                    const statusStr = String(status).trim();
                    
                    // Map Arabic status values to colors
                    if (statusStr === "على رأس العمل" || statusStr === "0") {
                      return { label: "على رأس العمل", color: "bg-green-100 text-green-800" };
                    }
                    if (statusStr === "خارج الخدمة" || statusStr === "1") {
                      return { label: "خارج الخدمة", color: "bg-red-100 text-red-800" };
                    }
                    if (statusStr === "ليس على رأس العمل" || statusStr === "2") {
                      return { label: "ليس على رأس العمل", color: "bg-yellow-100 text-yellow-800" };
                    }
                    if (statusStr === "الكل" || statusStr === "3") {
                      return { label: "الكل", color: "bg-gray-100 text-gray-800" };
                    }
                    
                    // Default: show the actual value if it's not a standard one
                    return { label: statusStr || "غير محدد", color: "bg-gray-100 text-gray-800" };
                  };
                  
                  const workStatusInfo = getWorkStatusInfo(employee);
                  
                  return (
                    <div
                      key={employee.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 cursor-pointer border border-gray-100 hover:border-blue-300 group"
                      onClick={() => navigate(`/profile/${employee.id}`, { state: { employee } })}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {employee.name?.charAt(0) || "؟"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                            {employee.name || "غير محدد"}
                          </h3>
                          <div className="mb-2">
                            <p className="text-xs font-semibold text-gray-700 mb-0.5">المركز الحالي:</p>
                            <p className="text-sm font-medium text-blue-600">
                              {employee.current_position || employee.position || "غير محدد"}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{employee.faculty_name || "غير محدد"} - {employee.department_name || employee.department || "غير محدد"}</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${workStatusInfo.color}`}>
                              {workStatusInfo.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      const newPage = Math.max(currentPage - 1, 1);
                      setCurrentPage(newPage);
                      fetchEmployees(newPage);
                    }}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <ChevronRight size={18} />
                    السابق
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 text-sm">الصفحة</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        let page = Math.max(1, Math.min(Number(e.target.value), totalPages));
                        setCurrentPage(page);
                        fetchEmployees(page);
                      }}
                      className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <span className="text-gray-600 text-sm">من {totalPages}</span>
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      const newPage = Math.min(currentPage + 1, totalPages);
                      setCurrentPage(newPage);
                      fetchEmployees(newPage);
                    }}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    التالي
                    <ChevronLeft size={18} />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListPage;