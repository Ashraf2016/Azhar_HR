import { FileText, Calendar, Briefcase, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

const Sidebar = ({
  employeeId,
  employeeName,
  currentRank,
  onGeneratePDF,
  isGenerating,
  onGenerateIarat,
  isGeneratingIarat,
  onGenerateGazaat,
  isGeneratingGazaat,   
  onGenerateEgaazat,
  isGeneratingEgaazat,
  onGenerateState,
  isGeneratingState
}) => {

  const navigate = useNavigate(); 

  // علشان اروح لصفحة الترقية
  const goToPromotion = () => {
    if (!employeeName || !currentRank) return; 
    navigate(`/promotion/${employeeId}`, {
      state: {
        employeeName: employeeName || "غير محدد",
        currentRank: currentRank || "غير محدد"
      }
    });
  };

  // علشان اروح لصفحة انهاء الخدمة
  const goToEndService = () => {
    if (!employeeName || !currentRank) return;
    navigate(`/end_service/${employeeId}`, {
      state: {
        employeeName: employeeName || "غير محدد",
        currentRank: currentRank || "غير محدد"
      }
    });
  };

  // علشان اروح صفحة الفصل 
  // const goToTerminate = () => {
  //   if (!employeeName || !currentRank) return;
  //   navigate(`/terminate/${employeeId}`, {
  //     state: {
  //       employeeName: employeeName || "غير محدد",
  //       currentRank: currentRank || "غير محدد"
  //     }
  //   });
  // };
  const goToReview = () => {
    if (!employeeName || !currentRank) return;
    navigate(`/review/${employeeId}`, {
      state: {
        employeeName: employeeName || "غير محدد",
        currentRank: currentRank || "غير محدد"
      }
    });
  };

  return (
    <aside className="w-64 bg-transparent p-4 flex flex-col gap-2">
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">بيان الحالة</h2>

        <div className="flex flex-col">
          {/* زر الإعارات */}
          <button
            onClick={() => navigate(`/deputation/${employeeId}`)}
            className="bg-[#10B981] text-white px-4 py-1  my-2 cursor-pointer  rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
             اعارات
          </button>
          

          {/* زر الإجازات */}
          <button
            onClick={() => navigate(`/holidays/${employeeId}`)}
            className="  bg-yellow-600 my-2  text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            اجازات
          </button>
          <button
            onClick={() => navigate(`/punishments/${employeeId}`)}
            className="bg-gray-600 my-2  text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            جزاءات
          </button>
          

          {/* زر التدرج الوظيفي */}
          {/* <button
            onClick={onGeneratePDF}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-yellow-600 my-3 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            <FileText className="w-5 h-5" />
            {isGenerating ? "جاري إنشاء PDF..." : "التدرج الوظيفي"}
          </button> */}
          <button
            onClick={() => navigate(`/careers/${employeeId}`)}
            className=" bg-yellow-600 my-2 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            التدرج الوظيفى
          </button>

          {/* زر الجزاءات */}
          {/* <button
            onClick={onGenerateGazaat}
            disabled={isGeneratingGazaat}  // ✅ تصحيح هنا
            className="flex items-center gap-2 bg-gray-600 my-3 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <AlertCircle className="w-5 h-5" />
            {isGeneratingGazaat ? "جاري إنشاء الجزاءات..." : "الجزاءات"}
          </button> */}
          
          {/* <button
            onClick={onGenerateState}
            disabled={isGeneratingState}  // ✅ تصحيح هنا
            className="flex items-center gap-2 bg-[#10B981] my-3 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-[#10B970] transition-colors disabled:opacity-50"
          >
            <AlertCircle className="w-5 h-5" />
            {isGeneratingState ? "جاري إنشاء بيان الحالة..." : "بيان الحالة"}
          </button> */}
          <button
            onClick={() => navigate(`/allStates/${employeeId}`)}
            className=" bg-[#10B981] my-2 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-[#10B970] transition-colors disabled:opacity-50"
          >
            بيان الحالة
          </button>
        </div>
      </div>

      {/* القرارات */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">القرارات</h2>
        <div className="flex flex-wrap flex-col gap-3">
          <button onClick={goToPromotion} className="bg-green-600 my-1 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-green-700 transition-colors">
            ترقيات
          </button>
          {/* bg-[#1C4E20] */}

          <button
            onClick={() => navigate(`/holidays/add/${employeeId}`)}
            className="  bg-yellow-600 my-1 text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            اجازات
          </button>

          
          <button
            onClick={() => navigate(`/deputation/add/${employeeId}`)}
            className="bg-[#10B981] text-white px-4 py-1 my-1 cursor-pointer  rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
             اعارات
          </button>
          <button
            onClick={() => navigate(`/punishments/add/${employeeId}`)}
            className="bg-gray-600  text-white px-4 py-1 my-1 cursor-pointer rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            جزاءات
          </button>
          <button onClick={goToEndService} className="bg-red-600 text-white px-4 py-1 my-1 cursor-pointer rounded-lg hover:bg-red-700 transition-colors">
            انهاء خدمه
          </button>
          {/* <button onClick={goToTerminate} className="bg-indigo-600 text-white px-4 py-1 my-1 cursor-pointer rounded-lg hover:bg-indigo-800 transition-colors">
               فصل من الخدمة
          </button> */}
          <button
            onClick={() => navigate(`/secondment`)}
            className="bg-[#1C4E20]  text-white px-4 py-1 my-1 cursor-pointer rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            انتدابات
          </button>
          
          
          <button onClick={goToReview} className="bg-[#10B981] text-white px-4 py-1 cursor-pointer rounded-lg hover:bg-indigo-800 transition-colors">
            مراجعة القرارات
          </button>


        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


