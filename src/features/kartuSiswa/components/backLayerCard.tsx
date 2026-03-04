import { useBiodata } from "@/features/user"
import { QRCodeSVG } from "qrcode.react"
import { useState } from "react"

export const BackLayerCard: React.FC = () => {
  const { query } = useBiodata()
  const { data, isLoading, error } = query

  const itemsPerPage = 8
  const [currentPage, setCurrentPage] = useState(1)

  if (isLoading) return <p>Loading data...</p>
  if (error) return <p>Error saat mengambil data!</p>

  const biodataSiswa = (data?.data ?? []) as any[]

  interface User {
    id: number
    nisn: string
  }

  const users: User[] = biodataSiswa.map((siswa) => ({
    id: siswa.user?.id || 0,
    nisn: siswa.user?.nisn || "Tidak ada NISN",
  }))

  const totalPages = Math.ceil(users.length / itemsPerPage)
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "15px" }}
      >
        QR Code Siswa
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        {paginatedUsers.map((student: User) => (
          <div
            key={student.id}
            id={`backlayer-student-card-${student.id}`}
            style={{
              width: "380px",
              minHeight: "500px",
              borderRadius: "20px",
              padding: "5px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: 'url("/defaultFrame.png") no-repeat center',
              backgroundSize: "cover",
              position: "relative", // Keeps the layout intact
              boxShadow: "none", // Removes the shadow that may cause the border-like effect
              border: "none", // Removes any border applied
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center", // Centers the QR code horizontally
                alignItems: "center", // Centers the QR code vertically
                width: "100%", // Takes up the full width of the parent container
                height: "100%", // Takes up the full height of the parent container
                // Adds border around the QR code
                borderRadius: "10px", // Rounded corners for the border
                padding: "20px", // Adds padding inside the border to separate the QR code
                backgroundColor: "transparent", // Sets the background color to white
              }}
            >
              <QRCodeSVG
                value={student.nisn}
                size={180} // Increased the size of the QR code for better visibility
                bgColor="white" // Background color of the QR code
                fgColor="black" // Color of the QR code
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: "5px solid #ff9800",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
