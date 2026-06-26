import { formatCopyCount } from "@/lib/promptConstants";

export const CHART_TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid rgba(192, 201, 188, 0.4)",
  boxShadow: "0 8px 24px -8px rgba(21, 82, 30, 0.15)",
};

export function avgCopiesPerPrompt(analytics) {
  const prompts = analytics?.totalPrompts ?? 0;
  const copies = analytics?.totalCopies ?? 0;
  if (!prompts) return "0";
  return formatCopyCount(Math.round(copies / prompts));
}
