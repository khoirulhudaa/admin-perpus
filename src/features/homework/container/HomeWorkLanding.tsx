import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/libs";
import { useAlert, Vokadialog } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useSchoolDetail } from "@/features/schools";
import dayjs from "dayjs";
import { useState } from "react";
import { FaFilePdf, FaSpinner } from "react-icons/fa";
import { useTask } from "../hooks";


interface Homework {
  id: number;
  materiTugas: string;
  startTime: string;
  endTime: string;
  deskripsi: string;
  detailTugas: string;
  jadwalPelajaranId: number;
  createdAt: string;
  updatedAt: string;
  tumbnail: string | null;
  sekolahId: number;
  jadwalMataPelajaran: {
    id: number;
    hari: string;
    jamMulai: string;
    jamSelesai: string;
    mataPelajaranId: number;
    guruId: number;
    createdAt: string;
    updatedAt: string;
    kelasId: number;
    sekolahId: number;
    mataPelajaran?: {
      id: number;
      namaMataPelajaran: string;
      kelasId: number;
      createdAt: string;
      updatedAt: string;
      sekolahId: number;
      kelas?: {
        id: number;
        namaKelas: string;
        level: string;
        kodeKelas: string | null;
        sekolahId: number;
        createdAt: string;
        updatedAt: string;
        deleteAt: string | null;
      };
    };
    guru?: {
      id: number;
      namaGuru: string;
      kode_guru: string;
      createdAt: string;
      updatedAt: string;
      userId: number;
      mataPelajaranId: number;
    };
  };
}

interface HomeworkCardListProps {
  tasks: Homework[];
  deleteTask: (id: number) => void;
  updateTask: (id: string, updates: any) => Promise<void>;
  alert: { success: (msg: string) => void; error: (msg: string) => void };
}

const HomeworkCardList: React.FC<HomeworkCardListProps> = ({ tasks, deleteTask, updateTask, alert }) => {
  const [open, setOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [selectId, setSelectId] = useState(0);
  const [updateForm, setUpdateForm] = useState<Partial<{
    materiTugas: string;
    startTime: string;
    endTime: string;
    jadwalPelajaranId: number;
    deskripsi: string;
    detailTugas: string;
  }>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenModal = (homework: Homework) => {
    setSelectedHomework(homework);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedHomework(null);
    setOpen(false);
  };

  const handleOpenUpdateModal = (homework: Homework) => {
    setSelectedHomework(homework);
    setUpdateForm({
      materiTugas: homework.materiTugas,
      startTime: homework.startTime,
      endTime: homework.endTime,
      jadwalPelajaranId: homework.jadwalPelajaranId,
      deskripsi: homework.deskripsi,
      detailTugas: homework.detailTugas,
    });
    setOpenModalUpdate(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedHomework(null);
    setUpdateForm({});
    setOpenModalUpdate(false);
  };

  const handleUpdate = async () => {
    if (!selectedHomework) return;
    setIsUpdating(true);
    try {
      await updateTask({
        id: selectedHomework.id,
        updates: updateForm,
      });
      alert.success(lang.text('successUpdate') || 'Tugas berhasil diperbarui.');
      handleCloseUpdateModal();
    } catch (error: any) {
      alert.error(error.message || lang.text('failUpdate') || 'Gagal memperbarui tugas.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      alert.success(lang.text('dataSuccessDelete') || 'Tugas berhasil dihapus.');
      setOpenModalDelete(false);
    } catch (error) {
      alert.error(error.message || lang.text('dataFailDelete') || 'Gagal menghapus tugas.');
    }
  };

  const handleDeleteData = (id: number) => {
    setSelectId(id);
    setOpenModalDelete(true);
  };

  // Handle no data
  if (!tasks || tasks.length === 0) {
    return <div className="border border-white/20 h-[50vh] flex flex-col items-center justify-center rounded-lg p-6 text-center text-white">{lang.text('noData')}</div>;
  }

  return (
    <>
      {openModalDelete && (
        <Vokadialog
          visible={openModalDelete}
          title={lang.text("deleteConfirmation")}
          content={lang.text("deleteConfirmationDesc", { context: 'tugas' })}
          footer={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => handleDelete(selectId)} variant="destructive">
                {lang.text("delete")}
              </Button>
              <Button onClick={() => setOpenModalDelete(false)} variant="outline">
                {lang.text("cancel")}
              </Button>
            </div>
          }
        />
      )}
      {openModalUpdate && (
        <Dialog open={openModalUpdate} onOpenChange={setOpenModalUpdate}>
          <DialogContent className="sm:max-w-md bg-gray-900 rounded-lg shadow-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">{lang.text('editPR')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Materi Tugas</label>
                <Input
                  value={updateForm.materiTugas || ''}
                  onChange={(e) => setUpdateForm({ ...updateForm, materiTugas: e.target.value })}
                  placeholder="Masukkan materi tugas"
                  className="bg-gray-800 text-white border-gray-700"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Deskripsi</label>
                <Input
                  value={updateForm.deskripsi || ''}
                  onChange={(e) => setUpdateForm({ ...updateForm, deskripsi: e.target.value })}
                  placeholder="Masukkan deskripsi"
                  className="bg-gray-800 text-white border-gray-700"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Detail Tugas</label>
                <Input
                  value={updateForm.detailTugas || ''}
                  onChange={(e) => setUpdateForm({ ...updateForm, detailTugas: e.target.value })}
                  placeholder="Masukkan detail tugas"
                  className="bg-gray-800 text-white border-gray-700"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Tanggal Mulai</label>
                <Input
                  type="date"
                  value={updateForm.startTime || ''}
                  onChange={(e) => setUpdateForm({ ...updateForm, startTime: e.target.value })}
                  className="bg-gray-800 text-white border-gray-700"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Tanggal Selesai</label>
                <Input
                  type="date"
                  value={updateForm.endTime || ''}
                  onChange={(e) => setUpdateForm({ ...updateForm, endTime: e.target.value })}
                  className="bg-gray-800 text-white border-gray-700"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Jadwal Pelajaran ID</label>
                <Input
                  type="number"
                  value={updateForm.jadwalPelajaranId || ''}
                  onChange={(e) => setUpdateForm({ ...updateForm, jadwalPelajaranId: parseInt(e.target.value) })}
                  placeholder="Masukkan ID jadwal pelajaran"
                  className="bg-gray-800 text-white border-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={handleCloseUpdateModal} 
                disabled={isUpdating}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                {lang.text('cancel')}
              </Button>
              <Button 
                onClick={handleUpdate} 
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? <FaSpinner className="animate-spin mr-2" /> : null}
                {lang.text('save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {tasks.map((homework) => (
          <Card key={homework.id} className="relative shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
            <div 
              className={`${dayjs().isAfter(dayjs(homework.endTime)) ? 'bg-red-600 text-red-300' : 'bg-green-600 text-green-300'} absolute top-5 right-5 w-[10px] h-[10px] rounded-full justify-center mt-auto`}
            />
            <CardHeader>
              <img src={'/iconTask.png'} alt="icon-task" className="w-[16%] relative left-[-5px] mb-2" />
              <CardTitle className="text-lg font-semibold">
                {homework.materiTugas || 'Unnamed Task'}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {(homework.jadwalMataPelajaran?.mataPelajaran?.namaMataPelajaran || 'Unknown Subject')} - 
                <b className="text-white">
                  {"[ "}
                  Kelas {homework.jadwalMataPelajaran?.kelas?.namaKelas || 'Kelas tidak ada'}
                  {" ]"}
                </b>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Deskripsi:</p>
                  <p className="text-sm text-muted-foreground">{homework.deskripsi || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Detail Tugas:</p>
                  <p className="text-sm text-muted-foreground">{homework.detailTugas || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Guru:</p>
                  <p className="text-sm text-muted-foreground">{homework.jadwalMataPelajaran?.guru?.namaGuru || 'Unknown Teacher'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Hari:</p>
                  <Badge variant="outline">{homework.jadwalMataPelajaran?.hari || 'Unknown Day'}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Waktu:</p>
                  <p className="text-sm text-muted-foreground">
                    {homework.startTime ? dayjs(homework.startTime).format('DD MMMM YYYY') : '-'} - 
                    {homework.endTime ? dayjs(homework.endTime).format('DD MMMM YYYY') : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-end items-end">
              <div className="flex justify-between w-full gap-4">
                <Button 
                  className="w-full justify-center py-2 mt-auto"
                  onClick={() => handleOpenModal(homework)}
                >
                  Detail
                </Button>
                <Button 
                  className="w-full justify-center py-2 mt-auto bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleOpenUpdateModal(homework)}
                >
                  {lang.text('update')}
                </Button>
                <Button 
                  className="w-full justify-center py-2 mt-auto bg-red-600 hover:bg-red-700"
                  variant="destructive"
                  onClick={() => handleDeleteData(homework.id)}
                >
                  {lang.text('delete')}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Modal for Homework Details */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[60vw] bg-gray-800 rounded-lg shadow-xl">
          <DialogHeader className="border-b border-white/20 pb-6">
            <Button className="bg-white text-black absolute top-4 right-3" onClick={handleCloseModal}>
              Tutup
            </Button>
            <DialogTitle className="text-2xl font-bold">{selectedHomework?.materiTugas || 'Unnamed Task'}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {(selectedHomework?.jadwalMataPelajaran?.mataPelajaran?.namaMataPelajaran || 'Unknown Subject')} - 
              Kelas {selectedHomework?.jadwalMataPelajaran?.kelas?.namaKelas || 'Unknown Class'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium col-span-1 flex justify-between">
                Deskripsi:
                <span>:</span>
              </span>
              <span className="col-span-3">{selectedHomework?.deskripsi || '-'}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium col-span-1 flex justify-between">
                Detail Tugas:
                <span>:</span>
              </span>
              <span className="col-span-3">{selectedHomework?.detailTugas || '-'}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium col-span-1 flex justify-between">
                Guru:
                <span>:</span>
              </span>
              <span className="col-span-3">{selectedHomework?.jadwalMataPelajaran?.guru?.namaGuru || 'Unknown Teacher'}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium col-span-1 flex justify-between">
                Hari:
                <span>:</span>
              </span>
              <span className="col-span-3">
                <Badge variant="outline" className="bg-white text-black py-1">{selectedHomework?.jadwalMataPelajaran?.hari || 'Unknown Day'}</Badge>
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium col-span-1 flex justify-between">
                Waktu:
                <span>:</span>
              </span>
              <span className="col-span-3">
                {selectedHomework ? 
                  `${selectedHomework.startTime ? dayjs(selectedHomework.startTime).format('DD MMMM YYYY') : '-'} - 
                   ${selectedHomework.endTime ? dayjs(selectedHomework.endTime).format('DD MMMM YYYY') : '-'}` 
                  : '-'}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium col-span-1 flex justify-between">
                Status:
                <span>:</span>
              </span>
              <span className="col-span-3">
                <Badge 
                  variant={selectedHomework && dayjs().isAfter(dayjs(selectedHomework.endTime)) ? "destructive" : "default"} 
                  className={`${selectedHomework && dayjs().isAfter(dayjs(selectedHomework.endTime)) ? 'bg-red-800 text-red-300' : 'bg-green-800 text-green-300'} pt-1.5 pb-1`}
                >
                  {selectedHomework && dayjs().isAfter(dayjs(selectedHomework.endTime)) ? "Tenggat Waktu Lewat" : "AKTIF"}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium col-span-1 flex justify-between">
                Dibuat:
                <span>:</span>
              </span>
              <span className="col-span-3">{selectedHomework?.createdAt ? dayjs(selectedHomework.createdAt).format('DD MMMM YYYY HH:mm') : '-'}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium col-span-1 flex justify-between">
                Diperbarui:
                <span>:</span>
              </span>
              <span className="col-span-3">{selectedHomework?.updatedAt ? dayjs(selectedHomework.updatedAt).format('DD MMMM YYYY HH:mm') : '-'}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HomeworkCardList;

export const HomeWorkLanding = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [guruFilter, setGuruFilter] = useState("all");
  const [kelasFilter, setKelasFilter] = useState("all");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const profile = useProfile();
  const alert = useAlert();
  const { data: schoolData, isLoading: schoolIsLoading } = useSchoolDetail({ id: profile?.user?.sekolahId || 1 });
  const { data: tasks, isLoading: tasksIsLoading, deleteTask, updateTask } = useTask();

  const dayOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

  // Extract unique teachers and classes for filter options
  const uniqueTeachers = Array.from(
    new Set(tasks?.map((task: Homework) => task.jadwalMataPelajaran?.guru?.namaGuru).filter(Boolean))
  );
  const uniqueClasses = Array.from(
    new Set(tasks?.map((task: Homework) => task.jadwalMataPelajaran?.kelas?.namaKelas).filter(Boolean))
  );

  // Apply filters
  const filteredTasks = tasks?.filter((task: Homework) => {
    const matchesDay = dayFilter === "all" || task.jadwalMataPelajaran?.hari?.toLowerCase() === dayFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && !dayjs().isAfter(dayjs(task.endTime))) || 
      (statusFilter === "expired" && dayjs().isAfter(dayjs(task.endTime)));
    const matchesGuru = guruFilter === "all" || task.jadwalMataPelajaran?.guru?.namaGuru === guruFilter;
    const matchesKelas = kelasFilter === "all" || task.jadwalMataPelajaran?.kelas?.namaKelas === kelasFilter;
    return matchesDay && matchesStatus && matchesGuru && matchesKelas;
  }) || [];

  return (
    <>
      <div className="flex items-center gap-3 mt-6 mb-3 flex-wrap">
        <Input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder={lang.text("search") || "Filter by name..."}
          className="w-[300px]"
        />
        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Filter Hari" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text('allDays')}</SelectItem>
            {dayOrder.map((day) => (
              <SelectItem key={day} value={day}>
                {lang.text(day)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text('allStatus')}</SelectItem>
            <SelectItem value="active">{lang.text('active') || 'Aktif'}</SelectItem>
            <SelectItem value="expired">{lang.text('expired') || 'Kedaluwarsa'}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={guruFilter} onValueChange={setGuruFilter}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Filter Guru" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text('allTeachers') || 'Semua Guru'}</SelectItem>
            {uniqueTeachers.map((guru) => (
              <SelectItem key={guru} value={guru}>
                {guru}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={kelasFilter} onValueChange={setKelasFilter}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Filter Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text('allClasses') || 'Semua Kelas'}</SelectItem>
            {uniqueClasses.map((kelas) => (
              <SelectItem key={kelas} value={kelas}>
                {kelas}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <Button
            className="relative bg-red-600 text-white hover:bg-red-700"
            variant="outline"
            aria-label="download pdf"
            disabled={isGeneratingPDF || schoolIsLoading}
            onClick={() => null}
          >
            {isGeneratingPDF ? "Generating..." : lang.text("downloadAttedance")}
            <FaFilePdf className="ml-2" />
          </Button>
        </div>
      </div>

      {tasksIsLoading ? (
        <div className="border border-white/20 h-[50vh] flex flex-col items-center justify-center rounded-lg p-6 text-center text-white">
          <p className="flex items-center gap-3 w-max text-slate-200">
            Loading tasks... <FaSpinner className="animate-spin duration-600 text-white" />
          </p>
        </div>
      ) : !tasks ? (
        <div className="text-center text-red-500">No tasks available or an error occurred.</div>
      ) : (
        <HomeworkCardList tasks={filteredTasks} deleteTask={deleteTask} updateTask={updateTask} alert={alert} />
      )}
    </>
  );
};
