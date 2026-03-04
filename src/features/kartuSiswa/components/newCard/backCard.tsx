import { Student } from "@/types/student";
import React from "react";
import "./styles/backCard.css";
import { getStaticFile } from "@/core/utils";

interface BackCardProps {
  student: Student;
  background: string;
  orientation: "horizontal" | "vertical";
  visiMisi?: string;
  fontSize?: number;
  lineHeight?: number;
  namaKepalaSekolah?: string;
  ttdKepalaSekolah?: string;
}

const BackCard: React.FC<BackCardProps> = ({
  student,
  background,
  orientation,
  visiMisi,
  fontSize,
  lineHeight,
  namaKepalaSekolah,
  ttdKepalaSekolah
}) => {
  console.log('ttdKepalaSekolah dsksld', ttdKepalaSekolah)
  return (
    <div
      id={`student-card-${student.id}-back`}
      className={`mt-2 back-card ${orientation}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={`${orientation ==='vertical' ? 'flex flex-col back-card-content2' : 'back-card-content'}`}>
          <h2 className="back-title">{student.namaSekolah || student?.sekolah || "Sekolah Indonesia"}</h2>
          <div
            className={`bg-white p-4 border border-blue-800 rounded-lg text-black ${orientation === 'vertical' ? 'visi-misi2' : 'visi-misi'}`}
            style={{ fontSize: `${fontSize ?? 13}px`, lineHeight: `${lineHeight ?? 1.5}` }}
          >
            <p className={`${orientation ==='vertical' ? 'w-[100%]' : 'w-[88%]'}`} dangerouslySetInnerHTML={{ __html: visiMisi || "Visi dan Misi tidak tersedia" }}></p>
          </div>
          <div className={`h-max pb-4 items-center justify-center flex flex-col ${'horizontal'} ${orientation === 'vertical' ? 'w-[100%] mt-3' : 'w-[22%] qr-logo-section'} text-black`}>
              {
                ttdKepalaSekolah ? (
                  <>
                  <p className="text-[54%] mb-1">{"Kepala sekolah"}</p>
                    <img
                      src={
                          ttdKepalaSekolah?.includes('uploads/assets')
                          ? `https://dev.kiraproject.id${ttdKepalaSekolah}`
                          : ttdKepalaSekolah?.includes('data:image')
                          ? ttdKepalaSekolah
                          : !ttdKepalaSekolah?.includes('/uploads/assets')
                          ? getStaticFile(String(ttdKepalaSekolah))
                          : '/default-school-logo.png'
                      }
                      alt={'ttdKepalaSekolah'}
                      className={`${orientation === 'vertical' ? 'w-[16%]' : 'w-[60%]'} object-contain`}
                    />
                  </>
                ):
                  <p className="text-black">Belum ada tanda tangan</p>
              }
             <p className="text-[54%]">{namaKepalaSekolah || 'Nama kepala sekolah'}</p>
          </div>
        </div>
    </div>
  );
};

export default BackCard;