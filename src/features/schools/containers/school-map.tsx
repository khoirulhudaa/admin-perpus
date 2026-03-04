import { Button, Card, CardContent, CardHeader, Input, lang, Progress } from "@/core/libs";
import { Regions } from "@/core/models";
import { provinceModel } from "@/core/models/province";
import { Feature } from 'geojson';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { FaArrowDown, FaArrowUp, FaGripLines } from 'react-icons/fa';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvent } from "react-leaflet";
// import { RegionDropdown } from '../components/school-region-dropdown';
import { useProvinces, useSchool } from '../hooks';

// Configure Leaflet marker icon
const PurpleCircleIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="purple-circle"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8],
});

export const SchoolMap = () => {
  const [center] = useState<[number, number]>([-6.16667, 106.82676]);
  const [zoom] = useState<number>(12);
  const [activeLineMarker, setActiveLineMarker] = useState<boolean>(false);
  const [lineMarkers, setLineMarkers] = useState<any>(null);
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [regions, setRegions] = useState<Regions>({
    central: true,
    south: false,
    north: false,
    west: false,
    east: false,
  });

  const toggleRegion = (region: keyof Regions) => {
    setRegions((prev) => ({
      ...prev,
      [region]: !prev[region],
    }));
  };

  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    if (feature?.properties && (feature?.properties?.NAMOBJ || feature?.properties?.namobj)) {
      layer.bindTooltip(feature?.properties?.NAMOBJ ?? feature?.properties?.namobj);
    }
  };

  const schools = useSchool();
  const provinces = useProvinces();

  const schoolData = useMemo(() => {
    return (
      schools?.data?.map((school) => ({
        lat: school.latitude,
        lng: school.longitude,
        namaSekolah: school.namaSekolah,
        alamatSekolah: school.alamatSekolah,
      })) || []
    );
  }, [schools?.data]);

  useEffect(() => {
    const linesDataMarker = [
      ...schoolData.map((school: any) => [
        Number(school.lat),
        Number(school.lng),
      ]),
      [
        Number(schoolData[0]?.lat),
        Number(schoolData[0]?.lng),
      ],
    ];
    setLineMarkers(linesDataMarker);
  }, [schoolData.length]);

  const MapEventsHandler = () => {
    useMapEvent("moveend", (event) => {
      const map = event.target;
      const center = map.getCenter();
    });
    return null;
  };

  if (!schools?.data) {
    return (
      <Card className="w-full h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">{lang.text('loading')}</p>
        </CardContent>
      </Card>
    );
  }

  // Menghitung jumlah sekolah berdasarkan provinsi
  const schoolCountByProvince = schools?.data
    ? schools.data.reduce((acc: { [key: number]: number }, school) => {
        const provinceIds = school?.provinceId;
        if (provinceIds !== undefined && provinceIds !== null) {
          acc[provinceIds] = (acc[provinceIds] || 0) + 1;
        }
        return acc;
      }, {})
    : {};

  // Mengambil nama provinsi dan jumlah sekolah hanya untuk yang memiliki data
  const result = provinces.data
    ? provinces.data
        ?.filter((province: provinceModel) => schoolCountByProvince[province.id] > 0)
        ?.map((province: provinceModel) => ({
          name: province.name,
          count: schoolCountByProvince[province.id],
        }))
    : [];

  // Fungsi untuk mengekspor data result ke PDF
  const handleExportPercentage = () => {
    const doc = new jsPDF();

    // Judul dokumen
    doc.setFontSize(18);
    doc.text('Laporan Sebaran Sekolah (Provinsi)', 14, 20);

    // Menghitung total jumlah sekolah
    const totalCount = result.reduce((sum, item) => sum + item.count, 0);

    // Menyiapkan data untuk tabel
    const tableData = result
      .sort((a, b) => b.count - a.count)
      .map((data, index) => {
        const percentage = totalCount > 0 ? (data.count / totalCount) * fno100 : 0;
        return [
          (index + 1).toString(), // No
          data.name, // Nama Provinsi
          data.count.toString(), // Jumlah Sekolah
          `${percentage.toFixed(2)}%`, // Persentase
        ];
      });

    // Terapkan autoTable ke dokumen
    autoTable(doc, {
      head: [['No', 'Nama Provinsi', 'Jumlah Sekolah', 'Persentase']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 20 }, // No
        1: { cellWidth: 80 }, // Nama Provinsi
        2: { cellWidth: 40 }, // Jumlah Sekolah
        3: { cellWidth: 40 }, // Persentase
      },
    });

    // Simpan dokumen sebagai PDF
    doc.save('sebaran_sekolah_per_provinsi.pdf');
  };

  return (
    <Card className="z-[1] w-full my-12 mb-12 bg-theme-color-primary/5">
      <CardContent className="pt-6">
        <div className="w-full flex gap-4 h-[500px]">
          {/* Left - Stats and Progress */}
          <Card className="w-[30%] bg-theme-color-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <h3 className="text-lg font-semibold">{lang.text('schoolDistribution')}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <h2 className="text-3xl text-foreground">{schoolData.length}</h2>
                  <div
                    className="bg-[#0f4d3f] text-[#3ee07a] w-max flex items-center text-xs font-sans rounded px-2 py-1"
                  >
                    {'20.7%'} <FaArrowUp className="rotate-[30deg] ml-2" />
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleExportPercentage}
                className="flex items-center gap-2"
              >
                {lang.text('export')} <FaArrowDown />
              </Button>
            </CardHeader>
            <CardContent>
              {result && result.length > 0 ? (
                <div className="space-y-4">
                  {[...result]
                    .sort((a, b) => b.count - a.count)
                    .map((data, index) => {
                      const totalCount = result.reduce((sum, item) => sum + item.count, 0);
                      const percentage = totalCount > 0 ? (data.count / totalCount) * 100 : 0;
                      let indicatorColor: string;
                      switch (index) {
                        case 0:
                          indicatorColor = "bg-purple-500";
                          break;
                        case 1:
                          indicatorColor = "bg-gray-500";
                          break;
                        case 2:
                          indicatorColor = "bg-purple-400";
                          break;
                        case 3:
                          indicatorColor = "bg-cyan-500";
                          break;
                        default:
                          indicatorColor = "bg-slate-500";
                          break;
                      }
                      return (
                        <div key={index}>
                          <p className="text-sm text-foreground">{data.name}</p>
                          <div className="flex gap-2 items-center justify-between">
                            <Progress
                              className="bg-transparent"
                              indicatorClassName={indicatorColor}
                              value={percentage}
                            />
                            <p className="text-sm text-muted-foreground">{percentage.toFixed(2)}%</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{lang.text('noReport')}</p>
              )}
            </CardContent>
          </Card>

          {/* Right - Map */}
          <Card className="w-[70%]">
            <CardContent className="p-0 h-full">
              <div className="relative rounded-lg border border-border h-full overflow-hidden">
                <div className="absolute right-4 top-4 z-[11] flex items-center gap-2">
                  <Input
                    placeholder={lang.text('searchLocation')}
                    value={searchLocation || ""}
                    onChange={(e) => setSearchLocation(String(e.target?.value))}
                    className="sm:max-w-[300px] flex-1"
                  />
                  <Button
                    variant={activeLineMarker ? "default" : "outline"}
                    onClick={() => setActiveLineMarker(!activeLineMarker)}
                    className={`flex items-center justify-center w-[38px] h-[38px] ${
                      activeLineMarker ? 'bg-blue-500 text-white' : 'text-foreground'
                    }`}
                    title="line-marker"
                  >
                    <FaGripLines className="text-sm" />
                  </Button>
                  {/* <RegionDropdown regions={regions} toggleRegion={toggleRegion} /> */}
                </div>
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
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution={'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'}
                  />
                  {schoolData && schoolData.length > 0
                    ? schoolData
                        .filter((data: any) => {
                          if (searchLocation && searchLocation !== '') {
                            return (data.namaSekolah.toLowerCase()).includes(searchLocation.toLowerCase());
                          }
                          return true;
                        })
                        .map((school, index) => (
                          <Marker
                            icon={PurpleCircleIcon}
                            key={schools.data[index].id || index}
                            position={[school.lat, school.lng]}
                          >
                            <Popup>
                              <strong>{school.namaSekolah}</strong> <br />
                              {school.alamatSekolah || "Alamat belum ditentukan"}
                            </Popup>
                          </Marker>
                        ))
                    : null}
                  {activeLineMarker && <Polyline positions={lineMarkers} color="#008ada" />}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};