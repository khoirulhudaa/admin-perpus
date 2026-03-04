export const APP_CONFIG = {
  appName: import.meta.env.VITE_APP_NAME,
  appDesc: import.meta.env.VITE_APP_DESCRIPTION,
  baseName: import.meta.env.VITE_BASE_NAME,
  staticUrl: import.meta.env.VITE_STATIC_BASE_URL,
  defaultTheme: import.meta.env.VITE_DEFAULT_THEME,
  themeKey: import.meta.env.VITE_THEME_KEY,
};

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  baseUrlOld: import.meta.env.VITE_API_BASE_URL_OLD,
};

export const QUERY_CONFIG = {
  persistorThrottleTime: 1000,
  persistorKey: "pkoZC7TvJYaKj4qfKnxX",
  retry: 0,
  gcTime: 1000 * 60 * 60 * 24, // 24 hours
};

export const SERVICE_ENDPOINTS = {
  attedance: {
    createAttedance: "/api/absen-masuk-manual",
    createAttedanceGo: "/api/absen-pulang-manual",
    createAttedanceRemove: "/api/user"
  },
  auth: {
    login: "/login",
    logout: "/logout",
    signup: "/signup",
    forgetPassword: "/forgot-password",
    resetPassword: "/reset-password",
    resetPasswordDefault: "/api/reset-password-user",
  },
  biodata: {
    allAttedance: "/api/get-biodata-siswa-new",
    attedance: "/get-biodata-siswa-new",
    attedanceOld: "/api/get-biodata-siswa-new-v2",
    siswa: "/api/get-biodata-siswa",
    absensiById: "/api/riwayat-absensi?filter=tahunan&page=1&limit=10&targetUserId=",
    attendanceNew: "/api/riwayat-absensi",
    guru: "/api/get-all-guru",
  },
  student: {
     list: "/api/user-siswa",
  },
  graduations: {
     all: "/api/get-kelulusan",
     create: "/api/create-kelulusan",
  },
  task: {
    createTask: "/api/create-tugas-siswa",
    getTask: "/api/get-tugas-siswa",
    getTaskId: "/api/get-tugas-siswa",
    updateTaskById: "/api/update-tugas-siswa",
    deletTugasById: "/api/delete-tugas-siswa"
  },
  province: {
    provinces: '/get-province'
  },
  school: {
    createSchool: "/create-sekolah",
    schools: "/sekolah",
    schools2: "/api/sekolah",
    classrooms: "/api/kelas",
    courses: "/api/mata-pelajaran",
  },
  schedule: {
    create: "/api/jadwal-mata-pelajaran",
    update: "/api/jadwal-mata-pelajaran",
    schedules: "/api/jadwal-mata-pelajaran",
    delete: "/api/jadwal-mata-pelajaran",
  },
  users: {
    parents: "/api/all-orang-tua",
    teachers: "/api/get-all-guru",
    students: "/api/get-biodata-siswa",
  },
  user: {
    user: "/api/user",
    update: "api/update-user",
    updateStudent: "/api/update-user",
    admin: "/api/all-admin",
    profile: "/api/profile",
    employees: "/ms-user/api/employees",
    photo: "/ms-user/api/profile/photo",
    changePassword: "/ms-user/api/account/changePassword",
  },
  otp: {
    verify: "/verify-otp",
    resend: "/resend-otp",
  },
  classroom: {
    classroom: "/api/kelas",
  },
  teacher: {
    detail: "/api/get-guru",
  },
  libraries: {
    all: "/api/get-history-perpus",
    createAbsenManual: "/api/absen-manual-perpus",
  },
   library: {
    vistor: "/index.php?p=api/visitor/today"
  }
};
