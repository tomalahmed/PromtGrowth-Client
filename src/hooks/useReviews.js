import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

async function fetchPromptReviews(promptId, page, limit) {
  const { data } = await axiosInstance.get(`/reviews/prompt/${promptId}`, {
    params: { page, limit },
  });
  return data;
}

async function submitReview({ promptId, rating, comment }) {
  const { data } = await axiosInstance.post(`/reviews/${promptId}`, {
    rating,
    comment,
  });
  return data;
}

async function fetchRecentReviews(limit) {
  const { data } = await axiosInstance.get("/reviews/recent", {
    params: { limit },
  });
  return data;
}

export function usePromptReviews(promptId, page = 1, limit = 5) {
  return useQuery({
    queryKey: ["reviews", "prompt", promptId, page, limit],
    queryFn: () => fetchPromptReviews(promptId, page, limit),
    enabled: Boolean(promptId),
    staleTime: 30 * 1000,
  });
}

export function useSubmitReview(promptId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => submitReview({ promptId, ...payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "prompt", promptId] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "recent"] });
      queryClient.invalidateQueries({ queryKey: ["prompt", promptId] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}

export function useRecentReviews(limit = 3) {
  return useQuery({
    queryKey: ["reviews", "recent", limit],
    queryFn: () => fetchRecentReviews(limit),
    staleTime: 60 * 1000,
  });
}

export function useMyReviews() {
  return useQuery({
    queryKey: ["reviews", "me"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reviews/me");
      return data;
    },
    staleTime: 30 * 1000,
  });
}
