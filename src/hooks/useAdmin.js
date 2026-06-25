import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export function useAdminReports(page = 1, limit = 20, status = "pending") {
  return useQuery({
    queryKey: ["admin", "reports", page, limit, status],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reports", {
        params: { page, limit, ...(status ? { status } : {}) },
      });
      return data;
    },
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, action }) => {
      const { data } = await axiosInstance.patch(`/reports/${reportId}`, { action });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "prompts"] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}

export function useAdminPayments(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["admin", "payments", page, limit],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/payments", { params: { page, limit } });
      return data;
    },
  });
}

export function useMyBookmarks(page = 1, limit = 9) {
  return useQuery({
    queryKey: ["bookmarks", page, limit],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/bookmarks", { params: { page, limit } });
      return data;
    },
  });
}
