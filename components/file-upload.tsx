"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUploadComplete?: (storageId: Id<"_storage">) => void;
  onUploadError?: (error: Error) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  accept = { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  disabled,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      if (file.size > maxSize) {
        onUploadError?.(new Error(`File size exceeds ${maxSize / 1024 / 1024}MB`));
        return;
      }

      setUploading(true);
      try {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        onUploadComplete?.(storageId);
      } catch (error) {
        onUploadError?.(error as Error);
      } finally {
        setUploading(false);
      }
    },
    [generateUploadUrl, maxSize, onUploadComplete, onUploadError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    disabled: disabled || uploading,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
        isDragActive && "border-primary bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            {isDragActive ? "Drop file here" : "Click or drag to upload"}
          </p>
          <p className="text-xs text-muted-foreground">
            Max size: {maxSize / 1024 / 1024}MB
          </p>
        </div>
      )}
    </div>
  );
}






