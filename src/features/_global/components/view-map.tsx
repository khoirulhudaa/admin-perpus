import { LatLngLiteral } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // Import Leaflet to create the custom icon

export interface ViewMapProps {
  position?: LatLngLiteral;
  label?: React.ReactNode;
  zoom?: number;
  markerContent?: React.ReactNode;
}

export const ViewMap = ({ zoom = 13, ...props }: ViewMapProps) => {

  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", // Default Leaflet marker icon
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png", // Shadow image
    shadowSize: [41, 41], // Size of the shadow
  });
  
  const PurpleCircleIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div class="w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });

  return (
    <div className="z-[11] w-full aspect-video relative mb-2">
      <MapContainer
        center={props.position}
        zoom={zoom}
        scrollWheelZoom={false}
        className="aspect-video w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {props.position && (
          <Marker position={props.position} icon={customIcon || PurpleCircleIcon}>
            <Popup>{props.markerContent || "-"}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};


// const WarningCircleIcon = L.divIcon({
//   className: "custom-div-icon",
//   html: `<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>`,
//   iconSize: [16, 16],
//   iconAnchor: [8, 8],
//   popupAnchor: [0, -8],
// });