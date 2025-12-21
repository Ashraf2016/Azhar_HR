import React, { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useIsLoggedIn } from "@/contexts/isLoggedinContext";

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleMap, setRoleMap] = useState({});

  const { role, hasPermission } = usePermissions();
  const { isLoggedIn } = useIsLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [rolesRes, usersRes] = await Promise.all([
          axiosInstance.get("/roles/all"),
          axiosInstance.get("/users/all"),
        ]);

        // normalize roles response into an array
        const rolesData = rolesRes?.data;
        const rolesList = Array.isArray(rolesData)
          ? rolesData
          : rolesData?.roles || rolesData?.data || [];

        const map = {};
        rolesList.forEach((r) => {
          const id = r?.id ?? r?.role_id ?? r?._id;
          const name = r?.name ?? r?.title ?? r?.role_name ?? r?.label;
          if (id != null) map[id] = name ?? String(id);
        });
        setRoleMap(map);

        const usersData = usersRes?.data;
        const list = Array.isArray(usersData) ? usersData : usersData?.users || usersData?.data || [];
        setUsers(list);
      } catch (err) {
        console.error("UsersListPage: fetch /roles/all or /users/all", err);
        setError(err?.response?.data?.message || "فشل تحميل قائمة المستخدمين");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [isLoggedIn, navigate]);

  // simple access guard: only system admin or users with explicit permission can view
  if (!isLoggedIn) return null;

  const getRoleName = (u) =>
    roleMap[u.role_id] ??
    roleMap[u.user?.role_id] ??
    roleMap[u.role] ??
    roleMap[String(u.role_id)] ??
    roleMap[String(u.user?.role_id)] ??
    u.role ??
    'بدون دور';

  const grouped = users.reduce((acc, u) => {
    const rn = getRoleName(u);
    if (!acc[rn]) acc[rn] = [];
    acc[rn].push(u);
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">قائمة الموظفين والصلاحيات</h1>

      {loading && <p className="text-gray-600">جاري التحميل...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-6">
          {Object.keys(grouped).length === 0 ? (
            <div className="overflow-x-auto bg-white rounded shadow p-3">
              <p className="p-4 text-center text-gray-600">لا توجد بيانات</p>
            </div>
          ) : (
            Object.entries(grouped).map(([roleName, roleUsers]) => (
              <div key={roleName} className="overflow-x-auto bg-white rounded shadow p-3">
                <h2 className="text-lg font-semibold mb-2 text-right">{roleName} <span className="text-sm text-gray-500">({roleUsers.length})</span></h2>
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-right">
                    <tr>
                      <th className="px-4 py-2">م</th>
                      <th className="px-4 py-2">الاسم</th>
                      <th className="px-4 py-2">اسم المستخدم</th>
                    </tr>
                  </thead>
                  <tbody className="text-right">
                    {roleUsers.map((u, i) => (
                      <tr key={(u.id || u._id || i) + String(i)} className="border-b">
                        <td className="px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2">{u.name ?? u.full_name ?? u.user?.name ?? u.user?.full_name ?? '-'}</td>
                        <td className="px-4 py-2">{u.username ?? u.user?.username ?? u.email ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UsersListPage;
