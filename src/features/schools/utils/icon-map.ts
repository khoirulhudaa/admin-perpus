// Impor ikon untuk setiap wilayah
import centralIcon from "/central.png";
import southIcon from "/south.png";
import northIcon from "/north.png";
import westIcon from "/west.png";
import eastIcon from "/east.png";
import otherIcon from "/other.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

// Definisikan ikon untuk setiap wilayah
export const regionIcons: Record<string, L.Icon> = {
  central: L.icon({
    iconUrl: centralIcon,
    shadowUrl: markerShadow,
    iconSize: [32, 32],
    iconAnchor: [16, 32], // Sesuaikan anchor agar ikon terpusat
  }),
  south: L.icon({
    iconUrl: southIcon,
    shadowUrl: markerShadow,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  north: L.icon({
    iconUrl: northIcon,
    shadowUrl: markerShadow,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  west: L.icon({
    iconUrl: westIcon,
    shadowUrl: markerShadow,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  east: L.icon({
    iconUrl: eastIcon,
    shadowUrl: markerShadow,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  other: L.icon({
    iconUrl: otherIcon,
    shadowUrl: markerShadow,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
};