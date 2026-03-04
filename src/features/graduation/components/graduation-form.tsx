import { Badge, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/libs";
import { useAlert } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import { useSchool } from "@/features/schools";
import * as React from "react";
import { CloseIcon } from "yet-another-react-lightbox";
import { useGraduation } from "../hooks";

interface SchoolClassDialogProps {
  open: boolean;
  onClose: () => void;
}

export const GraduationDialog = ({ open, onClose }: SchoolClassDialogProps) => {
  const schools = useSchool();
  const classRoom = useClassroom();
  const creation = useGraduation();
  const alert = useAlert();

  const listSchools = React.useMemo(() => schools?.data || [], [schools.data]);
  const listClassRoom = React.useMemo(() => classRoom?.data || [], [classRoom.data]);

  const [selectedSchool, setSelectedSchool] = React.useState("1");
  const [selectedClasses, setSelectedClasses] = React.useState<{ id: string }[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Menutup dropdown saat klik di luar
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set default school
  React.useEffect(() => {
    if (listSchools.length > 0 && !listSchools.some(school => school.id === "1")) {
      setSelectedSchool(listSchools[0].id);
    }
  }, [listSchools]);

  const handleClassSelection = (classId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (selectedClasses.some(cls => cls.id === classId)) {
      setSelectedClasses(selectedClasses.filter(cls => cls.id !== classId));
    } else {
      setSelectedClasses([...selectedClasses, { id: classId }]);
    }
  };

  const handleRemoveClass = (classId: string) => {
    setSelectedClasses(selectedClasses.filter(cls => cls.id !== classId));
  };

  const handleContinue = async () => {
    try {
      if (selectedSchool && selectedClasses.length > 0) {
        const body = {
          kelasId: selectedClasses.map(cls => ({ id: Number(cls.id) })),
          lulus: true,
          sekolahId: Number(selectedSchool),
        };
        console.log("Submitting:", body);
        const { data } = await creation.create(body);
        alert.success(data?.message);
        setSelectedClasses([]);
        setIsDropdownOpen(false);
        onClose();
        try {
          await Promise.all([creation.query.refetch()]);
        } catch (err) {
          alert.error("Terjadi kesalahan saat ambil data terbaru!");
        }
      }
    } catch (err: any) {
      alert.error(
        err?.message || lang.text("failUpdate", { context: lang.text("graduation") })
      );
    }
  };

  const handleClose = () => {
    setSelectedClasses([]);
    setIsDropdownOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pilih Sekolah dan Kelas</DialogTitle>
          <DialogDescription>
            Silakan pilih sekolah dan kelas yang sesuai.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {selectedClasses.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedClasses.map(cls => {
                const className = listClassRoom.find(c => c.id === cls.id)?.namaKelas || cls.id;
                return (
                  <Badge key={cls.id} variant="secondary" className="inline-flex items-center gap-1">
                    {className}
                    <button
                      type="button"
                      onClick={() => handleRemoveClass(cls.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <CloseIcon />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
          <div className="grid gap-2">
            <label htmlFor="school" className="text-sm font-medium">
              Sekolah
            </label>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger id="school">
                <SelectValue placeholder="Pilih sekolah" />
              </SelectTrigger>
              <SelectContent>
                {listSchools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
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
            <div className="relative">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedClasses.length > 0
                  ? `${selectedClasses.length} kelas dipilih`
                  : "Pilih kelas"}
              </Button>
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  tabIndex={0}
                  className="absolute z-10 w-full max-h-[220px] overflow-y-auto bg-black text-white border rounded-md shadow-md p-4 mt-1 -webkit-overflow-scrolling-touch scroll-smooth overscroll-contain touch-action-pan-y focus:outline-none"
                  onMouseEnter={() => dropdownRef.current?.focus()}
                >
                  <div className="grid gap-2">
                    {listClassRoom.map((cls) => (
                      <div
                        key={cls.id}
                        className="flex items-center gap-2 hover:brightness-[70%] p-1 rounded"
                        onClick={(e) => handleClassSelection(cls.id, e)} // Klik pada div memicu seleksi
                      >
                        <input
                          type="checkbox"
                          checked={selectedClasses.some(c => c.id === cls.id)}
                          onChange={(e) => handleClassSelection(cls.id, e)}
                          className="h-4 w-4"
                        />
                        <span>{cls.namaKelas}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-4">
          <Button variant="outline" onClick={handleClose}>
            {lang.text("reset")}
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedSchool || selectedClasses.length === 0}
          >
            {lang.text("addGraduation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};