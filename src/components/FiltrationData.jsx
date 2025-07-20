const FiltrationData = ({ filtrationData }) => {
  const badges = [
    { label: "كلية", value: filtrationData?.faculty },
    { label: "قسم", value: filtrationData?.department },
    { label: "درجة", value: filtrationData?.degree },
  ].filter((badge) => badge.value);

  return (
    <>
      {filtrationData && badges.length && (
        <div className="bg-white rounded-lg w-fit shadow-sm border border-gray-200 p-3 mb-4">
          <div className="flex flex-wrap gap-4 items-center">
            {badges.map((badge, index) => (
              <>
                <div key={badge.label} className="flex items-center gap-2">
                  <span className="text-gray-700">{badge.label}:</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {badge.value}
                  </span>
                </div>
                {index < badges.length - 1 && (
                  <div className="w-px h-6 bg-gray-200 hidden sm:block" />
                )}
              </>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FiltrationData;

