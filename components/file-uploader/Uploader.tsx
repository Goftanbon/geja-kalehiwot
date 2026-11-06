"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { useContructUrl } from "@/hooks/use-construct-url";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

interface PendingUpload {
  file: File;
  progress: number;
  error: boolean;
}

interface UploaderProps {
  /** S3 key of the uploaded file ("" when empty) */
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted: "image" | "video";
  /** Lets the parent disable its submit button while an upload is running */
  onBusyChange?: (busy: boolean) => void;
}

function putToS3(
  presignedUrl: string,
  file: File,
  onProgress: (progress: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 204) resolve();
      else reject(new Error("Upload failed."));
    };
    xhr.onerror = () => reject(new Error("Upload failed."));

    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

export function Uploader({
  value = "",
  onChange,
  fileTypeAccepted,
  onBusyChange,
}: UploaderProps) {
  // The upload that is running (or has just failed). The finished file
  // lives in `value`, which the form owns.
  const [pending, setPending] = useState<PendingUpload | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Always call the latest onChange (it is usually a new inline function)
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const fileUrl = useContructUrl(value);
  const uploading = !!pending && !pending.error;

  useEffect(() => {
    onBusyChange?.(uploading);
  }, [uploading, onBusyChange]);

  const uploadFile = useCallback(
    async (file: File) => {
      setPending({ file, progress: 0, error: false });

      try {
        // 1. Get a presigned URL from the server
        const presignedResponse = await fetch("/api/s3/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: fileTypeAccepted === "image",
          }),
        });

        if (!presignedResponse.ok) {
          throw new Error("Failed to get presigned URL");
        }

        const { presignedUrl, key } = await presignedResponse.json();

        // 2. Upload straight to the bucket
        await putToS3(presignedUrl, file, (progress) =>
          setPending((prev) => (prev ? { ...prev, progress } : prev)),
        );

        // 3. Hand the key to the form and clear the pending state
        onChangeRef.current?.(key);
        setPending(null);

        toast.success("File uploaded successfully");
      } catch {
        toast.error(`Failed to upload ${file.name}`);
        setPending({ file, progress: 0, error: true });
      }
    },
    [fileTypeAccepted],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) uploadFile(file);
    },
    [uploadFile],
  );

  function rejectFiles(fileRejections: FileRejection[]) {
    const codes = fileRejections.flatMap((r) => r.errors.map((e) => e.code));

    if (codes.includes("too-many-files")) {
      toast.error("Please select only one file.");
    } else if (codes.includes("file-too-large")) {
      toast.error(
        fileTypeAccepted === "video"
          ? "Video must be 100MB or smaller."
          : "Image must be 5MB or smaller.",
      );
    } else if (codes.includes("file-invalid-type")) {
      toast.error(`Only ${fileTypeAccepted} files are allowed here.`);
    } else {
      toast.error("That file can't be uploaded.");
    }
  }

  async function handleRemoveFile() {
    if (isDeleting || !value) return;

    setIsDeleting(true);

    try {
      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: value }),
      });

      if (!response.ok) {
        toast.error("Failed to delete file");
        return;
      }

      onChangeRef.current?.("");
      toast.success("File removed successfully");
    } catch {
      toast.error("Failed to remove file");
    } finally {
      setIsDeleting(false);
    }
  }

  // Locked while uploading or once a file is in place. After a failed upload
  // it stays open so the user can click or drop again to retry.
  const isDisabled = uploading || !!value;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: rejectFiles,
    accept:
      fileTypeAccepted === "video" ? { "video/*": [] } : { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: fileTypeAccepted === "video" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE,
    disabled: isDisabled,
  });

  function renderContent() {
    if (uploading && pending) {
      return (
        <RenderUploadingState progress={pending.progress} file={pending.file} />
      );
    }

    if (pending?.error) {
      return <RenderErrorState />;
    }

    if (value) {
      return (
        <RenderUploadedState
          previewUrl={fileUrl}
          fileType={fileTypeAccepted}
          isDeleting={isDeleting}
          handleRemoveFile={handleRemoveFile}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <Card
        {...getRootProps()}
        className={cn(
          "relative h-64 w-full border-2 border-dashed transition-colors duration-200 ease-in-out",
          isDragActive
            ? "border-solid border-primary bg-primary/10"
            : "border-border hover:border-primary",
        )}
      >
        <CardContent className="flex h-full w-full items-center justify-center p-4">
          <input {...getInputProps()} />
          {renderContent()}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        {fileTypeAccepted === "video"
          ? "One video, up to 100MB."
          : "One image, up to 5MB."}
      </p>
    </div>
  );
}
