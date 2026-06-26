export const isDemoEnabled =
  process.env.NEXT_PUBLIC_ENABLE_DEMO === "true" ||
  process.env.NODE_ENV !== "production";
