export interface ScheduleModel {
  id: number;
  id_pegawai: number;
  title: string;
  description: string;
  jam_mulai: string;
  jam_selesai: string;
  start: string;
  end: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduleCreationModel {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  weekend_status: string;
  users: number[];
}
