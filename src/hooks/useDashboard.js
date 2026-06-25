import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export function useMyPrompts(page = 1, limit = 10, status = "") {
  return useQuery({
    queryKey: ["prompts", "mine", page, limit, status],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/prompts/me/mine", {
        params: { page, limit, ...(status ? { status } : {}) },
      });
      return data;
    },
  });
}

export function useAdminPrompts(page = 1, limit = 20, status = "") {
  return useQuery({
    queryKey: ["admin", "prompts", page, limit, status],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/prompts/admin/all", {
        params: { page, limit, ...(status ? { status } : {}) },
      });
      return data;
    },
  });
}

export function useTopCreators(limit = 6) {
  return useQuery({
    queryKey: ["prompts", "top-creators", limit],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/prompts/top-creators", {
        params: { limit },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post("/prompts", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["prompts", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["creator", "analytics"] });
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promptId) => {
      const { data } = await axiosInstance.delete(`/prompts/${promptId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["prompts", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "prompts"] });
      queryClient.invalidateQueries({ queryKey: ["creator", "analytics"] });
    },
  });
}

export function useModeratePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ promptId, action, rejectionFeedback }) => {
      if (action === "approve") {
        const { data } = await axiosInstance.patch(`/prompts/${promptId}/approve`);
        return data;
      }
      if (action === "reject") {
        const { data } = await axiosInstance.patch(`/prompts/${promptId}/reject`, {
          rejectionFeedback,
        });
        return data;
      }
      if (action === "feature") {
        const { data } = await axiosInstance.patch(`/prompts/${promptId}/feature`);
        return data;
      }
      throw new Error("Invalid moderation action");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "prompts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
    },
  });
}
