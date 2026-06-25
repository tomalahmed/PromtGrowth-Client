import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

async function createCheckoutSession() {
  const { data } = await axiosInstance.post("/payments/create-checkout-session");
  return data.data;
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: createCheckoutSession,
  });
}
