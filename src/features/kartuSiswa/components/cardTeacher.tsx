import { Badge, Button, Input, lang } from "@/core/libs";
import { useSchool, useSchoolForCard } from "@/features/schools";
import { useBiodataGuruForCard } from "@/features/user";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import DownloadButtonForTeacher from "./downloadButtonForTeacher";
import BackCardTeacher from "./newCard/backCardTeacher";
import FrontCardTeacher from "./newCard/frontCardTeacher";
import { SearchSlash } from "lucide-react";
import { getStaticFile } from "@/core/utils";

interface MultiCardProps {
  searchKelas: string;
  schoolId: number | null;
  selectedBackgroundFront: string;
  selectedBackgroundBack: string;
  orientation: "horizontal" | "vertical";
  startIndex: number; // tambahkan
  endIndex: number;   // tambahkan
}

export const MultiCardForTeacher = ({
  searchKelas,
  schoolId,
  selectedBackgroundFront,
  selectedBackgroundBack,
  orientation,
  startIndex,
  endIndex,
}: MultiCardProps) => {
  const [visiMisiFontSize, setVisiMisiFontSize] = useState<number>(() => {
    const savedSize = localStorage.getItem("visiMisiFontSize");
    return savedSize ? parseInt(savedSize, 10) : 10;
  });
  const school = useSchool()
    
  const { 
    data: teachers,
    isLoading: isStudentsLoading,
    refetch: refetchTeachers,
    isRefetching: isStudentsRefetching
  } = useBiodataGuruForCard();

  console.log('teachersss', teachers)

  const {
    data: schoolDetail,
    isLoading: isSchoolLoading,
    refetch: schoolRefetch,
  } = useSchoolForCard();

  console.log('schoolDetail?.[0]?', schoolDetail)

  const printRef = useRef<HTMLDivElement>(null);
  const allDataRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    localStorage.setItem("visiMisiFontSize", visiMisiFontSize.toString());
  }, [visiMisiFontSize]);

  const isInitialLoading = isStudentsLoading || isSchoolLoading || !teachers || !schoolDetail;
  if (isInitialLoading) {
    return (
      <div className="w-full h-[200px] border border-dashed border-white rounded-lg flex items-center justify-center gap-5 text-center">
        <p>Loading...</p>
        <FaSpinner className="animate-spin duration-800" />
      </div>
    );
  }

  const hasTeachers = teachers?.data && Array.isArray(teachers?.data) && teachers?.data?.length > 0;
  // Filter sesuai range index (ingat index array mulai dari 0, jadi dikurangi 1)
  const filteredTeachers = hasTeachers
    ? teachers.data.slice(startIndex - 1, endIndex)
  : [];

  // const filteredTeachers = teachers?.data.filter((data) => {
  //   // Filter by schoolId
  //   if (schoolId && data.user.sekolah?.id !== schoolId) return false;}) || teachers?.data;
  return (
    <>
      <div className="w-full justify-between flex items-center gap-1">
        <div className="flex items-center gap-4">
          <div style={{ textAlign: "center" }}>
            <DownloadButtonForTeacher
              targetRef={printRef}
              allDataRef={allDataRef}
              isFiltered={searchKelas !== "all"}
              students={filteredTeachers}
            />
          </div>
          <Badge variant="outline" className="py-[5px] text-[16px]">
            {lang.text('totalData')}:
            <div className="ml-1.5" />
            {teachers?.data?.length || 0}
          </Badge>
        </div>
        <div className="flex items-center gap-5">
            <div className="w-max flex items-center gap-2 my-4">
                <label className="text-white text-sm">Ukuran Teks Visi Misi:</label>
                <div className="min-w-[52px] h-[30px] border border-white/20 rounded-sm px-2 flex items-center justify-center">
                    <span className="text-white text-sm">{visiMisiFontSize}px</span>
                </div>
                {/* Tombol minus */}
                <button
                    onClick={() => setVisiMisiFontSize((prev) => Math.max(8, prev - 1))}
                    className="w-[30px] h-[30px] bg-white text-black rounded-md text-xl font-bold hover:bg-gray-200"
                    aria-label="Kurangi ukuran font"
                >
                    –
                </button>

                {/* Slider */}
                <Input
                    type="range"
                    min={8}
                    max={16}
                    value={visiMisiFontSize}
                    onChange={(e) => setVisiMisiFontSize(Number(e.target.value))}
                    className="w-[150px]"
                />

                {/* Tombol plus */}
                <button
                    onClick={() => setVisiMisiFontSize((prev) => Math.min(20, prev + 1))}
                    className="w-[30px] h-[30px] bg-white text-black rounded-md text-xl font-bold hover:bg-gray-200"
                    aria-label="Tambah ukuran font"
                >
                    +
                </button>
            </div>
            <div className="w-[1.6px] h-[20px] bg-white/60">

            </div>
            <Button
                variant="outline"
                className="py-[5px] flex items-center text-[15px] gap-3"
                onClick={() => {refetchTeachers(), schoolRefetch()}}
                disabled={isStudentsRefetching}
            >
                {isStudentsRefetching ? (
                <span className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    {lang.text('progress')}
                </span>
                ) : (
                lang.text('updateCard')
                )}
                <ReloadIcon />
            </Button>
        </div>
      </div>
      {/* <div ref={printRef} style={{ padding: hasTeachers ? "30px" : "0px", textAlign: "left" }}>
        {hasTeachers ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: orientation === "horizontal" ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
              gap: "20px",
              justifyContent: "center",
              maxWidth: "100%",
              padding: "10px",
            }}
          >
            {(teachers?.data || []).map((teacher) => {
              const logoSekolah = schoolDetail?.[0]?.file?.includes('uploads/assets')
                ? `https://dev.kiraproject.id${schoolDetail[0].file}`
                : !schoolDetail?.[0]?.file?.includes('uploads/assets')
                ? getStaticFile(schoolDetail[0].file)
                : '/default-school-logo.png';

              return (
                <div
                  key={teacher.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <FrontCardTeacher
                    teacher={{
                      ...teacher,
                      sekolah: schoolDetail?.[0]?.namaSekolah || "Nama Sekolah Tidak Ada",
                      alamatSekolah: schoolDetail?.[0]?.alamatSekolah || "Alamat Sekolah Tidak Ada",
                      logoSekolah,
                    }}
                    background={selectedBackgroundFront}
                    orientation={orientation}
                  />
                  <BackCardTeacher
                    teacher={{
                      ...teacher,
                      sekolah: schoolDetail?.[0]?.namaSekolah || "Nama Sekolah Tidak Ada",
                      alamatSekolah: schoolDetail?.[0]?.alamatSekolah || "Alamat Sekolah Tidak Ada",
                      logoSekolah,
                    }}
                    background={selectedBackgroundBack}
                    orientation={orientation}
                    visiMisi={schoolDetail?.[0]?.visiMisi}
                    fontSize={visiMisiFontSize}
                    namaKepalaSekolah={school?.data?.[0]?.namaKepalaSekolah || ""}
                    ttdKepalaSekolah={school?.data?.[0]?.ttdKepalaSekolah || ""}
                  />
                </div>
              );
            })}
          </div>
        ) : (
            <div className="mt-8 w-full text-center px-10 py-20 mx-auto left-[0%] relative border border-white/20 border-dashed rounded-md">
              <p className="flex items-center w-full justify-center gap-2">{lang.text('teacherNull')} <SearchSlash /></p>
            </div>
        )}
      </div> */}

      <div ref={printRef} style={{ padding: hasTeachers ? "30px" : "0px", textAlign: "left" }}>
        {hasTeachers ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                orientation === "horizontal" ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
              gap: "20px",
              justifyContent: "center",
              maxWidth: "100%",
              padding: "10px",
            }}
          >
            {filteredTeachers.map((teacher) => {
             const logoSekolah = schoolDetail?.[0]?.file
              ? schoolDetail[0].file.includes('uploads/assets')
                ? `https://dev.kiraproject.id${schoolDetail[0].file}`
                : getStaticFile(schoolDetail[0].file)
              : '/default-school-logo.png';

              return (
                <div key={teacher.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <FrontCardTeacher
                    teacher={{
                      ...teacher,
                      sekolah: schoolDetail?.[0]?.namaSekolah || "Nama Sekolah Tidak Ada",
                      alamatSekolah: schoolDetail?.[0]?.alamatSekolah || "Alamat Sekolah Tidak Ada",
                      logoSekolah,
                    }}
                    background={selectedBackgroundFront}
                    orientation={orientation}
                  />
                  <BackCardTeacher
                    teacher={{
                      ...teacher,
                      sekolah: schoolDetail?.[0]?.namaSekolah || "Nama Sekolah Tidak Ada",
                      alamatSekolah: schoolDetail?.[0]?.alamatSekolah || "Alamat Sekolah Tidak Ada",
                      logoSekolah,
                    }}
                    background={selectedBackgroundBack}
                    orientation={orientation}
                    visiMisi={schoolDetail?.[0]?.visiMisiLegacy}
                    fontSize={visiMisiFontSize}
                    namaKepalaSekolah={school?.data?.[0]?.namaKepalaSekolah || ""}
                    ttdKepalaSekolah={school?.data?.[0]?.ttdKepalaSekolah || ""}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 w-full text-center px-10 py-20 mx-auto left-[0%] relative border border-white/20 border-dashed rounded-md">
            <p className="flex items-center w-full justify-center gap-2">{lang.text('teacherNull')} <SearchSlash /></p>
          </div>
        )}
      </div>
    </>
  );
};