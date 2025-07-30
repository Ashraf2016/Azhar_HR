import { useState } from "react";
import { ChevronLeft, ChevronDown, Menu, X, LogOut } from "lucide-react";
import Logo from "../assets/Logo.png";
import { useIsLoggedIn } from "../contexts/isLoggedinContext";

const Navbar = ({ onLogoClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn();

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  // منع الدخول لغير المسجلين
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
      <nav className="bg-blue-900 text-white shadow-lg" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer"
              onClick={onLogoClick}
            >
              <div className="text-blue-900 rounded-lg p-2 ml-3">
                <img
                  src={Logo}
                  alt="Logo"
                  className="p-0.5 w-16 h-16 rounded-full object-cover border-2"
                />
              </div>
              <span className="text-xl font-bold">جامعة الأزهر الشريف</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-4">
              <div className="mr-10 flex items-baseline space-x-reverse space-x-4 relative">
                <a
                  href="/"
                  onClick={(e) => handleProtectedLink(e, "/")}
                  className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  الرئيسية
                </a>

                {/* الموظفون Dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      isLoggedIn
                        ? setIsDropdownOpen((prev) => !prev)
                        : setShowLoginModal(true)
                    }
                    className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    الموظفون
                    {isDropdownOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronLeft className="w-4 h-4" />
                    )}
                  </button>

                  {isDropdownOpen && isLoggedIn && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg ring-1 ring-black overflow-hidden ring-opacity-5 z-50">
                      <a
                        href="/createUser"
                        onClick={(e) => handleProtectedLink(e, "/createUser")}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        إنشاء مستخدم جديد
                      </a>
                      <a
                        href="/permission"
                        onClick={(e) => handleProtectedLink(e, "/permissions")}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        صلاحيات المستخدم
                      </a>
                    </div>
                  )}
                </div>

                <a
                  href="#"
                  onClick={(e) => handleProtectedLink(e, "/sections")}
                  className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  الأقسام
                </a>
                <a
                  href="#"
                  onClick={(e) => handleProtectedLink(e, "/settings")}
                  className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  الإعدادات
                </a>
              </div>

              {/* تسجيل الخروج */}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2 rounded-md hover:bg-blue-800"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-800 px-4 py-3 space-y-2">
            <a
              href="/"
              onClick={(e) => handleProtectedLink(e, "/")}
              className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
            >
              الرئيسية
            </a>

            {/* الموظفون في الموبايل */}
            <div>
              <button
                onClick={() =>
                  isLoggedIn
                    ? setIsDropdownOpen((prev) => !prev)
                    : setShowLoginModal(true)
                }
                className="w-full text-right text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm flex justify-between items-center"
              >
                <span>الموظفون</span>
                {isDropdownOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>

              {isDropdownOpen && isLoggedIn && (
                <div className="pl-4 pr-2 mt-1 space-y-1">
                  <a
                    href="/createUser"
                    onClick={(e) => handleProtectedLink(e, "/createUser")}
                    className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
                  >
                    إنشاء مستخدم جديد
                  </a>
                  <a
                    href="/permission"
                    onClick={(e) => handleProtectedLink(e, "/permissions")}
                    className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
                  >
                    صلاحيات المستخدم
                  </a>
                </div>
              )}
            </div>

            <a
              href="#"
              onClick={(e) => handleProtectedLink(e, "/sections")}
              className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
            >
              الأقسام
            </a>
            <a
              href="#"
              onClick={(e) => handleProtectedLink(e, "/settings")}
              className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
            >
              الإعدادات
            </a>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="w-full text-right px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm text-white"
              >
                تسجيل الخروج
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              يجب تسجيل الدخول أولاً
            </h2>
            <p className="text-gray-600 mb-6">
              يرجى تسجيل الدخول للوصول إلى هذه الصفحة.
            </p>
            <button
              onClick={() => setShowLoginModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

