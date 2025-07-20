import { useState } from "react";
import { ChevronLeft, ChevronDown, Menu, X } from "lucide-react";
import Logo from "../assets/Logo.png";

const Navbar = ({ onLogoClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
                alt="l"
                className="p-0.5 w-16 h-16 rounded-full object-cover border-2"
              />
            </div>
            <span className="text-xl font-bold">جامعة الأزهر الشريف</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="mr-10 flex items-baseline space-x-reverse space-x-4 relative">
              <a
                href="#"
                className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                الرئيسية
              </a>

              {/* الموظفون مع Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                >
                  الموظفون
                  {isDropdownOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg ring-1 ring-black overflow-hidden ring-opacity-5 z-50">
                    <a
                      href="/createUser"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      إنشاء مستخدم جديد
                    </a>
                    <a
                      href="/permissions"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      صلاحيات المستخدم
                    </a>
                  </div>
                )}
              </div>

              <a
                href="#"
                className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                الأقسام
              </a>
              <a
                href="#"
                className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                الإعدادات
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-800 text-white px-4 py-3 space-y-2">
          <a href="#" className="block py-2 px-2 hover:bg-blue-700 rounded">
            الرئيسية
          </a>
          <div>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full text-right py-2 px-2 hover:bg-blue-700 rounded flex justify-between items-center"
            >
              الموظفون
              {isDropdownOpen ? <ChevronDown size={18} /> : <ChevronLeft size={18} />}
            </button>
            {isDropdownOpen && (
              <div className="pl-4 mt-1 space-y-1">
                <a
                  href="/createUser"
                  className="block py-1 px-2 hover:bg-blue-600 rounded"
                >
                  إنشاء مستخدم جديد
                </a>
                <a
                  href="/permissions"
                  className="block py-1 px-2 hover:bg-blue-600 rounded"
                >
                  صلاحيات المستخدم
                </a>
              </div>
            )}
          </div>
          <a href="#" className="block py-2 px-2 hover:bg-blue-700 rounded">
            الأقسام
          </a>
          <a href="#" className="block py-2 px-2 hover:bg-blue-700 rounded">
            الإعدادات
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
