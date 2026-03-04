import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { lang } from "@/core/libs";
import { FaFilePdf } from "react-icons/fa";

interface User {
  id: number;
  name: string;
  nisn: string;
  kelas: string | null;
}

interface DownloadButtonProps {
  students: User[];
  targetRef: React.RefObject<HTMLDivElement>;
  allDataRef: React.RefObject<HTMLDivElement>;
  isFiltered: boolean;
}

const DownloadButtonForTeacher: React.FC<DownloadButtonProps> = ({ students, targetRef, allDataRef, isFiltered }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    if (!targetRef.current) return;

    setIsDownloading(true);
    setProgress(0);

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Pastikan elemen sudah ter-render

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a3",
    });

    const cardWidth = 85.6;
    const cardHeight = 54;
    const marginX = 10;
    const marginY = 10;
    const startX = 10;
    const startY = 10;
    const maxPerRow = 3;
    const maxPerColumn = 3;
    const maxPerPage = maxPerRow * maxPerColumn * 2;

    let x = startX;
    let y = startY;
    let count = 0;
    const totalCards = students.length * 2; // Front + Back per student
    let processedCards = 0;

    for (let i = 0; i < students.length; i++) {
      const frontCard = document.getElementById(`student-card-${students[i].id}`);
      const backCard = document.getElementById(`student-card-${students[i].id}-back`);

      if (!frontCard || !backCard) {
        console.warn(`⚠️ Kartu guru ${students[i].id} tidak ditemukan`);
        continue;
      }

      await new Promise(resolve => setTimeout(resolve, 500)); // Beri waktu untuk rendering

      // Process Front Card
      const frontCanvas = await html2canvas(frontCard, { scale: 2, useCORS: true });
      const frontImgData = frontCanvas.toDataURL("image/png");
      pdf.addImage(frontImgData, "PNG", x, y, cardWidth, cardHeight);

      processedCards++;
      setProgress((processedCards / totalCards) * 100);

      y += cardHeight + marginY; // Geser ke bawah untuk Back Card

      // Process Back Card
      const backCanvas = await html2canvas(backCard, { scale: 2, useCORS: true });
      const backImgData = backCanvas.toDataURL("image/png");
      pdf.addImage(backImgData, "PNG", x, y, cardWidth, cardHeight);

      processedCards++;
      setProgress((processedCards / totalCards) * 100);

      y -= cardHeight + marginY; // Kembali ke posisi Front Card
      x += cardWidth + marginX; // Geser ke kanan

      count++;

      if (count % maxPerRow === 0) {
        x = startX;
        y += (cardHeight * 2) + (marginY * 2);
      }

      if (count % (maxPerPage / 2) === 0 && i !== students.length - 1) {
        pdf.addPage();
        x = startX;
        y = startY;
      }
    }

    pdf.save("Kartu_Kepegawaian_Sekolah.pdf");
    setIsDownloading(false);
    setProgress(0);
  };

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        style={{
          padding: "5px 15px",
          fontSize: "16px",
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: "bold",
          borderRadius: "5px",
          backgroundColor: "#dc2626",
          color: "white",
          border: "none",
          cursor: isDownloading ? "not-allowed" : "pointer",
        }}
      >
        {isDownloading ? lang.text('loadDownload') : lang.text('downloadPDF')}
        <FaFilePdf />
      </button>

      {isDownloading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {lang.text('generateCard')}
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-gray-600">
              {Math.round(progress)}% ({Math.floor(progress / 100 * students.length * 2)}/{students.length * 2} {lang.text('card')})
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadButtonForTeacher;
