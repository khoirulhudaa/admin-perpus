import logo from "../assets/images/logo.png";
import logoPt from "../assets/images/logo-pt.png";

export const Images = {
  logo,
  logoPt,
};

export function canvasToFile(
  canvas: HTMLCanvasElement,
  fileName: string,
): Promise<File> {
  return new Promise((resolve, reject) => {
    // Menggunakan toBlob untuk mendapatkan Blob dari canvas
    canvas.toBlob((blob) => {
      if (blob) {
        // Membuat File dari Blob
        const file = new File([blob], fileName, {
          type: blob.type,
          lastModified: Date.now(),
        });
        resolve(file);
      } else {
        reject(new Error("Canvas toBlob failed"));
      }
    }, "image/png"); // Format file yang dihasilkan (misalnya 'image/png')
  });
}

export function dataURLToFile(dataURL: string, fileName: string): File {
  const arr = dataURL.split(",");
  const mime = arr?.[0]?.match(/:(.*?);/)?.[1];
  const bstr = atob(arr?.[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
}
