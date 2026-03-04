import { Dialog, DialogContent, DialogHeader, DialogTitle, lang } from "@/core/libs";
import { CourseCreationForm } from "../containers";

interface propsModal {
    show: boolean;
    onClose: () => void;
}

export const ModalCreateCourse = ({show, onClose}: propsModal) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="w-max pt-10 h-max">
        <DialogHeader className="flex h-[54px] justify-between border-b border-b-white/10 pb-6 mb-4">
          <DialogTitle className="flex items-baseline">
            <p>{lang.text('completeDataCourse')}</p>
          </DialogTitle>
        </DialogHeader>
        <CourseCreationForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};