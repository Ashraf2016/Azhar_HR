import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/axiosInstance";
import { useIsLoggedIn } from "../contexts/isLoggedinContext";

const LoginPage = () => {
  const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // إذا المستخدم مسجل دخول بالفعل، نوجهه مباشرة
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      navigate("/"); 
    }
  }, [isLoggedIn, navigate, setIsLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/auth/login",
        { username, password }
      );

      const data = response.data;
      console.log(data);
      localStorage.setItem("userId", data.id);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        setIsLoggedIn(true); // تحديث الحالة فوراً
        navigate("/");       // توجيه للصفحة الرئيسية
      } else {
        setError(data.message || "بيانات الدخول غير صحيحة");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError("بيانات الدخول غير صحيحة");
      } else {
        setError("فشل الاتصال بالخادم. حاول لاحقًا.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center flex-1 bg-gray-50 bg-[url(/azhar.jpg)] bg-no-repeat bg-bottom bg-cover">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="absolute top-4 right-4 z-20">
        <div className="top-6 right-6 z-30 text-center bg-white/90 text-blue-900 px-5 py-4 rounded-2xl shadow-xl border border-gray-200 backdrop-blur-sm flex flex-col gap-2">
          <div className="text-2xl">📘</div>
          <div className="text-center leading-tight">
            <h1 className="font-bold">برنامج الشؤون الإدارية</h1>
            <p className="text-sm text-gray-700">جامعة الأزهر</p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="text-center relative z-10 mx-auto px-6 max-w-md px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl font-bold text-white mb-4">يرجى تسجيل الدخول</h1>
        <p className="text-gray-200 mb-6">
          للوصول إلى دليل الموظفين، يرجى تسجيل الدخول أولاً.
        </p>
        <form onSubmit={handleLogin}>
          {error && (
            <p className="text-red-500 bg-white/80 rounded-lg p-2 mb-3 text-sm">
              {error}
            </p>
          )}
          <div className="mb-4 flex items-center gap-1 flex-wrap sm:flex-nowrap">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="اسم المستخدم"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right shadow-sm hover:shadow-md"
              required
            />
            <label className="w-30 text-right font-medium text-white">
              : اسم المستخدم
            </label>
          </div>

          <div className="mb-6 flex items-center gap-1 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right shadow-sm hover:shadow-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <label className="w-30 text-right font-medium text-white">
              : كلمة المرور
            </label>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white cursor-pointer rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mx-auto" />
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>
      </div>

      <footer className="absolute bottom-4 w-full text-center">
        <p className="text-center text-sm text-white/90">
          &copy; 2025 جامعة الأزهر - جميع الحقوق محفوظة
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
