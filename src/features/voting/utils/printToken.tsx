// PrintTokens.tsx
import { useEffect } from "react";
import { useSchool } from "@/features/schools";

export default function PrintTokens() {
  const schoolQuery = useSchool();
  const schoolName = schoolQuery?.data?.[0]?.name || "SMK/SMA ...";

  // Ambil data codes dari localStorage / prop / context / atau fetch ulang
  // Untuk simpel, kita asumsikan codes diambil dari localStorage (atau ganti sesuai kebutuhan)
  const codes = JSON.parse(localStorage.getItem("voting_codes") || "[]") as any[];

  useEffect(() => {
    // Auto print saat halaman terbuka
    setTimeout(() => {
      window.print();
    }, 800); // beri waktu render selesai
  }, []);

  return (
    <div className="print-container p-4 md:p-8 bg-white text-black min-h-screen">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .card {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="text-center mb-8 no-print">
        <h1 className="text-3xl font-bold">Preview Kartu Token Voting</h1>
        <p className="text-gray-600">Akan otomatis tercetak saat membuka halaman ini</p>
        <button
          onClick={() => window.print()}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Cetak Sekarang
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {codes.map((code) => (
          <div
            key={code.id}
            className="card border-2 border-black rounded-xl p-6 text-center h-[180px] flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-700">
                {schoolName}
              </div>
              <div className="text-xs text-gray-500 mt-1">Kode Suara OSIS / Ketua Kelas</div>
            </div>

            <div className="my-4">
              <div className="text-5xl font-black tracking-widest font-mono">
                {code.code}
              </div>
            </div>

            <div className="text-xs text-gray-600">
              <p>Gunakan kode ini untuk voting sekali saja.</p>
              <p className="mt-1 font-semibold">RAHASIA – Jangan dibagikan</p>
            </div>
          </div>
        ))}
      </div>

      {codes.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          Belum ada kode voting yang tersedia untuk dicetak.
        </div>
      )}
    </div>
  );
}