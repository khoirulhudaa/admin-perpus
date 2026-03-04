import { Alert, Button, Card, CardContent, Input, Label } from "@/core/libs";
import { Upload, File } from "lucide-react";
import { useAlert } from "../hooks";

interface FileUploaderProps {
  value?: File;
  onChange?: (file: File | null) => void;
  maxSize?: number; // in bytes, default 10MB
  onError?: (message: string) => void;
  error?: React.ReactNode;
  buttonPlaceholder?: string;
  showButton?: boolean;
}

export function FileUploader2({
  onChange,
  value,
  onError,
  error,
  maxSize = 10 * 1024 * 1024,
  buttonPlaceholder,
  showButton = true,
}: FileUploaderProps) {


  const alert = useAlert();
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validasi ukuran file
      if (selectedFile.size > maxSize) {
        onChange?.(null);
        onError?.(`Ukuran file melebihi batas ${maxSize / 1024 / 1024}MB.`);
        return;
      }

      // Validasi dimensi gambar
      try {
        const img = new Image();
        const objectUrl = URL.createObjectURL(selectedFile);
        img.src = objectUrl;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error("Gagal memuat gambar."));
        });
        
        
        console.log('lbear:', img.width)
        if (img.width < 3000) {
          onChange?.(null);
          const errorMessage = `Lebar minimal (3000px). Lebar gambar yang diupload: (${img.width}px).`;
          alert.error(errorMessage); // Tampilkan di UI
          onError?.(errorMessage); // Kirim ke handler error
          URL.revokeObjectURL(objectUrl);
          return;
        }

        URL.revokeObjectURL(objectUrl);

        // Jika semua validasi lolos, panggil onChange
        onChange?.(selectedFile);
        onError?.("");
      } catch (error) {
        onChange?.(null);
        onError?.("Gagal memvalidasi gambar. Pastikan file adalah gambar yang valid.");
      }
    }
  };

  const getFileIcon = (fileName?: string) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <File className="w-4 h-4 text-red-500" />;
      case "doc":
      case "docx":
        return <File className="w-4 h-4 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <File className="w-4 h-4 text-green-500" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <File className="w-4 h-4 text-yellow-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300 ease-in-out"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400 animate-pulse" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Klik untuk memilih</span> atau seret
                  dan lepas
                </p>
                <p className="text-xs text-gray-500">
                  Format yang diizinkan: JPG, JPEG, PNG (Maks. {maxSize / 1024 / 1024}MB, Lebar min. 595px)
                </p>
              </div>
              <Input
                id="dropzone-file"
                accept="image/jpeg,image/jpg,image/png"
                type="file"
                name="letterHead"
                onChange={handleFileChange}
                className="hidden"
              />
            </Label>
          </div>
          {value && (
            <div className="flex items-center space-x-2 text-sm">
              {getFileIcon(value.name)}
              <span className="font-medium">{value.name}</span>
            </div>
          )}
          {showButton && (
            <Button
              onClick={() => document.getElementById("dropzone-file")?.click()}
              className="w-full"
            >
              {buttonPlaceholder || "Pilih File"}
            </Button>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}