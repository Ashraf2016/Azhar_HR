import { useState, useEffect } from "react";
import { Eye, PlusCircle, Pencil, Trash } from "lucide-react";
import axios from "axios";

const permissionsList = [
  { key: "loans", label: "الإعارات" },
  { key: "punishments", label: "الجزاءات" },
  { key: "Career progression", label: "التدرج الوظيفي" },
  { key: "holidays", label: "الإجازات" },
];

const UserPermissions = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Popup للرسائل
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success");

  // تأكيد الحذف
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // **Modal الصلاحيات**
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [editingUserName, setEditingUserName] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // جلب جميع المستخدمين
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://university.roboeye-tec.com/users/all"
      );
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب المستخدمين", error);
      alert("❌ فشل في تحميل المستخدمين");
    } finally {
      setIsLoading(false);
    }
  };

  // البحث عن مستخدم
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(value) ||
        (user.name && user.name.toLowerCase().includes(value))
    );
    setFilteredUsers(filtered);
  };

  // دالة الترتيب
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const valA = (a[key] || "").toString().toLowerCase();
      const valB = (b[key] || "").toString().toLowerCase();

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sortedUsers);
  };

  // حذف مستخدم
  const handleDeleteUser = (userId) => {
    setSelectedUserId(userId);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `https://university.roboeye-tec.com/users/${selectedUserId}`
      );
      setUsers((prev) => prev.filter((user) => user.id !== selectedUserId));
      setFilteredUsers((prev) =>
        prev.filter((user) => user.id !== selectedUserId)
      );
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

  // فتح الـ Modal للصلاحيات
  const handleEditPermissions = (user) => {
    const roles = JSON.parse(user.roles || "{}");
    const formatted = {};
    Object.entries(roles).forEach(([section, actions]) => {
      formatted[section] = Object.entries(actions)
        .filter(([_, value]) => value)
        .map(([action]) => action);
    });

    setPermissions(formatted);
    setEditingUserName(user.username);
    setEditingUserId(user.id);
    setPermissionsModalOpen(true);
  };

  // تغيير الصلاحيات
  const handlePermissionChange = (section, action) => {
    setPermissions((prevPermissions) => {
      const currentActions = prevPermissions[section] || [];
      if (currentActions.includes(action)) {
        return {
          ...prevPermissions,
          [section]: currentActions.filter((a) => a !== action),
        };
      } else {
        return {
          ...prevPermissions,
          [section]: [...currentActions, action],
        };
      }
    });
  };

  // حفظ الصلاحيات
  const handleSubmitPermissions = async (e) => {
    e.preventDefault();
    if (!editingUserId) {
      alert("❌ مفيش مستخدم محدد للتعديل");
      return;
    }

    const formattedPermissions = {};
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
      await axios.put(
        `https://university.roboeye-tec.com/users/${editingUserId}`,
        { roles: formattedPermissions }
      );
      alert("✅ تم حفظ الصلاحيات بنجاح");
      setPermissionsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("❌ فشل في الحفظ");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#fdfbff] bg-[url(/p-bg.png)] flex justify-center">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-6xl">
        <h3 className="text-xl font-semibold text-blue-700 text-center mb-4">
          قائمة جميع المستخدمين
        </h3>
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

        {/* خانة البحث */}
        <div className="mb-4 flex justify-end">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="بحث عن مستخدم..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50"></div>
            <span className="ml-3 text-blue-600 font-semibold">
              جارٍ تحميل المستخدمين...
            </span>
          </div>
        ) : (
          <table className="w-full text-right border border-gray-300" dir="rtl">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">#</th>
                <th
                  className="p-3 border cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("username")}
                >
                  اسم المستخدم
                  {sortConfig.key === "username" &&
                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="p-3 border cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("name")}
                >
                  الاسم الكامل
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="p-3 border">الإعارات</th>
                <th className="p-3 border">الجزاءات</th>
                <th className="p-3 border">التدرج الوظيفي</th>
                <th className="p-3 border">الإجازات</th>
                <th className="p-3 border text-center">تعديل</th>
                <th className="p-3 border text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
            
              {filteredUsers.map((user, idx) => (
                <tr key={user.id}>
                    <td className="border px-4 py-2 text-center">{idx+1}</td>
                    <td className="border px-4 py-2 text-center">{user.username}</td>
                    <td className="border px-4 py-2 text-center">
                    {user.name || "—"}
                    </td>

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
                    <button
                      className="bg-yellow-500 text-white rounded-full px-3 py-1"
                      onClick={() => handleEditPermissions(user)}
                    >
                      تعديل الصلاحيات
                    </button>
                  </td>
                  <td className="border px-2 py-2 text-center">
                    <button
                      className="bg-red-600 text-white rounded-full px-3 py-1"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal تعديل الصلاحيات */}
      {permissionsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
            <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">
              تعديل صلاحيات المستخدم ({editingUserName})
            </h2>
            <form onSubmit={handleSubmitPermissions} dir="rtl">
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
                    <tr key={perm.key}>
                      <td className="p-3 border font-medium">{perm.label}</td>
                      {["view", "add", "edit", "delete"].map((action) => (
                        <td key={action} className="text-center border">
                          <input
                            type="checkbox"
                            checked={(permissions[perm.key] || []).includes(
                              action
                            )}
                            onChange={() =>
                              handlePermissionChange(perm.key, action)
                            }
                            className="accent-blue-600"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-center mt-6 flex justify-center gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={() => setPermissionsModalOpen(false)}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPermissions;
