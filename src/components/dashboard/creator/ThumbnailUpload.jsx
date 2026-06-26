"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { FieldLabel } from "@/components/dashboard/creator/CreatorFormCard";

export default function ThumbnailUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      onChange(url);
      toast.success("Thumbnail uploaded");
    } catch (error) {
      toast.error(error.message || "Failed to upload thumbnail");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <FieldLabel>Thumbnail Image</FieldLabel>
      <motion.label
        animate={{
          scale: dragOver ? 1.02 : 1,
          borderColor: dragOver ? "rgba(48, 107, 52, 0.5)" : "rgba(192, 201, 188, 0.6)",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-surface-container-low/50 px-4 py-8 text-center transition-colors hover:bg-surface-container-low"
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {value ? (
          <img
            src={value}
            alt="Thumbnail preview"
            className="h-28 w-full max-w-[200px] rounded-xl object-cover shadow-sm"
          />
        ) : uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary-container" />
        ) : (
          <>
            <motion.div
              animate={{ y: dragOver ? -4 : 0 }}
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/12 text-primary-container"
            >
              <ImagePlus className="h-6 w-6" strokeWidth={1.75} />
            </motion.div>
            <p className="text-[14px] font-semibold text-on-surface">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-[12px] text-on-surface-variant">
              SVG, PNG, JPG or GIF (max 2MB)
            </p>
          </>
        )}
      </motion.label>
    </div>
  );
}
