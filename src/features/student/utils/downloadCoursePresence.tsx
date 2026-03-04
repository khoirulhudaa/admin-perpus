import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import { getStaticFile } from "@/core/utils"; // pastikan fungsi ini tersedia

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
  },
  header: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
  },
  headerImage: {
    width: 595,
    maxHeight: 150,
    objectFit: 'contain',
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  contentWrapper: {
    paddingLeft: 32,
    paddingRight: 32,
    marginTop: 10,
  },
  tableColHeader: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "20%",
    padding: 5,
    fontWeight: "bold",
    backgroundColor: "#eee",
    textAlign: "center",
  },
  tableCol: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "20%",
    padding: 5,
    textAlign: "center",
  },
  lastCol: {
    borderRightWidth: 0,
  },
  signature: {
    marginTop: 50,
    alignItems: "flex-end",
  },
  signatureImage: {
    width: 120,
    height: "auto",
    maxHeight: 50,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "flex-end",
  },
  signatureText: {
    textAlign: "center",
  },
});

export const StudentCoursePresencePDF = ({
  data,
  school,
}: {
  data: any[];
  school: {
    namaSekolah?: string;
    kopSurat?: string;
    ttdKepalaSekolah?: string;
    namaKepalaSekolah?: string;
  };
}) => {
  const kopSurat = school.kopSurat
    ? school.kopSurat.startsWith("data:image")
      ? school.kopSurat
      : `data:image/png;base64,${school.kopSurat}`
    : undefined;

  const signature = school.ttdKepalaSekolah
    ? school.ttdKepalaSekolah.startsWith("data:image")
      ? school.ttdKepalaSekolah
      : `data:image/png;base64,${school.ttdKepalaSekolah}`
    : undefined;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Kop Surat */}
        <View style={styles.header} fixed>
          {kopSurat && (
            <Image src={getStaticFile(kopSurat)} style={styles.headerImage} />
          )}
        </View>
        
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Laporan Kehadiran Siswa</Text>

          {/* Tabel Kehadiran */}
          <View style={styles.table}>
            {/* Header */}
            <View style={styles.tableRow}>
              {[
                "Tanggal",
                "Jam",
                "Tipe Absen",
                "Mata Pelajaran",
                "Status",
              ].map((col, i) => (
                <Text
                  key={i}
                  style={[
                    styles.tableColHeader,
                    i === 4 ? styles.lastCol : undefined,
                  ]}
                >
                  {col}
                </Text>
              ))}
            </View>

            {/* Rows */}
            {data.map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.tableCol}>
                  {dayjs(item?.kehadiranMapel?.[0]?.tanggal).format(
                    "DD/MM/YYYY"
                  )}
                </Text>
                <Text style={styles.tableCol}>
                  {dayjs(item?.jamMasuk).format("HH:mm")}
                </Text>
                <Text style={styles.tableCol}>
                  {item?.tipeAbsenMasuk || "-"}
                </Text>
                <Text style={styles.tableCol}>
                  {item?.mataPelajaran?.namaMataPelajaran || "-"}
                </Text>
                <Text style={[styles.tableCol, styles.lastCol]}>
                  {item?.kehadiranMapel?.[0]?.statusKehadiran || "-"}
                </Text>
              </View>
            ))}
          </View>

          {/* Tanda Tangan */}
          <View style={styles.signature}>
            <Text style={styles.signatureText}>Kepala Sekolah,</Text>
            {signature && (
              <Image
                src={getStaticFile(signature)}
                style={styles.signatureImage}
              />
            )}
            <Text style={styles.signatureText}>
              {school.namaKepalaSekolah || "Nama Kepala Sekolah"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
