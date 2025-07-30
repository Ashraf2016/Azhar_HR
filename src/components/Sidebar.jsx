// import { FileText, Calendar, Briefcase, AlertCircle } from "lucide-react";

// const Sidebar = ({ onGeneratePDF, isGenerating }) => {
//   return (
//     <aside className="w-64 bg-transparent p-4 flex flex-col gap-2">
//       <div className="mt-8 bg-white rounded-lg shadow-md p-6 ">
//         <h2 className="text-lg font-semibold text-gray-800 mb-2">بيان الحالة</h2>
      
//         <div className="flex flex-col">
//             <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1 cursor-pointer my-3 rounded-lg hover:bg-blue-700 transition-colors">
//             <Calendar className="w-5 h-5" />
//             الاعارات
//         </button>
      


//         <button className="flex items-center gap-2 bg-green-600 my-3 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-green-700 transition-colors">
//             <Briefcase className="w-5 h-5" />
//             الاجازات
//         </button>

//         <button
//             onClick={onGeneratePDF}
//             disabled={isGenerating}
//             className="flex items-center gap-2 bg-yellow-600 my-3 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
//         >
//             <FileText className="w-5 h-5" />
//             {isGenerating ? "جاري إنشاء PDF..." : "التدرج الوظيفي"}
//         </button>

//         <button className="flex items-center gap-2 bg-gray-600 my-3 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-gray-700 transition-colors">
//             <AlertCircle className="w-5 h-5" />
//             الجزاءات
//         </button>

//         </div>
//       </div>
//       <div>
//         <div className="mt-6 bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">القرارات</h2>
//           <div className="flex flex-wrap flex-col gap-3">
//             <button className="bg-green-600 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-green-700 transition-colors">
//               ترقيه
//             </button>
//             <button className="bg-red-600 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-red-700 transition-colors">
//               انهاء خدمه
//             </button>
//             <button className="bg-indigo-600 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-indigo-800 transition-colors">
//               فصل
//             </button>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;


import { FileText, Calendar, Briefcase, AlertCircle } from "lucide-react";

const Sidebar = ({
  onGeneratePDF,
  isGeneratingPDF,
  onGenerateIarat,
  isGeneratingIarat,
  onGenerateEgaazat,
  isGeneratingEgaazat,
  onGenerateGaza2at,
  isGeneratingGaza2at,
}) => {
  return (
    <aside className="w-64 bg-transparent p-4 flex flex-col gap-2">
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">بيان الحالة</h2>

        <div className="flex flex-col">
          {/* زر الإعارات */}
          <button
            onClick={onGenerateIarat}
            disabled={isGeneratingIarat}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1 cursor-pointer my-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Calendar className="w-5 h-5" />
            {isGeneratingIarat ? "جاري إنشاء الإعارات..." : "الإعارات"}
          </button>

          {/* زر الإجازات */}
          <button
            onClick={onGenerateEgaazat}
            disabled={isGeneratingEgaazat}
            className="flex items-center gap-2 bg-green-600 my-3 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Briefcase className="w-5 h-5" />
            {isGeneratingEgaazat ? "جاري إنشاء الإجازات..." : "الإجازات"}
          </button>

          {/* زر التدرج الوظيفي */}
          <button
            onClick={onGeneratePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 bg-yellow-600 my-3 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            <FileText className="w-5 h-5" />
            {isGeneratingPDF ? "جاري إنشاء PDF..." : "التدرج الوظيفي"}
          </button>

          {/* زر الجزاءات */}
          <button
            onClick={onGenerateGaza2at}
            disabled={isGeneratingGaza2at}
            className="flex items-center gap-2 bg-gray-600 my-3 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <AlertCircle className="w-5 h-5" />
            {isGeneratingGaza2at ? "جاري إنشاء الجزاءات..." : "الجزاءات"}
          </button>
        </div>
      </div>

      {/* القرارات */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">القرارات</h2>
        <div className="flex flex-wrap flex-col gap-3">
          <button className="bg-green-600 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-green-700 transition-colors">
            ترقيه
          </button>
          <button className="bg-red-600 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-red-700 transition-colors">
            انهاء خدمه
          </button>
          <button className="bg-indigo-600 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-indigo-800 transition-colors">
            فصل
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

