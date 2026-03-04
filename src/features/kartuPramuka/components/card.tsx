import { Button, Input, lang } from "@/core/libs";
import { useDataTableController } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useSchool, useSchoolForCard } from "@/features/schools";
import { useStudentPagination } from "@/features/student";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { NextIcon, PreviousIcon } from "yet-another-react-lightbox";
import DownloadButton from "./downloadButton";
import BackCard from "./newCard/backCard";
import FrontCard from "./newCard/frontCard";
import { SearchSlash } from "lucide-react";
import { getStaticFile } from "@/core/utils";

interface MultiCardProps {
  searchKelas: string;
  schoolId: number | null;
  selectedBackgroundFront: string;
  selectedBackgroundBack: string;
  orientation: "horizontal" | "vertical";
}

export const MultiCard = ({
  searchKelas,
  schoolId,
  selectedBackgroundFront,
  selectedBackgroundBack,
  orientation,
}: MultiCardProps) => {
  const [visiMisiFontSize, setVisiMisiFontSize] = useState<number>(() => {
    const savedSize = localStorage.getItem("visiMisiFontSize");
    return savedSize ? parseInt(savedSize, 10) : 10;
  });

  const [visiMisiLineHeight, setVisiMisiLineHeight] = useState<number>(() => {
    const savedLineHeight = localStorage.getItem("visiMisiLineHeight");
    return savedLineHeight ? parseFloat(savedLineHeight) : 1.5;
  });

  const school = useSchool()

  const { global, sorting, filter, pagination, onSortingChange, onPaginationChange } = useDataTableController({
    defaultPageSize: 50,
  });

  const profile = useProfile();
  const { data: schoolData, isLoading: isSchoolLoading } = useSchool();
  const { data: schoolDetail, isLoading: isSchoolDetailLoading, refetch: schoolRefetch } = useSchoolForCard();

  const sekolahId = filter.find((f) => f.id === "sekolahId")?.value || profile.user?.sekolahId || schoolId || 1;
  const idKelas = filter.find((f) => f.id === "idKelas")?.value || (searchKelas !== "all" ? searchKelas : undefined);

  // Memoized student parameters
  const studentParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sekolahId: sekolahId ? +sekolahId : undefined,
      idKelas: idKelas ? +idKelas : undefined,
      keyword: global || "",
    }),
    [pagination.pageIndex, pagination.pageSize, sekolahId, idKelas, global]
  );

  const { data, isLoading: isStudentsLoading, refetch } = useStudentPagination(studentParams);

  const printRef = useRef<HTMLDivElement>(null);
  const allDataRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("visiMisiFontSize", visiMisiFontSize.toString());
    localStorage.setItem("visiMisiLineHeight", visiMisiLineHeight.toString());
  }, [visiMisiFontSize, visiMisiLineHeight]);

  // Trigger refetch when studentParams changes
  useEffect(() => {
    console.log("studentParams:", studentParams);
    refetch();
  }, [studentParams, refetch]);

  const isInitialLoading = isStudentsLoading || isSchoolLoading || isSchoolDetailLoading || !data?.students || !schoolDetail;
  if (isInitialLoading) {
    return (
      <div className="w-full h-[200px] border border-dashed border-white rounded-lg flex items-center justify-center gap-5 text-center">
        <p>Loading...</p>
        <FaSpinner className="animate-spin duration-800" />
      </div>
    );
  }

  const totalPages = Math.ceil((data?.pagination?.totalItems || 0) / pagination.pageSize);
  const hasStudents = data?.students && Array.isArray(data.students) && data.students.length > 0;
  return (
    <>
      <div className="w-full justify-between flex items-center gap-5">
        <div className="flex items-center gap-4">
          <div style={{ textAlign: "center" }}>
            <DownloadButton
              targetRef={printRef}
              allDataRef={allDataRef}
              isFiltered={searchKelas !== "all"}
              students={data?.students || []}
            />
          </div>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={pagination.pageIndex === 0 || isStudentsLoading}
                onClick={() => onPaginationChange({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
              >
                <PreviousIcon />
              </Button>
              <span className="text-white">
               {pagination.pageIndex + 1} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                disabled={pagination.pageIndex + 1 >= totalPages || isStudentsLoading}
                onClick={() => onPaginationChange({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
              >
                <NextIcon />
              </Button>
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="text-white">Show:</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => onPaginationChange({ ...pagination, pageSize: Number(e.target.value), pageIndex: 0 })}
                className="border border-white/20 rounded-md bg-transparent text-white px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div> */}
          </div>
          {/* <Badge variant="outline" className="py-[5px] text-[16px]">
            {lang.text("totalData")}:
            <div className="ml-1.5" />
            {data?.pagination?.totalItems || 0}
          </Badge> */}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-max flex items-center gap-2 my-4">
            <label className="text-white text-sm">Ukuran VisiMisi:</label>
            <div className="min-w-[52px] h-[30px] border border-white/20 rounded-sm px-2 flex items-center justify-center">
              <span className="text-white text-sm">{visiMisiFontSize}px</span>
            </div>
            <button
              onClick={() => setVisiMisiFontSize((prev) => Math.max(8, prev - 1))}
              className="w-[30px] h-[30px] bg-white text-black rounded-md text-xl font-bold hover:bg-gray-200"
              aria-label="Kurangi ukuran font"
            >
              –
            </button>
            <Input
              type="range"
              min={8}
              max={16}
              value={visiMisiFontSize}
              onChange={(e) => setVisiMisiFontSize(Number(e.target.value))}
              className="w-[150px]"
            />
            <button
              onClick={() => setVisiMisiFontSize((prev) => Math.min(20, prev + 1))}
              className="w-[30px] h-[30px] bg-white text-black rounded-md text-xl font-bold hover:bg-gray-200"
              aria-label="Tambah ukuran font"
            >
              +
            </button>
          </div>
          <div className="w-[1.6px] h-[20px] bg-white/60" />
          <div className="w-max flex items-center gap-2 my-4">
            <label className="text-white text-sm">{lang.text("lineHeight")} VisiMisi:</label>
            <div className="min-w-[52px] h-[30px] border border-white/20 rounded-sm px-2 flex items-center justify-center">
              <span className="text-white text-sm">{visiMisiLineHeight.toFixed(1)}</span>
            </div>
            <button
              onClick={() => setVisiMisiLineHeight((prev) => Math.max(1.0, prev - 0.1))}
              className="w-[30px] h-[30px] bg-white text-black rounded-md text-xl font-bold hover:bg-gray-200"
              aria-label="Kurangi line height"
            >
              –
            </button>
            <Input
              type="range"
              min={1.0}
              max={2.0}
              step={0.1}
              value={visiMisiLineHeight}
              onChange={(e) => setVisiMisiLineHeight(Number(e.target.value))}
              className="w-[150px]"
            />
            <button
              onClick={() => setVisiMisiLineHeight((prev) => Math.min(2.0, prev + 0.1))}
              className="w-[30px] h-[30px] bg-white text-black rounded-md text-xl font-bold hover:bg-gray-200"
              aria-label="Tambah line height"
            >
              +
            </button>
          </div>
          <div className="w-[1.6px] h-[20px] bg-white/60" />
          <Button
            variant="outline"
            className="py-[5px] flex items-center text-[15px] gap-3"
            onClick={() => {
              refetch();
              schoolRefetch();
            }}
            disabled={isStudentsLoading}
          >
            {isStudentsLoading ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                {lang.text("progress")}
              </span>
            ) : (
              lang.text("updateCard")
            )}
            <ReloadIcon />
          </Button>
        </div>
      </div>

      <div ref={printRef} style={{ padding: hasStudents ? "30px" : "0px", textAlign: "left" }}>
         {hasStudents ? (
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
            {(data.students || [])
              .filter((student) => (student.isActive ?? student.user?.isActive) !== 0)
              .map((student) => {
              const logoSekolah = schoolDetail?.[0]?.file?.includes('uploads/assets')
                ? `https://dev.kiraproject.id${schoolDetail[0].file}`
                : !schoolDetail?.[0]?.file?.includes('uploads/assets')
                ? getStaticFile(schoolDetail[0].file)
                : '/default-school-logo.png';

                return (
                  <div
                    key={student.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FrontCard
                      student={{
                        ...student,
                        sekolah: schoolDetail?.[0]?.namaSekolah || "Nama Sekolah Tidak Ada",
                        alamatSekolah: schoolDetail?.[0]?.alamatSekolah || "Alamat Sekolah Tidak Ada",
                        logoSekolah,
                      }}
                      background={selectedBackgroundFront}
                      orientation={orientation}
                    />
                    <BackCard
                      student={{
                        ...student,
                        sekolah: schoolDetail?.[0]?.namaSekolah || "Nama Sekolah Tidak Ada",
                        alamatSekolah: schoolDetail?.[0]?.alamatSekolah || "Alamat Sekolah Tidak Ada",
                        logoSekolah,
                      }}
                      background={selectedBackgroundBack}
                      orientation={orientation}
                      visiMisi={schoolDetail?.[0]?.visiMisi}
                      fontSize={visiMisiFontSize}
                      lineHeight={visiMisiLineHeight}
                      namaKepalaSekolah={schoolData?.[0]?.namaKepalaSekolah || ""}
                      ttdKepalaSekolah={schoolData?.[0]?.ttdKepalaSekolah || ""}
                    />
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="mt-8 w-full text-center px-10 py-20 mx-auto left-[0%] relative border border-white/20 border-dashed rounded-md">
            <p className="flex items-center w-full justify-center gap-2">{lang.text('studentNull')} <SearchSlash /></p>
          </div>
        )}
        </div>
      {/* </div> */}
    </>
  );
};
