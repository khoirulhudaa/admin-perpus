import { SchoolLogo } from "@/features/schools/components";
import { Student } from "@/types/student";
import dayjs from "dayjs";
import React, { useState } from "react";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import "./styles/frontCard.css";

interface FrontCardProps {
  student: Student;
  background: string;
  orientation: "horizontal" | "vertical";
}

const genderOptions = {
  Male: "Laki-laki",
  Female: "Perempuan",
};

const FrontCard: React.FC<FrontCardProps> = ({
  student,
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

  return (
    <div id={`student-card-${student.id}`} className="container">
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
                image={student.logoSekolah || ""}
                title={student.sekolah || ""}
              />
            </div>
          )}
          <div className="school-info">
            <h2 className="school-name">{student?.sekolah || '-'}</h2>
            {orientation === "horizontal" && (
              <p className="school-address">{student?.alamatSekolah || '-'}</p>
            )}
          </div>
        </div>

        <div className="title relative top-1">KARTU PELAJAR</div>

        <div className={`content ${orientation}`}>
          <div className={`photo-placeholder ${orientation}`}>
            <img
              src={
                student.image === null
                  ? "/defaultProfile.png"
                  : 'https://dev.kiraproject.id'+student?.image || "/default-avatar.png"
              }
              alt="Profile"
              className={`profile-image ${orientation}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={() => setImageError(true)}
            />
          </div>
          <div className={`info ${orientation}`}>
            <h3 className="student-name">{student.name}</h3>
            <div className="info-grid">
              <div className="label">NIS/NISN</div>
              <div className="value">
                : {student.nis || '-'} / {student.nisn || '-'}
              </div>
              <div className="label">TTL</div>
              <div className="value">
                : {formattedTanggalLahir(student.tanggalLahir)}
              </div>
              <div className="label">Jenis Kelamin</div>
              <div className="value">
                : {genderOptions[student.jenisKelamin]}
              </div>
              <div className="label">Alamat</div>
              
              <div className="flex gap-[2px]">
                <div>:</div>
                <div className="value address-value" style={{ wordWrap: 'break-word', maxWidth: '100%' }}>
                  {student.alamat || "Tidak tersedia"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`footer ${orientation}`}>
          <div className="barcode-placeholder relative -top-5">
             {student.nis ? ( 
               <Barcode
                 value={student.nis}
                 format="CODE128"
                 fontSize={12}
                 width={2.2}
                 height={38}
               />

             ):
              <p className="text-black bg-white px-2 rounded-sm shadow-md">NIS belum ada</p>
            }
          </div>
          {orientation === "horizontal" && (
             <div className={`relative ${student.nisn ? 'qr-section' : 'qr-container scale-[0.7] relative top-[-26px]'}`}>
              {student.nisn ? (
                <div className="absolute bottom-[-6px]">
                  <QRCode value={String(student.nisn)} size={56} />
                </div>
              ) : (
                <p className="text-black">NISN belum ada</p>
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

export default FrontCard;