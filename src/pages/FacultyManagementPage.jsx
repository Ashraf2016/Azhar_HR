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
  Search 
} from "lucide-react";

export default function FacultyManagementPage() {
  // ================= State Management =================
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals Visibility
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Data for Actions
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFacCode, setCurrentFacCode] = useState(null);
  const [facultyToDelete, setFacultyToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  // ================= API Calls =================
  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/university/faculty");
      setFaculties(res.data);
    } catch (err) {
      setError("فشل تحميل الكليات. يرجى التحقق من الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axiosInstance.put(`/university/faculty/${currentFacCode}`, { name: formData.name });
      } else {
        await axiosInstance.post("/university/faculty", { name: formData.name });
      }
      closeFormModal();
      fetchFaculties();
    } catch (err) {
      alert("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const confirmDelete = async () => {
    if (!facultyToDelete) return;
    try {
      await axiosInstance.delete(`/university/faculty/${facultyToDelete.code}`);
      setIsDeleteModalOpen(false);
      setFacultyToDelete(null);
      fetchFaculties();
    } catch (err) {
      alert("فشل حذف الكلية");
    }
  };

  // ================= Helper Functions =================
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "" });
    setIsFormModalOpen(true);
  };

  const openEditModal = (faculty) => {
    setIsEditMode(true);
    setCurrentFacCode(faculty.code);
    setFormData({ name: faculty.name });
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setCurrentFacCode(null);
  };

  const openDeleteConfirmation = (faculty) => {
    setFacultyToDelete(faculty);
    setIsDeleteModalOpen(true);
  };

  // Filter faculties based on search
  const filteredFaculties = faculties.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <School size={28} />
              </div>
              إدارة الكليات
            </h1>
            <p className="text-gray-500 mt-2 mr-1">التحكم في الإضافة أو التعديل أو الحذف </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 font-bold"
          >
            <Plus size={22} />
            إضافة كلية جديدة
          </button>
        </div>

        {/* --- Search & Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="ابحث عن كلية..."
              className="w-full pr-11 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center p-3 text-blue-700 font-bold">
            إجمالي الكليات: {faculties.length}
          </div>
        </div>

        {/* --- Main Table Card --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-5 text-gray-600 font-bold w-24 text-center">#</th>
                  <th className="p-5 text-gray-600 font-bold">اسم الكلية</th>
                  <th className="p-5 text-gray-600 font-bold text-center w-48">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                   <tr>
                    <td colSpan="3" className="p-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="font-medium">جاري جلب البيانات...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredFaculties.length > 0 ? (
                  filteredFaculties.map((fac, index) => (
                    <tr key={fac.code} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="p-5 text-center text-gray-400 font-mono">{index + 1}</td>
                      <td className="p-5 font-semibold text-gray-700">{fac.name}</td>
                      <td className="p-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEditModal(fac)}
                            className="p-2.5 text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all"
                            title="تعديل"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => openDeleteConfirmation(fac)}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="حذف"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-20 text-center text-gray-400">
                      <p className="text-lg">لا توجد نتائج مطابقة لبحثك</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= MODAL: Add / Edit ================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeFormModal} />
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl transform transition-all animate-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-extrabold text-gray-800">
                {isEditMode ? "تحديث بيانات الكلية" : "إضافة كلية جديدة"}
              </h2>
              <button onClick={closeFormModal} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">اسم الكلية</label>
                <input
                  type="text"
                  placeholder="أدخل اسم الكلية هنا..."
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl p-4 text-right focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-gray-50/50"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  {isEditMode ? "تحديث الآن" : "إضافة الكلية"}
                </button>
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="w-full bg-white border border-gray-200 text-gray-600 px-6 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: Delete Confirmation ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8 animate-in zoom-in duration-200 text-center border border-red-50">
            <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="text-red-600" size={40} />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-3">هل أنت متأكد؟</h3>
            <p className="text-gray-500 leading-relaxed mb-8 text-lg">
              سيتم حذف كلية <span className="font-bold text-red-600 underline">"{facultyToDelete?.name}"</span> بشكل نهائي. هل تود الاستمرار؟
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
              >
                نعم، احذف الكلية
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all"
              >
                تراجع عن الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}