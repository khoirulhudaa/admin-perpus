import { APP_CONFIG } from "@/core/configs/app";
import { MENU_CONFIG, USERMENU_CONFIG } from "@/core/configs/menu";
import {
  AuthPage,
  ForgetPassword,
  LoginPage,
  Logout,
  ResetPassword,
} from "@/features/auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage, RootPage } from "../dashboard";

// Load Component for Pages
import { CommingSoonPage, Default404, Vokadash } from "@/features/_global";
import {
  AttendanceCreate,
  HistoryAttendance,
  MatkulAttendance,
  StudentAttendance,
  TeacherAttendance,
} from "@/features/attendance";
import {
  ClassroomCreate,
  ClassroomDelete,
  ClassroomDetail,
  ClassroomEdit,
  ClassroomLanding,
} from "@/features/classroom";
import {
  CourseCreate,
  CourseDelete,
  CourseEdit,
  CourseLanding
} from "@/features/course";
import { CalendarEvent } from "@/features/events";
import { StudentCardPage, TeacherCardPage } from "@/features/kartuSiswa";
// import { Otp } from "@/features/otp";
import { ParentDetail, ParentEdit, ParentLanding } from "@/features/parents";
import { EditProfileForm } from "@/features/profile";
import {
  SchoolClassroom,
  SchoolCourse,
  SchoolCreation,
  SchoolDetail,
  SchoolLanding,
  SchoolRegister,
  SchoolStudent,
  SchoolTeacher,
} from "@/features/schools";
import {
  StudentCoursePresence,
  StudentDailyPresence,
  StudentDetail,
  StudentEdit,
  StudentLanding,
  StudentLibrary,
  StudentMoodles,
  StudentParent,
} from "@/features/student";
import {
  TeacherDailyPresence,
  TeacherDetail,
  TeacherEdit,
  TeacherLanding,
} from "@/features/teacher";
import { AdminEdit, AdminLanding } from "@/features/user";
import { TULanding } from "../administration";
import { AlumniLanding } from "../alumni-new";
import { ApplicationLanding } from "../applications/pages/application";
import { AcrhiveLanding } from "../archive";
import { OTPPage } from "../auth/pages/otpPage.js";
import { BeritaLanding } from "../berita/pages/berita-landing.js";
import { CalendarLanding } from "../calendar";
import { CardPage } from "../card/pages";
import { ChangePasswordFormPage } from "../changePassword/pages/form";
import { CurriculumLanding } from "../curriculum";
import { EkstraLanding } from "../ekstrakurikuler";
import { FaqLanding } from "../FAQ/index.js";
import { FasilitasLanding } from "../fasilitas/pages/berita-landing.js";
import { FeedLanding } from "../feed/index.js";
import { GaleriLanding } from "../galeri";
import { GalleryPramukaLanding } from "../galeriPramuka";
import { GraduationNewLanding } from "../graduation-new";
import { GraduationLanding } from "../graduation/pages";
import { HealtBridgeLanding } from "../healtBridge";
import { WorkHomeMainLanding } from "../homework/pages/taskLanding";
import { InfraLanding } from "../infrastructure";
import { JadwalLanding } from "../jadwal";
import { JadwalSDLanding } from "../jadwalSD/index.js";
import { LayananLanding } from "../layanan";
import { LetterPreview } from "../letter/containers/letter-preview";
import { LetterPage } from "../letter/pages";
import { LibraryHomePage } from "../library/pages/home";
import { LibraryLanding } from "../library/pages/library-attedances";
import { LicensingPage } from "../licensing/pages/licensing";
import { LocationLanding } from "../locations/pages/location-landing";
import { OsisLanding } from "../osis";
import { PartnerLanding } from "../partner/pages/partner-landing.js";
import { PengumumanLanding } from "../pengumuman/pages/pengumuman-landing.js";
import { PenilaianLanding } from "../penilaian/pages/penilaian-landing.js";
import { PermohonanLanding } from "../permohonan";
import { PPDBLanding } from "../ppdb";
import { PPIDLanding } from "../ppid";
import { ScoutLanding } from "../pramuka";
import { PramukaLanding } from "../pramuka-new";
import { PrestasiLanding } from "../prestasi";
import { ProfileSekolahLanding } from "../profileSekolah.js";
import { RatingLanding } from "../rating";
import { ScheduleLanding } from "../schedules/pages/schedules-landing";
import { SchoolDistribution } from "../schools/pages/school-distribution";
import { SejarahLanding } from "../sejarah";
import { SiswaLanding } from "../siswa/index.js";
import { SPMBLanding } from "../spmb";
import { StrukturORGLanding } from "../strukturOrg";
import { StudentLandingManual } from "../student/pages/student-landing-manual";
import { TeacherLandingManual } from "../student/pages/teacher-landing";
import { TataTertibLanding } from "../tataTertib/index.js";
import { GuruTendikLanding } from "../teacherAndStaff";
import { TemaLanding } from "../tema";
import { VisiMisiLanding } from "../visiMission";
import { VotingLanding } from "../voting/index.js";
import { WelcomeLanding } from "../welcome";
import { ScanLanding } from "../scan/index.js";
import { AttedanceLanding } from "../kehadiran/pages/kehadiran-landing.js";
import { KelasLanding } from "../kelas/pages/kelas-landing.js";
import { GuruLanding } from "../guru/index.js";
import { DetailUserLanding } from "../detailUser/pages/detailUser-landing.js";
import { MappingSekolahLanding } from "../mappingSekolah/pages/mappingSekolah-landing.js";
import { TugasLanding } from "../tugas/pages/tugas-landing.js";
import { OrangTuaLanding } from "../orangTua/index.js";
import { BibliografyLanding } from "../bibliografy/pages/index.js";
import { EksemplarLanding } from "../eksemplar/pages/index.js";
import { PeminjamLanding } from "../peminjam/pages/index.js";
import { SignaneLanding } from "../signane/pages/index.js";
import { ReportLanding } from "../report/pages/index.js";
import { MemberLanding } from "../member/pages/index.js";
import { InventoryLanding } from "../inventory/pages/index.js";
import { SerialLanding } from "../serial/pages/index.js";
import { SettingMain } from "../setting/pages/index.js";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootPage />,
      errorElement: <Default404 />,
      children: [
        {
          path: "format",
          element: <LetterPreview />,
        },
        {
          path: "format/pdf",
          element: <LetterPage />,
        },
        {
          path: "library",
          element: <LibraryHomePage />,
        },
        {
          path: "library/visit",
          element: <LibraryLanding />,
        },
        {
          path: "homework",
          element: <WorkHomeMainLanding />,
        },
        {
          path: "/card/generate",
          element: <StudentCardPage />,
        },
        {
          path: "/card/generate/teacher",
          element: <TeacherCardPage />,
        },
        {
          path: "/events",
          element: <CalendarEvent />,
        },
        {
          path: "/archive",
          element: <AcrhiveLanding />,
        },
        {
          path: "/osis",
          element: <OsisLanding />,
        },
        {
          path: "/ppdb",
          element: <PPDBLanding />,
        },
        {
          path: "/kelulusan",
          element: <GraduationNewLanding />,
        },
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "/location/students",
          element: <LocationLanding />,
        },
        {
          path: "schedules",
          element: <ScheduleLanding />,
        },
        {
          path: "licensing",
          element: <LicensingPage />,
        },
        {
          path: "student-absence-manual",
          element: <StudentLandingManual />,
        },
        {
          path: "teacher-absence-manual",
          element: <TeacherLandingManual />,
        },
        {
          path: "healt-bridge",
          element: <HealtBridgeLanding />,
        },
        {
          path: "ulasan",
          element: <PenilaianLanding />,
        },
        {
          path: "format/card",
          element: <CardPage />,
        },

        {
          path: "profile/edit",
          element: <EditProfileForm />,
        },
        {
          path: "profile/change-password",
          element: <ChangePasswordFormPage />,
        },
        {
          path: "schools",
          element: <SchoolLanding />,
        },
        {
          path: "schools/distribution",
          element: <SchoolDistribution />,
        },
        {
          path: "schools/:id",
          element: <SchoolDetail />,
          children: [
            {
              index: true,
              element: <SchoolStudent />,
            },
            {
              path: "teachers",
              element: <SchoolTeacher />,
            },
            {
              path: "classrooms",
              element: <SchoolClassroom />,
            },
            {
              path: "courses",
              element: <SchoolCourse />,
            },
          ],
        },

        {
          path: "schools/edit/:id",
          element: <SchoolCreation />,
        },
        {
          path: "classrooms",
          element: <ClassroomLanding />,
        },
        {
          path: "classrooms/:id",
          element: <ClassroomDetail />,
        },
        {
          path: "classrooms/create",
          element: <ClassroomCreate />,
        },
        {
          path: "classrooms/edit/:id",
          element: <ClassroomEdit />,
        },
        {
          path: "classrooms/delete/:id",
          element: <ClassroomDelete />,
        },
        {
          path: "courses",
          element: <CourseLanding />,
        },

        {
          path: "courses/delete/:id",
          element: <CourseDelete />,
        },
        {
          path: "courses/create",
          element: <CourseCreate />,
        },
        {
          path: "courses/edit/:id",
          element: <CourseEdit />,
        },
        {
          path: "students",
          element: <StudentLanding />,
        },
        {
          path: "students/edit/:id",
          element: <StudentEdit />,
        },
        {
          path: "students/:id",
          element: <StudentDetail />,
          children: [
            {
              index: true,
              element: <StudentDailyPresence />,
            },
            {
              path: "course-presences",
              element: <StudentCoursePresence />,
            },
            {
              path: "parents",
              element: <StudentParent />,
            },
            {
              path: "library-visit",
              element: <StudentLibrary />,
            },
            {
              path: "moodle",
              element: <StudentMoodles />,
            },
          ],
        },
        {
          path: "students/create",
          element: <CommingSoonPage />,
        },
        {
          path: "students/edit/:id",
          element: <CommingSoonPage />,
        },
        {
          path: "teachers",
          element: <TeacherLanding />,
        },
        {
          path: "teachers/edit/:id",
          element: <TeacherEdit />,
        },
        {
          path: "teachers/:id",
          element: <TeacherDetail />,
          children: [
            {
              index: true,
              element: <TeacherDailyPresence />,
            },
          ],
        },
        {
          path: "profile-sekolah",
          element: <ProfileSekolahLanding />,
        },
        {
          path: "welcome",
          element: <WelcomeLanding />,
        },
        {
          path: "bibliografy",
          element: <BibliografyLanding />,
        },
        {
          path: "pengaturan-perpus",
          element: <SettingMain />,
        },
        {
          path: "kendali-serial",
          element: <SerialLanding />,
        },
        {
          path: "inventory",
          element: <InventoryLanding />,
        },
        {
          path: "anggota-perpus",
          element: <MemberLanding />,
        },
        {
          path: "laporan-kunjungan",
          element: <ReportLanding />,
        },
        {
          path: "peminjam",
          element: <PeminjamLanding />,
        },
        {
          path: "signane",
          element: <SignaneLanding />,
        },
        {
          path: "eksemplar",
          element: <EksemplarLanding />,
        },
        {
          path: "visiMission",
          element: <VisiMisiLanding />,
        },
        {
          path: "layanan",
          element: <LayananLanding />,
        },
        {
          path: "curriculum",
          element: <CurriculumLanding />,
        },
        {
          path: "calendar",
          element: <CalendarLanding />,
        },
        {
          path: "feed",
          element: <FeedLanding />,
        },
        {
          path: "schedule-teacher",
          element: <JadwalLanding />,
        },
        {
          path: "jadwal-sd",
          element: <JadwalSDLanding />,
        },
        {
          path: "pengumuman",
          element: <PengumumanLanding />,
        },
        {
          path: "berita",
          element: <BeritaLanding />,
        },
        {
          path: "teacherAndStaff",
          element: <GuruTendikLanding />,
        },
        {
          path: "ppid",
          element: <PPIDLanding />,
        },
        {
          path: "spmb",
          element: <SPMBLanding />,
        },
        {
          path: "scout",
          element: <ScoutLanding />,
        },
        {
          path: "prestasi",
          element: <PrestasiLanding />,
        },
        {
          path: "pramuka-sekolah",
          element: <PramukaLanding />,
        },
        {
          path: "sejarah",
          element: <SejarahLanding />,
        },
        {
          path: "faq",
          element: <FaqLanding />,
        },
        {
          path: "tata-tertib",
          element: <TataTertibLanding />,
        },
        {
          path: "struktur-organisasi",
          element: <StrukturORGLanding />,
        },
        {
          path: "voting-osis",
          element: <VotingLanding />,
        },
        {
          path: "fasilitas",
          element: <FasilitasLanding />,
        },
        {
          path: "partner-dan-sponsor",
          element: <PartnerLanding />,
        },
        {
          path: "buku-alumni",
          element: <AlumniLanding />,
        },
        {
          path: "ekstrakurikuler",
          element: <EkstraLanding />,
        },
        {
          path: "scout/member",
          element: <ScoutLanding />,
        },
        {
          path: "scout/card-member",
          element: <StudentCardPage />,
        },
        {
          path: "scout/gallery",
          element: <GalleryPramukaLanding />,
        },
        {
          path: "theme",
          element: <TemaLanding />,
        },
        {
          path: "galeri",
          element: <GaleriLanding />,
        },
        {
          path: "/applications-other",
          element: <ApplicationLanding />,
        },
        {
          path: "parents",
          element: <ParentLanding />,
        },
        {
          path: "parents/:id",
          element: <ParentDetail />,
        },
        {
          path: "parents/edit/:id",
          element: <ParentEdit />,
        },
        {
          path: "/graduation",
          element: <GraduationLanding />
        },
        {
          path: "/manajemen-kelas",
          element: <KelasLanding />
        },
        {
          path: "/data-orangtua",
          element: <OrangTuaLanding />
        },
        {
          path: "/scan-qrcode",
          element: <ScanLanding />
        },
        {
          path: "/pekerjaan-rumah",
          element: <TugasLanding />
        },
        {
          path: "/data-kehadiran",
          element: <AttedanceLanding />
        },
        {
          path: "data-siswa",
          element: <SiswaLanding />
        },
        {
          path: "detail/:id",
          element: <DetailUserLanding />
        },
        {
          path: "sebaran-sekolah",
          element: <MappingSekolahLanding />
        },
        {
          path: "data-guru",
          element: <GuruLanding />
        },
        {
          path: "admin/users",
          element: <AdminLanding />,
        },
        {
          path: "admin/tata-usaha",
          element: <TULanding />,
        },
        {
          path: "rating",
          element: <RatingLanding />,
        },
        {
          path: "asset/school",
          element: <InfraLanding />,
        },
        {
          path: "permohonan",
          element: <PermohonanLanding />,
        },
        {
          path: "admin/users/edit/:id",
          element: <AdminEdit />,
        },
        {
          path: "attendance/students",
          element: <StudentAttendance />,
        },
        {
          path: "attendance/create",
          element: <AttendanceCreate />,
        },
        {
          path: "attendance/history",
          element: <HistoryAttendance />,
        },
        {
          path: "attendance/courses",
          element: <MatkulAttendance />,
        },
        {
          path: "attendance/teachers",
          element: <TeacherAttendance />,
        },
        {
          path: "logout",
          element: <Logout />,
        },
      ],
    },
    {
      path: "/auth",
      element: <AuthPage />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "forget-password",
          element: <ForgetPassword />,
        },
        {
          path: "reset-password/:token",
          element: <ResetPassword />,
        },
      ],
    },
    // {
    //   path: "/attendance",
    //   element: <HistoryAttendance />,
    // },
    {
      path: "/auth/register",
      element: <SchoolRegister />,
    },
    {
      path: "/otp",
      element: <OTPPage />,
    },
    // {
    //   path: "/otp",
    //   element: <OTPPage />,
    // },
  ],
  {
    basename: APP_CONFIG.baseName,
  }
);

export const RootApp = () => {
  const sidebarMenus = MENU_CONFIG.staff;
  const usermenus = USERMENU_CONFIG.staff;

  return (
    <Vokadash
      appName={APP_CONFIG.appName}
      menus={sidebarMenus}
      usermenus={usermenus}
    >
      <RouterProvider router={router} />
    </Vokadash>
  );
};

export const App = () => {
  return <RootApp />;
};
