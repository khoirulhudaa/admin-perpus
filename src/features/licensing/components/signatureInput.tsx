import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { X } from "lucide-react";

export const SignatureInput = ({
  sigCanvas,
  onSignatureChange,
}: {
  sigCanvas: React.RefObject<SignatureCanvas>;
  onSignatureChange: (isDirty: boolean) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 300 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setCanvasSize({ width, height: 300 });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (sigCanvas.current) {
      const canvas =
        sigCanvas.current.getCanvas() as unknown as HTMLCanvasElement;

      if (!canvas) return;

      const handleDraw = () => {
        onSignatureChange(true); // ✅ Aktifkan tombol Save saat ada gambar
      };

      canvas.addEventListener("pointerdown", handleDraw);
      return () => canvas.removeEventListener("pointerdown", handleDraw);
    }
  }, [sigCanvas, onSignatureChange]);

  return (
    <div
      ref={containerRef}
      className="relative border border-gray-400 rounded-md bg-transparent w-full"
    >
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{
          width: canvasSize.width,
          height: canvasSize.height,
          className: "rounded-md w-full h-[300px] max-w-none",
          style: { backgroundColor: "#f5f5f5" }, // Soft off-white background color
        }}
      />

      {/* Tombol Hapus Tanda Tangan */}
      <button
        type="button"
        className="absolute top-2 right-2 p-1 focus:outline-none border-none shadow-none bg-transparent hover:bg-transparent"
        onClick={() => {
          sigCanvas.current?.clear();
          onSignatureChange(false); // ❌ Nonaktifkan tombol jika tanda tangan dihapus
        }}
      >
        <X size={30} className="text-red-700" />
      </button>
    </div>
  );
};
