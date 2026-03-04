import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { getStaticFile } from "@/core/utils"; // pastikan fungsi ini ada

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 32,
    fontFamily: "Times-Roman",
  },
  header: {
    marginBottom: 20,
  },
  headerImage: {
    width: 595,
    maxHeight: 130,
    objectFit: "contain",
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 20,
    fontStyle: "italic",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 5,
    fontWeight: "bold",
    width: "20%",
    backgroundColor: "#eee",
    textAlign: "center",
  },
  tableCol: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 5,
    width: "20%",
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

export const StudentParentPDF = ({
  data,
  school,
}: {
  data: any[];
  school: {
    namaSekolah: string;
    kopSurat?: string;
    namaKepalaSekolah?: string;
    ttdKepalaSekolah?: string;
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

        {/* Judul */}
        <Text style={styles.title}>Data Orang Tua dan Siswa</Text>
        <Text style={styles.subtitle}>{school.namaSekolah}</Text>

        {/* Tabel Data */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            {["Nama Ortu", "Email", "No. Telepon", "NIK", "Nama Siswa"].map(
              (h, i) => (
                <Text
                  key={i}
                  style={[
                    styles.tableColHeader,
                    i === 4 ? styles.lastCol : undefined,
                  ]}
                >
                  {h}
                </Text>
              )
            )}
          </View>

          {/* Data Rows */}
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>{item.name || "-"}</Text>
              <Text style={styles.tableCol}>{item.email || "-"}</Text>
              <Text style={styles.tableCol}>{item.noTlp || "-"}</Text>
              <Text style={styles.tableCol}>{item.nik || "-"}</Text>
              <Text style={[styles.tableCol, styles.lastCol]}>
                {item.student?.user?.name || "-"}
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
      </Page>
    </Document>
  );
};
