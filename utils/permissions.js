export const PERMISSIONS = {
  APPROVE_MERCHANTS: "approve_merchants",
  APPROVE_TRAINERS: "approve_trainers",
  MANAGE_USERS: "manage_users",
  MANAGE_CATEGORIES: "manage_categories",
  MANAGE_CITIES: "manage_cities",
  VIEW_REPORTS: "view_reports",
  VIEW_ANALYTICS: "view_analytics",
};

export const PERMISSION_GROUPS = {
  APPROVAL: [PERMISSIONS.APPROVE_MERCHANTS, PERMISSIONS.APPROVE_TRAINERS],
  MANAGEMENT: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_CITIES,
  ],
  VIEW: [PERMISSIONS.VIEW_REPORTS, PERMISSIONS.VIEW_ANALYTICS],
  ALL: Object.values(PERMISSIONS),
};

// Permission check utility function
export const hasPermission = (user, permission) => {
  if (!user) return false;

  // Admins have all permissions
  if (user.role === "admin") return true;

  // Check if user has the specific permission
  if (user.permissions && user.permissions.includes(permission)) {
    return true;
  }

  return false;
};

// Check multiple permissions
export const hasAnyPermission = (user, permissions) => {
  return permissions.some((permission) => hasPermission(user, permission));
};

export const hasAllPermissions = (user, permissions) => {
  return permissions.every((permission) => hasPermission(user, permission));
};

// Get permission display name in Arabic
export const getPermissionDisplay = (permission) => {
  const permissionsAr = {
    [PERMISSIONS.APPROVE_MERCHANTS]: "صلاحية قبول طلبات التجار",
    [PERMISSIONS.APPROVE_TRAINERS]: "صلاحية قبول طلبات المدربين",
    [PERMISSIONS.MANAGE_USERS]: "صلاحية إدارة المستخدمين",
    [PERMISSIONS.MANAGE_CATEGORIES]: "صلاحية إدارة الأقسام",
    [PERMISSIONS.MANAGE_CITIES]: "صلاحية إدارة المدن",
    [PERMISSIONS.VIEW_REPORTS]: "صلاحية عرض التقارير",
    [PERMISSIONS.VIEW_ANALYTICS]: "صلاحية عرض التحليلات",
  };

  return permissionsAr[permission] || permission;
};

// Check if user can manage permissions (admin or has manage_users permission)
export const canManagePermissions = (user) => {
  return (
    user &&
    (user.role === "admin" || hasPermission(user, PERMISSIONS.MANAGE_USERS))
  );
};
