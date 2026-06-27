import { getDashboardPath } from "@/utils/roleRedirect";

export function navigateAfterAuth(role, redirectPath) {
  const path = redirectPath || getDashboardPath(role);
  window.location.assign(path);
}
