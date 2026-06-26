"use client";

import { use } from "react";
import PromptForm from "@/components/dashboard/creator/PromptForm";

export default function EditPromptPage({ params }) {
  const { id } = use(params);
  return <PromptForm promptId={id} />;
}
