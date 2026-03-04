import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/libs";
import { useClassroom } from "@/features/classroom";
import { useSchool } from "@/features/schools";
import * as React from "react";

interface SchoolClassDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (schoolId: number, classId: number) => void;
  selectSchool: number | "";
  selectClass: number | "";
  onReset: () => void;
}

export const GraduationFilterDialog = ({ open, onClose, onReset, onApply, selectSchool, selectClass }: SchoolClassDialogProps) => {
  const schools = useSchool();
  const classRoom = useClassroom();

  // Memoize the lists to avoid unnecessary re-renders
  const listSchools = React.useMemo(() => schools?.data || [], [schools.data]);
  const listClassRoom = React.useMemo(() => classRoom?.data || [], [classRoom.data]);

  // Initialize states with props
  const [selectedSchool, setSelectedSchool] = React.useState<number | "">(selectSchool || 1);
  const [selectedClass, setSelectedClass] = React.useState<number | "">(selectClass || "");

  // Sync states with props
  React.useEffect(() => {
    setSelectedSchool(selectSchool || (listSchools.length > 0 ? listSchools[0].id : 1));
    setSelectedClass(selectClass || "");
  }, [selectSchool, selectClass, listSchools]);

  // Handle class selection (single selection)
  const handleClassSelection = (classId: string) => {
    const id = Number(classId);
    setSelectedClass(id === selectedClass ? "" : id);
  };

  const handleApply = (e) => {
    e.preventDefault()
    if (selectedSchool !== "" && selectedClass !== "") {
      onApply(selectedSchool as number, selectedClass as number);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pilih Sekolah dan Kelas</DialogTitle>
          <DialogDescription>
            Silakan pilih sekolah dan satu kelas untuk filter.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="school" className="text-sm font-medium">
              Sekolah
            </label>
            <Select
              value={selectedSchool === "" ? "" : selectedSchool.toString()}
              onValueChange={(value) => setSelectedSchool(Number(value))}
            >
              <SelectTrigger id="school">
                <SelectValue placeholder="Pilih sekolah" />
              </SelectTrigger>
              <SelectContent>
                {listSchools.map((school) => (
                  <SelectItem key={school.id} value={school.id.toString()}>
                    {school.namaSekolah}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="class" className="text-sm font-medium">
              Kelas
            </label>
            <Select
              value={selectedClass === "" ? "" : selectedClass.toString()}
              onValueChange={handleClassSelection}
            >
              <SelectTrigger id="class">
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                {listClassRoom.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedClass === cls.id}
                        onChange={() => handleClassSelection(cls.id.toString())}
                        className="h-6 w-6"
                      />
                      {cls.namaKelas}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-4">
          <Button variant="outline" onClick={onReset}>
            {lang.text("reset")}
          </Button>
          <Button
            onClick={(e) => handleApply(e)}
            disabled={selectedSchool === "" || selectedClass === ""}
          >
            {lang.text("apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};