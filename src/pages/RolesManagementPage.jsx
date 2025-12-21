// import { useEffect, useState } from "react";
// import axiosInstance from "@/axiosInstance";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@/components/ui/accordion";
// import { Checkbox } from "@/components/ui/checkbox";

// const RolesManagementPage = () => {
//   const [roles, setRoles] = useState([]);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [permissions, setPermissions] = useState({});
//   const [rolePermissions, setRolePermissions] = useState([]); // مصفوفة الصلاحيات الخام
//   const [showDeletePopup, setShowDeletePopup] = useState(false);
//   const [roleToDelete, setRoleToDelete] = useState(null);

//   const [showAddPopup, setShowAddPopup] = useState(false);
//   const [newRoleName, setNewRoleName] = useState("");

//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [roleToEdit, setRoleToEdit] = useState(null);
//   const [editRoleName, setEditRoleName] = useState("");

//   const [allPermissions, setAllPermissions] = useState([]);
//   const [successMessage, setSuccessMessage] = useState(""); //  رسالة النجاح

//   // تحميل الـ Roles
//   const fetchRoles = async () => {
//     try {
//       const { data } = await axiosInstance.get(
//         "/roles/all"
//       );
//       setRoles(data);
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//     }
//   };

//   // تحميل كل الصلاحيات
//   const fetchAllPermissions = async () => {
//     try {
//       const { data } = await axiosInstance.get(
//         "/roles/permissions/all"
//       );
//       setAllPermissions(data);
//     } catch (error) {
//       console.error("Error fetching permissions:", error);
//     }
//   };


  

//   useEffect(() => {
//     fetchRoles();
//     fetchAllPermissions();
//   }, []);

//   // تحميل صلاحيات الـ role المختار
//   useEffect(() => {
//     if (!selectedRole) return;

//     let rolePerms = selectedRole.permissions
//       ? selectedRole.permissions.split(",").map((p) => String(p).trim())
//       : [];

//     setRolePermissions(rolePerms);

//     const groupedPermissions = {};
//     rolePerms.forEach((perm) => {
//       if (typeof perm !== "string") return;
//       const [group, action] = perm.split(":");
//       if (!groupedPermissions[group]) groupedPermissions[group] = [];
//       groupedPermissions[group].push(action);
//     });
//     setPermissions(groupedPermissions);
//   }, [selectedRole]);

//   // حذف role
//   const handleDeleteRole = async () => {
//     if (!roleToDelete) return;
//     try {
//       await axiosInstance.delete(
//         `/roles/${roleToDelete.id}`
//       );
//       setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
//       if (selectedRole?.id === roleToDelete.id) setSelectedRole(null);
//       setShowDeletePopup(false);
//       setRoleToDelete(null);
//     } catch (error) {
//       console.error("Error deleting role:", error);
//     }
//   };

//   // إضافة role
//   const handleAddRole = async () => {
//     if (!newRoleName.trim()) return;
//     try {
//       await axiosInstance.post("/roles/create", {
//         name: newRoleName.trim(),
//       });
//       setNewRoleName("");
//       setShowAddPopup(false);
//       fetchRoles(); // إعادة تحميل القائمة
//     } catch (error) {
//       console.error("Error adding role:", error);
//     }
//   };

//   // تعديل role
//   const handleEditRole = async () => {
//     if (!roleToEdit || !editRoleName.trim()) return;
//     try {
//       await axiosInstance.put(
//         `/roles/${roleToEdit.id}`,
//         {
//           name: editRoleName.trim(),
//         }
//       );
//       setShowEditPopup(false);
//       setRoleToEdit(null);
//       setEditRoleName("");
//       fetchRoles();
//     } catch (error) {
//       console.error("Error editing role:", error);
//     }
//   };

//   // تحديث الصلاحيات (تحديث الـ UI فورًا)
//   const handleTogglePermission = (groupKey, actionKey) => {
//     if (!selectedRole) return;

//     const permString = `${groupKey}:${actionKey}`;
//     const exists = rolePermissions.includes(permString);

//     let updatedPermissions;
//     if (exists) {
//       updatedPermissions = rolePermissions.filter((p) => p !== permString);
//     } else {
//       updatedPermissions = [...rolePermissions, permString];
//     }

//     setRolePermissions(updatedPermissions);

//     // إعادة بناء الـ groupedPermissions علشان الـ checkboxes تتحدث
//     const groupedPermissions = {};
//     updatedPermissions.forEach((perm) => {
//       if (typeof perm !== "string") return;
//       const [group, action] = perm.split(":");
//       if (!groupedPermissions[group]) groupedPermissions[group] = [];
//       groupedPermissions[group].push(action);
//     });
//     setPermissions(groupedPermissions);
//   };

//   const handleSavePermissions = async () => {
//   if (!selectedRole) return;

//   const currentSet = new Set(rolePermissions);
//   const originalSet = new Set(
//     selectedRole.permissions
//       ? selectedRole.permissions.split(",").map((p) => String(p).trim())
//       : []
//   );

//   const permissionsToAdd = [...currentSet].filter((p) => !originalSet.has(p));
//   const permissionsToDelete = [...originalSet].filter(
//     (p) => !currentSet.has(p)
//   );
// const x = permissionsToAdd
//           .map((perm) => allPermissions.find((ap) => ap.name === perm)?.id)
//           .filter(Boolean)
// const y = permissionsToDelete
//           .map((perm) => allPermissions.find((ap) => ap.name === perm)?.id)
//           .filter(Boolean)
//   try {
//     const response =await axiosInstance.put(
//       `/roles/${selectedRole.id}/permissions`,
//       {
//         permissionsToAdd: permissionsToAdd
//           .map((perm) => allPermissions.find((ap) => ap.name === perm)?.id)
//           .filter(Boolean),
//         permissionsToDelete: permissionsToDelete
//           .map((perm) => allPermissions.find((ap) => ap.name === perm)?.id)
//           .filter(Boolean),
//       }
//     );

//     console.log("🔹 Selected Role:", selectedRole.name, `(ID: ${selectedRole.id})`);
//     console.log("✅ Permissions to ADD (names):", x);
//     console.log("✅ Permissions to delete (names):", y);
//     console.log(response.data)
    
//     const updatedRole = {
//       ...selectedRole,
//       permissions: [...currentSet].join(","),
//     };
//     setSelectedRole(updatedRole);

//     // ✅ تحديث roles في الـ state
//     setRoles((prev) =>
//       prev.map((r) => (r.id === updatedRole.id ? updatedRole : r))
//     );

//     //  تحديث state rolePermissions
//     setRolePermissions([...currentSet]);

//     // //  حفظ الصلاحيات في localStorage
//     // localStorage.setItem(
//     //   "rolePermissions",
//     //   JSON.stringify([...currentSet]) 
//     // );
//     //  تحديث checkboxes
//     const groupedPermissions = {};
//     [...currentSet].forEach((perm) => {
//       if (typeof perm !== "string") return;
//       const [group, action] = perm.split(":");
//       if (!groupedPermissions[group]) groupedPermissions[group] = [];
//       groupedPermissions[group].push(action);
//     });
//     setPermissions(groupedPermissions);

//     //  رسالة نجاح
//     setSuccessMessage("تم حفظ التغييرات بنجاح ");
//     setTimeout(() => setSuccessMessage(""), 3000);
//   } catch (error) {
//     console.error("Error saving permissions:", error);
//   }
// };


//   const permissionGroups = [
//     { key: "holidays", label: "الإجازات" },
//     { key: "deputation", label: "الإعارات" },
//     { key: "secondment", label: "الانتدابات" },
//     { key: "punishments", label: "الجزاءات" },
//     { key: "career", label: "التدرج الوظيفي" },
//     { key: "employee", label: "عضو هيئة التدريس" },
//     { key: "user", label: "الموظف " },

//   ];

//   const actions = [
//     { key: "read", label: "قراءة" },
//     { key: "update", label: "تعديل" },
//     { key: "delete", label: "حذف" },
//     { key: "create", label: "إضافة" },
//   ];

//   return (
//     <div className="min-h-screen p-6 bg-[#fdfbff] bg-[url(/p-bg.png)] ">
//       <div className="grid grid-cols-3 gap-6 p-6" dir="rtl">
//         {/* القائمة (Roles) */}
//         <div className="col-span-1 bg-white shadow rounded-2xl p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-semibold text-lg">الأدوار</h2>
//             <button
//               onClick={() => setShowAddPopup(true)}
//               className="px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 text-sm cursor-pointer"
//             >
//               + إضافة
//             </button>
//           </div>
//           <ul className="space-y-2">
//             {roles.map((role) => (
//               <li
//                 key={role.id}
//                 className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 ${
//                   selectedRole?.id === role.id ? "bg-gray-200 font-bold" : ""
//                 }`}
//               >
//                 <span
//                   onClick={() => setSelectedRole(role)}
//                   className="cursor-pointer flex-1"
//                 >
//                   {role.name}
//                 </span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => {
//                       setRoleToEdit(role);
//                       setEditRoleName(role.name);
//                       setShowEditPopup(true);
//                     }}
//                     className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm cursor-pointer"
//                   >
//                     ✏️ تعديل
//                   </button>
//                   <button
//                     onClick={() => {
//                       setRoleToDelete(role);
//                       setShowDeletePopup(true);
//                     }}
//                     className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm cursor-pointer"
//                   >
//                     🗑️ حذف
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* صلاحيات (Permissions) */}
//         <div className="col-span-2 bg-white shadow rounded-2xl p-4">
//           {selectedRole ? (
//             <>
//               <h2 className="font-semibold text-xl mb-4">{selectedRole.name}</h2>
//               <Accordion type="multiple" className="w-full">
//                 {permissionGroups.map((group) => (
//                   <AccordionItem key={group.key} value={group.key}>
//                     <AccordionTrigger>{group.label}</AccordionTrigger>
//                     <AccordionContent>
//                       <div className="grid grid-cols-2 gap-4 p-2">
//                         {actions.map((action) => (
//                           <label
//                             key={action.key}
//                             className="flex items-center space-x-2"
//                           >
//                             <Checkbox
//                               checked={permissions[group.key]?.includes(
//                                 action.key
//                               )}
//                               onCheckedChange={() =>
//                                 handleTogglePermission(group.key, action.key)
//                               }
//                             />
                            


//                             <span>{action.label}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </AccordionContent>
//                   </AccordionItem>
//                 ))}
//               </Accordion>
//               <div className=" mt-4 ">
//                 {/*  رسالة النجاح */}
//                 {successMessage && (
//                   <p className="text-green-600 font-medium">{successMessage}</p>
//                 )}
//                 <button
//                   onClick={handleSavePermissions}
//                   className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
//                 >
//                   💾 حفظ
//                 </button>
//               </div>
//             </>
//           ) : (
//             <p className="text-gray-500">اختر Role من القائمة على اليمين</p>
//           )}
//         </div>

//         {/* Popup لتأكيد الحذف */}
//         {showDeletePopup && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-40 z-50">
//             <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
//               <h3 className="text-lg font-semibold mb-4">تأكيد الحذف</h3>
//               <p className="mb-6">
//                 هل أنت متأكد أنك تريد حذف الـ Role{" "}
//                 <span className="font-bold text-red-600">
//                   {roleToDelete?.name}
//                 </span>
//                 ؟
//               </p>
//               <div className="flex justify-center gap-4">
//                 <button
//                   onClick={() => setShowDeletePopup(false)}
//                   className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
//                 >
//                   إلغاء
//                 </button>
//                 <button
//                   onClick={handleDeleteRole}
//                   className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer "
//                 >
//                   حذف
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Popup لإضافة role */}
//         {showAddPopup && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-40 z-50">
//             <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
//               <h3 className="text-lg font-semibold mb-4">إضافة Role جديدة</h3>
//               <input
//                 type="text"
//                 value={newRoleName}
//                 onChange={(e) => setNewRoleName(e.target.value)}
//                 placeholder="اسم الـ Role"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-green-300"
//               />
//               <div className="flex justify-center gap-4">
//                 <button
//                   onClick={() => setShowAddPopup(false)}
//                   className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
//                 >
//                   إلغاء
//                 </button>
//                 <button
//                   onClick={handleAddRole}
//                   className="px-4 py-2 rounded-lg bg-green-500 text-white cursor-pointer hover:bg-green-600"
//                 >
//                   إضافة
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Popup لتعديل role */}
//         {showEditPopup && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-40 z-50">
//             <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
//               <h3 className="text-lg font-semibold mb-4">تعديل Role</h3>
//               <input
//                 type="text"
//                 value={editRoleName}
//                 onChange={(e) => setEditRoleName(e.target.value)}
//                 placeholder="اسم الـ Role الجديد"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
//               />
//               <div className="flex justify-center gap-4">
//                 <button
//                   onClick={() => setShowEditPopup(false)}
//                   className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
//                 >
//                   إلغاء
//                 </button>
//                 <button
//                   onClick={handleEditRole}
//                   className="px-4 py-2 rounded-lg bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
//                 >
//                   حفظ
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RolesManagementPage;


import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { usePermissions } from "../contexts/PermissionsContext"; // ✅ استدعاء الـ context

const RolesManagementPage = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [rolePermissions, setRolePermissions] = useState([]); // مصفوفة الصلاحيات الخام
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [editRoleName, setEditRoleName] = useState("");

  const [allPermissions, setAllPermissions] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // رسالة النجاح

  const { updatePermissions } = usePermissions(); // ✅ دالة لتحديث الـ context

  // تحميل الـ Roles
  const fetchRoles = async () => {
    try {
      const { data } = await axiosInstance.get("/roles/all");
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // تحميل كل الصلاحيات
  const fetchAllPermissions = async () => {
    try {
      const { data } = await axiosInstance.get("/roles/permissions/all");
      setAllPermissions(data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchAllPermissions();
  }, []);

  // تحميل صلاحيات الـ role المختار
  useEffect(() => {
    if (!selectedRole) return;

    let rolePerms = selectedRole.permissions
      ? selectedRole.permissions.split(",").map((p) => String(p).trim())
      : [];

    setRolePermissions(rolePerms);

    const groupedPermissions = {};
    rolePerms.forEach((perm) => {
      if (typeof perm !== "string") return;
      const [group, action] = perm.split(":");
      if (!groupedPermissions[group]) groupedPermissions[group] = [];
      groupedPermissions[group].push(action);
    });
    setPermissions(groupedPermissions);
  }, [selectedRole]);

  // حذف role
  const handleDeleteRole = async () => {
    if (!roleToDelete) return;
    try {
      await axiosInstance.delete(`/roles/${roleToDelete.id}`);
      setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
      if (selectedRole?.id === roleToDelete.id) setSelectedRole(null);
      setShowDeletePopup(false);
      setRoleToDelete(null);
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  // إضافة role
  const handleAddRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      await axiosInstance.post("/roles/create", {
        name: newRoleName.trim(),
      });
      setNewRoleName("");
      setShowAddPopup(false);
      fetchRoles(); // إعادة تحميل القائمة
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  // تعديل role
  const handleEditRole = async () => {
    if (!roleToEdit || !editRoleName.trim()) return;
    try {
      await axiosInstance.put(`/roles/${roleToEdit.id}`, {
        name: editRoleName.trim(),
      });
      setShowEditPopup(false);
      setRoleToEdit(null);
      setEditRoleName("");
      fetchRoles();
    } catch (error) {
      console.error("Error editing role:", error);
    }
  };

  // تحديث الصلاحيات (تحديث الـ UI فورًا)
  const handleTogglePermission = (groupKey, actionKey) => {
    if (!selectedRole) return;

    const permString = `${groupKey}:${actionKey}`;
    const exists = rolePermissions.includes(permString);

    let updatedPermissions;
    if (exists) {
      updatedPermissions = rolePermissions.filter((p) => p !== permString);
    } else {
      updatedPermissions = [...rolePermissions, permString];
    }

    setRolePermissions(updatedPermissions);

    const groupedPermissions = {};
    updatedPermissions.forEach((perm) => {
      if (typeof perm !== "string") return;
      const [group, action] = perm.split(":");
      if (!groupedPermissions[group]) groupedPermissions[group] = [];
      groupedPermissions[group].push(action);
    });
    setPermissions(groupedPermissions);
  };

  // حفظ التغييرات مع تحديث PermissionsContext
  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    const currentSet = new Set(rolePermissions);
    const originalSet = new Set(
      selectedRole.permissions
        ? selectedRole.permissions.split(",").map((p) => String(p).trim())
        : []
    );

    const permissionsToAdd = [...currentSet].filter((p) => !originalSet.has(p));
    const permissionsToDelete = [...originalSet].filter(
      (p) => !currentSet.has(p)
    );

    try {
      await axiosInstance.put(`/roles/${selectedRole.id}/permissions`, {
        permissionsToAdd: permissionsToAdd
          .map((perm) => allPermissions.find((ap) => ap.name === perm)?.id)
          .filter(Boolean),
        permissionsToDelete: permissionsToDelete
          .map((perm) => allPermissions.find((ap) => ap.name === perm)?.id)
          .filter(Boolean),
      });

      // ✅ تحديث الـ state المحلي
      const updatedRole = {
        ...selectedRole,
        permissions: [...currentSet].join(","),
      };
      setSelectedRole(updatedRole);
      setRoles((prev) =>
        prev.map((r) => (r.id === updatedRole.id ? updatedRole : r))
      );
      setRolePermissions([...currentSet]);

      const groupedPermissions = {};
      [...currentSet].forEach((perm) => {
        if (typeof perm !== "string") return;
        const [group, action] = perm.split(":");
        if (!groupedPermissions[group]) groupedPermissions[group] = [];
        groupedPermissions[group].push(action);
      });
      setPermissions(groupedPermissions);

      // ✅ تحديث الـ context مباشرة
      updatePermissions([...currentSet], selectedRole.name);

      // ✅ رسالة نجاح
      setSuccessMessage("تم حفظ التغييرات بنجاح ");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving permissions:", error);
    }
  };

  const permissionGroups = [
    { key: "holidays", label: "الإجازات" },
    { key: "deputation", label: "الإعارات" },
    { key: "secondment", label: "الانتدابات" },
    { key: "punishments", label: "الجزاءات" },
    { key: "career", label: "التدرج الوظيفي" },
    { key: "employee", label: "عضو هيئة التدريس" },
    // { key: "user", label: "الموظف " },
  ];

  const actions = [
    { key: "read", label: "قراءة" },
    { key: "update", label: "تعديل" },
    { key: "delete", label: "حذف" },
    { key: "create", label: "إضافة" },
  ];

  return (
    <div className="min-h-screen p-6 bg-[#fdfbff] bg-[url(/p-bg.png)] ">
      <div className="grid grid-cols-3 gap-6 p-6" dir="rtl">
        {/* القائمة (Roles) */}
        <div className="col-span-1 bg-white shadow rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">الأدوار</h2>
            <button
              onClick={() => setShowAddPopup(true)}
              className="px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 text-sm cursor-pointer"
            >
              + إضافة
            </button>
          </div>
          <ul className="space-y-2">
            {roles.map((role) => (
              <li
                key={role.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 ${
                  selectedRole?.id === role.id ? "bg-gray-200 font-bold" : ""
                }`}
              >
                <span
                  onClick={() => setSelectedRole(role)}
                  className="cursor-pointer flex-1"
                >
                  {role.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setRoleToEdit(role);
                      setEditRoleName(role.name);
                      setShowEditPopup(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm cursor-pointer"
                  >
                    ✏️ تعديل
                  </button>
                  <button
                    onClick={() => {
                      setRoleToDelete(role);
                      setShowDeletePopup(true);
                    }}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm cursor-pointer"
                  >
                    🗑️ حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* صلاحيات (Permissions) */}
        <div className="col-span-2 bg-white shadow rounded-2xl p-4">
          {selectedRole ? (
            <>
              <h2 className="font-semibold text-xl mb-4">{selectedRole.name}</h2>
              <Accordion type="multiple" className="w-full">
                {permissionGroups.map((group) => (
                  <AccordionItem key={group.key} value={group.key}>
                    <AccordionTrigger>{group.label}</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 p-2">
                        {actions.map((action) => (
                          <label
                            key={action.key}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={permissions[group.key]?.includes(
                                action.key
                              )}
                              onCheckedChange={() =>
                                handleTogglePermission(group.key, action.key)
                              }
                            />
                            <span>{action.label}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className=" mt-4 ">
                {successMessage && (
                  <p className="text-green-600 font-medium">{successMessage}</p>
                )}
                <button
                  onClick={handleSavePermissions}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                >
                  💾 حفظ
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">اختر Role من القائمة على اليمين</p>
          )}
        </div>

        {/* Popup لتأكيد الحذف */}
        {showDeletePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
              <h3 className="text-lg font-semibold mb-4">تأكيد الحذف</h3>
              <p className="mb-6">
                هل أنت متأكد أنك تريد حذف الـ Role{" "}
                <span className="font-bold text-red-600">
                  {roleToDelete?.name}
                </span>
                ؟
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteRole}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer "
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup لإضافة role */}
        {showAddPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
              <h3 className="text-lg font-semibold mb-4">إضافة Role جديدة</h3>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="اسم الـ Role"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-green-300"
              />
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowAddPopup(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddRole}
                  className="px-4 py-2 rounded-lg bg-green-500 text-white cursor-pointer hover:bg-green-600"
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup لتعديل role */}
        {showEditPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
              <h3 className="text-lg font-semibold mb-4">تعديل Role</h3>
              <input
                type="text"
                value={editRoleName}
                onChange={(e) => setEditRoleName(e.target.value)}
                placeholder="اسم الـ Role الجديد"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowEditPopup(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleEditRole}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesManagementPage;

