import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  School, 
  Loader2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Layers,
  Search 
} from "lucide-react";

export default function DepartmentManagementPage() {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedFaculties, setExpandedFaculties] = useState({});

  // البحث العام في الصفحة
  const [globalSearch, setGlobalSearch] = useState("");

  // Modals States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Search & Dropdown States (داخل المودال)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [facSearchTerm, setFacSearchTerm] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDeptCode, setCurrentDeptCode] = useState(null);
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: "", fac_code: "" });

  // ================= Fetch Data =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, facRes] = await Promise.all([
        axiosInstance.get("/university/department"),
        axiosInstance.get("/university/faculty")
      ]);
      setDepartments(deptRes.data);
      setFaculties(facRes.data);
    } catch (err) {
      console.error("فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ================= Handlers =================
  const toggleFaculty = (facCode) => {
    setExpandedFaculties(prev => ({ ...prev, [facCode]: !prev[facCode] }));
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", fac_code: "" });
    setIsFormModalOpen(true);
  };

  const openEditModal = (dept) => {
    setIsEditMode(true);
    setCurrentDeptCode(dept.dept_code);
    setFormData({ name: dept.name, fac_code: dept.fac_code });
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setFacSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: formData.name, fac_code: Number(formData.fac_code) };
      if (isEditMode) {
        await axiosInstance.put(`/university/department/${currentDeptCode}`, payload);
      } else {
        await axiosInstance.post("/university/department", payload);
      }
      closeFormModal();
      fetchData();
    } catch (err) { alert("حدث خطأ أثناء الحفظ"); }
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/university/department/${deptToDelete.dept_code}`);
      setIsDeleteModalOpen(false);
      setDeptToDelete(null);
      fetchData();
    } catch (err) { alert("فشل الحذف"); }
  };

  // ================= Logic البحث الذكي =================
  // تصفية الكليات التي تحتوي هي أو أقسامها على نص البحث
  const filteredFaculties = faculties.filter(fac => {
    const facMatch = fac.name.toLowerCase().includes(globalSearch.toLowerCase());
    const deptsMatch = departments.some(d => 
      d.fac_code === fac.code && d.name.toLowerCase().includes(globalSearch.toLowerCase())
    );
    return facMatch || deptsMatch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Layers className="text-blue-600" size={28} /> إدارة الأقسام
            </h1>
            <p className="text-gray-500 text-sm mt-1">تنظيم الاقسام العلمية بسهولة</p>
          </div>
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95 font-bold">
            <Plus size={20} /> إضافة قسم جديد
          </button>
        </div>

        {/* حقل البحث العلوي الجديد */}
        <div className="relative mb-8 group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="ابحث عن قسم أو كلية معينة..."
            className="w-full pr-12 pl-4 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white shadow-sm font-medium"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : (
          <div className="space-y-4">
            {filteredFaculties.map((fac) => {
              // تصفية الأقسام بناءً على البحث أيضاً
              const facDepts = departments.filter(d => 
                d.fac_code === fac.code && 
                d.name.toLowerCase().includes(globalSearch.toLowerCase())
              );
              
              // فتح الأكورديون تلقائياً إذا كان هناك بحث نشط
              const isOpen = globalSearch !== "" ? true : expandedFaculties[fac.code];

              return (
                <div key={fac.code} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                  <div 
                    onClick={() => toggleFaculty(fac.code)}
                    className={`p-5 flex justify-between items-center cursor-pointer transition-colors ${isOpen ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-100"><School size={22} /></div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{fac.name}</h3>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{facDepts.length} قسم متوفر</span>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp size={22} className="text-blue-600" /> : <ChevronDown size={22} className="text-gray-400" />}
                  </div>

                  {isOpen && (
                    <div className="border-t border-gray-50 bg-white animate-in slide-in-from-top-2 duration-300">
                      {facDepts.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                          {facDepts.map((dept) => (
                            <div key={dept.dept_code} className="p-5 flex justify-between items-center hover:bg-gray-50/80 transition-colors group">
                              <span className="text-gray-700 pr-4 group-hover:text-blue-700 font-semibold transition-colors">{dept.name}</span>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModal(dept)} className="p-2.5 text-yellow-600 hover:bg-yellow-100 rounded-xl transition-all" title="تعديل"><Edit2 size={18} /></button>
                                <button onClick={() => { setDeptToDelete(dept); setIsDeleteModalOpen(true); }} className="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-all" title="حذف"><Trash2 size={18} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-gray-400 text-sm italic">لا توجد نتائج مطابقة لبحثك في هذه الكلية</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
            {filteredFaculties.length === 0 && (
              <div className="text-center p-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-lg">عذراً، لم نجد أي كلية أو قسم بهذا الاسم</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL: Add / Edit ================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={closeFormModal} />
          <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200 border border-gray-100">
            <h2 className="text-2xl font-black mb-8 text-gray-800 border-b pb-4">{isEditMode ? "تعديل بيانات القسم" : "إضافة قسم جديد"}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 mr-1">اسم القسم</label>
                <input
                  type="text"
                  placeholder="مثال: العقيدة والفلسفة"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none bg-gray-50/50 transition-all font-medium"
                  required
                />
              </div>

              {/* Searchable Select */}
              <div className="relative">
                <label className="block text-sm font-black text-gray-700 mb-2 mr-1">الكلية</label>
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full border border-gray-200 rounded-2xl p-4 bg-gray-50/50 flex justify-between items-center cursor-pointer hover:border-blue-600 transition-all shadow-inner"
                >
                  <span className={formData.fac_code ? "text-gray-800 font-bold" : "text-gray-400"}>
                    {formData.fac_code ? faculties.find(f => f.code == formData.fac_code)?.name : "اختر الكلية..."}
                  </span>
                  <ChevronDown size={20} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b bg-gray-50">
                      <div className="relative">
                        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text"
                          placeholder="ابحث عن الكلية هنا..."
                          className="w-full pr-10 pl-3 py-2.5 text-sm rounded-xl outline-none border border-gray-200 focus:border-blue-500 bg-white shadow-sm"
                          value={facSearchTerm}
                          onChange={(e) => setFacSearchTerm(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-52 overflow-y-auto custom-scrollbar">
                      {faculties.filter(f => f.name.includes(facSearchTerm)).map(f => (
                        <div 
                          key={f.code}
                          onClick={() => {
                            setFormData({...formData, fac_code: f.code});
                            setIsDropdownOpen(false);
                            setFacSearchTerm("");
                          }}
                          className={`p-4 text-sm font-bold cursor-pointer hover:bg-blue-50 transition-colors ${formData.fac_code == f.code ? 'bg-blue-600 text-white hover:bg-blue-600' : 'text-gray-700'}`}
                        >
                          {f.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">حفظ البيانات</button>
                <button type="button" onClick={closeFormModal} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: Delete ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-sm p-10 shadow-2xl animate-in zoom-in duration-200 text-center border border-red-50">
            <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-600 shadow-inner"><AlertTriangle size={40} /></div>
            <h3 className="text-2xl font-black text-gray-900">تأكيد الحذف</h3>
            <p className="text-gray-500 mt-3 mb-8 text-sm leading-relaxed font-medium">هل أنت متأكد تماماً من حذف قسم <span className="font-bold text-red-600 underline">"{deptToDelete?.name}"</span>؟</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDelete} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95">نعم، احذف الآن</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all">تراجع</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}