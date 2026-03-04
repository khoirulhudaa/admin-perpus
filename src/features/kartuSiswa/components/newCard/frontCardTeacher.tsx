import { SchoolLogo } from "@/features/schools/components";
import dayjs from "dayjs";
import React, { useState } from "react";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import "./styles/frontCard.css";

interface FrontCardProps {
  teacher: any;
  background: string;
  orientation: "horizontal" | "vertical";
}

const genderOptions = {
  Male: "Laki-laki",
  Female: "Perempuan",
};

const FrontCardTeacher: React.FC<FrontCardProps> = ({
  teacher,
  background,
  orientation,
}) => {
  const [imageError, setImageError] = useState(false);

  const calculateExpiryDate = () => {
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setFullYear(today.getFullYear() + 3);
    const month = String(expiryDate.getMonth() + 1).padStart(2, "0");
    const year = String(expiryDate.getFullYear()).slice(-2);
    return `${month}/${year}`;
  };

  const expiryDate = calculateExpiryDate();

  const formattedTanggalLahir = (value?: string | null) => {
    return value ? dayjs(value).format("DD-MM-YYYY") : "Kosong";
  };

  // console.log('teacher', teacher?.user)

  return (
    <div id={`student-card-${teacher.id}`} className="container">
      <div
        className={`front-card ${orientation}`}
        style={{
          backgroundImage: `url(${background})`,
          width: orientation === "vertical" ? "300px" : "500px",
          height: orientation === "vertical" ? "500px" : "300px",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={`header ${orientation}`}>
          {orientation === "horizontal" && (
            <div className={`logo-container ${orientation}`}>
              <SchoolLogo
                image={teacher.logoSekolah || ""}
                title={teacher.sekolah || ""}
              />
            </div>
          )}
          <div className="school-info">
            <h2 className="school-name">{teacher?.user?.sekolah?.namaSekolah || '-'}</h2>
            {orientation === "horizontal" && (
              <p className="school-address">{teacher?.alamatSekolah || '-'}</p>
            )}
          </div>
        </div>

        <div className="title relative top-1">KARTU KEPEGAWAIAN SEKOLAH</div>

        <div className={`content ${orientation}`}>
          <div className={`photo-placeholder ${orientation}`}>
            <img
              src={
                teacher.user.image === null
                  ? "/defaultProfile.png"
                  : 'https://dev.kiraproject.id'+teacher?.user.image || "/default-avatar.png"
              }
              alt="Profile"
              className={`profile-image ${orientation}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={() => setImageError(true)}
            />
          </div>
          <div className={`info ${orientation}`}>
            <h3 className="student-name">{teacher.user.name}</h3>
            <div className="info-grid">
              <div className="label">NIP/NRK</div>
              <div className="value">
                : {teacher.user.nip || '-'} / {teacher.user.nrk || '-'}
              </div>
              <div className="label">TTL</div>
              <div className="value">
                : {formattedTanggalLahir(teacher.user.tanggalLahir) || '-'}
              </div>
              <div className="label">Jenis Kelamin</div>
              <div className="value">
                : {genderOptions[teacher.user.jenisKelamin]}
              </div>
              <div className="label">Alamat</div>
              <div className="flex gap-[2px]">
                <div>:</div>
                <div className="value address-value" style={{ wordWrap: 'break-word', maxWidth: '100%' }}>
                  {teacher?.user?.alamat || "Tidak tersedia"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`footer ${orientation}`}>
          <div className="barcode-placeholder relative -top-5">
             {teacher.user.nip ? ( 
               <Barcode
                 value={teacher.user.nip}
                 format="CODE128"
                 fontSize={12}
                 width={1.5}
                 height={38}
               />

             ):
              <p className="text-black bg-white px-2 rounded-sm shadow-md">NIP belum ada</p>
            }
          </div>
          {/* {orientation === "horizontal" && (
             <div className={`relative ${teacher.user.nrk ? 'qr-section' : 'qr-container scale-[0.7] relative top-[-26px]'}`}>
              {teacher.user.nrk ? (
                <div className="relative top-[-10px]">
                  <QRCode value={String(teacher.user.nrk)} size={56} />
                </div>
              ) : (
                <p className="text-black">NRK belum ada</p>
              )}
            </div>
          )} */}
          {orientation === "horizontal" && (
             <div className={`relative ${teacher.user.nrk ? 'qr-section' : 'qr-container scale-[0.7] relative top-[-26px]'}`}>
              {teacher.user.nrk ? (
                <div className="absolute bottom-[-6px]">
                  <QRCode value={String(teacher.user.nrk)} size={56} />
                </div>
              ) : (
                <p className="text-black">NRK belum ada</p>
              )}
            </div>
          )}
          {orientation === "horizontal" && (
            <div className="expired">
              <p>Berlaku sampai</p>
              <p className="date">{expiryDate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrontCardTeacher;