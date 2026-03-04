// import { useProfile } from "@/features/profile";
// import { useEffect, useState } from "react";
// import { Outlet, useNavigate, useParams } from "react-router-dom";

// import { APP_CONFIG } from "@/core/configs";
// import {
//   Input,
//   lang,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/core/libs";
// import { useSchoolList } from "@/features/schools/hooks/useSchoolList";
// import { MultiCard } from "../components";
// import { BackLayerCard } from "../components/backLayerCard";

// import { DashboardPageLayout } from "@/features/_global";
// import { useClassroom } from "@/features/classroom";
// import { useSchool } from "@/features/schools";
// import { useRef } from "react";
// import bg1 from "./../assets/bg1.png";
// import bg10 from "./../assets/bg10.png";
// import bg11 from "./../assets/bg11.png";
// import bg12 from "./../assets/bg12.png";
// import bg13 from "./../assets/bg13.png";
// import bg2 from "./../assets/bg2.png";
// import bg3 from "./../assets/bg3.png";
// import bg4 from "./../assets/bg4.png";
// import bg5 from "./../assets/bg5.png";
// import bg6 from "./../assets/bg6.png";
// import bg7 from "./../assets/bg7.png";
// import bg8 from "./../assets/bg8.png";
// import bg9 from "./../assets/bg9.png";

// const backgrounds = {
//   template1: bg1,
//   template2: bg2,
//   template3: bg3,
//   template4: bg4,
//   template5: bg5,
//   template6: bg6,
//   template7: bg7,
//   template8: bg8,
//   template9: bg9,
//   template10: bg10,
//   template11: bg11,
//   template12: bg12,
//   template13: bg13,
// };

// export const StudentCardPage = () => {
//   const { id } = useParams();
//   const { user } = useProfile();
//   const userRole = user?.role;
//   const navigate = useNavigate();

//   const [showBackLayer, setShowBackLayer] = useState(false);
//   const [searchKelas, setSearchKelas] = useState<string>("all"); // Default to "all" for all classes
//   // const [currentPage, setCurrentPage] = useState(1);
//   const [schoolId, setSchoolId] = useState<number | null>(null);
//   const [selectedSchool, setSelectedSchool] = useState<string | null>(null); // School ID untuk SuperAdmin
//   const [cardOrientation, setCardOrientation] = useState<
//     "horizontal" | "vertical"
//   >("horizontal");

//   const [selectedBackgroundFront, setSelectedBackgroundFront] = useState(
//     backgrounds.template1
//   );
//   const [selectedBackgroundBack, setSelectedBackgroundBack] = useState(
//     backgrounds.template1
//   );
//   const [uploadedFront, setUploadedFront] = useState<string | null>(null);
//   const [uploadedBack, setUploadedBack] = useState<string | null>(null);

//   const frontInputRef = useRef<HTMLInputElement | null>(null);
//   const backInputRef = useRef<HTMLInputElement | null>(null);

//   const handleSchoolChange = (value: string) => {
//     const newSchoolId = value === "" ? null : Number(value);
//     setSelectedSchool(value);
//     setSchoolId(newSchoolId);
//     setSearchKelas("all"); // Reset kelas saat sekolah berubah
//     console.log("🎯 School Selected:", newSchoolId);
//   };

//   // Upload image untuk design kartu (kustom)
//   const handleUploadImage = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     type: "front" | "back"
//   ) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const maxSizeMB = 2;
//       const maxSizeBytes = maxSizeMB * 1024 * 1024;

//       if (file.size > maxSizeBytes) {
//         alert(`Ukuran gambar terlalu besar. Maksimal ${maxSizeMB}MB.`);
//         return;
//       }

//       const validTypes = ["image/jpeg", "image/png"];
//       if (!validTypes.includes(file.type)) {
//         alert("Format gambar tidak didukung. Gunakan JPEG, PNG, atau WebP.");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (type === "front") {
//           setUploadedFront(reader.result as string);
//           setSelectedBackgroundFront(reader.result as string);
//         } else {
//           setUploadedBack(reader.result as string);
//           setSelectedBackgroundBack(reader.result as string);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };


//   // Ambil daftar sekolah (hanya untuk SuperAdmin)
//   const { data: schoolList, isLoading: isLoadingSchools } = useSchoolList({
//     enabled: userRole === "superAdmin",
//   });

//   // Ambil daftar kelas berdasarkan schoolId
//   const { data: classroomList, isLoading: isLoadingClassrooms } = useClassroom();

//   useEffect(() => {
//     if (user?.sekolah && userRole !== "superAdmin") {
//       setSchoolId(user.sekolah.id);
//     }
//   }, [user, userRole]);

//   useEffect(() => {
//     if (schoolId && id !== schoolId.toString()) {
//       navigate(`/card/generate`);
//     }
//   }, [schoolId, id, navigate]);

//   useEffect(() => {
//     if (selectedSchool !== null) {
//       setSchoolId(Number(selectedSchool));
//     }
//   }, [selectedSchool]);

//   const handleResetUpload = () => {
//     setUploadedFront(null);
//     setUploadedBack(null);
//     setSelectedBackgroundFront(backgrounds.template1);
//     setSelectedBackgroundBack(backgrounds.template1);

//     // Reset value input file
//     if (frontInputRef.current) frontInputRef.current.value = "";
//     if (backInputRef.current) backInputRef.current.value = "";
//   };

//   const resource = useClassroom();
//   const school = useSchool();

//   return (
//     <DashboardPageLayout
//       siteTitle={`${lang.text("card")} | ${APP_CONFIG.appName}`}
//       breadcrumbs={[
//         { label: lang.text("card"), url: "/card" },
//         { label: lang.text("generateCard"), url: "/card/generate" },
//       ]}
//       title={lang.text("card")}
//     >

//       <div style={{ padding: "0px", textAlign: "left", marginBottom: "16px" }}>
//         <div className="flex justify-between items-center space-x-4 p-4 bg-gray-800 rounded-lg">
//           <div className="w-max flex items-center gap-4">
//             <h3 className="text-white w-max flex">Pilih Orientasi Kartu:</h3>
//             <button
//               className={`p-2 border-2 rounded-md ${
//                 cardOrientation === "horizontal"
//                   ? "border-blue-500"
//                   : "border-gray-500"
//               }`}
//               onClick={() => setCardOrientation("horizontal")}
//             >
//               Horizontal
//             </button>
//             <button
//               className={`p-2 border-2 rounded-md ${
//                 cardOrientation === "vertical"
//                   ? "border-blue-500"
//                   : "border-gray-500"
//               }`}
//               onClick={() => setCardOrientation("vertical")}
//             >
//               Vertikal
//             </button>
//           </div>
//         </div>

//         {/* Pilih Tema Kartu Depan */}
//         <div className="flex space-x-4 overflow-x-auto p-4 bg-gray-800 rounded-lg mt-4">
//           <h3 className="text-white">Pilih Tema Kartu Depan:</h3>
//           {Object.entries(backgrounds).map(([key, bg]) => (
//             <button
//               key={key}
//               onClick={() => setSelectedBackgroundFront(bg)}
//               className={`p-2 border-2 rounded-md transition ${
//                 selectedBackgroundFront === bg
//                   ? "border-blue-500 scale-105"
//                   : "border-gray-500"
//               }`}
//             >
//               <img
//                 src={bg}
//                 alt={key}
//                 className="w-16 h-16 rounded-md object-cover"
//               />
//             </button>
//           ))}
//         </div>

//         {/* Pilih Tema Kartu Belakang */}
//         <div className="flex space-x-4 overflow-x-auto p-4 bg-gray-800 rounded-lg mt-4">
//           <h3 className="text-white">Pilih Tema Kartu Belakang:</h3>
//           {Object.entries(backgrounds).map(([key, bg]) => (
//             <button
//               key={key}
//               onClick={() => setSelectedBackgroundBack(bg)}
//               className={`p-2 border-2 rounded-md transition ${
//                 selectedBackgroundBack === bg
//                   ? "border-red-500 scale-105"
//                   : "border-gray-500"
//               }`}
//             >
//               <img
//                 src={bg}
//                 alt={key}
//                 className="w-16 h-16 rounded-md object-cover"
//               />
//             </button>
//           ))}
//         </div>

//         <div
//           style={{
//             textAlign: "center",
//             margin: "30px 0px",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           {/* Filter Sekolah (Hanya SuperAdmin) */}
//           {userRole === "superAdmin" && (
//             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//               <label htmlFor="schoolFilter">Pilih Sekolah:</label>
//               {isLoadingSchools ? (
//                 <p>Loading...</p>
//               ) : schoolList && Array.isArray(schoolList) && schoolList.length > 0 ? (
//                 <Select
//                   value={selectedSchool || ""}
//                   onValueChange={handleSchoolChange}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Pilih Sekolah" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {schoolList.map((school) => (
//                       <SelectItem key={school.id} value={String(school.id)}>
//                         {school.namaSekolah}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               ) : (
//                 <p>⚠ Tidak ada sekolah tersedia</p>
//               )}
//             </div>
//           )}

//           {/* Filter Kelas dengan Dropdown */}
//           <div style={{ width: '100%', display: "flex", alignItems: "center", gap: "10px" }}>
//             <label
//               htmlFor="kelasFilter"
//               style={{
//                 fontSize: "16px",
//                 fontWeight: "bold",
//               }}
//             >
//               {lang.text("filterByClass")}:
//             </label>
//             {isLoadingClassrooms ? (
//               <p>Loading...</p>
//             ) : classroomList && Array.isArray(classroomList) && classroomList.length > 0 ? (
//               <Select
//                 value={searchKelas}
//                 onValueChange={(value) => setSearchKelas(value)}
//               >
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder={lang.text("selectClassRoom")} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">Semua Kelas</SelectItem>
//                   {classroomList.map((kelas) => (
//                     <SelectItem
//                       key={kelas.id}
//                       value={String(kelas.id)}
//                       disabled={!kelas.id || !kelas.namaKelas}
//                     >
//                       {kelas.namaKelas || "Kelas Tidak Diketahui"}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             ) : (
//               <p>⚠ Tidak ada kelas tersedia</p>
//             )}

//             <div className="ml-auto border-white/30 pl-7 w-max flex items-center gap-6">
//               <div className="flex items-center w-max gap-1">
//                 <label className="w-max flex text-white text-sm font-medium">Upload Gambar Depan:</label>
//                 <Input
//                   ref={frontInputRef}
//                   type="file"
//                   className="w-[200px] border border-white/20 ml-3 hover:bg-white/20 cursor-pointer duration-300"
//                   accept="image/*"
//                   onChange={(e) => handleUploadImage(e, "front")}
//                 />
//               </div>
//               <div className="flex items-center w-max gap-1">
//                 <label className="w-max flex text-white text-sm font-medium">Upload Gambar Belakang:</label>
//                 <Input
//                   ref={backInputRef}
//                   type="file"
//                   className="w-[200px] border border-white/20 ml-3 hover:bg-white/20 cursor-pointer duration-300"
//                   accept="image/*"
//                   onChange={(e) => handleUploadImage(e, "back")}
//                 />
//               </div>

//               {(uploadedFront || uploadedBack) && (
//                 <button
//                   onClick={handleResetUpload}
//                   className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition"
//                 >
//                   {lang.text('resetImage')}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* MultiCard menggunakan searchKelas sebagai ID kelas */}
//         {showBackLayer ? (
//           <BackLayerCard />
//         ) : (
//           <MultiCard
//             searchKelas={searchKelas}
//             schoolId={schoolId}
//             // currentPage={currentPage}
//             // setCurrentPage={setCurrentPage}
//             selectedBackgroundFront={selectedBackgroundFront}
//             selectedBackgroundBack={selectedBackgroundBack}
//             orientation={cardOrientation}
//           />
//         )}
//       </div>

//       <Outlet />
//       <div className="pb-16 sm:pb-0" />
//     </DashboardPageLayout>
//   );
// };


import { useProfile } from "@/features/profile";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { APP_CONFIG } from "@/core/configs";
import {
  Input,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { useSchoolList } from "@/features/schools/hooks/useSchoolList";
import { MultiCard } from "../components";
import { BackLayerCard } from "../components/backLayerCard";

import { DashboardPageLayout } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import { useSchool } from "@/features/schools";
import { useRef } from "react";
import bg1 from "./../assets/bg1.png";
import bg10 from "./../assets/bg10.png";
import bg11 from "./../assets/bg11.png";
import bg12 from "./../assets/bg12.png";
import bg13 from "./../assets/bg13.png";
import bg2 from "./../assets/bg2.png";
import bg3 from "./../assets/bg3.png";
import bg4 from "./../assets/bg4.png";
import bg5 from "./../assets/bg5.png";
import bg6 from "./../assets/bg6.png";
import bg7 from "./../assets/bg7.png";
import bg8 from "./../assets/bg8.png";
import bg9 from "./../assets/bg9.png";

const backgrounds = {
  template1: bg1,
  template2: bg2,
  template3: bg3,
  template4: bg4,
  template5: bg5,
  template6: bg6,
  template7: bg7,
  template8: bg8,
  template9: bg9,
  template10: bg10,
  template11: bg11,
  template12: bg12,
  template13: bg13,
};

export const StudentCardPage = () => {
  const { id } = useParams();
  const { user } = useProfile();
  const userRole = user?.role;
  const navigate = useNavigate();

  const [showBackLayer, setShowBackLayer] = useState(false);
  const [searchKelas, setSearchKelas] = useState<string>("all");
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [cardOrientation, setCardOrientation] = useState<
    "horizontal" | "vertical"
  >("horizontal");

  // Initialize with localStorage or default to template1
  const [selectedBackgroundFront, setSelectedBackgroundFront] = useState(() => {
    const savedFront = localStorage.getItem("selectedBackgroundFront");
    return savedFront && backgrounds[savedFront] ? backgrounds[savedFront] : backgrounds.template1;
  });
  const [selectedBackgroundBack, setSelectedBackgroundBack] = useState(() => {
    const savedBack = localStorage.getItem("selectedBackgroundBack");
    return savedBack && backgrounds[savedBack] ? backgrounds[savedBack] : backgrounds.template1;
  });
  const [uploadedFront, setUploadedFront] = useState<string | null>(null);
  const [uploadedBack, setUploadedBack] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement | null>(null);
  const backInputRef = useRef<HTMLInputElement | null>(null);

  // Save to localStorage whenever selectedBackgroundFront changes
  useEffect(() => {
    const frontKey = Object.keys(backgrounds).find(
      (key) => backgrounds[key] === selectedBackgroundFront
    );
    if (frontKey) {
      localStorage.setItem("selectedBackgroundFront", frontKey);
    }
  }, [selectedBackgroundFront]);

  // Save to localStorage whenever selectedBackgroundBack changes
  useEffect(() => {
    const backKey = Object.keys(backgrounds).find(
      (key) => backgrounds[key] === selectedBackgroundBack
    );
    if (backKey) {
      localStorage.setItem("selectedBackgroundBack", backKey);
    }
  }, [selectedBackgroundBack]);

  const handleSchoolChange = (value: string) => {
    const newSchoolId = value === "" ? null : Number(value);
    setSelectedSchool(value);
    setSchoolId(newSchoolId);
    setSearchKelas("all");
    console.log("🎯 School Selected:", newSchoolId);
  };

  const handleUploadImage = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSizeMB = 2;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      if (file.size > maxSizeBytes) {
        alert(`Ukuran gambar terlalu besar. Maksimal ${maxSizeMB}MB.`);
        return;
      }

      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("Format gambar tidak didukung. Gunakan JPEG, PNG, atau WebP.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "front") {
          setUploadedFront(reader.result as string);
          setSelectedBackgroundFront(reader.result as string);
        } else {
          setUploadedBack(reader.result as string);
          setSelectedBackgroundBack(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { data: schoolList, isLoading: isLoadingSchools } = useSchoolList({
    enabled: userRole === "superAdmin",
  });

  const { data: classroomList, isLoading: isLoadingClassrooms } = useClassroom();

  useEffect(() => {
    if (user?.sekolah && userRole !== "superAdmin") {
      setSchoolId(user.sekolah.id);
    }
  }, [user, userRole]);

  useEffect(() => {
    if (schoolId && id !== schoolId.toString()) {
      navigate(`/card/generate`);
    }
  }, [schoolId, id, navigate]);

  useEffect(() => {
    if (selectedSchool !== null) {
      setSchoolId(Number(selectedSchool));
    }
  }, [selectedSchool]);

  const handleResetUpload = () => {
    setUploadedFront(null);
    setUploadedBack(null);
    setSelectedBackgroundFront(backgrounds.template1);
    setSelectedBackgroundBack(backgrounds.template1);

    if (frontInputRef.current) frontInputRef.current.value = "";
    if (backInputRef.current) backInputRef.current.value = "";
  };

  const resource = useClassroom();
  const school = useSchool();

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("card")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        { label: lang.text("card"), url: "/card" },
        { label: lang.text("generateCard"), url: "/card/generate" },
      ]}
      title={lang.text("card")}
    >
      <div style={{ padding: "0px", textAlign: "left", marginBottom: "16px" }}>
        <div className="flex justify-between items-center space-x-4 p-4 bg-gray-800 rounded-lg">
          <div className="w-max flex items-center gap-4">
            <h3 className="text-white w-max flex">Pilih Orientasi Kartu:</h3>
            <button
              className={`p-2 border-2 rounded-md ${
                cardOrientation === "horizontal"
                  ? "border-blue-500"
                  : "border-gray-500"
              }`}
              onClick={() => setCardOrientation("horizontal")}
            >
              Horizontal
            </button>
            <button
              className={`p-2 border-2 rounded-md ${
                cardOrientation === "vertical"
                  ? "border-blue-500"
                  : "border-gray-500"
              }`}
              onClick={() => setCardOrientation("vertical")}
            >
              Vertikal
            </button>
          </div>
        </div>

        <div className="flex space-x-4 overflow-x-auto p-4 bg-gray-800 rounded-lg mt-4">
          <h3 className="text-white">Pilih Tema Kartu Depan:</h3>
          {Object.entries(backgrounds).map(([key, bg]) => (
            <button
              key={key}
              onClick={() => setSelectedBackgroundFront(bg)}
              className={`p-2 border-2 rounded-md transition ${
                selectedBackgroundFront === bg
                  ? "border-blue-500 scale-105"
                  : "border-gray-500"
              }`}
            >
              <img
                src={bg}
                alt={key}
                className="w-16 h-16 rounded-md object-cover"
              />
            </button>
          ))}
        </div>

        <div className="flex space-x-4 overflow-x-auto p-4 bg-gray-800 rounded-lg mt-4">
          <h3 className="text-white">Pilih Tema Kartu Belakang:</h3>
          {Object.entries(backgrounds).map(([key, bg]) => (
            <button
              key={key}
              onClick={() => setSelectedBackgroundBack(bg)}
              className={`p-2 border-2 rounded-md transition ${
                selectedBackgroundBack === bg
                  ? "border-red-500 scale-105"
                  : "border-gray-500"
              }`}
            >
              <img
                src={bg}
                alt={key}
                className="w-16 h-16 rounded-md object-cover"
              />
            </button>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            margin: "30px 0px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {userRole === "superAdmin" && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="schoolFilter">Pilih Sekolah:</label>
              {isLoadingSchools ? (
                <p>Loading...</p>
              ) : schoolList && Array.isArray(schoolList) && schoolList.length > 0 ? (
                <Select
                  value={selectedSchool || ""}
                  onValueChange={handleSchoolChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Sekolah" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolList.map((school) => (
                      <SelectItem key={school.id} value={String(school.id)}>
                        {school.namaSekolah}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p>⚠ Tidak ada sekolah tersedia</p>
              )}
            </div>
          )}

          <div style={{ width: '100%', display: "flex", alignItems: "center", gap: "10px" }}>
            <label
              htmlFor="kelasFilter"
              style={{
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {lang.text('className')}:
            </label>
            {isLoadingClassrooms ? (
              <p>Loading...</p>
            ) : classroomList && Array.isArray(classroomList) && classroomList.length > 0 ? (
              <Select
                value={searchKelas}
                onValueChange={(value) => setSearchKelas(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={lang.text("selectClassRoom")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {classroomList.map((kelas) => (
                    <SelectItem
                      key={kelas.id}
                      value={String(kelas.id)}
                      disabled={!kelas.id || !kelas.namaKelas}
                    >
                      {kelas.namaKelas || "Kelas Tidak Diketahui"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p>⚠ Tidak ada kelas tersedia</p>
            )}

            <div className="ml-auto border-white/30 pl-7 w-max flex items-center gap-6">
              <div className="flex items-center w-max gap-1">
                <label className="w-max flex text-white text-sm font-medium">Upload Gambar Depan:</label>
                <Input
                  ref={frontInputRef}
                  type="file"
                  className="w-[200px] border border-white/20 ml-3 hover:bg-white/20 cursor-pointer duration-300"
                  accept="image/*"
                  onChange={(e) => handleUploadImage(e, "front")}
                />
              </div>
              <div className="flex items-center w-max gap-1">
                <label className="w-max flex text-white text-sm font-medium">Upload Gambar Belakang:</label>
                <Input
                  ref={backInputRef}
                  type="file"
                  className="w-[200px] border border-white/20 ml-3 hover:bg-white/20 cursor-pointer duration-300"
                  accept="image/*"
                  onChange={(e) => handleUploadImage(e, "back")}
                />
              </div>

              {(uploadedFront || uploadedBack) && (
                <button
                  onClick={handleResetUpload}
                  className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition"
                >
                  {lang.text('resetImage')}
                </button>
              )}
            </div>
          </div>
        </div>

        {showBackLayer ? (
          <BackLayerCard />
        ) : (
          <MultiCard
            searchKelas={searchKelas}
            schoolId={schoolId}
            selectedBackgroundFront={selectedBackgroundFront}
            selectedBackgroundBack={selectedBackgroundBack}
            orientation={cardOrientation}
          />
        )}
      </div>

      <Outlet />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};