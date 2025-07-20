//useRef to make scroll
import { useState, useRef } from "react";
// to add icons 
import { Eye, PlusCircle, Pencil, Trash, Boxes } from "lucide-react";
// to connect api
import axios from "axios";

const permissionsList = [
  { key: "loans", label: "الإعارات" },
  { key: "punishments", label: "الجزاءات" },
  { key: "Career progression", label: "التدرج الوظيفي" },
  { key: "holidays", label: "الإجازات" },
];

const UserPermissions = () => {
    const [permissions, setPermissions] = useState({});
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    //   علشان يظهر popup للمستخدم توضحله هل تم الحذف ولا لأ 
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success"); // "success" أو "error"
    // تأكيد الحذف
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    // للتعديل الخاص باسم المستخدم
    const [editingUserName, setEditingUserName] = useState("");
    // علشان لما اضغط على تعديل يطلع فوق للجدول
    const permissionsTableRef = useRef(null);


    const handleDeleteUser = (userId) => {
    setSelectedUserId(userId);
    setConfirmModalOpen(true); // افتح المودال
    };

    // دالة الحذف الفعلى 

    const confirmDelete = async () => {
        try {
            await axios.get(`https://university.roboeye-tec.com/login_system/delete-user/${selectedUserId}`);
            setUsers((prev) => prev.filter((user) => user.id !== selectedUserId));
            setPopupMessage("✅ تم حذف المستخدم بنجاح");
            setPopupType("success");
        } catch (err) {
            setPopupMessage("❌ فشل في حذف المستخدم");
            setPopupType("error");
        } finally {
            setConfirmModalOpen(false);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
        }
        };

        // التعديل
        const handleEditPermissions = (user) => {
            const roles = JSON.parse(user.roles || "{}");
            const formatted = {};
            Object.entries(roles).forEach(([section, actions]) => {
                formatted[section] = Object.entries(actions)
                    .filter(([_, value]) => value)
                    .map(([action]) => action);
            });

            setPermissions(formatted);
            setEditingUserName(user.name);
            localStorage.setItem("editingUserId", user.id);

            // تحريك الصفحة إلى جدول الصلاحيات
            setTimeout(() => {
                permissionsTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        };



        //حفظ الصلاحيات
        const handleSubmit = async (e) => {
            e.preventDefault();

            const userId = localStorage.getItem("editingUserId");
            if (!userId) {
                alert("❌ مفيش مستخدم محدد للتعديل");
                return;
            }
            // تحويل شكل بيانات الصلاحيات (permissions) من شكل المستخدم بيختاره في الواجهة (checkboxes) إلى شكل JSON جاهز للإرسال للـ API 
            const formattedPermissions = {};

            // بدل Object.entries(permissions) استخدمي permissionsList:
            permissionsList.forEach(({ key }) => {
            const actions = permissions[key] || [];
            formattedPermissions[key] = {
                view: actions.includes("view"),
                add: actions.includes("add"),
                edit: actions.includes("edit"),
                delete: actions.includes("delete"),
            };
            });


            try {
                console.log(formattedPermissions)
                await axios.put(`https://university.roboeye-tec.com/login_system/update-roles/${userId}`,
                    {
                        roles: formattedPermissions
                    }
                );
                alert("✅ تم حفظ الصلاحيات بنجاح");
                handleCancel()
                fetchUsers()

                
            } catch (error) {
                console.error(error);
                alert("❌ فشل في الحفظ");
            }
            };

            // مسح ال checked Boxes
            const handleCancel = () => {
                setPermissions({});
            };
        //to get all users
        const fetchUsers = async () => {
        setIsLoading(true); // تبدأ التحميل
        try {
            const response = await axios.get("https://university.roboeye-tec.com/login_system/users");
            setUsers(response.data);
            console.log(response.data)
            setShowUsers(true);
        } catch (error) {
            console.error("حدث خطأ أثناء جلب المستخدمين", error);
            alert("❌ فشل في تحميل المستخدمين");
        } finally {
            setIsLoading(false); // توقف التحميل
        }
        };

       const handlePermissionChange = (section, action) => {
        setPermissions((prevPermissions) => {
        const currentActions = prevPermissions[section] || [];

        if (currentActions.includes(action)) {
        // شيل الـ action لو موجود
        return {
            ...prevPermissions,
            [section]: currentActions.filter((a) => a !== action)
        };
        } else {
        // ضيف الـ action
        return {
            ...prevPermissions,
            [section]: [...currentActions, action]
        };
        }
    });
};





  return (
    <div className="min-h-screen  flex flex-col items-center p-6 bg-[#fdfbff] bg-[url(/p-bg.png)]">
      <div ref={permissionsTableRef} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-blue-700 text-center ">
            تحديد صلاحيات المستخدم 
        </h2>

        <p className="text-center text-xl py-2">{editingUserName && `(${editingUserName})`}</p>

        <form onSubmit={handleSubmit} dir="rtl">
          <table className="w-full text-right border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">القسم</th>
                <th className="p-3 border text-center">قراءة</th>
                <th className="p-3 border text-center">إضافة</th>
                <th className="p-3 border text-center">تعديل</th>
                <th className="p-3 border text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {permissionsList.map((perm) => (
                <tr
                  key={perm.key}
                  className={`hover:bg-gray-50 ${
                    permissions[perm.key] === "read"
                      ? "bg-yellow-50"
                      : permissions[perm.key] === "edit"
                      ? "bg-green-50"
                      : ""
                  }`}
                >
                  <td className="p-3 border font-medium">{perm.label}</td>
                  <td className="text-center border">
                    <input
                        type="checkbox"
                        name={`${perm.key}-view`}
                        checked={(permissions[perm.key] || []).includes("view")}
                        onChange={() => handlePermissionChange(perm.key, "view")}
                        className="accent-blue-600"
                        />
                  </td>
                  <td className="text-center border">
                    <input
                        type="checkbox"
                        name={`${perm.key}-add`}
                        checked={(permissions[perm.key] || []).includes("add")}
                        onChange={() => handlePermissionChange(perm.key, "add")}
                        className="accent-blue-600"
                        />

                  </td>
                  <td className="text-center border">
                    <input
                        type="checkbox"
                        name={`${perm.key}-edit`}
                        checked={(permissions[perm.key] || []).includes("edit")}
                        onChange={() => handlePermissionChange(perm.key, "edit")}
                        className="accent-blue-600"
                        />

                  </td>
                  <td className="text-center border">
                    <input
                        type="checkbox"
                        name={`${perm.key}-delete`}
                        checked={(permissions[perm.key] || []).includes("delete")}
                        onChange={() => handlePermissionChange(perm.key, "delete")}
                        className="accent-blue-600"
                    />

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center mt-6 flex justify-center gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              حفظ الصلاحيات
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={fetchUsers}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              عرض المستخدمين
            </button>
          </div>
        </form>
      </div>
      {isLoading && (
            <div className="flex justify-center items-center my-8 ">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50"></div>
                <span className="ml-3 text-blue-600 font-semibold">جارٍ تحميل المستخدمين...</span>
            </div>
            )}
      {showUsers && (
        
        <div className="mt-10 bg-white shadow-md rounded-xl p-8 w-full max-w-4xl">
          <h3 className="text-xl font-semibold text-blue-700 text-center mb-4">قائمة جميع المستخدمين</h3>
          {confirmModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500/60 z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
                <h3 className="text-lg font-bold mb-4 text-red-700">تأكيد الحذف</h3>
                <p className="mb-6">هل أنت متأكد أنك تريد حذف هذا المستخدم؟</p>
                <div className="flex justify-center gap-4">
                    <button
                    onClick={confirmDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                    نعم، احذف
                    </button>
                    <button
                    onClick={() => setConfirmModalOpen(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                    إلغاء
                    </button>
                </div>
                </div>
            </div>
            )}
            {showPopup && (
                <div className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-semibold transition-opacity duration-300 
                    ${popupType === "success" ? "bg-green-600" : "bg-red-600"}`}>
                    {popupMessage}
                </div>
                )}


          <table className="w-full text-right border border-gray-300 " dir="rtl">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border"></th>
                <th className="p-3 border">اسم المستخدم</th>
                <th className="p-3 border">كلمة المرور</th>
                <th className="p-3 border">الإعارات</th>
                <th className="p-3 border">الجزاءات</th>
                <th className="p-3 border">التدرج الوظيفي</th>
                <th className="p-3 border">الإجازات</th>
                <th className="p-3 border text-center">تعديل</th>
                <th className="p-3 border text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id}>
                    <td className="border px-4 py-2 text-center">{idx+1}</td>
                    <td className="border px-4 py-2 text-center">{user.username}</td>
                    <td className="border px-4 py-2 text-center">******</td>

                    {/* لكل قسم نعرض عمود */}
                    {["loans", "punishments", "Career progression", "holidays"].map((section) => (
                        <td key={section} className="border px-2 py-2 text-center">
                        <div className="flex flex-col items-center gap-1 " >
                            {[
                            { action: "view", Icon: Eye },
                            { action: "add", Icon: PlusCircle },
                            { action: "edit", Icon: Pencil },
                            { action: "delete", Icon: Trash },
                            ].map(({ action, Icon }) => (
                            <label key={action} className="flex items-center justify-center gap-1">
                                <input
                                type="checkbox"
                                readOnly
                                checked={
                                    JSON.parse(user.roles || "{}")[section]?.[action] || false
                                }
                                className="accent-blue-600"
                                />
                                <Icon className="w-4 h-4 text-gray-700" />
                            </label>
                            ))}
                        </div>
                        </td>
                    ))}

                    <td className="border px-2 py-2 text-center">
                        <button className="bg-yellow-500 text-white rounded-full px-3 py-1" onClick={() => handleEditPermissions(user)} >تعديل</button>
                    </td>
                    <td className="border px-2 py-2 text-center">
                        <button className="bg-red-600 text-white rounded-full px-3 py-1"  onClick={() => handleDeleteUser(user.id)}>حذف</button>
                    </td>
                    </tr>

              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserPermissions;
