const REDIRECT_KEY = "pg_auth_redirect";

export function saveAuthRedirect(path) {
  if (typeof window === "undefined" || !path) return;
  sessionStorage.setItem(REDIRECT_KEY, path);
}

export function consumeAuthRedirect() {
  if (typeof window === "undefined") return null;
  const path = sessionStorage.getItem(REDIRECT_KEY);
  if (path) {
    sessionStorage.removeItem(REDIRECT_KEY);
  }
  return path;
}

export function clearAuthRedirect() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(REDIRECT_KEY);
}
