import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LeadersCategories() {
  const navigate = useNavigate();
  
  const categories = [
    { 
      title: 'رؤساء الجامعة',
      level: 1,
      id: 32
    },
    { 
      title: 'نواب رئيس الجامعة',
      level: 2,
      id: 15
    },
    { 
      title: 'عمداء الكليات',
      level: 3,
      id: 16
    },
    { 
      title: 'وكلاء الكليات',
      level: 4,
      id: 18
    },
    { 
      title: 'رؤساء الأقسام',
      level: 5,
      id: 14
    },
  ];

  const handleView = (title, level, id) => {
    navigate('/leaders', { state: { id } });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 pb-6 border-b-2 border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            القيادات الأكاديمية
          </h1>
        </div>

        {/* Categories List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {categories.map((c, index) => (
            <div
              key={c.title}
              className={`${index !== categories.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              <button
                onClick={() => handleView(c.title, c.level, c.id)}
                className="w-full pointer cursor-pointer px-6 py-5 text-right hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
                      {c.level}
                    </span>
                    <span className="text-base font-medium text-gray-900">
                      {c.title}
                    </span>
                  </div>
                  <svg 
                    className="w-5 h-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 19l-7-7 7-7" 
                    />
                  </svg>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-6 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            القيادات مرتبة حسب التسلسل الإداري من الأعلى إلى الأدنى
          </p>
        </div>
      </div>
    </div>
  );
}