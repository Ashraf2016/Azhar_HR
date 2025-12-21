import React from "react";
import { X, CheckCircle, Calendar } from "lucide-react";

const CompletionModal = ({
  showModal,
  onClose,
  selectedAction,
  memoDate,
  setMemoDate,
  isSubmitting,
  onSubmit,
}) => {
  if (!showModal) return null;

  const getActionTypeLabel = () => {
    const typeMap = {
      job: "ترقية",
      deput: "إعارة",
      punish: "جزاء",
      second: "انتداب",
      holiday: "إجازة",
    };
    return typeMap[selectedAction?.actionType] || "إجراء";
  };

  const getActionTypeColor = () => {
    return "from-blue-500 to-blue-600";
  };

  const getActionTypeBadgeColor = () => {
    return "bg-blue-100 text-blue-800";
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header with gradient background */}
        <div className={`bg-gradient-to-r ${getActionTypeColor()} px-6 py-8 text-white relative`}>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute top-4 left-4 p-1 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <CheckCircle size={32} />
            <div>
              <h2 className="text-2xl font-bold">إتمام الإجراء</h2>
              <p className="text-white/80 text-sm">أكمل تفاصيل الإجراء</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Action Type Badge */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
              نوع الإجراء
            </label>
            <div className={`inline-block ${getActionTypeBadgeColor()} px-4 py-2 rounded-lg font-semibold`}>
              {getActionTypeLabel()}
            </div>
          </div>

          {/* Date Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-blue-500" />
                تاريخ الملاحظة
              </div>
            </label>
            <input
              type="date"
              value={memoDate}
              onChange={(e) => setMemoDate(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-gray-50 disabled:text-gray-500 font-medium"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onSubmit}
              disabled={isSubmitting || !memoDate}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الحفظ...
                </div>
              ) : (
                "تأكيد الإتمام"
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 transition-all duration-200"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
