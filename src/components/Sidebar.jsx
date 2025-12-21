import { useNavigate } from "react-router-dom";
import { usePermissions } from "../contexts/PermissionsContext";
import { 
  FileText, 
  Calendar, 
  Briefcase, 
  AlertCircle, 
  TrendingUp,
  UserX,
  Send,
  Award,
  ClipboardList,
  Eye,
  ChevronLeft
} from "lucide-react";

const Sidebar = ({ employeeId, employeeName, currentRank }) => {
  const navigate = useNavigate(); 
  const { permissions, role } = usePermissions();

  const hasPermission = (perm) => permissions?.includes(perm);

  const goToPromotion = () => {
    if (!employeeName || !currentRank) return; 
    navigate(`/promotion/${employeeId}`, {
      state: { employeeName: employeeName || "غير محدد", currentRank: currentRank || "غير محدد" }
    });
  };

  const goToEndService = () => {
    if (!employeeName || !currentRank) return;
    navigate(`/end_service/${employeeId}`, {
      state: { employeeName: employeeName || "غير محدد", currentRank: currentRank || "غير محدد" }
    });
  };

  const goToReview = () => {
    if (!employeeName || !currentRank) return;
    navigate(`/review/${employeeId}`, {
      state: { employeeName: employeeName || "غير محدد", currentRank: currentRank || "غير محدد" }
    });
  };

  const goToSecondment = () => {
    if (!employeeName || !currentRank) return;
    navigate(`/secondment/${employeeId}`, {
      state: { employeeName: employeeName || "غير محدد", currentRank: currentRank || "غير محدد" }
    });
  };

  const goToCreateSecondment = () => {
    if (!employeeName || !currentRank) return;
    navigate(`/secondment/add/${employeeId}`, {
      state: { employeeName: employeeName || "غير محدد", currentRank: currentRank || "غير محدد" }
    });
  };

  const SidebarButton = ({ onClick, icon: Icon, label, variant = "view" }) => {
    const variants = {
      view: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300",
      action: "bg-gradient-to-l from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg",
      danger: "bg-gradient-to-l from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg",
      success: "bg-gradient-to-l from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg",
      warning: "bg-gradient-to-l from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md hover:shadow-lg",
      info: "bg-gradient-to-l from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-md hover:shadow-lg",
      purple: "bg-gradient-to-l from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg"
    };

    return (
      <button
        onClick={onClick}
        className={`group relative flex items-center justify-between w-full px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${variants[variant]} hover:translate-x-[-2px] active:scale-[0.98]`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${variant === "view" ? "bg-gray-100 text-gray-600" : "bg-white/20"}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <ChevronLeft className={`w-4 h-4 transition-transform group-hover:translate-x-[-3px] ${variant === "view" ? "text-gray-400" : "text-white/70"}`} />
      </button>
    );
  };

  return (
    <aside className="w-80 p-7 mt-5">
      <div className="space-y-5">
        {/* بيان الحالة */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl shadow-sm border border-gray-200/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">بيان الحالة</h2>
          </div>
          
          <div className="space-y-2.5">
            {hasPermission("deputation:read") && (
              <SidebarButton
                onClick={() => navigate(`/deputation/${employeeId}`)}
                icon={Send}
                label="إعارات"
                variant="view"
              />
            )}

            {hasPermission("holidays:read") && (
              <SidebarButton
                onClick={() => navigate(`/holidays/${employeeId}`)}
                icon={Calendar}
                label="إجازات"
                variant="view"
              />
            )}

            {hasPermission("punishments:read") && (
              <SidebarButton
                onClick={() => navigate(`/punishments/${employeeId}`)}
                icon={AlertCircle}
                label="جزاءات"
                variant="view"
              />
            )}

            {hasPermission("secondment:read") && (
              <SidebarButton
                onClick={goToSecondment}
                icon={Briefcase}
                label="انتدابات"
                variant="view"
              />
            )}

            {hasPermission("career:read") && (
              <SidebarButton
                onClick={() => navigate(`/careers/${employeeId}`)}
                icon={TrendingUp}
                label="التدرج الوظيفى"
                variant="view"
              />
            )}

            {hasPermission("employee:read") && (
              <SidebarButton
                onClick={() => navigate(`/allStates/${employeeId}`)}
                icon={FileText}
                label="بيان الحالة الكامل"
                variant="view"
              />
            )}
          </div>
        </div>

        {/* القرارات */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl shadow-sm border border-gray-200/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">القرارات</h2>
          </div>
          
          <div className="space-y-2.5">
            {hasPermission("career:create") && (
              <SidebarButton
                onClick={goToPromotion}
                icon={TrendingUp}
                label="ترقيات"
                variant="success"
              />
            )}

            {hasPermission("holidays:create") && (
              <SidebarButton
                onClick={() => navigate(`/holidays/add/${employeeId}`)}
                icon={Calendar}
                label="إضافة إجازة"
                variant="warning"
              />
            )}

            {hasPermission("deputation:create") && (
              <SidebarButton
                onClick={() => navigate(`/deputation/add/${employeeId}`)}
                icon={Send}
                label="إضافة إعارة"
                variant="action"
              />
            )}

            {hasPermission("punishments:create") && (
              <SidebarButton
                onClick={() => navigate(`/punishments/add/${employeeId}`)}
                icon={AlertCircle}
                label="إضافة جزاء"
                variant="info"
              />
            )}

            {hasPermission("secondment:create") && (
              <SidebarButton
                onClick={goToCreateSecondment}
                icon={Briefcase}
                label="إضافة انتداب"
                variant="info"
              />
            )}

            {role === "مدير النظام" && (
              <SidebarButton
                onClick={goToReview}
                icon={Eye}
                label="مراجعة القرارات"
                variant="purple"
              />
            )}

            {hasPermission("employee:update") && (
              <SidebarButton
                onClick={goToEndService}
                icon={UserX}
                label="إنهاء خدمة"
                variant="danger"
              />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;