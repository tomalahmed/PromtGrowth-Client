"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FieldLabel, TextField } from "@/components/dashboard/creator/CreatorFormCard";

export default function TagInput({ tags, onChange }) {
  const [input, setInput] = useState("");

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase();
    if (!tag || tags.includes(tag)) return;
    onChange([...tags, tag]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
  };

  return (
    <div>
      <FieldLabel>Tags</FieldLabel>
      <TextField
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a tag and press Enter"
      />
      <AnimatePresence>
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {tags.map((tag) => (
              <motion.span
                key={tag}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1 rounded-full bg-primary-container/12 px-3 py-1 text-[12px] font-semibold text-primary-container"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onChange(tags.filter((item) => item !== tag))}
                  className="rounded-full p-0.5 hover:bg-primary-container/15"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
