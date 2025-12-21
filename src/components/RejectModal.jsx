import React from "react";
import { X, XCircle } from "lucide-react";

const RejectModal = ({
  showModal,
  onClose,
  selectedAction,
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

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-white relative">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute top-4 left-4 p-1 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <XCircle size={32} />
            <div>
              <h2 className="text-2xl font-bold">رفض الإجراء</h2>
              <p className="text-white/80 text-sm">تأكيد رفض الإجراء</p>
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
            <div className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold">
              {getActionTypeLabel()}
            </div>
          </div>

          {/* Warning Message */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <span className="font-semibold">⚠️ تحذير: </span>
              هل أنت متأكد من رغبتك في رفض هذا الإجراء؟ لا يمكن التراجع عن هذا الإجراء بسهولة.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري المعالجة...
                </div>
              ) : (
                "نعم، رفض الإجراء"
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

export default RejectModal;
