// import { Card, CardContent, Input, lang, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@/core/libs";
// import { useBiodataNoRefetchForCard } from "@/features/user";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { IdCard, LocateIcon } from "lucide-react";
// import { useMemo, useState } from "react";
// import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
// import { useSchool } from "../hooks";

// // Fungsi untuk menghitung jarak Haversine
// const haversineDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371e3; // Radius bumi dalam meter
//   const toRad = (deg) => (deg * Math.PI) / 180;

//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const lat1Rad = toRad(lat1);
//   const lat2Rad = toRad(lat2);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Jarak dalam meter
// };

// // Ikon marker
// const PurpleCircleIcon = L.divIcon({
//   className: "custom-div-icon",
//   html: `<div class="w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>`,
//   iconSize: [16, 16],
//   iconAnchor: [8, 8],
//   popupAnchor: [0, -8],
// });

// const WarningCircleIcon = L.divIcon({
//   className: "custom-div-icon",
//   html: `<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>`,
//   iconSize: [16, 16],
//   iconAnchor: [8, 8],
//   popupAnchor: [0, -8],
// });

// const MapEventsHandler = () => {
//   useMapEvent("moveend", (event) => {
//     const map = event.target;
//     const center = map.getCenter();
//   });
//   return null;
// };

// export const SchoolMap = () => {
//   const [center] = useState<[number, number]>([-6.16667, 106.82676]);
//   const [zoom] = useState<number>(12);
//   const [searchStudent, setSearchStudent] = useState<string>("");
//   const [sheetSearch, setSheetSearch] = useState<string>("");
//   const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
//   const biodata = useBiodataNoRefetchForCard();
//   const schoolProfile = useSchool();

//   console.log('biodata?.data new', biodata?.data);

//   const studentData = useMemo(() => {
//     let parsedData = [];

//     try {
//       if (typeof biodata?.data === 'string') {
//         parsedData = JSON.parse(biodata.data) || [];
//       } else {
//         parsedData = biodata?.data || [];
//       }
//     } catch (error) {
//       console.error('Gagal mem-parse biodata.data:', error);
//       parsedData = [];
//     }

//     if (!Array.isArray(parsedData)) {
//       console.warn('biodata.data bukan array:', parsedData);
//       return [];
//     }

//     const schoolLat = schoolProfile?.data?.[0]?.latitude || 0;
//     const schoolLng = schoolProfile?.data?.[0]?.longitude || 0;

//     return parsedData
//       .filter((student) => student?.user?.isActive !== 0 && student?.location !== null)
//       .map((student) => {
//         const lat = student.location?.latitude || 0;
//         const lng = student.location?.longitude || 0;
//         const distance = haversineDistance(schoolLat, schoolLng, lat, lng);
//         const isOutsideRadius = distance > 120;

//         return {
//           lat,
//           lng,
//           nis: student.user?.nis || '-',
//           name: student.user?.name || '-',
//           email: student.user?.email || '-',
//           alamat: student.user?.alamat || 'Alamat belum ditentukan',
//           updatedAt: student?.updatedAt || null,
//           profileImage: student.user?.image || null,
//           status: 'Lokasi',
//           isOutsideRadius,
//           distance: distance.toFixed(2),
//         };
//       });
//   }, [biodata?.data, schoolProfile?.data]);

//   // Memisahkan siswa berdasarkan isOutsideRadius
//   const studentsInsideRadius = studentData.filter((student) => !student.isOutsideRadius);
//   const studentsOutsideRadius = studentData.filter((student) => student.isOutsideRadius);

//   // Filter siswa berdasarkan pencarian di sheet
//   const filteredStudentsInsideRadius = studentsInsideRadius.filter((student) =>
//     sheetSearch
//       ? student.name.toLowerCase().includes(sheetSearch.toLowerCase()) ||
//         student.nis.toLowerCase().includes(sheetSearch.toLowerCase())
//       : true
//   );
//   const filteredStudentsOutsideRadius = studentsOutsideRadius.filter((student) =>
//     sheetSearch
//       ? student.name.toLowerCase().includes(sheetSearch.toLowerCase()) ||
//         student.nis.toLowerCase().includes(sheetSearch.toLowerCase())
//       : true
//   );

//   if (biodata?.isLoading) {
//     return (
//       <Card className="w-full h-full">
//         <CardContent className="flex flex-col items-center justify-center h-full">
//           <div className="w-full max-w-[300px] h-2 bg-gray-200 rounded-full overflow-hidden">
//             <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-blue-500 animate-[indeterminate_1.5s_infinite_linear] origin-left"></div>
//           </div>
//           <p className="text-gray-500 mt-8">{lang.text("loading")}</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   console.log('studentData studentData', studentData)

//   return (
//     <>
//       <Card className="relative z-[9999] w-max h-[70px] flex items-center px-6 py-2 top-5 mb-8">
//         <div className="w-full flex items-center space-y-0">
//           <div className="flex mr-4 border-r border-white/50 pr-4 items-center">
//             <h3 className="text-lg font-normal">{lang.text("studentTotal")}</h3>
//             <div className="flex items-center gap-4">
//               <h2 className="text-lg ml-4 text-foreground">({biodata?.data?.length || 0})</h2>
//             </div>
//           </div>
//           <div className="flex items-center">
//             <h3 className="text-lg font-normal">{lang.text("locationTotal")}</h3>
//             <div className="flex items-center gap-4 w-[80px]">
//               <h2 className="text-lg text-foreground ml-4">({studentData?.length || 0})</h2>
//             </div>
//             <div className="w-4 h-4 rounded-full border-2 border-white bg-purple-600"></div>
//           </div>
//           <div className="ml-6 flex items-center gap-4">
//             <Input
//               placeholder={lang.text("searchStudentByName")}
//               value={searchStudent || ""}
//               onChange={(e) => setSearchStudent(String(e.target?.value))}
//               className="w-[380px] flex-1 focus:border-none focus:outline-none"
//             />
//             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
//               <SheetTrigger asChild>
//                 <Button variant="outline" className="w-max">
//                   <LocateIcon className="mr-1" /> Lihat Daftar Siswa (radius)
//                 </Button>
//               </SheetTrigger>
//               <SheetContent
//                 side="right"
//                 className="w-[100vw] md:w-[40vw] pr-4 pb-12 pt-12 z-[999999] md:max-w-[410px] md:min-w-[32vw] max-h-[100vh] overflow-y-auto text-white"
//               >
//                 <SheetHeader>
//                   <SheetTitle>Daftar Siswa Berdasarkan Lokasi</SheetTitle>
//                 </SheetHeader>
//                 <div className="flex gap-3 mt-4 mb-5 items-center h-[42px]">
//                   <Input
//                       placeholder="Telusuri sekarang..."
//                       value={sheetSearch}
//                       onChange={(e) => setSheetSearch(String(e.target?.value))}
//                       className="flex-1 h-full my-4 py-5 border outline-0 focus:border-none focus:outline-none dark:text-white text-black"
//                     />
//                   <Badge className="bg-transparent h-full w-max text-white dark:text-white hover:bg-transparent">
//                     <LocateIcon className="text-green-500 w-4 h-4 mr-2.5" />
//                     Dalam Radius: {filteredStudentsInsideRadius.length}
//                   </Badge>
//                   <Badge className="bg-transparent h-full w-max text-white dark:text-white hover:bg-transparent">
//                     <LocateIcon className="text-red-500 w-4 h-4 mr-2.5" />
//                     Luar Radius: {filteredStudentsOutsideRadius.length}
//                   </Badge>
//                 </div>
//                 <Tabs defaultValue="inside" className="w-full">
//                   <TabsList className="grid w-full h-max grid-cols-2 mb-4 bg-transparent border border-slate-400 dark:border-white/20 rounded-lg px-2 py-2">
//                     <TabsTrigger
//                       value="inside"
//                       className="data-[state=active]:bg-blue-600 text-slate-300 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md py-2"
//                     >
//                       Dalam Radius
//                     </TabsTrigger>
//                     <TabsTrigger
//                       value="outside"
//                       className="data-[state=active]:bg-blue-600 text-slate-300 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md py-2"
//                     >
//                       Luar Radius
//                     </TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="inside">
//                     <div className="max-h-[50%] overflow-y-auto p-4 border border-white/20 rounded-lg">
//                       {filteredStudentsInsideRadius.length > 0 ? (
//                         filteredStudentsInsideRadius.map((student, index) => (
//                           <div
//                             key={index}
//                             className="p-3 rounded-md border border-white/20 mb-2 last:mb-0 transition-transform duration-200"
//                           >
//                             <div className="border-b border-b-white/30 pb-3 mb-3">
//                               <p className="text-lg font-bold text-white">{student.name}</p>
//                               <p className="text-md text-slate-400">NIS: {student.nis}</p>
//                             </div>
//                             <p className="text-md text-green-400">Jarak: {student.distance} m</p>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-sm text-gray-600">Tidak ada siswa di dalam radius.</p>
//                       )}
//                     </div>
//                   </TabsContent>
//                   <TabsContent value="outside">
//                     <div className="max-h-[50%] overflow-y-auto p-4 border border-white/20 rounded-lg">
//                       {filteredStudentsOutsideRadius.length > 0 ? (
//                         filteredStudentsOutsideRadius.map((student, index) => (
//                           <div
//                             key={index}
//                             className="p-3 rounded-md border border-white/20 mb-2 last:mb-0 transition-transform duration-200"
//                           >
//                             <div className="border-b border-b-white/30 pb-3 mb-3">
//                               <p className="text-lg font-bold text-white">{student.name}</p>
//                               <p className="text-md text-slate-400">NIS: {student.nis}</p>
//                             </div>
//                             <p className="text-md text-red-400">Jarak: {student.distance} m</p>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-sm text-gray-600">Tidak ada siswa di luar radius.</p>
//                       )}
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </Card>
//       <Card className="z-[1] w-full mb-12 mt-4 bg-indigo-50/30">
//         <CardContent className="p-0">
//           <div className="relative w-full gap-4 h-max">
//             <Card className="w-full h-[72vh]">
//               <CardContent className="p-0 h-full">
//                 <div className="relative rounded-lg h-full overflow-hidden">
//                   <MapContainer
//                     className="w-full h-full"
//                     center={center}
//                     zoom={zoom}
//                     scrollWheelZoom={true}
//                     attributionControl={false}
//                     zoomControl={false}
//                     doubleClickZoom={true}
//                     dragging={true}
//                     easeLinearity={0.35}
//                   >
//                     <MapEventsHandler />
//                     <TileLayer
//                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                       attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     />
//                     {studentData && studentData.length > 0
//                       ? studentData
//                           .filter((data) => {
//                             if (searchStudent && searchStudent !== "") {
//                               return data.name.toLowerCase().includes(searchStudent.toLowerCase());
//                             }
//                             return true;
//                           })
//                           .map((student, index) => (
//                             <Marker
//                               icon={student.isOutsideRadius ? WarningCircleIcon : PurpleCircleIcon}
//                               key={biodata?.data[index]?.id || index}
//                               position={[student.lat, student.lng]}
//                             >
//                               <Popup
//                                 className={`bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.03)] w-80 font-sans ${student.isOutsideRadius ? 'border-2 border-red-500' : ''}`}
//                               >
//                                 <div className="pt-2 flex flex-col items-center gap-2">
//                                   <div className="mb-5 w-full flex items-center justify-between">
//                                     <div className="flex items-center gap-2 text-sm">
//                                       <IdCard /> NIS: {student.nis}
//                                     </div>
//                                     <div className="bg-green-400 text-white text-xs flex items-center justify-center px-2">
//                                       {student.status}
//                                     </div>
//                                   </div>
//                                   {student.profileImage && student.profileImage !== "" ? (
//                                     <img
//                                       src={
//                                         student.profileImage.includes('uploads')
//                                           ? `https://dev.kiraproject.id${student.profileImage}`
//                                           : student.profileImage
//                                       }
//                                       alt={student.name}
//                                       className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
//                                     />
//                                   ) : (
//                                     <div className="w-16 h-16 rounded-full bg-purple-500 text-white flex items-center justify-center text-2xl font-bold border-2 border-gray-200">
//                                       {student.name.charAt(0).toUpperCase()}
//                                     </div>
//                                   )}
//                                   <div className="w-full flex items-center text-center flex-col">
//                                     <strong className="text-lg">{student.name}</strong>
//                                     <p className="relative -top-3 text-sm text-gray-600">{student?.email}</p>
//                                   </div>
//                                 </div>
//                                 <div className="text-center w-full flex flex-col justify-center items-center">
//                                   <p className="text-sm text-gray-600">{student.alamat}</p>
//                                   <p className="text-xs text-gray-500 mt-1 mb-3">
//                                     Last Updated: {new Date(student.updatedAt).toLocaleString()}
//                                   </p>
//                                   {student.isOutsideRadius && (
//                                     <p className="text-xs text-red-500 flex items-center">
//                                       <span className="mr-1">⚠</span> Lokasi di luar radius 120m ({student.distance} m)
//                                     </p>
//                                   )}
//                                   <a
//                                     href={`https://www.google.com/maps?q=${student.lat},${student.lng}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-500 hover:underline text-sm mt-2"
//                                   >
//                                     Lihat google maps
//                                   </a>
//                                 </div>
//                               </Popup>
//                             </Marker>
//                           ))
//                       : null}
//                   </MapContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </CardContent>
//       </Card>
//     </>
//   );
// };

import { Badge, Button, Card, CardContent, Input, lang, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/libs";
import { useBiodataNoRefetchForCard } from "@/features/user";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IdCard, LocateIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import { useSchool } from "../hooks";

// Fungsi untuk menghitung jarak Haversine
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Radius bumi dalam meter
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Jarak dalam meter
};

// Ikon marker
const PurpleCircleIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div class="w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8],
});

const WarningCircleIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8],
});

const MapEventsHandler = () => {
  useMapEvent("moveend", (event) => {
    const map = event.target;
    const center = map.getCenter();
  });
  return null;
};

export const SchoolMap = () => {
  const [center] = useState([-6.16667, 106.82676]);
  const [zoom] = useState(12);
  const [searchStudent, setSearchStudent] = useState("");
  const [sheetSearch, setSheetSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const biodata = useBiodataNoRefetchForCard();
  const schoolProfile = useSchool();

  const studentData = useMemo(() => {
    let parsedData = [];

    try {
      if (typeof biodata?.data === 'string') {
        parsedData = JSON.parse(biodata.data) || [];
      } else {
        parsedData = biodata?.data || [];
      }
    } catch (error) {
      console.error('Gagal mem-parse biodata.data:', error);
      parsedData = [];
    }

    if (!Array.isArray(parsedData)) {
      console.warn('biodata.data bukan array:', parsedData);
      return [];
    }

    const schoolLat = schoolProfile?.data?.[0]?.latitude || 0;
    const schoolLng = schoolProfile?.data?.[0]?.longitude || 0;

    return parsedData
      .filter((student) => student?.user?.isActive !== 0 && student?.location !== null)
      .map((student) => {
        const lat = student.location?.latitude || 0;
        const lng = student.location?.longitude || 0;
        const distance = haversineDistance(schoolLat, schoolLng, lat, lng);
        const isOutsideRadius = distance > 120;

        return {
          lat,
          lng,
          nis: student.user?.nis || '-',
          name: student.user?.name || '-',
          email: student.user?.email || '-',
          alamat: student.user?.alamat || 'Alamat belum ditentukan',
          updatedAt: student?.updatedAt || null,
          profileImage: student.user?.image || null,
          status: 'Lokasi',
          isOutsideRadius,
          distance: distance.toFixed(2),
        };
      });
  }, [biodata?.data, schoolProfile?.data]);

  // Memisahkan siswa berdasarkan isOutsideRadius
  const studentsInsideRadius = studentData.filter((student) => !student.isOutsideRadius);
  const studentsOutsideRadius = studentData.filter((student) => student.isOutsideRadius);

  // Filter siswa berdasarkan pencarian di sheet
  const filteredStudentsInsideRadius = studentsInsideRadius.filter((student) =>
    sheetSearch
      ? student.name.toLowerCase().includes(sheetSearch.toLowerCase()) ||
        student.nis.toLowerCase().includes(sheetSearch.toLowerCase())
      : true
  );
  const filteredStudentsOutsideRadius = studentsOutsideRadius.filter((student) =>
    sheetSearch
      ? student.name.toLowerCase().includes(sheetSearch.toLowerCase()) ||
        student.nis.toLowerCase().includes(sheetSearch.toLowerCase())
      : true
  );

  if (biodata?.isLoading) {
    return (
      <Card className="w-full h-full">
        <CardContent className="flex flex-col items-center justify-center h-full">
          <div className="w-full max-w-[300px] h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-blue-500 animate-[indeterminate_1.5s_infinite_linear] origin-left"></div>
          </div>
          <p className="text-gray-500 mt-8">{lang.text("loading")}</p>
        </CardContent>
      </Card>
    );
  }

  // Koordinat sekolah untuk pusat lingkaran
  const schoolLat = schoolProfile?.data?.[0]?.latitude || -6.16667;
  const schoolLng = schoolProfile?.data?.[0]?.longitude || 106.82676;

  return (
    <>
      <Card className="relative z-[9999] w-max h-[70px] flex items-center px-6 py-2 top-5 mb-8">
        <div className="w-full flex items-center space-y-0">
          <div className="flex mr-4 border-r border-white/50 pr-4 items-center">
            <h3 className="text-lg font-normal">{lang.text("studentTotal")}</h3>
            <div className="flex items-center gap-4">
              <h2 className="text-lg ml-4 text-foreground">({biodata?.data?.length || 0})</h2>
            </div>
          </div>
          <div className="flex items-center">
            <h3 className="text-lg font-normal">{lang.text("locationTotal")}</h3>
            <div className="flex items-center gap-4 w-[80px]">
              <h2 className="text-lg text-foreground ml-4">({studentData?.length || 0})</h2>
            </div>
            <div className="w-4 h-4 rounded-full border-2 border-white bg-purple-600"></div>
          </div>
          <div className="ml-6 flex items-center gap-4">
            <Input
              placeholder={lang.text("searchStudentByName")}
              value={searchStudent || ""}
              onChange={(e) => setSearchStudent(String(e.target?.value))}
              className="w-[380px] flex-1 focus:border-none focus:outline-none"
            />
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-max">
                  <LocateIcon className="mr-1" /> Lihat Daftar Siswa (radius)
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[100vw] md:w-[40vw] pr-4 pb-12 pt-12 z-[999999] md:max-w-[410px] md:min-w-[32vw] max-h-[100vh] overflow-y-auto text-white"
              >
                <SheetHeader>
                  <SheetTitle>Daftar Siswa Berdasarkan Lokasi</SheetTitle>
                </SheetHeader>
                <div className="flex gap-3 mt-4 mb-5 items-center h-[42px]">
                  <Input
                    placeholder="Telusuri sekarang..."
                    value={sheetSearch}
                    onChange={(e) => setSheetSearch(String(e.target?.value))}
                    className="flex-1 h-full my-4 py-5 border outline-0 focus:border-none focus:outline-none dark:text-white text-black"
                  />
                  <Badge className="bg-transparent h-full w-max text-white dark:text-white hover:bg-transparent">
                    <LocateIcon className="text-green-500 w-4 h-4 mr-2.5" />
                    Dalam Radius: {filteredStudentsInsideRadius.length}
                  </Badge>
                  <Badge className="bg-transparent h-full w-max text-white dark:text-white hover:bg-transparent">
                    <LocateIcon className="text-red-500 w-4 h-4 mr-2.5" />
                    Luar Radius: {filteredStudentsOutsideRadius.length}
                  </Badge>
                </div>
                <Tabs defaultValue="inside" className="w-full">
                  <TabsList className="grid w-full h-max grid-cols-2 mb-4 bg-transparent border border-slate-400 dark:border-white/20 rounded-lg px-2 py-2">
                    <TabsTrigger
                      value="inside"
                      className="data-[state=active]:bg-blue-600 text-slate-300 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md py-2"
                    >
                      Dalam Radius
                    </TabsTrigger>
                    <TabsTrigger
                      value="outside"
                      className="data-[state=active]:bg-blue-600 text-slate-300 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md py-2"
                    >
                      Luar Radius
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="inside">
                    <div className="max-h-[50%] overflow-y-auto p-4 border border-white/20 rounded-lg">
                      {filteredStudentsInsideRadius.length > 0 ? (
                        filteredStudentsInsideRadius.map((student, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-md border border-white/20 mb-2 last:mb-0 transition-transform duration-200"
                          >
                            <div className="border-b border-b-white/30 pb-3 mb-3">
                              <p className="text-lg font-bold text-white">{student.name}</p>
                              <p className="text-md text-slate-400">NIS: {student.nis}</p>
                            </div>
                            <p className="text-md text-green-400">Jarak: {student.distance} m</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">Tidak ada siswa di dalam radius.</p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="outside">
                    <div className="max-h-[50%] overflow-y-auto p-4 border border-white/20 rounded-lg">
                      {filteredStudentsOutsideRadius.length > 0 ? (
                        filteredStudentsOutsideRadius.map((student, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-md border border-white/20 mb-2 last:mb-0 transition-transform duration-200"
                          >
                            <div className="border-b border-b-white/30 pb-3 mb-3">
                              <p className="text-lg font-bold text-white">{student.name}</p>
                              <p className="text-md text-slate-400">NIS: {student.nis}</p>
                            </div>
                            <p className="text-md text-red-400">Jarak: {student.distance} m</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">Tidak ada siswa di luar radius.</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Card>
      <Card className="z-[1] w-full mb-12 mt-4 bg-indigo-50/30">
        <CardContent className="p-0">
          <div className="relative w-full gap-4 h-max">
            <Card className="w-full h-[72vh]">
              <CardContent className="p-0 h-full">
                <div className="relative rounded-lg h-full overflow-hidden">
                  <MapContainer
                    className="w-full h-full"
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={true}
                    attributionControl={false}
                    zoomControl={false}
                    doubleClickZoom={true}
                    dragging={true}
                    easeLinearity={0.35}
                  >
                    <MapEventsHandler />
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* Lingkaran biru untuk radius 120m */}
                    <Circle
                      center={[schoolLat, schoolLng]}
                      radius={120}
                      pathOptions={{
                        color: 'blue',
                        fillColor: 'blue',
                        fillOpacity: 0.2,
                        weight: 2,
                      }}
                    />
                    {studentData && studentData.length > 0
                      ? studentData
                          .filter((data) => {
                            if (searchStudent && searchStudent !== "") {
                              return data.name.toLowerCase().includes(searchStudent.toLowerCase());
                            }
                            return true;
                          })
                          .map((student, index) => (
                            <Marker
                              icon={student.isOutsideRadius ? WarningCircleIcon : PurpleCircleIcon}
                              key={biodata?.data[index]?.id || index}
                              position={[student.lat, student.lng]}
                            >
                              <Popup
                                className={`bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.03)] w-80 font-sans ${student.isOutsideRadius ? 'border-2 border-red-500' : ''}`}
                              >
                                <div className="pt-2 flex flex-col items-center gap-2">
                                  <div className="mb-5 w-full flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                      <IdCard /> NIS: {student.nis}
                                    </div>
                                    <div className="bg-green-400 text-white text-xs flex items-center justify-center px-2">
                                      {student.status}
                                    </div>
                                  </div>
                                  {student.profileImage && student.profileImage !== "" ? (
                                    <img
                                      src={
                                        student.profileImage.includes('uploads')
                                          ? `https://dev.kiraproject.id${student.profileImage}`
                                          : student.profileImage
                                      }
                                      alt={student.name}
                                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 rounded-full bg-purple-500 text-white flex items-center justify-center text-2xl font-bold border-2 border-gray-200">
                                      {student.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="w-full flex items-center text-center flex-col">
                                    <strong className="text-lg">{student.name}</strong>
                                    <p className="relative -top-3 text-sm text-gray-600">{student?.email}</p>
                                  </div>
                                </div>
                                <div className="text-center w-full flex flex-col justify-center items-center">
                                  <p className="text-sm text-gray-600 break-words max-w-full">{student.alamat}</p>
                                  <p className="text-xs text-gray-500 mt-1 mb-3">
                                    Last Updated: {new Date(student.updatedAt).toLocaleString()}
                                  </p>
                                  {student.isOutsideRadius && (
                                    <p className="text-xs text-red-500 flex items-center">
                                      <span className="mr-1">⚠</span> Lokasi di luar radius 120m ({student.distance} m)
                                    </p>
                                  )}
                                  <a
                                    href={`https://www.google.com/maps?q=${student.lat},${student.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline text-sm mt-2"
                                  >
                                    Lihat google maps
                                  </a>
                                </div>
                              </Popup>
                            </Marker>
                          ))
                      : null}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
};