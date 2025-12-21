// import { useState } from "react";
// import {
//   ChevronLeft,
//   ChevronDown,
//   Menu,
//   X,
//   LogOut,
//   User,
// } from "lucide-react";
// import Logo from "../assets/Logo.png";
// import { useIsLoggedIn } from "../contexts/isLoggedinContext";

// const Navbar = ({ onLogoClick }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

//   const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn();
//   const username = localStorage.getItem("username");

//   // تسجيل الخروج
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("username");
//     setIsLoggedIn(false);
//     window.location.href = "/";
//   };

//   // منع الدخول لغير المسجلين
//   const handleProtectedLink = (e, path) => {
//     if (!isLoggedIn) {
//       e.preventDefault();
//       setShowLoginModal(true);
//     } else {
//       window.location.href = path;
//     }
//   };

//   return (
//     <>
//       <nav className="bg-blue-900 text-white shadow-lg print:hidden" dir="rtl">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div
//               className="flex items-center cursor-pointer"
//               onClick={onLogoClick}
//             >
//               <div className="text-blue-900 rounded-lg p-2 ml-3">
//                 <img
//                   src={Logo}
//                   alt="Logo"
//                   className="p-0.5 w-16 h-16 rounded-full object-cover border-2"
//                 />
//               </div>
//               <span className="text-xl font-bold">جامعة الأزهر الشريف</span>
//             </div>

//             {/* Desktop Links */}
//             <div className="hidden md:flex items-center gap-6">
//               <div className="mr-10 flex items-baseline space-x-reverse space-x-4 relative">
//                 <a
//                   href="/"
//                   onClick={(e) => handleProtectedLink(e, "/")}
//                   className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                 >
//                   الرئيسية
//                 </a>

//                 {/* الموظفون Dropdown */}
//                 <div className="relative">
//                   <button
//                     onClick={() =>
//                       isLoggedIn
//                         ? setIsDropdownOpen((prev) => !prev)
//                         : setShowLoginModal(true)
//                     }
//                     className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
//                   >
//                     الموظفون
//                     {isDropdownOpen ? (
//                       <ChevronDown className="w-4 h-4" />
//                     ) : (
//                       <ChevronLeft className="w-4 h-4" />
//                     )}
//                   </button>

//                   {isDropdownOpen && isLoggedIn && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg ring-1 ring-black overflow-hidden ring-opacity-5 z-50">
//                       <a
//                         href="/createUser"
//                         onClick={(e) => handleProtectedLink(e, "/createUser")}
//                         className="block px-4 py-2 text-sm hover:bg-gray-100"
//                       >
//                         إنشاء مستخدم جديد
//                       </a>
//                       <a
//                         href="/roles"
//                         onClick={(e) => handleProtectedLink(e, "/roles")}
//                         className="block px-4 py-2 text-sm hover:bg-gray-100"
//                       >
//                         صلاحيات المستخدم
//                       </a>
//                     </div>
//                   )}
//                 </div>

//                 <a
//                   href="/statistics"
//                   onClick={(e) => handleProtectedLink(e, "/statistics")}
//                   className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                 >
//                   الاحصائيات
//                 </a>
//                 <a
//                   href="/assignTA"
//                   onClick={(e) => handleProtectedLink(e, "/assignTA")}
//                   className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                 >
//                   تعيين جديد
//                 </a>

                
//               </div>

//               {/* أيقونة المستخدم */}
//               {isLoggedIn && (
//                 <div className="relative">
//                   <button
//                     onClick={() => setIsUserMenuOpen((prev) => !prev)}
//                     className="flex cursor-pointer items-center gap-2 bg-blue-800 px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
//                   >
//                     <User className="w-5 h-5" />
//                     <span>{username}</span>
//                     {isUserMenuOpen ? (
//                       <ChevronDown className="w-4 h-4" />
//                     ) : (
//                       <ChevronLeft className="w-4 h-4" />
//                     )}
//                   </button>

//                   {isUserMenuOpen && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg ring-1 ring-black overflow-hidden ring-opacity-5 z-50">
//                       <a
//                         href="/change-password"
//                         className="block px-4 py-2 text-sm hover:bg-gray-100"
//                       >
//                         تعديل كلمة المرور
//                       </a>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 flex  cursor-pointer items-center gap-2 text-red-600"
//                       >
//                         <LogOut className="w-4 h-4" />
//                         تسجيل الخروج
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="md:hidden">
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="text-white p-2 rounded-md hover:bg-blue-800"
//               >
//                 {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden bg-blue-800 px-4 py-3 space-y-2">
//             <a
//               href="/"
//               onClick={(e) => handleProtectedLink(e, "/")}
//               className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
//             >
//               الرئيسية
//             </a>

//             {/* الموظفون في الموبايل */}
//             <div>
//               <button
//                 onClick={() =>
//                   isLoggedIn
//                     ? setIsDropdownOpen((prev) => !prev)
//                     : setShowLoginModal(true)
//                 }
//                 className="w-full text-right text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm flex justify-between items-center"
//               >
//                 <span>الموظفون</span>
//                 {isDropdownOpen ? (
//                   <ChevronDown className="w-4 h-4" />
//                 ) : (
//                   <ChevronLeft className="w-4 h-4" />
//                 )}
//               </button>

//               {isDropdownOpen && isLoggedIn && (
//                 <div className="pl-4 pr-2 mt-1 space-y-1">
//                   <a
//                     href="/createUser"
//                     onClick={(e) => handleProtectedLink(e, "/createUser")}
//                     className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
//                   >
//                     إنشاء مستخدم جديد
//                   </a>
//                   <a
//                     href="/roles"
//                     onClick={(e) => handleProtectedLink(e, "/roles")}
//                     className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
//                   >
//                     صلاحيات المستخدم
//                   </a>
//                 </div>
//               )}
//             </div>

//             <a
//                   href="/statistics"
//                   onClick={(e) => handleProtectedLink(e, "/statistics")}
//                   className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                 >
//                   الاحصائيات
//             </a>
//             <a
//               href="/assignTA"
//               onClick={(e) => handleProtectedLink(e, "/assignTA")}
//               className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
//             >
//               تعيين جديد
//             </a>
            

//             {/* أيقونة المستخدم في الموبايل */}
//             {isLoggedIn && (
//               <div className="relative">
//                 <button
//                   onClick={() => setIsUserMenuOpen((prev) => !prev)}
//                   className="w-full cursor-pointer flex items-center justify-between px-3 py-2 bg-blue-700 rounded-md text-sm"
//                 >
//                   <div className="flex items-center gap-2">
//                     <User className="w-5 h-5" />
//                     <span>{username}</span>
//                   </div>
//                   {isUserMenuOpen ? (
//                     <ChevronDown className="w-4 h-4" />
//                   ) : (
//                     <ChevronLeft className="w-4 h-4" />
//                   )}
//                 </button>

//                 {isUserMenuOpen && (
//                   <div className="mt-2 bg-white text-gray-800 overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
//                     <a
//                       href="/change-password"
//                       className="block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
//                     >
//                       تعديل كلمة المرور
//                     </a>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-right cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
//                     >
//                       <LogOut className="w-4 h-4" />
//                       تسجيل الخروج
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </nav>

//       {/* Modal */}
//       {showLoginModal && (
//         <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
//             <h2 className="text-lg font-bold text-gray-800 mb-4">
//               يجب تسجيل الدخول أولاً
//             </h2>
//             <p className="text-gray-600 mb-6">
//               يرجى تسجيل الدخول للوصول إلى هذه الصفحة.
//             </p>
//             <button
//               onClick={() => setShowLoginModal(false)}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               إغلاق
//             </button>
//           </div>
//         </div>
//       )}
//       <style>
//         {`
//           @media print {
//             nav {
//               display: none !important;
//             }
//           }
//         `}
//       </style>

//     </>
    
//   );
// };

// export default Navbar;



import { useState } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { useIsLoggedIn } from "../contexts/isLoggedinContext";
import { usePermissions } from "../contexts/PermissionsContext";

const Navbar = ({ onLogoClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn();
  const { permissions, role } = usePermissions(); // role و permissions من context
  
  const username = localStorage.getItem("username");

  const hasPermission = (perm) => permissions?.includes(perm);
  const isSystemAdmin = role === "مدير النظام";

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const handleProtectedLink = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginModal(true);
    } else {
      window.location.href = path;
    }
  };

  return (
    <>
      <nav className="bg-blue-900 text-white shadow-lg print:hidden" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={onLogoClick}>
              <img src={Logo} alt="Logo" className="w-14 h-14 rounded-full border-2" />
              <span className="text-xl font-bold mr-3">جامعة الأزهر الشريف</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="/"
                onClick={(e) => handleProtectedLink(e, "/")}
                className="hover:bg-blue-800 px-3 py-2 rounded-md"
              >
                الرئيسية
              </a>

              <a
                href="/leaders-categories"
                onClick={(e) => handleProtectedLink(e, "/leaders-categories")}
                className="hover:bg-blue-800 px-3 py-2 rounded-md"
              >
                الإدارة
              </a>

              {role === "مدير النظام" && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 hover:bg-blue-800 px-3 py-2 rounded-md"
                >
                  الموظفون
                  {isDropdownOpen ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow">
                        <a href="/users" className="block px-4 py-2 hover:bg-gray-100">الموظفون</a>
                      <a href="/createUser" className="block px-4 py-2 hover:bg-gray-100">
                        إنشاء مستخدم جديد
                      </a>

                      <a href="/roles" className="block px-4 py-2 hover:bg-gray-100">
                        صلاحيات المستخدم
                      </a>
                  </div>
                )}
              </div>
              )}

              {role === "مدير النظام" && (
              <a href="/statistics" onClick={(e) => handleProtectedLink(e, "/")} className="hover:bg-blue-800 px-3 py-2 rounded-md">
                الاحصائيات
              </a>)}

              {hasPermission("employee:create") && (
                <a href="/assignTA" className="hover:bg-blue-800 px-3 py-2 rounded-md">
                  تعيين جديد
                </a>
              )}

              {isLoggedIn && (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 bg-blue-800 px-4 py-2 rounded"
                  >
                    <User size={18} /> {username}
                    {isUserMenuOpen ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded shadow">
                      <a href="/change-password" className="block px-4 py-2 hover:bg-gray-100">
                        تعديل كلمة المرور
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full text-right px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-800 px-4 py-3 space-y-2">
          <a
            href="/"
            onClick={(e) => handleProtectedLink(e, "/")}
            className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md"
          >
            الرئيسية
          </a>

          {role === "مدير النظام" && (
          <div>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full text-right text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm flex justify-between items-center"
            >
              الموظفون
              {isDropdownOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {isDropdownOpen && (
              <div className="pl-4 pr-2 mt-1 space-y-1">
                {hasPermission("user:create") && (
                  <a
                    href="/createUser"
                    className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
                  >
                    إنشاء مستخدم جديد
                  </a>
                )}
                {!isSystemAdmin && (
                  <a
                    href="/roles"
                    className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
                  >
                    صلاحيات المستخدم
                  </a>
                )}
              </div>
            )}
          </div> )}

          {role === "مدير النظام" && (
          <a href="/statistics" className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md">
            الاحصائيات
          </a>)}

          {hasPermission("employee:create") && (
            <a href="/assignTA" className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md">
              تعيين جديد
            </a>
          )}
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="font-bold mb-3">يجب تسجيل الدخول أولاً</h2>
            <button
              onClick={() => setShowLoginModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
