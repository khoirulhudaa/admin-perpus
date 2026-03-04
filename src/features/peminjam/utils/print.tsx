import React from "react";

export const ReceiptTemplate = React.forwardRef(({ data }: any, ref: any) => {
  if (!data) return null;
  return (
    <div ref={ref} className="p-8 text-slate-800 font-mono text-sm max-w-[80mm]">
      <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
        <h2 className="font-black uppercase text-lg">Bukti Peminjaman</h2>
        <p className="text-[10px] uppercase">Perpustakaan Digital Sekolah</p>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between"><span>Nama:</span> <span className="font-bold">{data.peminjamName}</span></div>
        <div className="flex justify-between"><span>ID:</span> <span className="font-bold">{data.peminjamId}</span></div>
        <div className="flex justify-between"><span>Buku:</span> <span className="font-bold">{data.Eksemplar?.Biblio?.title}</span></div>
        <div className="flex justify-between"><span>Reg:</span> <span className="font-bold">{data.Eksemplar?.registerNumber}</span></div>
      </div>

      <div className="bg-slate-100 p-3 rounded-lg text-center border border-slate-200">
        <p className="text-[10px] uppercase mb-1">Batas Pengembalian</p>
        <p className="font-black text-lg">{data.tglKembali}</p>
      </div>

      <div className="mt-6 text-center text-[9px] text-slate-400 italic">
        * Harap dikembalikan tepat waktu untuk menghindari denda.<br/>
        Terima Kasih
      </div>
    </div>
  );
});