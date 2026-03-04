import { Dialog, DialogContent, DialogHeader, DialogTitle, lang } from "@/core/libs";
import { ClassroomCreationForm } from "../containers";

interface propsModal {
    show: boolean;
    onClose: () => void;
}

export const ModalCreateClass = ({show, onClose}: propsModal) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="w-max pt-10 h-max">
        <DialogHeader className="flex h-[54px] justify-between border-b border-b-white/10 pb-6 mb-4">
          <DialogTitle className="flex items-baseline">
            <p>{lang.text('completeDataClassroom')}</p>
          </DialogTitle>
        </DialogHeader>
        <ClassroomCreationForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};