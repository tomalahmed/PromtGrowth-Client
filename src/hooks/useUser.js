import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/profile");
      return data;
    },
    staleTime: 30 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.patch("/users/profile", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useCreatorAnalytics() {
  return useQuery({
    queryKey: ["creator", "analytics"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/creator/analytics");
      return data;
    },
    staleTime: 60 * 1000,
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/admin/analytics");
      return data;
    },
    staleTime: 60 * 1000,
  });
}

export function useAdminUsers(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["admin", "users", page, limit],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users", { params: { page, limit } });
      return data;
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }) => {
      const { data } = await axiosInstance.patch(`/users/${userId}/role`, { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await axiosInstance.delete(`/users/${userId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
    },
  });
}
