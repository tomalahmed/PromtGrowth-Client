import { getDashboardPath } from "@/utils/roleRedirect";
import { consumeAuthRedirect } from "@/utils/authSession";

export function navigateAfterAuth(role, redirectPath) {
  const storedRedirect = consumeAuthRedirect();
  const path = redirectPath || storedRedirect || getDashboardPath(role);
  window.location.replace(path);
}

export async function logoutAndRefresh(logout) {
  try {
    await logout();
  } finally {
    window.location.replace("/");
  }
}
