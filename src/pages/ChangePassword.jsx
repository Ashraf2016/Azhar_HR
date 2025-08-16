import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId")

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return setMessage("كلمة المرور الجديدة غير متطابقة");
    }

    try {
      setLoading(true);
      if (!userId) {
        return setMessage("حدث خطأ: لا يمكن التعرف على المستخدم");
      }
      else {
      const response = await axios.post(
        `https://university.roboeye-tec.com/auth/change-password/${userId}`,
        {
          "currentPassword" : oldPassword,
          "newPassword": newPassword,
        }
      );

      setMessage("تم تغيير كلمة المرور بنجاح");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    }


    } catch (error) {
      setMessage("حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center flex-1 bg-gray-50 bg-[url(/azhar.jpg)] bg-no-repeat bg-bottom bg-cover">
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/90 text-blue-900 px-5 py-4 rounded-2xl shadow-xl border border-gray-200 backdrop-blur-sm flex flex-col gap-2">
          <div className="text-2xl">📘</div>
          <div className="text-center leading-tight">
            <h1 className="font-bold">برنامج الشؤون الإدارية</h1>
            <p className="text-sm text-gray-700">جامعة الأزهر</p>
          </div>
        </div>
      </div>

      <div className="text-center relative z-10 mx-auto px-6 max-w-xl">
        <h1 className="text-3xl font-bold text-white mb-4">تغيير كلمة المرور</h1>
        <form onSubmit={handleSubmit} className="bg-white/90 p-8 rounded-xl shadow-xl space-y-4">
          {message && <p className="text-center text-sm text-red-600 font-semibold">{message}</p>}

          <div className="text-right">
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الحالية <span className="text-red-600">*</span></label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 text-right border border-gray-300 rounded-lg shadow-sm"
              required
            />
          </div>

          <div className="relative text-right">
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة <span className="text-red-600">*</span></label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 text-right border border-gray-300 rounded-lg shadow-sm pr-10"
              required
            />
            <button
              type="button"
              className="absolute left-3 top-9 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative text-right">
            <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور الجديدة <span className="text-red-600">*</span></label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 text-right py-2 border border-gray-300 rounded-lg shadow-sm pr-10"
              required
            />
            <button
              type="button"
              className="absolute left-3 top-9 text-gray-500"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {loading ? "جاري الحفظ..." : "تغيير كلمة المرور"}
          </button>
        </form>
      </div>

      <footer className="absolute bottom-4 w-full text-center">
        <p className="text-sm text-white/90">&copy; 2025 جامعة الأزهر - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default ChangePasswordPage;
