import EmployeeCard from "../components/EmployeeCard";
import logo from "../assets/logo.png";
import { getData, postData } from "../services/api";
import { useNavigate } from "react-router-dom";
import LoginPage from "../components/LoginPage";

import { useState, useEffect } from "react";
import {
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronDown,
  Filter,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import FiltrationData from "../components/FiltrationData";
import { useIsLoggedIn } from "../contexts/isLoggedinContext";

const EmployeeListPage = () => {
  const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("1114");
  const [selectedDepartment, setSelectedDepartment] = useState("142");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [searchNationalId, setSearchNationalId] = useState("");

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [loadingFaculties, setLoadingFaculties] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    setLoadingFaculties(true);
    getData("structure/faculty")
      .then((data) => {
        setFaculties(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoadingFaculties(false));
  }, []);

  useEffect(() => {
    setLoadingDepartments(true);
    const fetchDepartments = selectedCollege
      ? postData("structure/department", { id: selectedCollege })
      : getData("structure/department");
    fetchDepartments
      .then((data) => {
        const departmentsArray = Array.isArray(data) ? data : [];
        setDepartments(departmentsArray);
      })
      .catch(console.error)
      .finally(() => setLoadingDepartments(false));
  }, [selectedCollege]);

  useEffect(() => {
    setLoadingDepartments(true);
    getData("structure/academic-degree/")
      .then((data) => {
        const degreesArray = Array.isArray(data) ? data : [];
        setDegrees(degreesArray);
      })
      .catch(console.error)
      .finally(() => setLoadingDepartments(false));
  }, []);

  // Fetch employee by ID if searchEmployeeId is set
  useEffect(() => {
    if (searchEmployeeId) {
      getData(`employee/search/${searchEmployeeId}`)
        .then((data) => {
          // If the API returns a single employee object, wrap it in an array
          setFilteredEmployees(data ? (Array.isArray(data) ? data : [data]) : []);
        })
        .catch((err) => {
          setFilteredEmployees([]);
          console.error(err);
        });
    }
  }, [searchEmployeeId]);

  // Fetch initial employees on mount with default filters
  useEffect(() => {
    const params = {};
    if ("1114") params.fac = "1114";
    if ("142") params.dept = "142";
    getData("employee/list", params)
      .then((data) => {
        setFilteredEmployees(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setFilteredEmployees([]);
        console.error(err);
      });
  }, []);

  const handleFilter = () => {
    // No-op: filtering is now handled by API
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setTimeout(handleFilter, 0);
  };

  const handleCollegeChange = (facultyCode) => {
    setSelectedCollege(facultyCode);
    setSelectedDegree("");
    setTimeout(handleFilter, 0);
  };

  const handleDepartmentChange = (departmentCode) => {
    setSelectedDepartment(departmentCode);
    setSelectedDegree("");
    setTimeout(handleFilter, 0);
  };

  const handlePositionChange = (degree) => {
    setSelectedDegree(degree);
    setTimeout(handleFilter, 0);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCollege("");
    setSelectedDepartment("");
    setSelectedDegree("");
    setFilteredEmployees([]);
  };

  const getFiltrationData = () => {
    const faculty = faculties?.find(({ code }) => code === selectedCollege)?.name;

    const department = departments?.find(
      ({ dept_code }) => dept_code === +selectedDepartment
    )?.name;

    const degree = degrees?.find(({ job_code }) => job_code === selectedDegree)?.job_name;

    if (!faculty && !department && !degree) {
      return undefined;
    }

    return {
      faculty,
      department,
      degree,
    };
  };

  const openFilterDialog = () => {
    setIsFilterDialogOpen(true);
  };

  const closeFilterDialog = () => {
    setIsFilterDialogOpen(false);
  };

  const applyFilters = () => {
    // Only include non-empty params
    const params = {};
    if (selectedCollege) params.fac = selectedCollege;
    if (selectedDepartment) params.dept = selectedDepartment;
    if (selectedDegree) params.degree = selectedDegree;
    getData("employee/list", params)
      .then((data) => {
        setFilteredEmployees(Array.isArray(data) ? data : []);
        console.log(data);
      })
      .catch((err) => {
        setFilteredEmployees([]);
        console.error(err);
      });
    closeFilterDialog();
  };

  const hasActiveFilters = searchTerm || selectedCollege || selectedDepartment || selectedDegree;

  return isLoggedIn ? (
    <>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              برنامج الشؤون الادارية لجامعة الازهر
            </h1>
            <p className="text-gray-600">إدارة وعرض أعضاء هيئة التدريس والموظفين بالجامعة</p>
          </div>

          {/* Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="البحث عن الموظفين بالاسم ..."
                  className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm transition-all duration-200 hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={!!searchEmployeeId}
                />
              </div>
              <div className="relative w-48">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="بحث برقم الموظف..."
                  className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm transition-all duration-200 hover:shadow-md"
                  value={searchEmployeeId}
                  onChange={(e) => setSearchEmployeeId(e.target.value)}
                />
                {searchEmployeeId && (
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchEmployeeId("")}
                    tabIndex={-1}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            <div className="relative w-48">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="بحث بالرقم القومي..."
                className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm transition-all duration-200 hover:shadow-md"
                value={searchNationalId || ""}
                onChange={(e) => setSearchNationalId(e.target.value)}
              />
              {searchNationalId && (
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchNationalId("")}
                  tabIndex={-1}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Filter button */}
            <button
              onClick={openFilterDialog}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                hasActiveFilters
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Filter className=" h-5 w-5" />
              تصفية البحث
              {hasActiveFilters && (
                <span className="bg-white text-blue-600 text-xs px-2 py-1 rounded-full font-bold">
                  {
                    [searchTerm, selectedCollege, selectedDepartment, selectedDegree].filter(
                      Boolean
                    ).length
                  }
                </span>
              )}
            </button>

            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            >
              مسح التصفية
            </button>
          </div>

          {/* Filtration Data */}
          <FiltrationData filtrationData={getFiltrationData()} />

          {/* Employees */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchEmployeeId
              ? filteredEmployees
              // : filteredEmployees.filter((employee) => {
              //     if (!searchTerm) return true;
              //     return (
              //       (employee.name &&
              //         employee.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
              //       (employee.department &&
              //         employee.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
              //       (employee.position &&
              //         employee.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
              //       (employee.college &&
              //         employee.college.toLowerCase().includes(searchTerm.toLowerCase()))
              //     );
              :filteredEmployees.filter((employee) => {
                    const matchName =
                      searchTerm &&
                      (
                        employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        employee.college?.toLowerCase().includes(searchTerm.toLowerCase())
                      );

                    const matchId = searchEmployeeId
                      ? employee.university_file_number?.toString().includes(searchEmployeeId)
                      : true;

                    return (!searchTerm || matchName) && (!searchEmployeeId || matchId);
                  })

            ).map((employee, idx) => (
              <EmployeeCard
                key={employee.id || employee.member_id || employee.email || idx}
                employee={employee}
                onClick={() =>
                  navigate(`/profile/${employee.university_file_number}`, {
                    state: { employee },
                  })
                }
              />
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Dialog - Rendered outside main container */}
      {isFilterDialogOpen && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={closeFilterDialog}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900">تصفية البحث</h3>
              <button
                onClick={closeFilterDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-100 p-1 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* فلتر الكلية */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">الكلية</label>
                <div className="relative">
                  <select
                    value={selectedCollege}
                    onChange={(e) => handleCollegeChange(e.target.value)}
                    className="block w-full pr-3 pl-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm transition-all duration-200 hover:shadow-md appearance-none cursor-pointer"
                  >
                    <option value="">جميع الكليات</option>
                    {loadingFaculties ? (
                      <option disabled>جاري التحميل...</option>
                    ) : (
                      faculties.map((faculty) => (
                        <option key={faculty.code} value={faculty.code}>
                          {faculty.name}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">القسم</label>
                <div className="relative">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className={`block w-full pr-3 pl-10 py-3 border border-gray-300 rounded-lg leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm transition-all duration-200 appearance-none cursor-pointer`}
                  >
                    <option value="">
                      {loadingDepartments ? "جاري التحميل..." : "جميع الأقسام"}
                    </option>
                    {departments.map((department, idx) => (
                      <option key={department.dept_code + "-" + idx} value={department.dept_code}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Degree Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">الدرجة</label>
                <div className="relative">
                  <select
                    value={selectedDegree}
                    onChange={(e) => handlePositionChange(e.target.value)}
                    className={`block w-full pr-3 pl-10 py-3 border border-gray-300 rounded-lg leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm transition-all duration-200 appearance-none cursor-pointer`}
                  >
                    <option value="">جميع الدرجات</option>
                    {degrees.map((degree, idx) => (
                      <option key={degree.job_code + "-" + idx} value={degree.job_code}>
                        {degree.job_name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              >
                مسح التصفية
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              >
                تطبيق التصفية
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    
    <LoginPage/>
    
    
  );
};

export default EmployeeListPage;

