"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FileUpload } from "./file-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  storageId?: Id<"_storage"> | null;
  onUploadComplete: (storageId: Id<"_storage">) => void;
  onRemove?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
}

export function ImageUpload({
  storageId,
  onUploadComplete,
  onRemove,
  className,
  size = "md",
  shape = "circle",
}: ImageUploadProps) {
  const imageUrl = useQuery(
    api.files.getFileUrl,
    storageId ? { storageId } : "skip"
  );

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };


  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {imageUrl && (
        <div className="relative">
          <Avatar
            className={cn(
              sizeClasses[size],
              shape === "square" && "rounded-lg"
            )}
          >
            <AvatarImage src={imageUrl || undefined} />
            <AvatarFallback>IMG</AvatarFallback>
          </Avatar>
          {onRemove && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      <FileUpload
        onUploadComplete={onUploadComplete}
        accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }}
        maxSize={5 * 1024 * 1024}
        className="w-full"
      />
    </div>
  );
}






