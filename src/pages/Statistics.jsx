// import React, { useState, useEffect, useMemo, useRef } from 'react';

// // عناوين API
// const OVERVIEW_API_URL = 'https://university.roboeye-tec.com/statistics/overview';
// const FACULTIES_API_URL = 'https://university.roboeye-tec.com/statistics/faculties';
// // تم حذف: DEPARTMENTS_API_URL
// const DEGREES_API_URL = 'https://university.roboeye-tec.com/statistics/academic-degrees'; 

// // عناوين API المطلوبة للتفاصيل:
// const STRUCTURE_FACULTY_API = 'https://university.roboeye-tec.com/structure/faculty';
// const FACULTY_BREAKDOWN_API_BASE = 'https://university.roboeye-tec.com/statistics/faculty'; // يضاف بعدها /{code}/breakdown

// const DEGREE_GAPS_API_URL = 'https://university.roboeye-tec.com/statistics/degree-gaps';


// // ----------------------------------------------------------------------
// // دوال مساعدة
// // ----------------------------------------------------------------------

// const formatNumber = (numString) => {
//     if (!numString) return '0';
//     // 💡 تعديل للسماح بالأرقام المعطوفة لـ CountUpAnimation
//     if (typeof numString === 'number' && !Number.isInteger(numString)) {
//         return numString.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
//     }
//     const num = parseInt(numString);
//     return isNaN(num) ? numString : num.toLocaleString('en-US');
// };

// const classifyFaculty = (name) => {
//     if (name.includes('القاهره')) return 'القاهرة والوجه البحري';
//     if (name.includes('اسيوط') || name.includes('سوهاج') || name.includes('قنا') || name.includes('اسوان')) return 'الصعيد';
//     if (name.includes('المنصوره') || name.includes('الزقازيق') || name.includes('المنوفيه') || name.includes('طنطا') || name.includes('دمياط') || name.includes('دمنهور') || name.includes('الاسكندريه')) return 'الوجه البحري والدلتا';
//     if (name.includes('بنات') || name.includes('انسانيه') || name.includes('اسلامية وعربية بنات')) return 'كليات البنات/دراسات انسانية';
//     return 'مراكز ووحدات متخصصة';
// };

// // ----------------------------------------------------------------------
// // مكون العداد CountUpAnimation
// // ----------------------------------------------------------------------
// const CountUpAnimation = ({ endValue, duration = 500, isPercentage = false }) => {
//     const finalNumber = parseFloat(endValue) || 0;
//     const [count, setCount] = useState(0);

//     useEffect(() => {
//         let startTime;
//         let animationFrameId;
        
//         if (finalNumber === 0) {
//             setCount(0);
//             return;
//         }

//         const step = (timestamp) => {
//             if (!startTime) startTime = timestamp;
//             const progress = timestamp - startTime;
//             const percentage = Math.min(progress / duration, 1);
//             const currentValue = percentage * finalNumber;

//             setCount(currentValue);

//             if (percentage < 1) {
//                 animationFrameId = requestAnimationFrame(step);
//             } else {
//                 setCount(finalNumber);
//             }
//         };

//         animationFrameId = requestAnimationFrame(step);

//         return () => cancelAnimationFrame(animationFrameId);
//     }, [finalNumber, duration]);

//     // 💡 تعديل لعرض الكسور العشرية لنسبة مئوية أو معدل
//     const displayValue = isPercentage 
//         ? `${count.toFixed(count < 100 ? 2 : 0)}%`
//         : formatNumber(Math.floor(count).toString());
    
//     return (
//         <h3 className="text-3xl font-extrabold text-right mt-2">
//             {displayValue}
//         </h3>
//     );
// };

// // ----------------------------------------------------------------------
// // مكون القائمة المنسدلة القابلة للبحث (SearchableSelect)
// // ----------------------------------------------------------------------
// const SearchableSelect = ({ options, selectedCode, onSelect, placeholder }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isOpen, setIsOpen] = useState(false);
//     const wrapperRef = useRef(null);
//     const inputRef = useRef(null); 

//     // البحث عن العنصر المحدد لعرض اسمه في مربع البحث
//     const selectedOption = useMemo(() => 
//         options.find(o => o.code === selectedCode), 
//     [options, selectedCode]);
    
//     // تصفية الخيارات بناءً على مصطلح البحث
//     const filteredOptions = useMemo(() => {
//         // إذا لم يكن هناك مصطلح بحث، أعد كل الخيارات
//         if (!searchTerm || !options || options.length === 0) return options;
        
//         const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        
//         return options.filter(option => 
//             // 💡 شرط البحث الفوري
//             option.name && option.name.toLowerCase().includes(normalizedSearchTerm)
//         );
//     }, [options, searchTerm]);

//     // معالجة النقر خارج المكون لإغلاق القائمة
//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//                 setIsOpen(false);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [wrapperRef]);
    
//     // 💡 خاصية التركيز التلقائي وتعبئة مربع البحث عند الفتح
//     useEffect(() => {
//         if (isOpen && inputRef.current) {
//             // إذا كان هناك عنصر محدد، ابدأ مربع البحث باسمه لسهولة التعديل
//             const selectedName = selectedOption ? selectedOption.name : '';
//             setSearchTerm(selectedName); 
//             inputRef.current.focus();
//         } else {
//              // مسح مربع البحث عند الإغلاق إذا لم يكن هناك عنصر محدد
//              if (!selectedOption) {
//                  setSearchTerm('');
//              }
//         }
//     }, [isOpen, selectedOption]);

    
//     // التعامل مع اختيار عنصر
//     const handleSelect = (code) => {
//         onSelect(code);
//         setSearchTerm(''); // مسح البحث بعد الاختيار
//         setIsOpen(false);
//     };

//     return (
//         <div className="relative w-full" ref={wrapperRef}>
//             {/* مربع الإدخال (الزر) */}
//             <button
//                 type="button"
//                 className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm text-right flex justify-between items-center text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 // عند النقر، نعكس حالة الفتح
//                 onClick={() => setIsOpen(!isOpen)} 
//                 aria-haspopup="listbox"
//                 aria-expanded={isOpen}
//             >
//                 {/* عرض اسم الكلية المختارة أو الـ Placeholder */}
//                 <span className="truncate">
//                     {selectedOption ? selectedOption.name : placeholder}
//                 </span>
//                 <span className="text-gray-400 ml-2">{isOpen ? '▲' : '▼'}</span>
//             </button>
            
//             {/* القائمة المنسدلة والبحث */}
//             {isOpen && (
//                 <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-2xl border border-gray-200">
//                     {/* مربع البحث */}
//                     <input
//                         ref={inputRef} // 💡 تطبيق المرجع لخاصية التركيز التلقائي
//                         type="text"
//                         placeholder="ابحث هنا..."
//                         value={searchTerm}
//                         // 💡 هذا هو مفتاح البحث الفوري: تحديث searchTerm عند كل تغيير
//                         onChange={(e) => setSearchTerm(e.target.value)} 
//                         className="w-full p-3 border-b border-gray-200 rounded-t-lg focus:outline-none focus:ring-0 text-right"
//                     />
                    
//                     {/* قائمة الخيارات */}
//                     <ul 
//                         className="max-h-60 overflow-y-auto" 
//                         role="listbox" 
//                         aria-activedescendant={selectedCode}
//                     >
//                         {/* 💡 يتم استخدام filteredOptions الذي يتغير مع كل ضغطة مفتاح */}
//                         {filteredOptions.length > 0 ? (
//                             filteredOptions.map((option) => (
//                                 <li
//                                     key={option.code} 
//                                     className={`p-3 text-right cursor-pointer hover:bg-indigo-50 transition duration-150 ${
//                                         option.code === selectedCode ? 'bg-indigo-100 font-bold text-indigo-700' : 'text-gray-800'
//                                     }`}
//                                     onClick={() => handleSelect(option.code)}
//                                     role="option"
//                                     aria-selected={option.code === selectedCode}
//                                 >
//                                     {option.name}
//                                 </li>
//                             ))
//                         ) : (
//                             <li className="p-3 text-center text-gray-500">لا توجد نتائج مطابقة</li>
//                         )}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };


// // ----------------------------------------------------------------------
// // Hook لجلب بيانات تفاصيل الكلية
// // ----------------------------------------------------------------------

// const useFacultyBreakdownData = (facultyCode) => {
//     const [breakdownData, setBreakdownData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (!facultyCode) {
//             setBreakdownData(null);
//             return;
//         }

//         const fetchBreakdown = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const url = `${FACULTY_BREAKDOWN_API_BASE}/${facultyCode}/breakdown`;
//                 const response = await fetch(url);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const data = await response.json();
                
//                 const totalEmployees = parseInt(data.summary?.totalEmployees) || 0;
//                 const activeEmployees = parseInt(data.summary?.activeEmployees) || 0;

//                 const cleanedData = {
//                     ...data,
//                     departments: data.departments || [],
//                     academicDegrees: data.academicDegrees || [],
//                     summary: {
//                         ...data.summary,
//                         totalEmployees,
//                         activeEmployees,
//                         inactiveEmployees: totalEmployees - activeEmployees
//                     }
//                 };

//                 setBreakdownData(cleanedData);
//             } catch (e) {
//                 setError(`فشل في جلب تفاصيل الكلية (${facultyCode}).`);
//                 console.error("Error fetching faculty breakdown:", e);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBreakdown();
//     }, [facultyCode]);

//     return { breakdownData, loading, error };
// };

// // ----------------------------------------------------------------------
// // Hook لجلب هيكل الكليات
// // ----------------------------------------------------------------------

// const useFacultyStructure = () => {
//     const [faculties, setFaculties] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchFaculties = async () => {
//             try {
//                 const response = await fetch(STRUCTURE_FACULTY_API);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 // هنا نجهز البيانات لـ SearchableSelect باستخدام حقل "code"
//                 setFaculties(data.filter(f => f.name && f.code));
//             } catch (e) {
//                 setError("فشل في جلب قائمة الكليات.");
//                 console.error("Error fetching faculty structure:", e);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFaculties();
//     }, []);

//     return { faculties, loading, error };
// };


// // ----------------------------------------------------------------------
// // Hook لجلب بيانات فجوات الدرجات الأكاديمية
// // ----------------------------------------------------------------------
// const useDegreeGapsData = () => {
//     const [degreeGapsStats, setDegreeGapsStats] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchGaps = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const response = await fetch(DEGREE_GAPS_API_URL);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const data = await response.json();
                
//                 // تنظيف وتجهيز البيانات
//                 const cleanedData = {
//                     gaps: data.gaps || [],
//                     filled: data.filled || [],
//                     summary: {
//                         ...data.summary,
//                         fillRate: parseFloat(data.summary?.fillRate.replace('%', '')) || 0, // تحويل النسبة المئوية إلى رقم
//                         totalPositions: parseInt(data.summary?.totalPositions) || 0,
//                         gapPositions: parseInt(data.summary?.gapPositions) || 0,
//                         filledPositions: parseInt(data.summary?.filledPositions) || 0,
//                     }
//                 };

//                 setDegreeGapsStats(cleanedData);
//             } catch (e) {
//                 setError(`فشل في جلب بيانات فجوات الدرجات.`);
//                 console.error("Error fetching degree gaps:", e);
//                 setDegreeGapsStats(null);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchGaps();
//     }, []);

//     return { degreeGapsStats, loading, error };
// };



// // ----------------------------------------------------------------------
// // Hook لجلب البيانات الأساسية
// // ----------------------------------------------------------------------
// const useStatisticsData = () => {
//     const [stats, setStats] = useState(null);
//     const [facultiesStats, setFacultiesStats] = useState(null);
//     // تم حذف: [departmentsStats, setDepartmentsStats] = useState(null);
//     const [degreesStats, setDegreesStats] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         const fetchStatistics = async () => {
//             setLoading(true);
//             setErrors({});
//             let newErrors = {};

//             const apiUrls = [
//                 { key: 'overview', url: OVERVIEW_API_URL },
//                 { key: 'faculties', url: FACULTIES_API_URL },
//                 // تم حذف: { key: 'departments', url: DEPARTMENTS_API_URL },
//                 { key: 'degrees', url: DEGREES_API_URL },
//             ];
            
//             const results = await Promise.allSettled(
//                 apiUrls.map(api => fetch(api.url).catch(e => ({ status: 'rejected', reason: `API ${api.key} failed: ${e.message}` })))
//             );

//             const processResult = async (result, key) => {
//                 if (result.status === 'fulfilled' && result.value.ok) {
//                     return await result.value.json();
//                 } else {
//                     newErrors[key] = `فشل في جلب بيانات ${key} الأساسية.`;
//                     return null;
//                 }
//             };

//             const overviewData = await processResult(results[0], 'overview');
//             const facultiesData = await processResult(results[1], 'faculties');
//             // تم حذف: departmentsData
//             const degreesData = await processResult(results[2], 'degrees'); // تم تغيير الفهرس
            
//             if (overviewData) {
//                 const cleanedStatusData = overviewData.employeesByStatus
//                     .filter(item => item.count > 0 && item.work_status && item.work_status.length > 1) 
//                     .map(item => ({ name: item.work_status, count: item.count }));
//                 setStats({ ...overviewData, employeesByStatus: cleanedStatusData });
//             }
//             if (facultiesData) {
//                 const cleanedFacultiesData = facultiesData
//                     .filter(f => f.total_employees > 0)
//                     .map(f => ({ ...f, category: classifyFaculty(f.name) }));
//                 setFacultiesStats(cleanedFacultiesData);
//             }
//             // تم حذف: معالجة departmentsData
//             if (degreesData) {
//                 setDegreesStats(degreesData);
//             }
            
//             setErrors(newErrors);
//             setLoading(false);
//         };

//         fetchStatistics();
//     }, []);
    
//     return { stats, facultiesStats, degreesStats, loading, errors }; // تم حذف departmentsStats من الإرجاع
// };

// // ----------------------------------------------------------------------
// // المكون الرئيسي: Statistics Overview
// // ----------------------------------------------------------------------

// const Statistics = () => {
//     // تم حذف: departmentsStats من هنا
//     const { stats, facultiesStats, degreesStats, loading, errors } = useStatisticsData(); 
    
//     // 💡 جلب هيكل الكليات لخاصية التفاصيل
//     const { faculties: structureFaculties, loading: structureLoading, error: structureError } = useFacultyStructure();
    
//     // 🆕 جلب بيانات فجوات الدرجات
//     const { degreeGapsStats, loading: gapsLoading, error: gapsError } = useDegreeGapsData();

//     const hasFatalError = errors.general || errors.overview; 
    
//     const [facultyFilterType, setFacultyFilterType] = useState('all'); 
//     // تم حذف: [departmentFilterType, setDepartmentFilterType]
//     const [degreeFilterType, setDegreeFilterType] = useState('active'); 
    
//     const [selectedView, setSelectedView] = useState('status'); 

    
//     const totalStatusCount = useMemo(() => {
//         if (!stats || !stats.employeesByStatus) return 0;
//         return stats.employeesByStatus.reduce((sum, item) => sum + item.count, 0);
//     }, [stats]);
    
//     const filteredFaculties = useMemo(() => {
//         if (!facultiesStats) return [];
//         if (facultyFilterType === 'all') return facultiesStats;
        
//         return facultiesStats.filter(f => 
//             facultyFilterType === 'كليات البنات/دراسات انسانية'
//             ? f.category === 'كليات البنات/دراسات انسانية'
//             : f.category.includes(facultyFilterType)
//         );
//     }, [facultiesStats, facultyFilterType]);
    
//     // تم حذف: filteredDepartments memo

//     const filteredDegrees = useMemo(() => {
//         if (!degreesStats || !degreesStats.allDegrees) return [];
//         const allDegrees = degreesStats.allDegrees.map(d => ({
//             ...d,
//             total_employees: parseInt(d.total_employees) || 0,
//             active_employees: parseInt(d.active_employees) || 0,
//             inactive_employees: parseInt(d.inactive_employees) || 0,
//         }));
        
//         if (degreeFilterType === 'active') {
//             return allDegrees.filter(d => d.total_employees > 0);
//         }
//         return allDegrees; 
//     }, [degreesStats, degreeFilterType]);


//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-gray-50" dir="rtl">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
//                 <p className="mr-4 text-xl text-indigo-600 font-semibold">جاري تحميل لوحة الإحصائيات...</p>
//             </div>
//         );
//     }

//     if (hasFatalError) {
//         return (
//             <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-xl m-10 text-right" dir="rtl">
//                 <h2 className="text-2xl font-bold mb-3">⚠️ خطأ فادح في الاتصال</h2>
//                 <p className="text-lg">حدث خطأ أثناء جلب **البيانات الرئيسية (الملخص العام)**. يرجى التأكد من اتصال الخادم بهذا الرابط: <code>{OVERVIEW_API_URL}</code></p>
//                 {errors.general && <p className="mt-2 text-sm italic">تفاصيل الخطأ: {errors.general}</p>}
//             </div>
//         );
//     }
    
//     const activeEmployeesCount = parseInt(stats?.activeEmployees) || 0;
//     const totalEmployeesCount = parseInt(stats?.totalEmployees) || 0;
//     const inactiveEmployeesCount = totalEmployeesCount - activeEmployeesCount;

//     const activePercentageValue = (activeEmployeesCount && totalEmployeesCount) 
//         ? ((activeEmployeesCount / totalEmployeesCount) * 100) 
//         : 0;

//     return (
//         <div className="min-h-screen w-[90%] m-auto bg-gray-50 p-6 md:p-12" dir="rtl">
//             <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-right border-b-4 border-indigo-500 pb-3">
//                 لوحة إحصائيات الموارد البشرية 📊
//             </h1>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//                 <BigStatCard 
//                     title="إجمالي عدد الموظفين" 
//                     value={stats?.totalEmployees} 
//                     icon="👥"
//                     color="bg-indigo-600"
//                 />
//                 <BigStatCard 
//                     title="الموظفين النشطين" 
//                     value={stats?.activeEmployees} 
//                     icon="✅"
//                     color="bg-green-600"
//                 />
//                 <BigStatCard 
//                     title="الموظفين غير النشطين" 
//                     value={inactiveEmployeesCount} 
//                     icon="❌"
//                     color="bg-red-600"
//                 />
//                 <BigStatCard 
//                     title="نسبة النشطين" 
//                     value={activePercentageValue} 
//                     icon="📈"
//                     color="bg-yellow-600"
//                     isPercentage={true}
//                 />
//             </div>

//             <ViewSelector selectedView={selectedView} setSelectedView={setSelectedView} />

//             <div className="bg-white shadow-2xl rounded-xl p-8">
                
//                 {errors.faculties && selectedView === 'faculties' && <APIErrorBanner message={errors.faculties} />}
//                 {/* تم حذف: errors.departments */}
//                 {errors.degrees && selectedView === 'degrees' && <APIErrorBanner message={errors.degrees} />} 
//                 {gapsError && selectedView === 'gaps' && <APIErrorBanner message={gapsError} />} 

                
//                 {selectedView === 'status' && (
//                     <StatusView stats={stats} totalStatusCount={totalStatusCount} />
//                 )}

//                 {selectedView === 'faculties' && (
//                     <FacultiesView 
//                         facultiesStats={filteredFaculties} 
//                         filterType={facultyFilterType} 
//                         setFilterType={setFacultyFilterType} 
//                     />
//                 )}
                
//                 {/* تم حذف: DepartmentsView */}
                
//                 {selectedView === 'degrees' && (
//                     <DegreesView 
//                         degreesStats={filteredDegrees} 
//                         summary={degreesStats?.summary}
//                         filterType={degreeFilterType} 
//                         setFilterType={setDegreeFilterType} 
//                     />
//                 )}

//                 {selectedView === 'breakdown' && (
//                     <FacultyBreakdownView
//                         faculties={structureFaculties}
//                         loading={structureLoading}
//                         error={structureError}
//                     />
//                 )}
                
//                 {/* 🆕 عرض فجوات الدرجات */}
//                 {selectedView === 'gaps' && (
//                     <DegreeGapsView
//                         degreeGapsStats={degreeGapsStats}
//                         loading={gapsLoading}
//                         error={gapsError}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// // ----------------------------------------------------------------------
// // 🆕 مكون عرض فجوات الدرجات الأكاديمية
// // ----------------------------------------------------------------------
// const DegreeGapsView = ({ degreeGapsStats, loading, error }) => {
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-48">
//                 <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
//                 <p className="mr-3 text-lg text-indigo-500">جاري تحميل بيانات فجوات الدرجات...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return <APIErrorBanner message={error} />;
//     }
    
//     if (!degreeGapsStats) {
//         return (
//             <p className="text-center text-gray-500 p-4">
//                 تعذر جلب بيانات فجوات الدرجات.
//             </p>
//         );
//     }
    
//     const { summary, gaps, filled } = degreeGapsStats;

//     return (
//         <div className="space-y-12">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">
//                 📉 تحليل فجوات الدرجات الأكاديمية (Degree Gaps)
//             </h2>
            
//             {/* ملخص الفجوات */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <SummaryCard title="إجمالي الوظائف المعتمدة" value={summary.totalPositions} color="bg-indigo-600" />
//                 <SummaryCard title="الوظائف المشغولة" value={summary.filledPositions} color="bg-green-600" />
//                 <SummaryCard title="فجوة الوظائف (الشاغر)" value={summary.gapPositions} color="bg-red-600" />
//                 <SummaryCard 
//                     title="معدل الإشغال (%)" 
//                     value={summary.fillRate} 
//                     color="bg-yellow-600" 
//                     isPercentage={true} // 💡 استخدام الخاصية لعرض القيمة كنسبة
//                 />
//             </div>
            
//             {/* جدول الفجوات (الوظائف الشاغرة) */}
//             <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mt-4 text-red-700">
//                 🔴 الوظائف الشاغرة (فجوات التوظيف)
//             </h3>
//             {gaps.length > 0 ? (
//                 <GapsTable data={gaps} type="gaps" />
//             ) : (
//                 <p className="p-4 bg-green-50 rounded-lg text-green-700 font-semibold">
//                     ✅ لا توجد فجوات توظيف حالياً! (كل الوظائف المعتمدة مشغولة).
//                 </p>
//             )}

//             {/* جدول الوظائف المشغولة */}
//             <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mt-8 text-green-700">
//                 🟢 الوظائف المشغولة فعلياً
//             </h3>
//             {filled.length > 0 ? (
//                 <GapsTable data={filled} type="filled" />
//             ) : (
//                 <p className="p-4 bg-red-50 rounded-lg text-red-700 font-semibold">
//                     ❌ لا توجد وظائف مشغولة حالياً!
//                 </p>
//             )}
            
//         </div>
//     );
// };

// // ----------------------------------------------------------------------
// // 🆕 مكون جدول الفجوات/الوظائف المشغولة
// // ----------------------------------------------------------------------
// const GapsTable = ({ data, type }) => {
//     const [sortConfig, setSortConfig] = useState({ key: 'employee_count', direction: 'descending' });
    
//     const sortedData = useMemo(() => {
//         let sortableItems = [...data];
//         if (sortConfig !== null) {
//             sortableItems.sort((a, b) => {
//                 const aValue = parseInt(a[sortConfig.key]) || 0;
//                 const bValue = parseInt(b[sortConfig.key]) || 0;
                
//                 if (aValue < bValue) {
//                     return sortConfig.direction === 'ascending' ? -1 : 1;
//                 }
//                 if (aValue > bValue) {
//                     return sortConfig.direction === 'ascending' ? 1 : -1;
//                 }
                
//                 // فرز ثانوي حسب اسم الكلية
//                 return a.faculty_name.localeCompare(b.faculty_name);
//             });
//         }
//         return sortableItems;
//     }, [data, sortConfig]);

//     const requestSort = (key) => {
//         let direction = 'ascending';
//         if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//             direction = 'descending';
//         }
//         setSortConfig({ key, direction });
//     };

//     const getSortIcon = (key) => {
//         if (sortConfig.key !== key) return '↕';
//         return sortConfig.direction === 'ascending' ? '▲' : '▼';
//     };

//     const headers = [
//         { key: 'faculty_name', label: 'الكلية' },
//         { key: 'dept_name', label: 'القسم' },
//         { key: 'job_name', label: 'الدرجة الوظيفية' },
//         { key: 'employee_count', label: type === 'gaps' ? 'عدد الشواغر' : 'عدد الموظفين' },
//     ];

//     return (
//         <div className="overflow-x-auto border rounded-xl shadow-lg">
//             <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-100">
//                     <tr>
//                         {headers.map((header) => (
//                             <th
//                                 key={header.key}
//                                 onClick={() => requestSort(header.key)}
//                                 className={`px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right cursor-pointer select-none whitespace-nowrap ${header.key === 'employee_count' ? 'text-center' : ''}`}
//                             >
//                                 <div className="flex items-center space-x-1 space-x-reverse">
//                                     <span className="text-sm">{getSortIcon(header.key)}</span>
//                                     <span>{header.label}</span>
//                                 </div>
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                     {sortedData.map((item, index) => (
//                         <tr key={index} className="hover:bg-indigo-50/50 transition duration-150">
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
//                                 {item.faculty_name}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
//                                 {item.dept_name || 'غير محدد'}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                                 {item.job_name || 'غير محدد'}
//                             </td>
//                             <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-center ${type === 'gaps' ? 'text-red-600' : 'text-green-600'}`}>
//                                 {formatNumber(item.employee_count)}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };


// // ----------------------------------------------------------------------
// // مكون عرض تفاصيل الكلية
// // ----------------------------------------------------------------------
// const FacultyBreakdownView = ({ faculties, loading, error }) => {
//     // حالة الكلية المختارة (افتراضياً، لا توجد كلية مختارة)
//     const [selectedFacultyCode, setSelectedFacultyCode] = useState(null);
    
//     // جلب البيانات التفصيلية للكلية المختارة
//     const { breakdownData, loading: dataLoading, error: dataError } = useFacultyBreakdownData(selectedFacultyCode);
    
//     const selectedFacultyName = useMemo(() => 
//         faculties.find(f => f.code === selectedFacultyCode)?.name || 'الرجاء اختيار كلية', 
//     [faculties, selectedFacultyCode]);
    
//     const handleFacultySelection = (code) => {
//         setSelectedFacultyCode(code);
//     };

//     if (loading) {
//         return <p className="text-center p-4 text-indigo-600">جاري تحميل قائمة الكليات...</p>;
//     }

//     if (error) {
//         return <APIErrorBanner message={error} />;
//     }
    
//     return (
//         <>
//             <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">
//                 🔍 تفاصيل الإحصائيات حسب الكلية
//             </h2>
            
//             <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-inner border">
//                 <p className="text-lg font-semibold text-gray-700 mb-3">
//                     الكلية المختارة حاليًا: <span className="text-indigo-600 font-extrabold">{selectedFacultyName}</span>
//                 </p>
                
//                 {/* استخدام المكون الجديد SearchableSelect */}
//                 <SearchableSelect
//                     options={faculties.map(f => ({ code: f.code, name: f.name }))}
//                     selectedCode={selectedFacultyCode}
//                     onSelect={handleFacultySelection}
//                     placeholder="ابحث واختر الكلية..."
//                 />

//             </div>

//             {/* عرض محتوى الكلية المختارة */}
//             {selectedFacultyCode && dataLoading && (
//                 <div className="flex justify-center items-center h-48">
//                     <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
//                     <p className="mr-3 text-lg text-indigo-500">جاري تحميل تفاصيل الكلية...</p>
//                 </div>
//             )}

//             {selectedFacultyCode && dataError && <APIErrorBanner message={dataError} />}

//             {breakdownData && !dataLoading && (
//                 <FacultyBreakdownContent breakdownData={breakdownData} />
//             )}
            
//             {!selectedFacultyCode && !loading && (
//                  <p className="text-center p-8 text-gray-500 text-xl bg-gray-50 rounded-lg">
//                     الرجاء اختيار كلية من القائمة المنسدلة أعلاه لعرض الإحصائيات التفصيلية.
//                 </p>
//             )}
//         </>
//     );
// };


// // ----------------------------------------------------------------------
// // مكون عرض محتوى التفاصيل الفعلية للكلية
// // ----------------------------------------------------------------------
// const FacultyBreakdownContent = ({ breakdownData }) => {
//     const summary = breakdownData.summary || {};
//     const departments = breakdownData.departments || [];
//     const academicDegrees = breakdownData.academicDegrees || [];
    
//     const totalEmployees = summary.totalEmployees;

//     return (
//         <div className="space-y-10">
            
//             <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mt-4">ملخص الإحصائيات للكلية</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <SummaryCard title="إجمالي الموظفين" value={summary.totalEmployees} color="bg-indigo-500" />
//                 <SummaryCard title="الموظفون النشطون" value={summary.activeEmployees} color="bg-green-500" />
//                 <SummaryCard title="الموظفون غير النشطين" value={summary.inactiveEmployees} color="bg-red-500" />
//                 <SummaryCard title="إجمالي الأقسام" value={summary.totalDepartments} color="bg-yellow-500" />
//             </div>

//             <h3 className="text-xl font-bold text-gray-700 border-b pb-2">تفاصيل إحصائيات الأقسام التابعة للكلية</h3>
//             {departments.length > 0 ? (
//                 <BreakdownDepartmentsTable data={departments} />
//             ) : (
//                 <p className="p-4 bg-gray-100 rounded-lg text-gray-500">لا توجد بيانات أقسام للعرض في هذه الكلية.</p>
//             )}

//             <h3 className="text-xl font-bold text-gray-700 border-b pb-2">تفاصيل الدرجات الأكاديمية بالكلية</h3>
//             {academicDegrees.length > 0 ? (
//                  <DegreesTable data={academicDegrees} totalEmployees={totalEmployees} isBreakdown={true} />
//             ) : (
//                 <p className="p-4 bg-gray-100 rounded-lg text-gray-500">لا توجد بيانات درجات أكاديمية للعرض في هذه الكلية.</p>
//             )}
//         </div>
//     );
// };


// // ----------------------------------------------------------------------
// // مكون جدول الأقسام في عرض تفاصيل الكلية (تم الاحتفاظ به لأن الكلية تحتوي على أقسام)
// // ----------------------------------------------------------------------
// const BreakdownDepartmentsTable = ({ data }) => {
//     const sortedData = useMemo(() => {
//         return [...data].sort((a, b) => b.total_employees - a.total_employees);
//     }, [data]);

//     return (
//         <div className="overflow-x-auto border rounded-xl shadow-lg">
//             <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-100">
//                     <tr>
//                         <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">القسم</th>
//                         <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">إجمالي الموظفين</th>
//                         <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">نشط حالياً</th>
//                         <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">نسبة النشطين</th>
//                     </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                     {sortedData.map((dept) => {
//                          const total = parseInt(dept.total_employees) || 0;
//                          const active = parseInt(dept.active_employees) || 0;
//                          const percentage = total > 0 ? ((active / total) * 100).toFixed(1) : '0.0';
//                         return (
//                         <tr key={dept.dept_code} className="hover:bg-indigo-50/50 transition duration-150">
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
//                                 {dept.name}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold text-right">
//                                 {formatNumber(total)}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold text-right">
//                                 {formatNumber(active)}
//                             </td>
//                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 text-right">
//                                 {percentage}%
//                             </td>
//                         </tr>
//                     )})}
//                 </tbody>
//             </table>
//         </div>
//     );
// };



// const APIErrorBanner = ({ message }) => (
//     <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-right" dir="rtl">
//         <h3 className="text-xl font-bold mb-2">⚠️ خطأ في جلب البيانات الجزئية</h3>
//         <p>{message} سيتم عرض البيانات إن وجدت، أو يرجى المحاولة لاحقاً.</p>
//     </div>
// );

// const ViewSelector = ({ selectedView, setSelectedView }) => {
//     const baseStyle = "px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none";
//     const activeStyle = "bg-white text-indigo-700 border-b-4 border-indigo-500 shadow-t-lg";
//     const inactiveStyle = "bg-gray-100 text-gray-600 hover:bg-gray-200 border-b-2 border-gray-300";

//     const getStyle = (view) => 
//         selectedView === view ? activeStyle : inactiveStyle;

//     return (
//         <div className="flex justify-start mb-0 border-b-2 border-gray-200 overflow-x-auto" dir="rtl">
//             <button
//                 onClick={() => setSelectedView('status')}
//                 className={`${baseStyle} ${getStyle('status')} cursor-pointer`}
//             >
//                 حالة العمل
//             </button>
//             <button
//                 onClick={() => setSelectedView('faculties')}
//                 className={`${baseStyle} ${getStyle('faculties')} cursor-pointer`}
//             >
//                 إحصائيات الكليات
//             </button>
//              {/* تم حذف: زر إحصائيات الأقسام */}
//              <button
//                 onClick={() => setSelectedView('degrees')}
//                 className={`${baseStyle} ${getStyle('degrees')} cursor-pointer`}
//             >
//                 الدرجات الوظيفية
//             </button>
//             <button
//                 onClick={() => setSelectedView('breakdown')}
//                 className={`${baseStyle} ${getStyle('breakdown')} cursor-pointer`}
//             >
//                 تفاصيل الكلية 🔍
//             </button>
//              {/* 🆕 زر عرض فجوات الدرجات */}
//             <button
//                 onClick={() => setSelectedView('gaps')}
//                 className={`${baseStyle} ${getStyle('gaps')} whitespace-nowrap cursor-pointer`}
//             >
//                 فجوات الدرجات 📉
//             </button>
            
//         </div>
//     );
// };

// const StatusRow = ({ status, count, totalCount }) => {
//     const percentage = totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : 0;
    
//     const getBarColor = (statusName) => {
//         if (statusName.includes('قائم بالعمل') || statusName.includes('نشط') || statusName.includes('متفرغ')) return 'bg-green-500';
//         if (statusName.includes('خروج') || statusName.includes('وفاه') || statusName.includes('انتهاء')) return 'bg-red-500';
//         if (statusName.includes('إعارة') || statusName.includes('اجازه') || statusName.includes('ايقاف')) return 'bg-yellow-500';
//         return 'bg-indigo-500';
//     };

//     return (
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-white transition duration-200">
//             <div className="flex justify-between items-center mb-2">
//                 <span className="text-base font-semibold text-gray-800 text-right">{status}</span>
//                 <div className="flex items-center space-x-2 space-x-reverse">
//                     <span className="text-lg font-extrabold text-gray-900">{formatNumber(count)}</span>
//                     <span className="text-sm font-medium text-indigo-600">
//                         ({percentage}%)
//                     </span>
//                 </div>
//             </div>
            
//             <div className="w-full bg-gray-200 rounded-full h-3.5">
//                 <div 
//                     className={`${getBarColor(status)} h-3.5 rounded-full transition-all duration-700 ease-out`}
//                     style={{ width: `${percentage}%` }}
//                 ></div>
//             </div>
//         </div>
//     );
// };

// const StatusView = ({ stats, totalStatusCount }) => (
//     <>
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">
//             توزيع الموظفين حسب حالة العمل
//         </h2>
        
//         <div className="space-y-4">
//             {stats?.employeesByStatus
//                 .sort((a, b) => b.count - a.count)
//                 .map((statusItem, index) => (
//                     <StatusRow 
//                         key={index} 
//                         status={statusItem.name} 
//                         count={statusItem.count}
//                         totalCount={totalStatusCount}
//                     />
//                 ))}
//         </div>
//     </>
// );

// const FacultiesTable = ({ data }) => {
//     const [sortConfig, setSortConfig] = useState({ key: 'total_employees', direction: 'descending' });
    
//     const sortedData = useMemo(() => {
//         let sortableItems = [...data];
//         if (sortConfig !== null) {
//             sortableItems.sort((a, b) => {
//                 const isNumberField = ['total_employees', 'active_employees', 'inactive_employees', 'temporarily_away'].includes(sortConfig.key);
//                 const aValue = isNumberField ? parseInt(a[sortConfig.key]) : a[sortConfig.key];
//                 const bValue = isNumberField ? parseInt(b[sortConfig.key]) : b[sortConfig.key];
                
//                 if (aValue < bValue) {
//                     return sortConfig.direction === 'ascending' ? -1 : 1;
//                 }
//                 if (aValue > bValue) {
//                     return sortConfig.direction === 'ascending' ? 1 : -1;
//                 }
//                 return 0;
//             });
//         }
//         return sortableItems;
//     }, [data, sortConfig]);

//     const requestSort = (key) => {
//         let direction = 'ascending';
//         if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//             direction = 'descending';
//         }
//         setSortConfig({ key, direction });
//     };

//     const getSortIcon = (key) => {
//         if (sortConfig.key !== key) return '↕';
//         return sortConfig.direction === 'ascending' ? '▲' : '▼';
//     };

//     const headers = [
//         { key: 'name', label: 'الكلية/الوحدة' },
//         { key: 'total_employees', label: 'إجمالي الموظفين' },
//         { key: 'active_employees', label: 'نشط حالياً' },
//         { key: 'inactive_employees', label: 'خارج الخدمة' },
//         { key: 'temporarily_away', label: 'غائب مؤقتاً' },
//     ];

//     return (
//         <div className="overflow-x-auto border rounded-xl shadow-lg">
//             <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-100">
//                     <tr>
//                         {headers.map((header) => (
//                             <th
//                                 key={header.key}
//                                 onClick={() => requestSort(header.key)}
//                                 className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right cursor-pointer select-none whitespace-nowrap"
//                             >
//                                 <div className="flex  items-center space-x-1 space-x-reverse">
//                                     <span className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{getSortIcon(header.key)}</span>
//                                     <span>{header.label}</span>
//                                 </div>
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                     {sortedData.map((faculty) => (
//                         <tr key={faculty.code} className="hover:bg-indigo-50/50 transition duration-150">
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
//                                 {faculty.name}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold text-center">
//                                 {formatNumber(faculty.total_employees)}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold text-center">
//                                 {formatNumber(faculty.active_employees)}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium text-center">
//                                 {formatNumber(faculty.inactive_employees)}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium text-center">
//                                 {formatNumber(faculty.temporarily_away)}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// const FacultiesView = ({ facultiesStats, filterType, setFilterType }) => {
//     const filterOptions = [
//         { value: 'all', label: 'جميع الكليات والوحدات' },
//         { value: 'القاهرة والوجه البحري', label: 'كليات القاهرة والوجه البحري' },
//         { value: 'الوجه البحري والدلتا', label: 'كليات الوجه البحري والدلتا' },
//         { value: 'الصعيد', label: 'كليات الصعيد' },
//         { value: 'كليات البنات/دراسات انسانية', label: 'كليات البنات/دراسات انسانية' },
//         { value: 'مراكز ووحدات متخصصة', label: 'مراكز ووحدات متخصصة' },
//     ];

//     return (
//         <>
//             <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">
//                 📊 إحصائيات الموظفين حسب الكلية/الوحدة
//             </h2>
            
//             <div className="mb-6 flex justify-end items-center">
//                 <label htmlFor="faculty-filter" className="ml-3 text-lg font-medium text-gray-700">تصفية حسب المنطقة:</label>
//                 <select
//                     id="faculty-filter"
//                     value={filterType}
//                     onChange={(e) => setFilterType(e.target.value)}
//                     className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
//                 >
//                     {filterOptions.map(option => (
//                         <option key={option.value} value={option.value}>{option.label}</option>
//                     ))}
//                 </select>
//             </div>

//             {facultiesStats.length > 0 ? (
//                 <FacultiesTable data={facultiesStats} />
//             ) : (
//                 <p className="text-center text-gray-500 p-4">لا توجد بيانات كليات مطابقة لفلتر **{filterType}**.</p>
//             )}
//         </>
//     );
// };

// // تم حذف: DepartmentsTable و DepartmentsView

// const DegreesTable = ({ data, totalEmployees, isBreakdown = false }) => {
//     const [sortConfig, setSortConfig] = useState({ key: 'total_employees', direction: 'descending' });
    
//     const sortedData = useMemo(() => {
//         let sortableItems = [...data].map(d => ({
//             ...d,
//             total_employees: parseInt(d.total_employees) || 0,
//             active_employees: parseInt(d.active_employees) || 0,
//             inactive_employees: parseInt(d.inactive_employees) || (parseInt(d.total_employees) || 0) - (parseInt(d.active_employees) || 0)
//         }));
        
//         if (sortConfig !== null) {
//             sortableItems.sort((a, b) => {
//                 let aValue, bValue;
                
//                 if (sortConfig.key === 'percentage') {
//                     aValue = totalEmployees > 0 ? (a.total_employees / totalEmployees) * 100 : 0;
//                     bValue = totalEmployees > 0 ? (b.total_employees / totalEmployees) * 100 : 0;
//                 } else {
//                     const isNumberField = ['total_employees', 'active_employees', 'inactive_employees'].includes(sortConfig.key);
//                     aValue = isNumberField ? a[sortConfig.key] : a[sortConfig.key];
//                     bValue = isNumberField ? b[sortConfig.key] : b[sortConfig.key];
//                 }
                
//                 if (aValue < bValue) {
//                     return sortConfig.direction === 'ascending' ? -1 : 1;
//                 }
//                 if (aValue > bValue) {
//                     return sortConfig.direction === 'ascending' ? 1 : -1;
//                 }
//                 return 0;
//             });
//         }
//         return sortableItems;
//     }, [data, totalEmployees, sortConfig]);

//     const requestSort = (key) => {
//         let direction = 'ascending';
//         if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//             direction = 'descending';
//         }
//         setSortConfig({ key, direction });
//     };

//     const getSortIcon = (key) => {
//         if (sortConfig.key !== key) return '↕';
//         return sortConfig.direction === 'ascending' ? '▲' : '▼';
//     };

//     const headers = [
//         { key: 'job_name', label: 'الدرجة الوظيفية' }, 
//         { key: 'total_employees', label: 'إجمالي الموظفين' },
//         { key: 'active_employees', label: 'نشط حالياً' },
//         { key: 'inactive_employees', label: 'خارج الخدمة' },
//         { key: 'percentage', label: isBreakdown ? 'النسبة من إجمالي الكلية/القسم' : 'النسبة من الإجمالي العام' },
//     ];

//     return (
//         <div className="overflow-x-auto border rounded-xl shadow-lg">
//             <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-100">
//                     <tr>
//                         {headers.map((header) => (
//                             <th
//                                 key={header.key}
//                                 onClick={() => requestSort(header.key)}
//                                 className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right cursor-pointer select-none whitespace-nowrap"
//                             >
//                                 <div className="flex  items-center space-x-1 space-x-reverse">
//                                     <span className="text-sm">{getSortIcon(header.key)}</span>
//                                     <span>{header.label}</span>
//                                 </div>
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                     {sortedData.map((degree) => {
//                         const total = degree.total_employees;
//                         const inactive = degree.inactive_employees;
//                         const active = degree.active_employees;

//                         const percentage = totalEmployees > 0 ? ((total / totalEmployees) * 100).toFixed(1) : 0;
//                         return (
//                         <tr key={degree.job_code} className="hover:bg-indigo-50/50 transition duration-150">
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
//                                 {degree.job_name || 'غير محدد'}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold text-right">
//                                 {formatNumber(total)}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold text-right">
//                                 {formatNumber(active)}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium text-right">
//                                 {formatNumber(inactive)}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 text-right">
//                                 {total > 0 ? `${percentage}%` : '0.0%'}
//                             </td>
//                         </tr>
//                     )})}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// const DegreesView = ({ degreesStats, summary, filterType, setFilterType }) => {
//     const totalEmployeesInDegrees = useMemo(() => {
//         if (!degreesStats) return 0;
//         return degreesStats.reduce((sum, item) => sum + item.total_employees, 0);
//     }, [degreesStats]);


//     const filterOptions = [
//         { value: 'all', label: 'عرض جميع الدرجات الوظيفية' },
//         { value: 'active', label: 'عرض الدرجات التي بها موظفون فقط' },
//     ];
    
//     // التحقق من توفر البيانات قبل العرض
//     const hasData = degreesStats && degreesStats.length > 0;


//     return (
//         <>
//             <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">
//                 🎓 إحصائيات الدرجات الوظيفية لأعضاء هيئة التدريس
//             </h2>
            
//             {hasData ? (
//                 <>
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
//                         <SummaryCard title="إجمالي أنواع الدرجات" value={summary?.totalDegreeTypes} color="bg-indigo-500" />
//                         <SummaryCard title="درجات بها موظفون" value={summary?.degreesWithEmployees} color="bg-green-500" />
//                         <SummaryCard title="درجات بدون موظفين" value={summary?.degreesWithoutEmployees} color="bg-red-500" />
//                     </div>

//                     <div className="mb-6 flex justify-end items-center">
//                         <label htmlFor="degree-filter" className="ml-3 text-lg font-medium text-gray-700">نوع العرض:</label>
//                         <select
//                             id="degree-filter"
//                             value={filterType}
//                             onChange={(e) => setFilterType(e.target.value)}
//                             className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base max-w-lg min-w-[300px]"
//                         >
//                             {filterOptions.map(option => (
//                                 <option key={option.value} value={option.value}>{option.label}</option>
//                             ))}
//                         </select>
//                     </div>
//                     <DegreesTable data={degreesStats} totalEmployees={totalEmployeesInDegrees} /> 
//                 </>
//             ) : (
//                 <p className="text-center text-gray-500 p-4">
//                     لا توجد بيانات للدرجات الوظيفية للعرض حالياً. 
//                     يرجى التحقق من الرسالة التحذيرية في الأعلى التي تشير إلى فشل في جلب البيانات من الخادم.
//                 </p>
//             )}
//         </>
//     );
// };


// const BigStatCard = ({ title, value, icon, color, isPercentage = false }) => {
//     const textColor = color.replace('bg-', 'text-');
    
//     return (
//         <div className={`p-5 bg-white text-gray-800 rounded-xl shadow-xl flex flex-col justify-between h-36 transform hover:shadow-2xl transition duration-300 ease-in-out border border-gray-100`}>
//             <div className="flex justify-between items-start">
//                 <span className={`text-4xl ${textColor}`}>{icon}</span>
//                 <p className="text-sm font-semibold text-gray-600 text-right leading-snug">{title}</p>
//             </div>
            
//             <CountUpAnimation 
//                 endValue={value} 
//                 isPercentage={isPercentage} 
//             />
//         </div>
//     );
// };

// const SummaryCard = ({ title, value, color, isPercentage = false }) => (
//     <div className={`p-4 ${color} text-white rounded-lg shadow-md text-right`}>
//         <p className="text-base font-medium opacity-95">{title}</p>
//         <h3 className="text-3xl font-bold mt-1">
//             {isPercentage ? `${formatNumber(value)}%` : formatNumber(value)}
//         </h3>
//     </div>
// );


// export default Statistics;























// src/pages/Statistics.jsx
// import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

// /**
//  * Statistics.jsx
//  * ملف واحد يحتوي مكونات لوحة الإحصائيات + فجوات الدرجات + خدمات مساعدة
//  *
//  * تحسينات مضافة:
//  * - بحث قابل للبحث مع debounce
//  * - تحميل بيانات مع معالجة أخطاء محسنة
//  * - زر لتصدير جدول الفجوات إلى CSV
//  * - تحسينات في العرض والطباعة
//  *
//  * انسخ الملف كما هو في مشروعك.
//  */

// /* ============================
//    عناوين API (اضبطها عند الحاجة)
//    ============================ */
// const OVERVIEW_API_URL = 'https://university.roboeye-tec.com/statistics/overview';
// const FACULTIES_API_URL = 'https://university.roboeye-tec.com/statistics/faculties';
// const DEGREES_API_URL = 'https://university.roboeye-tec.com/statistics/academic-degrees';
// const STRUCTURE_FACULTY_API = 'https://university.roboeye-tec.com/structure/faculty';
// const FACULTY_BREAKDOWN_API_BASE = 'https://university.roboeye-tec.com/statistics/faculty';
// const DEGREE_GAPS_API_URL = 'https://university.roboeye-tec.com/statistics/degree-gaps';

// /* ============================
//    دوال مساعدة عامة
//    ============================ */
// const formatNumber = (value) => {
//   if (value === null || value === undefined || value === '') return '0';
//   if (typeof value === 'number') return value.toLocaleString('en-US');
//   const n = parseFloat(value);
//   if (isNaN(n)) return String(value);
//   // لا نخسر الكسور اذا كانت مهمة
//   if (!Number.isInteger(n)) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
//   return n.toLocaleString('en-US');
// };

// const safeParseInt = (v, fallback = 0) => {
//   const n = parseInt(v);
//   return isNaN(n) ? fallback : n;
// };

// const classifyFaculty = (name = '') => {
//   if (name.includes('القاهره')) return 'القاهرة والوجه البحري';
//   if (name.includes('اسيوط') || name.includes('سوهاج') || name.includes('قنا') || name.includes('اسوان')) return 'الصعيد';
//   if (name.includes('المنصوره') || name.includes('الزقازيق') || name.includes('المنوفيه') || name.includes('طنطا') || name.includes('دمياط') || name.includes('دمنهور') || name.includes('الاسكندريه')) return 'الوجه البحري والدلتا';
//   if (name.includes('بنات') || name.includes('انسانيه') || name.includes('اسلامية وعربية بنات')) return 'كليات البنات/دراسات انسانية';
//   return 'مراكز ووحدات متخصصة';
// };

// /* ============================
//    CountUpAnimation (عداد رقمي بسيط)
//    ============================ */
// const CountUpAnimation = ({ endValue = 0, duration = 600, isPercentage = false }) => {
//   const finalNumber = parseFloat(endValue) || 0;
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let rafId = null;
//     let start = null;
//     if (finalNumber === 0) {
//       setCount(0);
//       return;
//     }
//     const step = (ts) => {
//       if (!start) start = ts;
//       const progress = Math.min((ts - start) / duration, 1);
//       setCount(progress * finalNumber);
//       if (progress < 1) rafId = requestAnimationFrame(step);
//     };
//     rafId = requestAnimationFrame(step);
//     return () => cancelAnimationFrame(rafId);
//   }, [finalNumber, duration]);

//   const display = isPercentage ? `${count.toFixed(count < 100 ? 2 : 0)}%` : formatNumber(Math.round(count));
//   return <h3 className="text-3xl font-extrabold text-right mt-2">{display}</h3>;
// };

// /* ============================
//    Debounce hook بسيط
//    ============================ */
// const useDebounce = (value, delay = 300) => {
//   const [deb, setDeb] = useState(value);
//   useEffect(() => {
//     const t = setTimeout(() => setDeb(value), delay);
//     return () => clearTimeout(t);
//   }, [value, delay]);
//   return deb;
// };

// /* ============================
//    SearchableSelect (قابل للبحث) مع تحسينات
//    ============================ */
// const SearchableSelect = ({ options = [], selectedCode = null, onSelect = () => {}, placeholder = 'اختر...' }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [term, setTerm] = useState('');
//   const debTerm = useDebounce(term, 200);
//   const ref = useRef(null);
//   const inputRef = useRef(null);

//   const selectedOption = useMemo(() => options.find(o => o.code === selectedCode) || null, [options, selectedCode]);

//   useEffect(() => {
//     function outside(e) {
//       if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
//     }
//     document.addEventListener('mousedown', outside);
//     return () => document.removeEventListener('mousedown', outside);
//   }, []);

//   useEffect(() => {
//     if (isOpen && inputRef.current) inputRef.current.focus();
//     if (!isOpen) setTerm('');
//   }, [isOpen]);

//   const filtered = useMemo(() => {
//     if (!debTerm) return options;
//     const q = debTerm.trim().toLowerCase();
//     return options.filter(o => (o.name || '').toLowerCase().includes(q));
//   }, [options, debTerm]);

//   return (
//     <div ref={ref} className="relative w-full">
//       <button
//         type="button"
//         onClick={() => setIsOpen(s => !s)}
//         className="w-full p-3 flex justify-between items-center bg-white border border-gray-300 rounded-lg shadow-sm text-right"
//       >
//         <span className="truncate">{selectedOption ? selectedOption.name : placeholder}</span>
//         <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
//       </button>

//       {isOpen && (
//         <div className="absolute z-30 w-full mt-1 bg-white rounded-lg shadow-xl border">
//           <div className="p-2">
//             <input
//               ref={inputRef}
//               value={term}
//               onChange={(e) => setTerm(e.target.value)}
//               placeholder="ابحث هنا..."
//               className="w-full p-2 border rounded text-right"
//             />
//           </div>
//           <ul className="max-h-56 overflow-auto">
//             {filtered.length === 0 ? (
//               <li className="p-3 text-center text-gray-500">لا توجد نتائج</li>
//             ) : (
//               filtered.map(o => (
//                 <li
//                   key={o.code}
//                   onClick={() => { onSelect(o.code); setIsOpen(false); }}
//                   className={`p-3 cursor-pointer hover:bg-indigo-50 text-right ${o.code === selectedCode ? 'bg-indigo-100 font-bold text-indigo-700' : ''}`}
//                 >
//                   {o.name}
//                 </li>
//               ))
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ============================
//    Hooks لجلب البيانات
//    ============================ */

// const useFacultyStructure = () => {
//   const [faculties, setFaculties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const res = await fetch(STRUCTURE_FACULTY_API);
//         if (!res.ok) throw new Error(`Status ${res.status}`);
//         const data = await res.json();
//         if (!mounted) return;
//         // احتفظ فقط بالعناصر التي تحتوي على اسم وكود
//         setFaculties(Array.isArray(data) ? data.filter(d => d.name && d.code) : []);
//       } catch (e) {
//         if (!mounted) return;
//         setError('فشل في جلب هيكل الكليات.');
//         console.error(e);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, []);
//   return { faculties, loading, error };
// };

// const useDegreeGapsData = () => {
//   const [degreeGapsStats, setDegreeGapsStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(DEGREE_GAPS_API_URL);
//         if (!res.ok) throw new Error(`Status ${res.status}`);
//         const data = await res.json();
//         if (!mounted) return;
//         // تجهيز البيانات بإعتبار احتمال غياب الحقول
//         const cleaned = {
//           gaps: Array.isArray(data.gaps) ? data.gaps : [],
//           filled: Array.isArray(data.filled) ? data.filled : [],
//           summary: {
//             totalPositions: safeParseInt(data.summary?.totalPositions, 0),
//             filledPositions: safeParseInt(data.summary?.filledPositions, 0),
//             gapPositions: safeParseInt(data.summary?.gapPositions, 0),
//             fillRate: (typeof data.summary?.fillRate === 'string') ? data.summary.fillRate.replace('%', '') : (data.summary?.fillRate || 0)
//           }
//         };
//         setDegreeGapsStats(cleaned);
//       } catch (e) {
//         if (!mounted) return;
//         console.error(e);
//         setError('فشل في جلب بيانات فجوات الدرجات.');
//         setDegreeGapsStats(null);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, []);

//   return { degreeGapsStats, loading, error };
// };

// const useStatisticsData = () => {
//   const [stats, setStats] = useState(null);
//   const [facultiesStats, setFacultiesStats] = useState([]);
//   const [degreesStats, setDegreesStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       setErrors({});
//       try {
//         // نجلب الثلاث endpoints بالتوازي
//         const [ovRes, facRes, degRes] = await Promise.allSettled([
//           fetch(OVERVIEW_API_URL),
//           fetch(FACULTIES_API_URL),
//           fetch(DEGREES_API_URL)
//         ]);

//         const newErrors = {};
//         // overview
//         if (ovRes.status === 'fulfilled' && ovRes.value.ok) {
//           const ov = await ovRes.value.json();
//           // تنظيف بيانات الحالة
//           const statuses = Array.isArray(ov.employeesByStatus) ? ov.employeesByStatus
//             .filter(it => it.count > 0 && it.work_status)
//             .map(it => ({ name: it.work_status, count: it.count })) : [];
//           if (mounted) setStats({ ...ov, employeesByStatus: statuses });
//         } else {
//           newErrors.overview = 'فشل في جلب الملخص العام.';
//         }

//         // faculties
//         if (facRes.status === 'fulfilled' && facRes.value.ok) {
//           const facs = await facRes.value.json();
//           const cleaned = (Array.isArray(facs) ? facs : []).filter(f => safeParseInt(f.total_employees) > 0).map(f => ({ ...f, category: classifyFaculty(f.name) }));
//           if (mounted) setFacultiesStats(cleaned);
//         } else {
//           newErrors.faculties = 'فشل في جلب بيانات الكليات.';
//         }

//         // degrees
//         if (degRes.status === 'fulfilled' && degRes.value.ok) {
//           const deg = await degRes.value.json();
//           if (mounted) setDegreesStats(deg);
//         } else {
//           newErrors.degrees = 'فشل في جلب بيانات الدرجات.';
//         }

//         if (mounted) setErrors(newErrors);
//       } catch (e) {
//         console.error(e);
//         if (mounted) setErrors(prev => ({ ...prev, general: 'خطأ غير متوقع أثناء جلب البيانات.' }));
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, []);

//   return { stats, facultiesStats, degreesStats, loading, errors };
// };

// /* ============================
//    Components: Gaps view و جدول الفجوات
//    تحسين: زر تحميل CSV + إمكانية تجميع حسب الكلية (groupByFaculty)
//    ============================ */

// /** تحويل مصفوفة إلى CSV والبدء بتحميله */
// const downloadCSV = (rows = [], filename = 'export.csv') => {
//   if (!rows || rows.length === 0) return;
//   const headers = Object.keys(rows[0]);
//   const csv = [
//     headers.join(','),
//     ...rows.map(r => headers.map(h => {
//       const cell = r[h] === null || r[h] === undefined ? '' : String(r[h]).replace(/"/g, '""');
//       return `"${cell}"`;
//     }).join(','))
//   ].join('\n');

//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = filename;
//   a.click();
//   URL.revokeObjectURL(url);
// };

// /* جدول الفجوات — تحسينات: فرز، تجميع، تصدير CSV */
// const GapsTable = ({ data = [], type = 'gaps', groupByFaculty = false }) => {
//   const [sortConfig, setSortConfig] = useState({ key: 'employee_count', direction: 'desc' });
//   const [search, setSearch] = useState('');
//   const debSearch = useDebounce(search, 200);

//   // تجهيز بيانات: تحويل القيم الرقمية
//   const normalized = useMemo(() => {
//     return data.map(item => ({
//       ...item,
//       employee_count: safeParseInt(item.employee_count, 0),
//       faculty_name: item.faculty_name || 'غير محدد',
//       dept_name: item.dept_name || '',
//       job_name: item.job_name || '',
//     }));
//   }, [data]);

//   // فلترة البحث
//   const filtered = useMemo(() => {
//     if (!debSearch) return normalized;
//     const q = debSearch.trim().toLowerCase();
//     return normalized.filter(it =>
//       (it.faculty_name || '').toLowerCase().includes(q) ||
//       (it.dept_name || '').toLowerCase().includes(q) ||
//       (it.job_name || '').toLowerCase().includes(q)
//     );
//   }, [normalized, debSearch]);

//   // تجميع حسب الكلية (اختياري) — سنعرض تعداد الشواغر/الموظفين لكل كلية كصف قابل للتوسيع
//   const grouped = useMemo(() => {
//     if (!groupByFaculty) return null;
//     const map = new Map();
//     filtered.forEach(it => {
//       const key = it.faculty_name || 'غير محدد';
//       if (!map.has(key)) map.set(key, []);
//       map.get(key).push(it);
//     });
//     // تصنيف حسب مجموع employee_count تنازلياً
//     const arr = Array.from(map.entries()).map(([faculty, items]) => {
//       const total = items.reduce((s, x) => s + (x.employee_count || 0), 0);
//       return { faculty, total, items };
//     }).sort((a, b) => b.total - a.total);
//     return arr;
//   }, [filtered, groupByFaculty]);

//   // فرز قائمة (أو عناصر المجموعة)
//   const sorted = useMemo(() => {
//     const comparator = (a, b) => {
//       const av = a[sortConfig.key] ?? 0;
//       const bv = b[sortConfig.key] ?? 0;
//       if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
//       if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
//       // tie-break by faculty
//       return (a.faculty_name || '').localeCompare(b.faculty_name || '');
//     };
//     if (groupByFaculty && grouped) {
//       // sort groups by total (already sorted) and sort items inside each group
//       return grouped.map(g => ({
//         ...g,
//         items: [...g.items].sort(comparator),
//       }));
//     }
//     return [...filtered].sort(comparator);
//   }, [filtered, grouped, sortConfig, groupByFaculty]);

//   const requestSort = (key) => {
//     setSortConfig(prev => {
//       if (prev.key === key) return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
//       return { key, direction: 'desc' };
//     });
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return '↕';
//     return sortConfig.direction === 'asc' ? '▲' : '▼';
//   };

//   // تنزيل CSV: إذا grouped فعادة نريد تفصيل العناصر
//   const handleExport = () => {
//     if (groupByFaculty && sorted && Array.isArray(sorted)) {
//       // نفك التجميع لإخراج CSV مفصل
//       const rows = [];
//       sorted.forEach(group => {
//         group.items.forEach(it => {
//           rows.push({
//             faculty_name: it.faculty_name,
//             dept_name: it.dept_name,
//             job_name: it.job_name,
//             employee_count: it.employee_count
//           });
//         });
//       });
//       if (rows.length === 0) return alert('لا توجد بيانات للتصدير');
//       downloadCSV(rows, `${type === 'gaps' ? 'gaps' : 'filled'}-export.csv`);
//     } else {
//       if (!filtered || filtered.length === 0) return alert('لا توجد بيانات للتصدير');
//       downloadCSV(filtered.map(it => ({
//         faculty_name: it.faculty_name, dept_name: it.dept_name, job_name: it.job_name, employee_count: it.employee_count
//       })), `${type === 'gaps' ? 'gaps' : 'filled'}-export.csv`);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="بحث داخل الجدول (كلية / قسم / وظيفة)"
//             className="p-2 border rounded w-80 text-right"
//           />
//           <label className="flex items-center gap-2 text-sm">
//             <input type="checkbox" onChange={(e) => { /* handled above by prop, but kept for UI */ }} />
//             تجميع حسب الكلية (عرض مُجمّع)
//           </label>
//         </div>

//         <div className="flex items-center gap-2">
//           <button onClick={handleExport} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
//             ⤓ تصدير CSV
//           </button>
//           <button onClick={() => {
//             // طباعة الجزء
//             window.print();
//           }} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">
//             🖨️ طباعة
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto border rounded-xl shadow-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th onClick={() => requestSort('faculty_name')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right cursor-pointer">الكلية {getSortIcon('faculty_name')}</th>
//               <th onClick={() => requestSort('dept_name')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right cursor-pointer">القسم {getSortIcon('dept_name')}</th>
//               <th onClick={() => requestSort('job_name')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right cursor-pointer">الدرجة الوظيفية {getSortIcon('job_name')}</th>
//               <th onClick={() => requestSort('employee_count')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-center cursor-pointer"> {type === 'gaps' ? 'عدد الشواغر' : 'عدد الموظفين'} {getSortIcon('employee_count')}</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {groupByFaculty && Array.isArray(sorted) ? (
//               sorted.map((group, gi) => (
//                 <React.Fragment key={gi}>
//                   <tr className="bg-indigo-50">
//                     <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">{group.faculty}</td>
//                     <td className="px-6 py-3 text-sm text-gray-700 text-right">—</td>
//                     <td className="px-6 py-3 text-sm text-gray-700 text-right">مجمّع</td>
//                     <td className="px-6 py-3 text-sm font-bold text-center text-indigo-700">{formatNumber(group.total)}</td>
//                   </tr>
//                   {group.items.map((it, idx) => (
//                     <tr key={idx} className="hover:bg-indigo-50/50">
//                       <td className="px-6 py-3 text-sm text-gray-900 text-right">{it.faculty_name}</td>
//                       <td className="px-6 py-3 text-sm text-gray-700 text-right">{it.dept_name || 'غير محدد'}</td>
//                       <td className="px-6 py-3 text-sm text-gray-500 text-right">{it.job_name || 'غير محدد'}</td>
//                       <td className={`px-6 py-3 text-sm font-bold text-center ${type === 'gaps' ? 'text-red-600' : 'text-green-600'}`}>{formatNumber(it.employee_count)}</td>
//                     </tr>
//                   ))}
//                 </React.Fragment>
//               ))
//             ) : (
//               sorted.map((it, idx) => (
//                 <tr key={idx} className="hover:bg-indigo-50/50">
//                   <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">{it.faculty_name}</td>
//                   <td className="px-6 py-3 text-sm text-gray-700 text-right">{it.dept_name || 'غير محدد'}</td>
//                   <td className="px-6 py-3 text-sm text-gray-500 text-right">{it.job_name || 'غير محدد'}</td>
//                   <td className={`px-6 py-3 text-sm font-bold text-center ${type === 'gaps' ? 'text-red-600' : 'text-green-600'}`}>{formatNumber(it.employee_count)}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// /* ============================
//    DegreeGapsView — يستخدم useDegreeGapsData
//    ============================ */
// const DegreeGapsView = ({ degreeGapsStats, loading, error }) => {
//   const [groupByFaculty, setGroupByFaculty] = useState(false);

//   if (loading) return (
//     <div className="flex justify-center items-center h-48">
//       <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
//       <p className="mr-3 text-lg text-indigo-500">جاري تحميل بيانات فجوات الدرجات...</p>
//     </div>
//   );

//   if (error) return <div className="p-4 text-red-700 bg-red-50 rounded">{error}</div>;
//   if (!degreeGapsStats) return <div className="p-4 text-gray-500">لا توجد بيانات للفجوات.</div>;

//   const { summary, gaps = [], filled = [] } = degreeGapsStats;

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold text-gray-800 mb-2 text-right border-b pb-3">📉 تحليل فجوات الدرجات الأكاديمية</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="p-4 bg-indigo-600 text-white rounded-lg">
//           <div className="text-sm">إجمالي الوظائف المعتمدة</div>
//           <div className="text-2xl font-bold">{formatNumber(summary?.totalPositions)}</div>
//         </div>
//         <div className="p-4 bg-green-600 text-white rounded-lg">
//           <div className="text-sm">الوظائف المشغولة</div>
//           <div className="text-2xl font-bold">{formatNumber(summary?.filledPositions)}</div>
//         </div>
//         <div className="p-4 bg-red-600 text-white rounded-lg">
//           <div className="text-sm">فجوة الوظائف (الشاغر)</div>
//           <div className="text-2xl font-bold">{formatNumber(summary?.gapPositions)}</div>
//         </div>
//         <div className="p-4 bg-yellow-500 text-white rounded-lg">
//           <div className="text-sm">معدل الإشغال (%)</div>
//           <div className="text-2xl font-bold">{typeof summary?.fillRate === 'number' ? `${summary.fillRate}%` : summary.fillRate}</div>
//         </div>
//       </div>

//       <div className="flex justify-between items-center">
//         <h3 className="text-xl font-bold text-red-700">🔴 الوظائف الشاغرة</h3>
//         <div className="flex items-center gap-3">
//           <label className="flex items-center gap-2">
//             <input type="checkbox" checked={groupByFaculty} onChange={(e) => setGroupByFaculty(e.target.checked)} />
//             تجميع حسب الكلية
//           </label>
//         </div>
//       </div>

//       {gaps.length > 0 ? <GapsTable data={gaps} type="gaps" groupByFaculty={groupByFaculty} /> : (
//         <div className="p-4 bg-green-50 rounded text-green-700 font-semibold">✅ لا توجد فجوات حالياً.</div>
//       )}

//       <h3 className="text-xl font-bold text-green-700 mt-6">🟢 الوظائف المشغولة</h3>
//       {filled.length > 0 ? <GapsTable data={filled} type="filled" groupByFaculty={groupByFaculty} /> : (
//         <div className="p-4 bg-red-50 rounded text-red-700 font-semibold">❌ لا توجد وظائف مشغولة حالياً.</div>
//       )}
//     </div>
//   );
// };

// /* ============================
//    بقية المكونات الأساسية (StatusView, FacultiesView, DegreesView, Breakdown, إلخ)
//    — نحتفظ بالوظائف كما في ملفك الأصلي مع تحسينات بسيطة
//    ============================ */

// const APIErrorBanner = ({ message }) => (
//   <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-right" dir="rtl">
//     <h3 className="text-xl font-bold mb-2">⚠️ خطأ في جلب البيانات الجزئية</h3>
//     <p>{message} سيتم عرض البيانات إن وجدت، أو يرجى المحاولة لاحقاً.</p>
//   </div>
// );

// const ViewSelector = ({ selectedView, setSelectedView }) => {
//   const base = "px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none";
//   const active = "bg-white text-indigo-700 border-b-4 border-indigo-500 shadow-t-lg";
//   const inactive = "bg-gray-100 text-gray-600 hover:bg-gray-200 border-b-2 border-gray-300";
//   const get = (v) => selectedView === v ? active : inactive;

//   return (
//     <div className="flex justify-start mb-0 border-b-2 border-gray-200 overflow-x-auto" dir="rtl">
//       <button onClick={() => setSelectedView('status')} className={`${base} ${get('status')}`}>حالة العمل</button>
//       <button onClick={() => setSelectedView('faculties')} className={`${base} ${get('faculties')}`}>إحصائيات الكليات</button>
//       <button onClick={() => setSelectedView('degrees')} className={`${base} ${get('degrees')}`}>الدرجات الوظيفية</button>
//       <button onClick={() => setSelectedView('breakdown')} className={`${base} ${get('breakdown')}`}>تفاصيل الكلية 🔍</button>
//       <button onClick={() => setSelectedView('gaps')} className={`${base} ${get('gaps')} whitespace-nowrap`}>فجوات الدرجات 📉</button>
//     </div>
//   );
// };

// const StatusRow = ({ status, count, totalCount }) => {
//   const percentage = totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : 0;
//   const getBarColor = (statusName) => {
//     if (!statusName) return 'bg-indigo-500';
//     if (statusName.includes('قائم') || statusName.includes('نشط') || statusName.includes('متفرغ')) return 'bg-green-500';
//     if (statusName.includes('خروج') || statusName.includes('وفاه') || statusName.includes('انتهاء')) return 'bg-red-500';
//     if (statusName.includes('إعارة') || statusName.includes('اجازه') || statusName.includes('ايقاف')) return 'bg-yellow-500';
//     return 'bg-indigo-500';
//   };
//   return (
//     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-white transition duration-200">
//       <div className="flex justify-between items-center mb-2">
//         <span className="text-base font-semibold text-gray-800 text-right">{status}</span>
//         <div className="flex items-center space-x-2 space-x-reverse">
//           <span className="text-lg font-extrabold text-gray-900">{formatNumber(count)}</span>
//           <span className="text-sm font-medium text-indigo-600">({percentage}%)</span>
//         </div>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-3.5">
//         <div className={`${getBarColor(status)} h-3.5 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
//       </div>
//     </div>
//   );
// };

// const StatusView = ({ stats, totalStatusCount }) => (
//   <>
//     <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">توزيع الموظفين حسب حالة العمل</h2>
//     <div className="space-y-4">
//       {stats?.employeesByStatus?.sort((a,b)=>b.count - a.count).map((s, i) => (
//         <StatusRow key={i} status={s.name} count={s.count} totalCount={totalStatusCount} />
//       ))}
//     </div>
//   </>
// );

// const FacultiesTable = ({ data }) => {
//   const [sortConfig, setSortConfig] = useState({ key: 'total_employees', direction: 'desc' });
//   const sorted = useMemo(() => {
//     const arr = [...data];
//     arr.sort((a,b) => {
//       const av = safeParseInt(a[sortConfig.key]), bv = safeParseInt(b[sortConfig.key]);
//       if (av === bv) return (a.name || '').localeCompare(b.name || '');
//       return sortConfig.direction === 'asc' ? av - bv : bv - av;
//     });
//     return arr;
//   }, [data, sortConfig]);

//   const requestSort = (key) => {
//     setSortConfig(prev => prev.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'desc' });
//   };

//   return (
//     <div className="overflow-x-auto border rounded-xl shadow-lg">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-100">
//           <tr>
//             <th onClick={() => requestSort('name')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right cursor-pointer">الكلية/الوحدة</th>
//             <th onClick={() => requestSort('total_employees')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center cursor-pointer">إجمالي الموظفين</th>
//             <th onClick={() => requestSort('active_employees')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center cursor-pointer">نشط حالياً</th>
//             <th onClick={() => requestSort('inactive_employees')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center cursor-pointer">خارج الخدمة</th>
//             <th onClick={() => requestSort('temporarily_away')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center cursor-pointer">غائب مؤقتاً</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {sorted.map(f => (
//             <tr key={f.code} className="hover:bg-indigo-50/50 transition duration-150">
//               <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">{f.name}</td>
//               <td className="px-6 py-4 text-sm text-gray-700 text-center">{formatNumber(f.total_employees)}</td>
//               <td className="px-6 py-4 text-sm text-green-700 text-center">{formatNumber(f.active_employees)}</td>
//               <td className="px-6 py-4 text-sm text-red-600 text-center">{formatNumber(f.inactive_employees)}</td>
//               <td className="px-6 py-4 text-sm text-yellow-600 text-center">{formatNumber(f.temporarily_away)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const FacultiesView = ({ facultiesStats, filterType, setFilterType }) => {
//   const options = [
//     { value: 'all', label: 'جميع الكليات والوحدات' },
//     { value: 'القاهرة والوجه البحري', label: 'كليات القاهرة والوجه البحري' },
//     { value: 'الوجه البحري والدلتا', label: 'كليات الوجه البحري والدلتا' },
//     { value: 'الصعيد', label: 'كليات الصعيد' },
//     { value: 'كليات البنات/دراسات انسانية', label: 'كليات البنات/دراسات انسانية' },
//     { value: 'مراكز ووحدات متخصصة', label: 'مراكز ووحدات متخصصة' },
//   ];
//   return (
//     <>
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">📊 إحصائيات الموظفين حسب الكلية/الوحدة</h2>
//       <div className="mb-6 flex justify-end items-center gap-3">
//         <label className="text-lg font-medium">تصفية حسب المنطقة:</label>
//         <select value={filterType} onChange={(e)=>setFilterType(e.target.value)} className="p-2 border rounded">
//           {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//         </select>
//       </div>
//       {facultiesStats.length > 0 ? <FacultiesTable data={facultiesStats} /> : <p className="text-center text-gray-500 p-4">لا توجد بيانات مطابقة للفلتر.</p>}
//     </>
//   );
// };

// const DegreesTable = ({ data = [], totalEmployees = 0, isBreakdown = false }) => {
//   const [sortConfig, setSortConfig] = useState({ key: 'total_employees', direction: 'desc' });
//   const prepared = useMemo(() => data.map(d => ({
//     ...d,
//     total_employees: safeParseInt(d.total_employees, 0),
//     active_employees: safeParseInt(d.active_employees, 0),
//     inactive_employees: safeParseInt(d.inactive_employees, (safeParseInt(d.total_employees,0) - safeParseInt(d.active_employees,0)))
//   })), [data]);

//   const sorted = useMemo(() => {
//     const arr = [...prepared];
//     arr.sort((a,b)=>{
//       let av = a[sortConfig.key], bv = b[sortConfig.key];
//       if (sortConfig.key === 'percentage') {
//         av = totalEmployees > 0 ? (a.total_employees / totalEmployees) * 100 : 0;
//         bv = totalEmployees > 0 ? (b.total_employees / totalEmployees) * 100 : 0;
//       }
//       if (av === bv) return (a.job_name || '').localeCompare(b.job_name || '');
//       return sortConfig.direction === 'asc' ? av - bv : bv - av;
//     });
//     return arr;
//   }, [prepared, sortConfig, totalEmployees]);

//   const requestSort = (key) => setSortConfig(prev => prev.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'desc' });

//   return (
//     <div className="overflow-x-auto border rounded-xl shadow-lg">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-100">
//           <tr>
//             <th onClick={() => requestSort('job_name')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right cursor-pointer">الدرجة الوظيفية</th>
//             <th onClick={() => requestSort('total_employees')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-center cursor-pointer">إجمالي</th>
//             <th onClick={() => requestSort('active_employees')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-center cursor-pointer">نشط</th>
//             <th onClick={() => requestSort('inactive_employees')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-center cursor-pointer">خارج الخدمة</th>
//             <th onClick={() => requestSort('percentage')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-center cursor-pointer">{isBreakdown ? 'النسبة من الكلية' : 'النسبة من الإجمالي'}</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {sorted.map(row => {
//             const percent = totalEmployees > 0 ? ((row.total_employees / totalEmployees) * 100).toFixed(1) : '0.0';
//             return (
//               <tr key={row.job_code} className="hover:bg-indigo-50/50">
//                 <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">{row.job_name || 'غير محدد'}</td>
//                 <td className="px-6 py-3 text-sm text-gray-700 text-center">{formatNumber(row.total_employees)}</td>
//                 <td className="px-6 py-3 text-sm text-green-700 text-center">{formatNumber(row.active_employees)}</td>
//                 <td className="px-6 py-3 text-sm text-red-600 text-center">{formatNumber(row.inactive_employees)}</td>
//                 <td className="px-6 py-3 text-sm font-bold text-indigo-600 text-center">{`${percent}%`}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const DegreesView = ({ degreesStats = [], summary = {}, filterType = 'active', setFilterType = () => {} }) => {
//   const hasData = degreesStats && degreesStats.length > 0;
//   const totalEmployeesInDegrees = useMemo(() => degreesStats ? degreesStats.reduce((s, d) => s + (d.total_employees || 0), 0) : 0, [degreesStats]);

//   return (
//     <>
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">🎓 إحصائيات الدرجات الوظيفية</h2>
//       {hasData ? (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
//             <div className="p-4 bg-indigo-500 text-white rounded-lg"><div>إجمالي أنواع الدرجات</div><div className="text-2xl font-bold">{formatNumber(summary?.totalDegreeTypes)}</div></div>
//             <div className="p-4 bg-green-500 text-white rounded-lg"><div>درجات بها موظفون</div><div className="text-2xl font-bold">{formatNumber(summary?.degreesWithEmployees)}</div></div>
//             <div className="p-4 bg-red-500 text-white rounded-lg"><div>درجات بدون موظفين</div><div className="text-2xl font-bold">{formatNumber(summary?.degreesWithoutEmployees)}</div></div>
//           </div>

//           <div className="mb-6 flex justify-end items-center gap-3">
//             <label className="text-lg">نوع العرض:</label>
//             <select value={filterType} onChange={(e)=>setFilterType(e.target.value)} className="p-2 border rounded">
//               <option value="all">عرض جميع الدرجات</option>
//               <option value="active">عرض الدرجات التي بها موظفون فقط</option>
//             </select>
//           </div>

//           <DegreesTable data={degreesStats} totalEmployees={totalEmployeesInDegrees} />
//         </>
//       ) : (
//         <p className="text-center text-gray-500 p-4">لا توجد بيانات للدرجات الوظيفية للعرض حالياً.</p>
//       )}
//     </>
//   );
// };

// /* ============================
//    Faculty breakdown components (تفاصيل كلية)
//    ============================ */

// const BreakdownDepartmentsTable = ({ data = [] }) => {
//   const sorted = useMemo(() => [...data].sort((a,b)=> (safeParseInt(b.total_employees) - safeParseInt(a.total_employees))), [data]);
//   return (
//     <div className="overflow-x-auto border rounded-xl shadow-lg">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right">القسم</th>
//             <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right">إجمالي الموظفين</th>
//             <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right">نشط حالياً</th>
//             <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right">نسبة النشطين</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {sorted.map(dept => {
//             const total = safeParseInt(dept.total_employees);
//             const active = safeParseInt(dept.active_employees);
//             const percent = total > 0 ? ((active / total) * 100).toFixed(1) : '0.0';
//             return (
//               <tr key={dept.dept_code} className="hover:bg-indigo-50/50">
//                 <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">{dept.name}</td>
//                 <td className="px-6 py-3 text-sm text-gray-700 text-right">{formatNumber(total)}</td>
//                 <td className="px-6 py-3 text-sm text-green-700 text-right">{formatNumber(active)}</td>
//                 <td className="px-6 py-3 text-sm font-bold text-indigo-600 text-right">{percent}%</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const FacultyBreakdownContent = ({ breakdownData = {} }) => {
//   const summary = breakdownData.summary || {};
//   const departments = breakdownData.departments || [];
//   const academicDegrees = breakdownData.academicDegrees || [];
//   const totalEmployees = summary.totalEmployees || 0;

//   return (
//     <div className="space-y-8">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <SummaryCard title="إجمالي الموظفين" value={summary.totalEmployees} color="bg-indigo-500" />
//         <SummaryCard title="الموظفون النشطون" value={summary.activeEmployees} color="bg-green-500" />
//         <SummaryCard title="الموظفون غير النشطين" value={summary.inactiveEmployees} color="bg-red-500" />
//         <SummaryCard title="إجمالي الأقسام" value={summary.totalDepartments} color="bg-yellow-500" />
//       </div>

//       <h3 className="text-xl font-bold">تفاصيل أقسام الكلية</h3>
//       {departments.length > 0 ? <BreakdownDepartmentsTable data={departments} /> : <p className="p-4 bg-gray-50 rounded">لا توجد بيانات أقسام.</p>}

//       <h3 className="text-xl font-bold">تفاصيل الدرجات الأكاديمية</h3>
//       {academicDegrees.length > 0 ? <DegreesTable data={academicDegrees} totalEmployees={totalEmployees} isBreakdown /> : <p className="p-4 bg-gray-50 rounded">لا توجد درجات أكاديمية.</p>}
//     </div>
//   );
// };

// const FacultyBreakdownView = ({ faculties = [], loading = false, error = null }) => {
//   const [selected, setSelected] = useState(null);
//   const { breakdownData, loading: detailLoading, error: detailError } = useFacultyBreakdownData(selected);

//   return (
//     <>
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">🔍 تفاصيل الإحصائيات حسب الكلية</h2>
//       <div className="mb-4 p-4 bg-gray-50 rounded shadow-inner">
//         <p className="mb-3 text-right">الكلية المختارة: <span className="font-bold text-indigo-600">{faculties.find(f => f.code === selected)?.name || 'لم يتم الاختيار'}</span></p>
//         <SearchableSelect
//           options={faculties.map(f => ({ code: f.code, name: f.name }))}
//           selectedCode={selected}
//           onSelect={setSelected}
//           placeholder="ابحث واختر كلية..."
//         />
//       </div>

//       {selected && detailLoading && <div className="p-4 text-indigo-600">جاري تحميل تفاصيل الكلية...</div>}
//       {selected && detailError && <APIErrorBanner message={detailError} />}
//       {breakdownData && !detailLoading && <FacultyBreakdownContent breakdownData={breakdownData} />}
//       {!selected && !loading && <p className="p-6 bg-gray-50 text-center rounded">الرجاء اختيار كلية لعرض التفاصيل.</p>}
//     </>
//   );
// };

// /* ============================
//    BigStatCard + SummaryCard
//    ============================ */
// const BigStatCard = ({ title, value, icon, color = 'bg-indigo-600', isPercentage = false }) => {
//   const textColor = color.replace('bg-', 'text-') || 'text-indigo-600';
//   return (
//     <div className="p-5 bg-white rounded-xl shadow-xl border border-gray-100 h-36 flex flex-col justify-between">
//       <div className="flex justify-between items-start">
//         <span className={`text-4xl ${textColor}`}>{icon}</span>
//         <p className="text-sm font-semibold text-gray-600 text-right">{title}</p>
//       </div>
//       <CountUpAnimation endValue={value} isPercentage={isPercentage} />
//     </div>
//   );
// };

// const SummaryCard = ({ title, value, color = 'bg-indigo-500', isPercentage = false }) => (
//   <div className={`p-4 ${color} text-white rounded-lg shadow-md text-right`}>
//     <p className="text-base font-medium">{title}</p>
//     <h3 className="text-3xl font-bold mt-1">{isPercentage ? `${formatNumber(value)}%` : formatNumber(value)}</h3>
//   </div>
// );

// /* ============================
//    المكون الرئيسي — Statistics
//    ============================ */
// const Statistics = () => {
//   const { stats, facultiesStats, degreesStats, loading, errors } = useStatisticsData();
//   const { faculties: structureFaculties, loading: structureLoading, error: structureError } = useFacultyStructure();
//   const { degreeGapsStats, loading: gapsLoading, error: gapsError } = useDegreeGapsData();

//   const [facultyFilterType, setFacultyFilterType] = useState('all');
//   const [degreeFilterType, setDegreeFilterType] = useState('active');
//   const [selectedView, setSelectedView] = useState('status');

//   const totalStatusCount = useMemo(() => stats?.employeesByStatus?.reduce((s, it) => s + (it.count || 0), 0) || 0, [stats]);

//   const filteredFaculties = useMemo(() => {
//     if (!facultiesStats) return [];
//     if (facultyFilterType === 'all') return facultiesStats;
//     return facultiesStats.filter(f => f.category === facultyFilterType || f.category.includes(facultyFilterType));
//   }, [facultiesStats, facultyFilterType]);

//   const filteredDegrees = useMemo(() => {
//     if (!degreesStats) return [];
//     const all = degreesStats.allDegrees ? degreesStats.allDegrees.map(d => ({ ...d, total_employees: safeParseInt(d.total_employees) })) : [];
//     return degreeFilterType === 'active' ? all.filter(d => safeParseInt(d.total_employees) > 0) : all;
//   }, [degreesStats, degreeFilterType]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50" dir="rtl">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
//         <p className="mr-4 text-xl text-indigo-600 font-semibold">جاري تحميل لوحة الإحصائيات...</p>
//       </div>
//     );
//   }

//   if (errors.general || errors.overview) {
//     return (
//       <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-xl m-10 text-right" dir="rtl">
//         <h2 className="text-2xl font-bold mb-3">⚠️ خطأ فادح في الاتصال</h2>
//         <p className="text-lg">حدث خطأ أثناء جلب البيانات الرئيسية. يرجى التحقق من الخدمة.</p>
//       </div>
//     );
//   }

//   const activeEmployeesCount = safeParseInt(stats?.activeEmployees);
//   const totalEmployeesCount = safeParseInt(stats?.totalEmployees);
//   const inactiveEmployeesCount = totalEmployeesCount - activeEmployeesCount;
//   const activePercentageValue = totalEmployeesCount > 0 ? ((activeEmployeesCount / totalEmployeesCount) * 100) : 0;

//   return (
//     <div className="min-h-screen w-[90%] m-auto bg-gray-50 p-6 md:p-12" dir="rtl">
//       <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-right border-b-4 border-indigo-500 pb-3">لوحة إحصائيات الموارد البشرية 📊</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         <BigStatCard title="إجمالي عدد الموظفين" value={stats?.totalEmployees} icon="👥" color="bg-indigo-600" />
//         <BigStatCard title="الموظفين النشطين" value={stats?.activeEmployees} icon="✅" color="bg-green-600" />
//         <BigStatCard title="الموظفين غير النشطين" value={inactiveEmployeesCount} icon="❌" color="bg-red-600" />
//         <BigStatCard title="نسبة النشطين" value={activePercentageValue} icon="📈" color="bg-yellow-600" isPercentage />
//       </div>

//       <ViewSelector selectedView={selectedView} setSelectedView={setSelectedView} />

//       <div className="bg-white shadow-2xl rounded-xl p-8">
//         {errors.faculties && selectedView === 'faculties' && <APIErrorBanner message={errors.faculties} />}
//         {errors.degrees && selectedView === 'degrees' && <APIErrorBanner message={errors.degrees} />}
//         {gapsError && selectedView === 'gaps' && <APIErrorBanner message={gapsError} />}

//         {selectedView === 'status' && <StatusView stats={stats} totalStatusCount={totalStatusCount} />}

//         {selectedView === 'faculties' && <FacultiesView facultiesStats={filteredFaculties} filterType={facultyFilterType} setFilterType={setFacultyFilterType} />}

//         {selectedView === 'degrees' && <DegreesView degreesStats={filteredDegrees} summary={degreesStats?.summary} filterType={degreeFilterType} setFilterType={setDegreeFilterType} />}

//         {selectedView === 'breakdown' && <FacultyBreakdownView faculties={structureFaculties} loading={structureLoading} error={structureError} />}

//         {selectedView === 'gaps' && <DegreeGapsView degreeGapsStats={degreeGapsStats} loading={gapsLoading} error={gapsError} />}
//       </div>

//       {/* طباعة خفيفة — إخفاء عناصر التحكم عند الطباعة */}
//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Statistics;



// src/pages/Statistics.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

/**
 * Statistics.jsx
 * ملف واحد يحتوي مكونات لوحة الإحصائيات + فجوات الدرجات + خدمات مساعدة
 *
 * تحسينات مضافة:
 * - بحث قابل للبحث مع debounce
 * - تحميل بيانات مع معالجة أخطاء محسنة
 * - زر لتصدير جدول الفجوات إلى CSV
 * - تحسينات في العرض والطباعة
 *
 * انسخ الملف كما هو في مشروعك.
 */

/* ============================
   عناوين API (اضبطها عند الحاجة)
   ============================ */
const OVERVIEW_API_URL = 'https://university.roboeye-tec.com/statistics/overview';
const FACULTIES_API_URL = 'https://university.roboeye-tec.com/statistics/faculties';
const DEGREES_API_URL = 'https://university.roboeye-tec.com/statistics/academic-degrees';
const STRUCTURE_FACULTY_API = 'https://university.roboeye-tec.com/structure/faculty';
const FACULTY_BREAKDOWN_API_BASE = 'https://university.roboeye-tec.com/statistics/faculty';
const DEGREE_GAPS_API_URL = 'https://university.roboeye-tec.com/statistics/degree-gaps';

/* ============================
   دوال مساعدة عامة
   ============================ */
const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return '0';
  if (typeof value === 'number') return value.toLocaleString('en-US');
  const n = parseFloat(value);
  if (isNaN(n)) return String(value);
  // لا نخسر الكسور اذا كانت مهمة
  if (!Number.isInteger(n)) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return n.toLocaleString('en-US');
};

const safeParseInt = (v, fallback = 0) => {
  const n = parseInt(v);
  return isNaN(n) ? fallback : n;
};

const classifyFaculty = (name = '') => {
  if (name.includes('القاهره')) return 'القاهرة والوجه البحري';
  if (name.includes('اسيوط') || name.includes('سوهاج') || name.includes('قنا') || name.includes('اسوان')) return 'الصعيد';
  if (name.includes('المنصوره') || name.includes('الزقازيق') || name.includes('المنوفيه') || name.includes('طنطا') || name.includes('دمياط') || name.includes('دمنهور') || name.includes('الاسكندريه')) return 'الوجه البحري والدلتا';
  if (name.includes('بنات') || name.includes('انسانيه') || name.includes('اسلامية وعربية بنات')) return 'كليات البنات/دراسات انسانية';
  return 'مراكز ووحدات متخصصة';
};

/* ============================
   CountUpAnimation (عداد رقمي بسيط)
   ============================ */
const CountUpAnimation = ({ endValue = 0, duration = 600, isPercentage = false }) => {
  const finalNumber = parseFloat(endValue) || 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let rafId = null;
    let start = null;
    if (finalNumber === 0) {
      setCount(0);
      return;
    }
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(progress * finalNumber);
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [finalNumber, duration]);

  const display = isPercentage ? `${count.toFixed(count < 100 ? 2 : 0)}%` : formatNumber(Math.round(count));
  return <h3 className="text-3xl font-extrabold text-right mt-2">{display}</h3>;
};

/* ============================
   Debounce hook بسيط
   ============================ */
const useDebounce = (value, delay = 300) => {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
};

/* ============================
   SearchableSelect (قابل للبحث) مع تحسينات
   ============================ */
const SearchableSelect = ({ options = [], selectedCode = null, onSelect = () => {}, placeholder = 'اختر...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [term, setTerm] = useState('');
  const debTerm = useDebounce(term, 200);
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selectedOption = useMemo(() => options.find(o => o.code === selectedCode) || null, [options, selectedCode]);

  useEffect(() => {
    function outside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
    if (!isOpen) setTerm('');
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!debTerm) return options;
    const q = debTerm.trim().toLowerCase();
    return options.filter(o => (o.name || '').toLowerCase().includes(q));
  }, [options, debTerm]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(s => !s)}
        className="w-full p-3 flex justify-between items-center bg-white border border-gray-300 rounded-lg shadow-sm text-right"
      >
        <span className="truncate">{selectedOption ? selectedOption.name : placeholder}</span>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="absolute z-30 w-full mt-1 bg-white rounded-lg shadow-xl border">
          <div className="p-2">
            <input
              ref={inputRef}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="ابحث هنا..."
              className="w-full p-2 border rounded text-right"
            />
          </div>
          <ul className="max-h-56 overflow-auto">
            {filtered.length === 0 ? (
              <li className="p-3 text-center text-gray-500">لا توجد نتائج</li>
            ) : (
              filtered.map(o => (
                <li
                  key={o.code}
                  onClick={() => { onSelect(o.code); setIsOpen(false); }}
                  className={`p-3 cursor-pointer hover:bg-indigo-50 text-right ${o.code === selectedCode ? 'bg-indigo-100 font-bold text-indigo-700' : ''}`}
                >
                  {o.name}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

/* ============================
   Hooks لجلب البيانات
   ============================ */

/**
 * ✅ Hook مضاف: لجلب تفاصيل الإحصائيات لكلية محددة.
 * هذا الـ Hook كان مفقوداً ويسبب خطأ Uncaught ReferenceError.
 */
const useFacultyBreakdownData = (facultyCode) => {
  const [breakdownData, setBreakdownData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!facultyCode) {
      setBreakdownData(null);
      setError(null);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${FACULTY_BREAKDOWN_API_BASE}/${facultyCode}/breakdown`; 
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setBreakdownData(data);
      } catch (e) {
        if (!mounted) return;
        console.error("Error fetching faculty breakdown:", e);
        setError(`فشل في جلب بيانات تفاصيل الكلية (${facultyCode}).`);
        setBreakdownData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [facultyCode]);

  return { breakdownData, loading, error };
};


const useFacultyStructure = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(STRUCTURE_FACULTY_API);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        // احتفظ فقط بالعناصر التي تحتوي على اسم وكود
        setFaculties(Array.isArray(data) ? data.filter(d => d.name && d.code) : []);
      } catch (e) {
        if (!mounted) return;
        setError('فشل في جلب هيكل الكليات.');
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  return { faculties, loading, error };
};

const useDegreeGapsData = () => {
  const [degreeGapsStats, setDegreeGapsStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(DEGREE_GAPS_API_URL);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        // تجهيز البيانات بإعتبار احتمال غياب الحقول
        const cleaned = {
          gaps: Array.isArray(data.gaps) ? data.gaps : [],
          filled: Array.isArray(data.filled) ? data.filled : [],
          summary: {
            totalPositions: safeParseInt(data.summary?.totalPositions, 0),
            filledPositions: safeParseInt(data.summary?.filledPositions, 0),
            gapPositions: safeParseInt(data.summary?.gapPositions, 0),
            fillRate: (typeof data.summary?.fillRate === 'string') ? data.summary.fillRate.replace('%', '') : (data.summary?.fillRate || 0)
          }
        };
        setDegreeGapsStats(cleaned);
      } catch (e) {
        if (!mounted) return;
        console.error(e);
        setError('فشل في جلب بيانات فجوات الدرجات.');
        setDegreeGapsStats(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { degreeGapsStats, loading, error };
};

const useStatisticsData = () => {
  const [stats, setStats] = useState(null);
  const [facultiesStats, setFacultiesStats] = useState([]);
  const [degreesStats, setDegreesStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErrors({});
      try {
        // نجلب الثلاث endpoints بالتوازي
        const [ovRes, facRes, degRes] = await Promise.allSettled([
          fetch(OVERVIEW_API_URL),
          fetch(FACULTIES_API_URL),
          fetch(DEGREES_API_URL)
        ]);

        const newErrors = {};
        // overview
        if (ovRes.status === 'fulfilled' && ovRes.value.ok) {
          const ov = await ovRes.value.json();
          // تنظيف بيانات الحالة
          const statuses = Array.isArray(ov.employeesByStatus) ? ov.employeesByStatus
            .filter(it => it.count > 0 && it.work_status)
            .map(it => ({ name: it.work_status, count: it.count })) : [];
          if (mounted) setStats({ ...ov, employeesByStatus: statuses });
        } else {
          newErrors.overview = 'فشل في جلب الملخص العام.';
        }

        // faculties
        if (facRes.status === 'fulfilled' && facRes.value.ok) {
          const facs = await facRes.value.json();
          const cleaned = (Array.isArray(facs) ? facs : []).filter(f => safeParseInt(f.total_employees) > 0).map(f => ({ ...f, category: classifyFaculty(f.name) }));
          if (mounted) setFacultiesStats(cleaned);
        } else {
          newErrors.faculties = 'فشل في جلب بيانات الكليات.';
        }

        // degrees
        if (degRes.status === 'fulfilled' && degRes.value.ok) {
          const deg = await degRes.value.json();
          if (mounted) setDegreesStats(deg);
        } else {
          newErrors.degrees = 'فشل في جلب بيانات الدرجات.';
        }

        if (mounted) setErrors(newErrors);
      } catch (e) {
        console.error(e);
        if (mounted) setErrors(prev => ({ ...prev, general: 'خطأ غير متوقع أثناء جلب البيانات.' }));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { stats, facultiesStats, degreesStats, loading, errors };
};

/* ============================
   Components: Gaps view و جدول الفجوات
   تحسين: زر تحميل CSV + إمكانية تجميع حسب الكلية (groupByFaculty)
   ============================ */

/** تحويل مصفوفة إلى CSV والبدء بتحميله */
/** تحويل مصفوفة إلى CSV والبدء بتحميله (مع دعم UTF-8 للغة العربية) */
const downloadCSV = (rows = [], filename = 'export.csv') => {
  if (!rows || rows.length === 0) return;
  
  const headers = Object.keys(rows[0]);
  
  const csvString = [
    headers.join(','),
    ...rows.map(r => headers.map(h => {
      // تنظيف البيانات والتأكد من التعامل مع الفواصل داخل النص
      const cell = r[h] === null || r[h] === undefined ? '' : String(r[h]).replace(/"/g, '""');
      return `"${cell}"`;
    }).join(','))
  ].join('\n');

  // ****** التعديل الرئيسي هنا: إضافة علامة BOM ******
  // علامة \ufeff هي الـ BOM لـ UTF-8 وتجعل Excel يتعرف على الترميز الصحيح
  const BOM = '\ufeff'; 
  const content = BOM + csvString;
  // **********************************************

  // إنشاء Blob مع ترميز UTF-8
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
/* جدول الفجوات — تحسينات: فرز، تجميع، تصدير CSV */
const GapsTable = ({ data = [], type = 'gaps', groupByFaculty = false }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'employee_count', direction: 'desc' });
  const [search, setSearch] = useState('');
  const debSearch = useDebounce(search, 200);

  // تجهيز بيانات: تحويل القيم الرقمية
  const normalized = useMemo(() => {
    return data.map(item => ({
      ...item,
      employee_count: safeParseInt(item.employee_count, 0),
      faculty_name: item.faculty_name || 'غير محدد',
      dept_name: item.dept_name || '',
      job_name: item.job_name || '',
    }));
  }, [data]);

  // فلترة البحث
  const filtered = useMemo(() => {
    if (!debSearch) return normalized;
    const q = debSearch.trim().toLowerCase();
    return normalized.filter(it =>
      (it.faculty_name || '').toLowerCase().includes(q) ||
      (it.dept_name || '').toLowerCase().includes(q) ||
      (it.job_name || '').toLowerCase().includes(q)
    );
  }, [normalized, debSearch]);

  // تجميع حسب الكلية (اختياري) — سنعرض تعداد الشواغر/الموظفين لكل كلية كصف قابل للتوسيع
  const grouped = useMemo(() => {
    if (!groupByFaculty) return null;
    const map = new Map();
    filtered.forEach(it => {
      const key = it.faculty_name || 'غير محدد';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    });
    // تصنيف حسب مجموع employee_count تنازلياً
    const arr = Array.from(map.entries()).map(([faculty, items]) => {
      const total = items.reduce((s, x) => s + (x.employee_count || 0), 0);
      return { faculty, total, items };
    }).sort((a, b) => b.total - a.total);
    return arr;
  }, [filtered, groupByFaculty]);

  // فرز قائمة (أو عناصر المجموعة)
  const sorted = useMemo(() => {
    const comparator = (a, b) => {
      const av = a[sortConfig.key] ?? 0;
      const bv = b[sortConfig.key] ?? 0;
      if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
      if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
      // tie-break by faculty
      return (a.faculty_name || '').localeCompare(b.faculty_name || '');
    };
    if (groupByFaculty && grouped) {
      // sort groups by total (already sorted) and sort items inside each group
      return grouped.map(g => ({
        ...g,
        items: [...g.items].sort(comparator),
      }));
    }
    return [...filtered].sort(comparator);
  }, [filtered, grouped, sortConfig, groupByFaculty]);

  const requestSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      return { key, direction: 'desc' };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  // تنزيل CSV: إذا grouped فعادة نريد تفصيل العناصر
  const handleExport = () => {
    if (groupByFaculty && sorted && Array.isArray(sorted)) {
      // نفك التجميع لإخراج CSV مفصل
      const rows = [];
      sorted.forEach(group => {
        group.items.forEach(it => {
          rows.push({
            faculty_name: it.faculty_name,
            dept_name: it.dept_name,
            job_name: it.job_name,
            employee_count: it.employee_count
          });
        });
      });
      if (rows.length === 0) return alert('لا توجد بيانات للتصدير');
      downloadCSV(rows, `${type === 'gaps' ? 'gaps' : 'filled'}-export.csv`);
    } else {
      if (!filtered || filtered.length === 0) return alert('لا توجد بيانات للتصدير');
      downloadCSV(filtered.map(it => ({
        faculty_name: it.faculty_name, dept_name: it.dept_name, job_name: it.job_name, employee_count: it.employee_count
      })), `${type === 'gaps' ? 'gaps' : 'filled'}-export.csv`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث داخل الجدول (كلية / قسم / وظيفة)"
            className="p-2 border rounded w-80 text-right"
          />
          
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            ⤓ تصدير CSV
          </button>
          <button onClick={() => {
            // طباعة الجزء
            window.print();
          }} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">
            🖨️ طباعة
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th onClick={() => requestSort('faculty_name')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right cursor-pointer">الكلية {getSortIcon('faculty_name')}</th>
              <th onClick={() => requestSort('dept_name')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right cursor-pointer">القسم {getSortIcon('dept_name')}</th>
              <th onClick={() => requestSort('job_name')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right cursor-pointer">الدرجة الوظيفية {getSortIcon('job_name')}</th>
              <th onClick={() => requestSort('employee_count')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-center cursor-pointer"> {type === 'gaps' ? 'عدد الشواغر' : 'عدد الموظفين'} {getSortIcon('employee_count')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groupByFaculty && Array.isArray(sorted) ? (
              sorted.map((group, gi) => (
                <React.Fragment key={gi}>
                  <tr className="bg-indigo-50">
                    <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">{group.faculty}</td>
                    <td className="px-6 py-3 text-sm text-gray-700 text-right">—</td>
                    <td className="px-6 py-3 text-sm text-gray-700 text-right">مجمّع</td>
                    <td className="px-6 py-3 text-sm font-bold text-center text-indigo-700">{formatNumber(group.total)}</td>
                  </tr>
                  {group.items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50/50">
                      <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">{it.faculty_name}</td>
                      <td className="px-6 py-3 text-sm text-gray-700 text-right">{it.dept_name || 'غير محدد'}</td>
                      <td className="px-6 py-3 text-sm text-gray-500 text-right">{it.job_name || 'غير محدد'}</td>
                      <td className={`px-6 py-3 text-sm font-bold text-center ${type === 'gaps' ? 'text-red-600' : 'text-green-600'}`}>{formatNumber(it.employee_count)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              sorted.map((it, idx) => (
                <tr key={idx} className="hover:bg-indigo-50/50">
                  <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">{it.faculty_name}</td>
                  <td className="px-6 py-3 text-sm text-gray-700 text-right">{it.dept_name || 'غير محدد'}</td>
                  <td className="px-6 py-3 text-sm text-gray-500 text-right">{it.job_name || 'غير محدد'}</td>
                  <td className={`px-6 py-3 text-sm font-bold text-center ${type === 'gaps' ? 'text-red-600' : 'text-green-600'}`}>{formatNumber(it.employee_count)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ============================
   DegreeGapsView — يستخدم useDegreeGapsData
   ============================ */
const DegreeGapsView = ({ degreeGapsStats, loading, error }) => {
  const [groupByFaculty, setGroupByFaculty] = useState(false);

  if (loading) return (
    <div className="flex justify-center items-center h-48">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      <p className="mr-3 text-lg text-indigo-500">جاري تحميل بيانات فجوات الدرجات...</p>
    </div>
  );

  if (error) return <div className="p-4 text-red-700 bg-red-50 rounded">{error}</div>;
  if (!degreeGapsStats) return <div className="p-4 text-gray-500">لا توجد بيانات للفجوات.</div>;

  const { summary, gaps = [], filled = [] } = degreeGapsStats;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-right border-b pb-3">📉 تحليل فجوات الدرجات الأكاديمية</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-indigo-600 text-white rounded-lg">
          <div className="text-sm">إجمالي الوظائف المعتمدة</div>
          <div className="text-2xl font-bold">{formatNumber(summary?.totalPositions)}</div>
        </div>
        <div className="p-4 bg-green-600 text-white rounded-lg">
          <div className="text-sm">الوظائف المشغولة</div>
          <div className="text-2xl font-bold">{formatNumber(summary?.filledPositions)}</div>
        </div>
        <div className="p-4 bg-red-600 text-white rounded-lg">
          <div className="text-sm">فجوة الوظائف (الشاغر)</div>
          <div className="text-2xl font-bold">{formatNumber(summary?.gapPositions)}</div>
        </div>
        <div className="p-4 bg-yellow-500 text-white rounded-lg">
          <div className="text-sm">معدل الإشغال (%)</div>
          <div className="text-2xl font-bold">{typeof summary?.fillRate === 'number' ? `${summary.fillRate}%` : summary.fillRate}</div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-red-700">🔴 الوظائف الشاغرة</h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={groupByFaculty} onChange={(e) => setGroupByFaculty(e.target.checked)} />
            تجميع حسب الكلية
          </label>
        </div>
      </div>

      {gaps.length > 0 ? <GapsTable data={gaps} type="gaps" groupByFaculty={groupByFaculty} /> : (
        <div className="p-4 bg-green-50 rounded text-green-700 font-semibold">✅ لا توجد فجوات حالياً.</div>
      )}

      <h3 className="text-xl font-bold text-green-700 mt-6">🟢 الوظائف المشغولة</h3>
      {filled.length > 0 ? <GapsTable data={filled} type="filled" groupByFaculty={groupByFaculty} /> : (
        <div className="p-4 bg-red-50 rounded text-red-700 font-semibold">❌ لا توجد وظائف مشغولة حالياً.</div>
      )}
    </div>
  );
};

/* ============================
   بقية المكونات الأساسية (StatusView, FacultiesView, DegreesView, Breakdown, إلخ)
   — نحتفظ بالوظائف كما في ملفك الأصلي مع تحسينات بسيطة
   ============================ */

const APIErrorBanner = ({ message }) => (
  <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-right" dir="rtl">
    <h3 className="text-xl font-bold mb-2">⚠️ خطأ في جلب البيانات الجزئية</h3>
    <p>{message} سيتم عرض البيانات إن وجدت، أو يرجى المحاولة لاحقاً.</p>
  </div>
);

const ViewSelector = ({ selectedView, setSelectedView }) => {
  const base = "px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none";
  const active = "bg-white text-indigo-700 border-b-4 border-indigo-500 shadow-t-lg";
  const inactive = "bg-gray-100 text-gray-600 hover:bg-gray-200 border-b-2 border-gray-300";
  const get = (v) => selectedView === v ? active : inactive;

  return (
    <div className="flex justify-start mb-0 border-b-2 border-gray-200 overflow-x-auto" dir="rtl">
      <button onClick={() => setSelectedView('status')} className={`${base} ${get('status')}`}>حالة العمل</button>
      <button onClick={() => setSelectedView('faculties')} className={`${base} ${get('faculties')}`}>إحصائيات الكليات</button>
      <button onClick={() => setSelectedView('degrees')} className={`${base} ${get('degrees')}`}>الدرجات الوظيفية</button>
      <button onClick={() => setSelectedView('breakdown')} className={`${base} ${get('breakdown')}`}>تفاصيل الكلية 🔍</button>
      <button onClick={() => setSelectedView('gaps')} className={`${base} ${get('gaps')} whitespace-nowrap`}>فجوات الدرجات 📉</button>
    </div>
  );
};

const StatusRow = ({ status, count, totalCount }) => {
  const percentage = totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : 0;
  const getBarColor = (statusName) => {
    if (!statusName) return 'bg-indigo-500';
    if (statusName.includes('قائم') || statusName.includes('نشط') || statusName.includes('متفرغ')) return 'bg-green-500';
    if (statusName.includes('خروج') || statusName.includes('وفاه') || statusName.includes('انتهاء')) return 'bg-red-500';
    if (statusName.includes('إعارة') || statusName.includes('اجازه') || statusName.includes('ايقاف')) return 'bg-yellow-500';
    return 'bg-indigo-500';
  };
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-white transition duration-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-base font-semibold text-gray-800 text-right">{status}</span>
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-lg font-extrabold text-gray-900">{formatNumber(count)}</span>
          <span className="text-sm font-medium text-indigo-600">({percentage}%)</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3.5">
        <div className={`${getBarColor(status)} h-3.5 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

const StatusView = ({ stats, totalStatusCount }) => (
  <>
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">توزيع الموظفين حسب حالة العمل</h2>
    <div className="space-y-4">
      {stats?.employeesByStatus?.sort((a,b)=>b.count - a.count).map((s, i) => (
        <StatusRow key={i} status={s.name} count={s.count} totalCount={totalStatusCount} />
      ))}
    </div>
  </>
);

const FacultiesTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'total_employees', direction: 'desc' });
  const sorted = useMemo(() => {
    const arr = [...data];
    arr.sort((a,b) => {
      const av = safeParseInt(a[sortConfig.key]), bv = safeParseInt(b[sortConfig.key]);
      if (av === bv) return (a.name || '').localeCompare(b.name || '');
      return sortConfig.direction === 'asc' ? av - bv : bv - av;
    });
    return arr;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    setSortConfig(prev => prev.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'desc' });
  };

  return (
    <div className="overflow-x-auto border rounded-xl shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th onClick={() => requestSort('name')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-right cursor-pointer">الكلية/الوحدة</th>
            <th onClick={() => requestSort('total_employees')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center cursor-pointer">إجمالي الموظفين</th>
            <th onClick={() => requestSort('active_employees')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center cursor-pointer">نشط حالياً</th>
            <th onClick={() => requestSort('inactive_employees')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center cursor-pointer">خارج الخدمة</th>
            <th onClick={() => requestSort('temporarily_away')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center cursor-pointer">غائب مؤقتاً</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sorted.map(f => (
            <tr key={f.code} className="hover:bg-indigo-50/50 transition duration-150">
              <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">{f.name}</td>
              <td className="px-6 py-4 text-sm text-gray-700 text-center">{formatNumber(f.total_employees)}</td>
              <td className="px-6 py-4 text-sm text-green-700 text-center">{formatNumber(f.active_employees)}</td>
              <td className="px-6 py-4 text-sm text-red-600 text-center">{formatNumber(f.inactive_employees)}</td>
              <td className="px-6 py-4 text-sm text-yellow-600 text-center">{formatNumber(f.temporarily_away)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FacultiesView = ({ facultiesStats, filterType, setFilterType }) => {
  const options = [
    { value: 'all', label: 'جميع الكليات والوحدات' },
    { value: 'القاهرة والوجه البحري', label: 'كليات القاهرة والوجه البحري' },
    { value: 'الوجه البحري والدلتا', label: 'كليات الوجه البحري والدلتا' },
    { value: 'الصعيد', label: 'كليات الصعيد' },
    { value: 'كليات البنات/دراسات انسانية', label: 'كليات البنات/دراسات انسانية' },
    { value: 'مراكز ووحدات متخصصة', label: 'مراكز ووحدات متخصصة' },
  ];
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">📊 إحصائيات الموظفين حسب الكلية/الوحدة</h2>
      <div className="mb-6 flex justify-end items-center gap-3">
        <label className="text-lg font-medium">تصفية حسب المنطقة:</label>
        <select value={filterType} onChange={(e)=>setFilterType(e.target.value)} className="p-2 border rounded">
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {facultiesStats.length > 0 ? <FacultiesTable data={facultiesStats} /> : <p className="text-center text-gray-500 p-4">لا توجد بيانات مطابقة للفلتر.</p>}
    </>
  );
};

const DegreesTable = ({ data = [], totalEmployees = 0, isBreakdown = false }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'total_employees', direction: 'desc' });
  const prepared = useMemo(() => data.map(d => ({
    ...d,
    total_employees: safeParseInt(d.total_employees, 0),
    active_employees: safeParseInt(d.active_employees, 0),
    inactive_employees: safeParseInt(d.inactive_employees, (safeParseInt(d.total_employees,0) - safeParseInt(d.active_employees,0)))
  })), [data]);

  const sorted = useMemo(() => {
    const arr = [...prepared];
    arr.sort((a,b)=>{
      let av = a[sortConfig.key], bv = b[sortConfig.key];
      if (sortConfig.key === 'percentage') {
        av = totalEmployees > 0 ? (a.total_employees / totalEmployees) * 100 : 0;
        bv = totalEmployees > 0 ? (b.total_employees / totalEmployees) * 100 : 0;
      }
      if (av === bv) return (a.job_name || '').localeCompare(b.job_name || '');
      return sortConfig.direction === 'asc' ? av - bv : bv - av;
    });
    return arr;
  }, [prepared, sortConfig, totalEmployees]);

  const requestSort = (key) => setSortConfig(prev => prev.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'desc' });

  return (
    <div className="overflow-x-auto border rounded-xl shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th onClick={() => requestSort('job_name')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right cursor-pointer">الدرجة الوظيفية</th>
            <th onClick={() => requestSort('total_employees')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-center cursor-pointer">إجمالي</th>
            <th onClick={() => requestSort('active_employees')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-center cursor-pointer">نشط</th>
            <th onClick={() => requestSort('inactive_employees')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-center cursor-pointer">خارج الخدمة</th>
            <th onClick={() => requestSort('percentage')} className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-center cursor-pointer">{isBreakdown ? 'النسبة من الكلية' : 'النسبة من الإجمالي'}</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sorted.map(row => {
            const percent = totalEmployees > 0 ? ((row.total_employees / totalEmployees) * 100).toFixed(1) : '0.0';
            return (
              <tr key={row.job_code} className="hover:bg-indigo-50/50">
                <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">{row.job_name || 'غير محدد'}</td>
                <td className="px-6 py-3 text-sm text-gray-700 text-center">{formatNumber(row.total_employees)}</td>
                <td className="px-6 py-3 text-sm text-green-700 text-center">{formatNumber(row.active_employees)}</td>
                <td className="px-6 py-3 text-sm text-red-600 text-center">{formatNumber(row.inactive_employees)}</td>
                <td className="px-6 py-3 text-sm font-bold text-indigo-600 text-center">{`${percent}%`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const DegreesView = ({ degreesStats = [], summary = {}, filterType = 'active', setFilterType = () => {} }) => {
  const hasData = degreesStats && degreesStats.length > 0;
  const totalEmployeesInDegrees = useMemo(() => degreesStats ? degreesStats.reduce((s, d) => s + (d.total_employees || 0), 0) : 0, [degreesStats]);

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">🎓 إحصائيات الدرجات الوظيفية</h2>
      {hasData ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-indigo-500 text-white rounded-lg"><div>إجمالي أنواع الدرجات</div><div className="text-2xl font-bold">{formatNumber(summary?.totalDegreeTypes)}</div></div>
            <div className="p-4 bg-green-500 text-white rounded-lg"><div>درجات بها موظفون</div><div className="text-2xl font-bold">{formatNumber(summary?.degreesWithEmployees)}</div></div>
            <div className="p-4 bg-red-500 text-white rounded-lg"><div>درجات بدون موظفين</div><div className="text-2xl font-bold">{formatNumber(summary?.degreesWithoutEmployees)}</div></div>
          </div>

          <div className="mb-6 flex justify-end items-center gap-3">
            <label className="text-lg">نوع العرض:</label>
            <select value={filterType} onChange={(e)=>setFilterType(e.target.value)} className="p-2 border rounded">
              <option value="all">عرض جميع الدرجات</option>
              <option value="active">عرض الدرجات التي بها موظفون فقط</option>
            </select>
          </div>

          <DegreesTable data={degreesStats} totalEmployees={totalEmployeesInDegrees} />
        </>
      ) : (
        <p className="text-center text-gray-500 p-4">لا توجد بيانات للدرجات الوظيفية للعرض حالياً.</p>
      )}
    </>
  );
};

/* ============================
   Faculty breakdown components (تفاصيل كلية)
   ============================ */

const BreakdownDepartmentsTable = ({ data = [] }) => {
  const sorted = useMemo(() => [...data].sort((a,b)=> (safeParseInt(b.total_employees) - safeParseInt(a.total_employees))), [data]);
  return (
    <div className="overflow-x-auto border rounded-xl shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right">القسم</th>
            <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right">إجمالي الموظفين</th>
            <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right">نشط حالياً</th>
            <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase text-right">نسبة النشطين</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sorted.map(dept => {
            const total = safeParseInt(dept.total_employees);
            const active = safeParseInt(dept.active_employees);
            const percent = total > 0 ? ((active / total) * 100).toFixed(1) : '0.0';
            return (
              <tr key={dept.dept_code} className="hover:bg-indigo-50/50">
                <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">{dept.name}</td>
                <td className="px-6 py-3 text-sm text-gray-700 text-right">{formatNumber(total)}</td>
                <td className="px-6 py-3 text-sm text-green-700 text-right">{formatNumber(active)}</td>
                <td className="px-6 py-3 text-sm font-bold text-indigo-600 text-right">{percent}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const FacultyBreakdownContent = ({ breakdownData = {} }) => {
  const summary = breakdownData.summary || {};
  const departments = breakdownData.departments || [];
  const academicDegrees = breakdownData.academicDegrees || [];
  const totalEmployees = summary.totalEmployees || 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="إجمالي الموظفين" value={summary.totalEmployees} color="bg-indigo-500" />
        <SummaryCard title="الموظفون النشطون" value={summary.activeEmployees} color="bg-green-500" />
        <SummaryCard title="الموظفون غير النشطين" value={summary.inactiveEmployees} color="bg-red-500" />
        <SummaryCard title="إجمالي الأقسام" value={summary.totalDepartments} color="bg-yellow-500" />
      </div>

      <h3 className="text-xl font-bold">تفاصيل أقسام الكلية</h3>
      {departments.length > 0 ? <BreakdownDepartmentsTable data={departments} /> : <p className="p-4 bg-gray-50 rounded">لا توجد بيانات أقسام.</p>}

      <h3 className="text-xl font-bold">تفاصيل الدرجات الأكاديمية</h3>
      {academicDegrees.length > 0 ? <DegreesTable data={academicDegrees} totalEmployees={totalEmployees} isBreakdown /> : <p className="p-4 bg-gray-50 rounded">لا توجد درجات أكاديمية.</p>}
    </div>
  );
};

const FacultyBreakdownView = ({ faculties = [], loading = false, error = null }) => {
  const [selected, setSelected] = useState(null);
  // ✅ الآن useFacultyBreakdownData معرفة
  const { breakdownData, loading: detailLoading, error: detailError } = useFacultyBreakdownData(selected);

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right border-b pb-3">🔍 تفاصيل الإحصائيات حسب الكلية</h2>
      <div className="mb-4 p-4 bg-gray-50 rounded shadow-inner">
        <p className="mb-3 text-right">الكلية المختارة: <span className="font-bold text-indigo-600">{faculties.find(f => f.code === selected)?.name || 'لم يتم الاختيار'}</span></p>
        <SearchableSelect
          options={faculties.map(f => ({ code: f.code, name: f.name }))}
          selectedCode={selected}
          onSelect={setSelected}
          placeholder="ابحث واختر كلية..."
        />
      </div>

      {selected && detailLoading && <div className="p-4 text-indigo-600">جاري تحميل تفاصيل الكلية...</div>}
      {selected && detailError && <APIErrorBanner message={detailError} />}
      {breakdownData && !detailLoading && <FacultyBreakdownContent breakdownData={breakdownData} />}
      {!selected && !loading && <p className="p-6 bg-gray-50 text-center rounded">الرجاء اختيار كلية لعرض التفاصيل.</p>}
    </>
  );
};

/* ============================
   BigStatCard + SummaryCard
   ============================ */
const BigStatCard = ({ title, value, icon, color = 'bg-indigo-600', isPercentage = false }) => {
  const textColor = color.replace('bg-', 'text-') || 'text-indigo-600';
  return (
    <div className="p-5 bg-white rounded-xl shadow-xl border border-gray-100 h-36 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <span className={`text-4xl ${textColor}`}>{icon}</span>
        <p className="text-sm font-semibold text-gray-600 text-right">{title}</p>
      </div>
      <CountUpAnimation endValue={value} isPercentage={isPercentage} />
    </div>
  );
};

const SummaryCard = ({ title, value, color = 'bg-indigo-500', isPercentage = false }) => (
  <div className={`p-4 ${color} text-white rounded-lg shadow-md text-right`}>
    <p className="text-base font-medium">{title}</p>
    <h3 className="text-3xl font-bold mt-1">{isPercentage ? `${formatNumber(value)}%` : formatNumber(value)}</h3>
  </div>
);

/* ============================
   المكون الرئيسي — Statistics
   ============================ */
const Statistics = () => {
  const { stats, facultiesStats, degreesStats, loading, errors } = useStatisticsData();
  const { faculties: structureFaculties, loading: structureLoading, error: structureError } = useFacultyStructure();
  const { degreeGapsStats, loading: gapsLoading, error: gapsError } = useDegreeGapsData();

  const [facultyFilterType, setFacultyFilterType] = useState('all');
  const [degreeFilterType, setDegreeFilterType] = useState('active');
  const [selectedView, setSelectedView] = useState('status');

  const totalStatusCount = useMemo(() => stats?.employeesByStatus?.reduce((s, it) => s + (it.count || 0), 0) || 0, [stats]);

  const filteredFaculties = useMemo(() => {
    if (!facultiesStats) return [];
    if (facultyFilterType === 'all') return facultiesStats;
    return facultiesStats.filter(f => f.category === facultyFilterType || f.category.includes(facultyFilterType));
  }, [facultiesStats, facultyFilterType]);

  const filteredDegrees = useMemo(() => {
    if (!degreesStats) return [];
    const all = degreesStats.allDegrees ? degreesStats.allDegrees.map(d => ({ ...d, total_employees: safeParseInt(d.total_employees) })) : [];
    return degreeFilterType === 'active' ? all.filter(d => safeParseInt(d.total_employees) > 0) : all;
  }, [degreesStats, degreeFilterType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50" dir="rtl">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="mr-4 text-xl text-indigo-600 font-semibold">جاري تحميل لوحة الإحصائيات...</p>
      </div>
    );
  }

  if (errors.general || errors.overview) {
    return (
      <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-xl m-10 text-right" dir="rtl">
        <h2 className="text-2xl font-bold mb-3">⚠️ خطأ فادح في الاتصال</h2>
        <p className="text-lg">حدث خطأ أثناء جلب البيانات الرئيسية. يرجى التحقق من الخدمة.</p>
      </div>
    );
  }

  const activeEmployeesCount = safeParseInt(stats?.activeEmployees);
  const totalEmployeesCount = safeParseInt(stats?.totalEmployees);
  const inactiveEmployeesCount = totalEmployeesCount - activeEmployeesCount;
  const activePercentageValue = totalEmployeesCount > 0 ? ((activeEmployeesCount / totalEmployeesCount) * 100) : 0;

  return (
    <div className="min-h-screen w-[90%] m-auto bg-gray-50 p-6 md:p-12" dir="rtl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-right border-b-4 border-indigo-500 pb-3">لوحة إحصائيات الموارد البشرية 📊</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <BigStatCard title="إجمالي عدد الموظفين" value={stats?.totalEmployees} icon="👥" color="bg-indigo-600" />
        <BigStatCard title="الموظفين النشطين" value={stats?.activeEmployees} icon="✅" color="bg-green-600" />
        <BigStatCard title="الموظفين غير النشطين" value={inactiveEmployeesCount} icon="❌" color="bg-red-600" />
        <BigStatCard title="نسبة النشطين" value={activePercentageValue} icon="📈" color="bg-yellow-600" isPercentage />
      </div>

      <ViewSelector selectedView={selectedView} setSelectedView={setSelectedView} />

      <div className="bg-white shadow-2xl rounded-xl p-8">
        {errors.faculties && selectedView === 'faculties' && <APIErrorBanner message={errors.faculties} />}
        {errors.degrees && selectedView === 'degrees' && <APIErrorBanner message={errors.degrees} />}
        {gapsError && selectedView === 'gaps' && <APIErrorBanner message={gapsError} />}

        {selectedView === 'status' && <StatusView stats={stats} totalStatusCount={totalStatusCount} />}

        {selectedView === 'faculties' && <FacultiesView facultiesStats={filteredFaculties} filterType={facultyFilterType} setFilterType={setFacultyFilterType} />}

        {selectedView === 'degrees' && <DegreesView degreesStats={filteredDegrees} summary={degreesStats?.summary} filterType={degreeFilterType} setFilterType={setDegreeFilterType} />}

        {selectedView === 'breakdown' && <FacultyBreakdownView faculties={structureFaculties} loading={structureLoading} error={structureError} />}

        {selectedView === 'gaps' && <DegreeGapsView degreeGapsStats={degreeGapsStats} loading={gapsLoading} error={gapsError} />}
      </div>

      {/* طباعة خفيفة — إخفاء عناصر التحكم عند الطباعة */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Statistics;
