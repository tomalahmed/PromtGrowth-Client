export const PREMIUM_RETURN_STORAGE_KEY = "premiumReturnTo";

export function setPremiumReturnTo(path) {
  if (typeof window === "undefined" || !path) {
    return;
  }

  sessionStorage.setItem(PREMIUM_RETURN_STORAGE_KEY, path);
}
