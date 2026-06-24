import useAuth from "@/hooks/useAuth";

export default function useRole() {
  const { user } = useAuth();
  const role = user?.role ?? null;

  return {
    role,
    isAdmin: role === "admin",
    isCreator: role === "creator",
    isUser: role === "user",
  };
}
