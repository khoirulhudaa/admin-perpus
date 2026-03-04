import React from "react";
import "./styles/backCard.css";
import { getStaticFile } from "@/core/utils";
interface BackCardProps {
  teacher: any;
  background: string;
  orientation: "horizontal" | "vertical";
  visiMisi?: string;
  fontSize?: number;
  namaKepalaSekolah?: string;
  ttdKepalaSekolah?: string;
}

const BackCardTeacher: React.FC<BackCardProps> = ({
  teacher,
  background,
  orientation,
  visiMisi,
  fontSize,
  namaKepalaSekolah,
  ttdKepalaSekolah
}) => {
  return (
    <div
      id={`student-card-${teacher.id}-back`}
      className={`mt-2 back-card ${orientation}`}
      style={{ backgroundImage: `url(${background})` }}
    >
       <div className={`${orientation ==='vertical' ? 'flex flex-col back-card-content2' : 'back-card-content'}`}>
          <h2 className="back-title">{teacher.namaSekolah || teacher?.sekolah || "Sekolah Indonesia"}</h2>
          <div
            className={`bg-white p-4 border border-blue-800 rounded-lg text-black ${orientation === 'vertical' ? 'visi-misi2' : 'visi-misi'}`}
            style={{ fontSize: `${fontSize ?? 13}px` }}
          >
          <p className={`${orientation ==='vertical' ? 'w-[100%]' : 'w-[88%]'}`} dangerouslySetInnerHTML={{ __html: visiMisi || "Visi dan Misi tidak tersedia" }}></p>
          </div>
          {/* <div className={`qr-logo-section ${'horizontal'} absolute top-8 mr-2 right-12 mb-24 scale-[0.8]`}>
             <div className={`${teacher.user.nip ? '' : 'scale-[0.8]'} qr-container`}>
              {teacher.user.nip ? (
                  <QRCode
                    value={teacher.user.nip}
                    size={orientation === "vertical" ? 100 : 120}
                  />
                ) : (
                  <p className="text-black">NRK belum ada</p>
                )}
            </div>
          </div> */}
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
             <p className="text-[54%]">{namaKepalaSekolah || '[Isi nama kepala sekolah]'}</p>
          </div>
        </div>
    </div>
  );
};

export default BackCardTeacher;