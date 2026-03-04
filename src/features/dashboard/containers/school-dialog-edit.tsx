import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/libs";
import { SchoolUpdateForm } from "./school-update-form";
import { useSchoolUpdateDialog } from "../hooks";

export const SchoolUpdateDialog = () => {
  const { isModalOpen, handleOpenChange, handleCloseDialog } = useSchoolUpdateDialog();

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-[70vw] h-max">
        <DialogHeader className="flex h-[54px] justify-between border-b border-b-white/10 pb-6 mb-4">
          <DialogTitle className="flex items-baseline">
            <p>Lengkapi data sekolah</p>
          </DialogTitle>
        </DialogHeader>
        <SchoolUpdateForm onClose={handleCloseDialog} />
      </DialogContent>
    </Dialog>
  );
};