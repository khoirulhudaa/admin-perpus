import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/core/libs";

export const PhotoUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
        onClick={handleUploadClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            No image selected
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Upload className="w-12 h-12 text-white" />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        aria-label="Upload photo"
        style={{ display: "none" }}
      />
      <Button onClick={handleUploadClick} className="w-full mt-4">
        Select Photo
      </Button>
    </div>
  );
};
