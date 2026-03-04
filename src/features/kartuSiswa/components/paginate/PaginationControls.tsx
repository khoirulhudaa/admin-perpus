import { Button, lang } from "@/core/libs"
import { ArrowLeft, ArrowRight } from "lucide-react"
import React from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
}

const PaginationControls: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  // Tambahkan fungsi untuk navigasi ke halaman pertama
  const handleFirstPage = () => {
    setCurrentPage(1)
  }

  // Tambahkan fungsi untuk navigasi ke halaman terakhir
  const handleLastPage = () => {
    setCurrentPage(totalPages)
  }

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {currentPage} of {totalPages}
      </div>
      <div className="flex flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        >
          {lang.text("first")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ArrowRight />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
        >
          {lang.text("last")}
        </Button>
      </div>
    </div>
  )
}

export default PaginationControls