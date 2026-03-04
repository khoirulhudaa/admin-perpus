import { lang, simpleEncode } from "@/core/libs";
import { BiodataGuru } from "@/core/models/biodata-guru";
import { getStaticFile } from "@/core/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  buttonVariants,
  cn,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/libs";
import { ExternalLink, InfoIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useVokadialog, Vokadialog } from "@/features/_global";

export interface TableItemGuruProps {
  data: BiodataGuru;
}

export const TableItemGuru = React.memo(({ data }: TableItemGuruProps) => {
  const dialog = useVokadialog();

  const d = data;
  const nameArr = d?.user?.name?.split(" ") || [];
  const initialName =
    nameArr && nameArr.length > 0
      ? `${nameArr?.[0]?.[0]?.toUpperCase() || ""}${nameArr?.[1]?.[0]?.toUpperCase() || ""}`
      : "-";

  const fotoAbsenMasuk = data?.absensis?.[0]?.fotoAbsen || "";
  const fotoAbsenPulang = data?.absensis?.[0]?.fotoAbsenPulang || "";
  const buktiSurat = data?.absensis?.[0]?.dispensasi?.buktiSurat || "";

  const encryptPayload = simpleEncode(
    JSON.stringify({ id: data?.id, text: data?.user?.name }),
  );

  const renderUser = (badge = true) => {
    return (
      <div className="flex gap-2">
        <Avatar>
          <AvatarImage src={d?.user?.image} alt={d?.user?.name} />
          <AvatarFallback>{initialName}</AvatarFallback>
        </Avatar>
        <div className="">
          <p className="font-bold mb-1">{d?.user?.name}</p>
          <p className="text-xs mb-1">{`${d?.user?.email || "-"} | ${d?.user?.sekolah?.namaSekolah || "Belum ada sekolah"}`}</p>
          <p className="text-xs mb-2 text-gray-600">{`${d?.user?.nip || "-"} / ${d?.user?.nrk || "-"}`}</p>
          {badge && (
            <>
              {d?.absensis?.[0]?.statusKehadiran && (
                <div className="flex gap-1">
                  <Badge className="text-white">
                    {d?.absensis?.[0]?.statusKehadiran}
                  </Badge>
                  {buktiSurat && (
                    <Link
                      to={getStaticFile(buktiSurat)}
                      target="_blank"
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "text-xs px-2",
                      )}
                    >
                      <span className="mr-1">
                        {" "}
                        {`Lihat bukti surat ${d?.absensis?.[0]?.statusKehadiran}`}
                      </span>
                      <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const fields = [
      {
        label: "Jumlah Masuk",
        value: data?.absensis?.length,
      },
      {
        label: "Jumlah Izin",
        value:
          data?.absensis?.filter((d) => d.statusKehadiran === "izin").length ||
          0,
      },
      {
        label: "Jumlah Sakit",
        value:
          data?.absensis?.filter((d) => d.statusKehadiran === "sakit").length ||
          0,
      },
      {
        label: "Jumlah Alfa",
        value:
          data?.absensis?.filter((d) => d.statusKehadiran === "alfa").length ||
          0,
      },
      {
        label: "Kehadiran Terakhir",
        value: !data?.absensis?.[0]?.statusKehadiran ? (
          "Tidak ada kehadiran"
        ) : (
          <Badge>{data?.absensis?.[0]?.statusKehadiran}</Badge>
        ),
      },
      ...(buktiSurat
        ? [
            {
              label: "Bukti Surat",
              value: (
                <Link
                  to={getStaticFile(buktiSurat)}
                  target="_blank"
                >{`Lihat bukti surat ${data?.absensis?.[0]?.dispensasi?.alasan || ""}`}</Link>
              ),
            },
          ]
        : []),
    ];

    return (
      <div className="flex flex-col gap-1">
        {renderUser(false)}
        {fields.map((field) => {
          return (
            <div className="text-sm flex gap-2 flex-row">
              <div className="w-32">
                <span>{field.label}</span>
              </div>
              <div className="flex-1 text-right">
                <span>{field.value}</span>
              </div>
            </div>
          );
        })}
        {(fotoAbsenMasuk || fotoAbsenPulang) && (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Absen Masuk</TableHead>
                  <TableHead className="text-center">Absen Pulang</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-center">
                    {fotoAbsenMasuk && (
                      <img
                        src={getStaticFile(fotoAbsenMasuk)}
                        alt="foto absen"
                        className="w-32 inline-block"
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {fotoAbsenPulang && (
                      <img
                        src={getStaticFile(fotoAbsenPulang)}
                        alt="foto absen"
                        className="w-32 inline-block"
                      />
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        {renderUser()}
        <div className="flex items-center justify-end">
          <Button onClick={() => dialog.open()}>
            <InfoIcon size={14} className="mr-1" />
            <span className="text-xs">{lang.text("detail")}</span>
          </Button>
        </div>
      </div>
      <Vokadialog
        visible={dialog.visible}
        content={renderContent()}
        onOpenChange={dialog.setVisible}
        footer={
          <Link
            className={cn(buttonVariants({ variant: "default" }))}
            to={`/teachers/${encryptPayload}`}
          >
            {lang.text("biodata")}
          </Link>
        }
        title={lang.text("detail")}
      />
    </>
  );
});
