import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// to connect with api
import axios from "axios";

const CreateUserPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  


  const handleAddUser = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!username || !password || !confirmPassword ||!email) {
      setError("يرجى تعبئة جميع الحقول الإلزامية.");
      return;
    }

    if (password.length < 6) {
    setError("كلمة المرور يجب أن تكون على الأقل 6 أحرف.");
    return;
  }

  // ✅ التحقق من وجود رقم أو رمز خاص
  const passwordPattern = /(?=.*[0-9!@#$%^&*])/;

  if (!passwordPattern.test(password)) {
    setError("كلمة المرور يجب أن تحتوي على رقم أو رمز خاص.");
    return;
  }


    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
axios.post("https://university.roboeye-tec.com/login_system/register", {
    username: email,
    name : username,
    password: password,
  })
  .then((response) => {
    const data = response.data;
    console.log(data)
    
    if (data.success) {
      setSuccess(true);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      // navigate("/permissions")
      
    } else {
      setError(data.message || "حدث خطأ أثناء إنشاء المستخدم.");
    }
  })
  .catch((error) => {
    console.error("Registration error:", error);
    setError("فشل الاتصال بالخادم. حاول مرة أخرى لاحقًا.");
  });

    
  };

  return (
    <div className="px-4 relative flex items-center justify-center flex-1 bg-gray-50 bg-[url(/azhar.jpg)] bg-no-repeat bg-bottom bg-cover">
      <div className="absolute inset-0 z-0 bg-black/50"></div>
      <div className="relative z-10 bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">إنشاء مستخدم جديد</h1>

        {error && <p className="text-red-600 text-sm mb-4 text-right">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm mb-4 text-right">
            ✅ تم إنشاء المستخدم بنجاح!
          </p>
        )}

        <form onSubmit={handleAddUser} className="space-y-4" dir="rtl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم <span className="text-red-600">*</span></label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني<span className="text-red-600">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            />
          </div>

           {/* كلمة المرور */}
      <div className="relative mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور <span className="text-red-600">*</span></label>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm pr-10 focus:ring focus:ring-blue-300"
        />
        <button
          type="button"
          className="absolute left-3 top-9 text-gray-500"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* تأكيد كلمة المرور */}
      <div className="relative mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور <span className="text-red-600">*</span></label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm pr-10 focus:ring focus:ring-blue-300"
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            إضافة المستخدم
          </button>
        </form>
      </div>
      <footer className="absolute  bottom-2 w-full text-center">
        <p className="text-center text-sm text-white/90">&copy; 2025 جامعة الأزهر - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default CreateUserPage;
