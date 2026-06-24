export const roleDashboard = {
  user: "/user",
  creator: "/creator",
  admin: "/admin",
};

export function getDashboardPath(role) {
  return roleDashboard[role] || "/user";
}

export function getRoleFromPath(pathname) {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/creator")) return "creator";
  if (pathname.startsWith("/user")) return "user";
  return null;
}
