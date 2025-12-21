import { useState, useRef, useEffect } from "react";
import axiosInstance from "@/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import useRequireAuth from "../lib/useRequireAuth";
import Select from "react-select";
import { useFilters } from "../contexts/filtersContext";

const LeadersListPage = () => {
  const location = useLocation();
  const job_id = location.state?.id;
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
  const navigate = useNavigate();
  const PAGE_LIMIT = 3000;

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
  

  // ensure user is authenticated before this page issues any requests
  useRequireAuth();
  // Reset filters when component mounts to prevent EmployeeListPage filters from affecting this page
  useEffect(() => {
    setFilters({
      nameQuery: "",
      nidQuery: "",
      ufnQuery: "",
      selectedCollege: "",
      selectedDepartment: "",
      selectedDegree: "",
      workStatus: "3",
    });
  }, []);
  // جلب الموظفين
  const fetchEmployees = async (page = 1) => {
    setLoading(true);
    try {
      // 1. بناء الاستعلام بناءً على الفلاتر الحالية
      let query = `employee/allSearch?page=${page}&limit=${PAGE_LIMIT}&sortBy=current_position&sortDir=desc&lead=true`;

      if (selectedCollege) query += `&fac=${selectedCollege}`;
      if (selectedDepartment) query += `&dept=${selectedDepartment}`;
      console.log("job_id", job_id)
      if (job_id) query += `&degree=${job_id}`;
      if (workStatus !== "") query += `&out=${workStatus}`;
      if (nameQuery.trim()) query += `&name=${encodeURIComponent(nameQuery.trim())}`;
      if (nidQuery.trim()) query += `&nid=${encodeURIComponent(nidQuery.trim())}`;
      if (ufnQuery.trim()) query += `&ufn=${encodeURIComponent(ufnQuery.trim())}`;


      const res = await axiosInstance.get(query);
      const data = res.data;

      setEmployees(data.employees || []);
      console.log("dd", data.pagination)
      setTotalPages(data.pagination?.totalPages || 1);
      // set filtered results count from the paginated response
      setTotalItems(data.pagination?.totalItems || 0);

      const noFilters =
        !selectedCollege &&
        !selectedDepartment &&
        !selectedDegree &&
        workStatus === "0" &&
        !nameQuery.trim() &&
        !nidQuery.trim() &&
        !ufnQuery.trim();

      // fixedTotal (global total) is fetched from /employee/count-all on mount

      

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
        axiosInstance.get("structure/leaders-degree")
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
    // Fetch the global total number of employees and store in fixedTotal
    const fetchGlobalTotal = async () => {
      try {
        const res = await axiosInstance.get("/employee/count-leaders");
        const d = res.data;
        const total = d?.count ?? d?.total ?? d?.totalItems ?? d;
        console.debug("extracted global total:", total);
        const parsed = Number(total) || 0;
        if (!parsed) console.warn("/employee/count-leaders returned falsy total:", d);
        setFixedTotal(parsed);
      } catch (err) {
        console.error("فشل جلب العدد الكلي من /employee/count-leaders:", err);
      }
    };

    fetchGlobalTotal();
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

  return (
    <div className="min-h-screen p-6 bg-gray-60 w-[98%] mx-auto flex gap-6" dir="rtl">
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-4">قائمة القيادات الأكاديمية</h1>

        {loading ? (
          <div className="text-center">جاري التحميل...</div>
        ) : employees.length === 0 ? (
          <div className="text-center text-red-500">لا توجد نتائج</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow p-3">
            {(() => {
              // Sort employees by role priority: عميد -> وكيل -> رئيس الجامعة -> others
              const priorityOrder = { "عميد": 0, "وكيل": 1, "رئيس الجامعة": 2 };
              const normalize = (s) => (s || "").toString().trim();
              const getPriority = (emp) => {
                const pos = normalize(emp.current_position);
                return Object.prototype.hasOwnProperty.call(priorityOrder, pos) ? priorityOrder[pos] : 3;
              };

              const sortedEmps = [...employees].sort((a, b) => {
                const pa = getPriority(a);
                const pb = getPriority(b);
                if (pa !== pb) return pa - pb;
                // same priority -> secondary sort by position name then by employee name (Arabic collation)
                const posA = normalize(a.current_position);
                const posB = normalize(b.current_position);
                if (posA !== posB) return posA.localeCompare(posB, 'ar');
                const nameA = normalize(a.name || a.member_name);
                const nameB = normalize(b.name || b.member_name);
                return nameA.localeCompare(nameB, 'ar');
              });

              // Group the sorted employees by position (this preserves the priority order)
              const grouped = sortedEmps.reduce((acc, emp) => {
                const position = normalize(emp.current_position) || 'بدون منصب';
                if (!acc[position]) acc[position] = [];
                acc[position].push(emp);
                return acc;
              }, {});

              // Flatten into a single list with position headers (ordered as in grouped)
              const flatList = [];
              Object.entries(grouped).forEach(([positionName, positionEmployees]) => {
                flatList.push({ type: 'position-header', position: positionName, count: positionEmployees.length });
                positionEmployees.forEach((emp, idx) => {
                  flatList.push({ type: 'employee', data: emp, index: idx + 1 });
                });
              });

              return (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-right">
                    <tr>
                      <th className="px-4 py-2">م</th>
                      <th className="px-4 py-2">الاسم</th>
                      <th className="px-4 py-2">القسم</th>
                      <th className="px-4 py-2">رقم الملف الجامعي</th>
                      <th className="px-4 py-2">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="text-right">
                    {flatList.map((item, idx) => {
                      if (item.type === 'position-header') {
                        return (
                          <tr key={`pos-${item.position}`} className="bg-blue-50">
                            <td colSpan={5} className="px-4 py-3 font-semibold text-blue-900 border-t-2 border-b-2 border-blue-300">
                              {item.position} <span className="text-sm text-gray-600">({item.count})</span>
                            </td>
                          </tr>
                        );
                      }
                      const emp = item.data;
                      return (
                        <tr key={emp.id || idx} className="border-b hover:bg-gray-50 cursor-pointer">
                          <td className="px-4 py-2">{item.index}</td>
                          <td className="px-4 py-2 font-medium">{emp.name || emp.member_name || '-'}</td>
                          <td className="px-4 py-2">{emp.department_name || '-'}</td>
                          <td className="px-4 py-2 text-blue-600">{emp.university_file_number || '-'}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() =>
                                navigate(`/profile/${emp.id}`, { state: { employee: emp } })
                              }
                              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                            >
                              عرض
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            })()}
          </div>
        )}          {/* Pagination */}
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
  );
};

export default LeadersListPage;