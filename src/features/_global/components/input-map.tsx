import {
  FormControl,
  FormItem,
  FormLabel,
  Input,
  Label,
  lang,
} from "@/core/libs";
import { Icon, LatLngLiteral, Map } from "leaflet";
import React, { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const DEFAULT_POSITION = {
  lat: -6.3252674,
  lng: 106.6460001,
} as LatLngLiteral;

const customIcon = new Icon({
  // Default Leaflet marker
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", 
  // Size of the icon
  iconSize: [25, 41], 
  // Anchor point (bottom center of the icon)
  iconAnchor: [12, 41], 
  // Popup position relative to the icon
  popupAnchor: [1, -34], 
  // Optional shadow
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png", 
  // Size of the shadow
  shadowSize: [41, 41], 
});

export type InputMapValue = LatLngLiteral;

export interface InputMapProps {
  value?: InputMapValue;
  label?: React.ReactNode;
  markerContent?: React.ReactNode;
  defaultValue?: InputMapValue;
  onChange?: (value: InputMapValue) => void;
}

export const InputMap = React.memo(
  ({
    value,
    defaultValue = DEFAULT_POSITION,
    onChange,
    label,
    markerContent,
  }: InputMapProps) => {
    const [map, setMap] = useState<Map | null>(null);

    const [position, setPosition] = useState(defaultValue);

    const onMove = useCallback(() => {
      if (map) {
        const center = map.getCenter();
        setPosition(center);
        onChange?.(center);
      }
    }, [map, onChange]);

    useEffect(() => {
      map?.on("move", onMove);
      return () => {
        map?.off("move", onMove);
      };
    }, [map, onMove]);

    useEffect(() => {
      if (
        value?.lat &&
        value?.lng &&
        position?.lat &&
        position?.lng &&
        position?.lat !== value?.lat &&
        position?.lng !== value?.lng
      ) {
        setPosition({ lat: value.lat, lng: value.lng });
        map?.setView({ lat: value.lat, lng: value.lng }, 20);
      }
    }, [value?.lat, value?.lng, map, position?.lat, position.lng]);

    const renderInput = () => {
      return (
        <div className="grid grid-cols-2 gap-4 mb-4 mt-4 pb-6">
          <FormItem>
            <FormLabel>{lang.text("latitude")}</FormLabel>
            <FormControl>
              <Input
                name="lat"
                placeholder={lang.text("latitude")}
                value={position.lat}
                disabled
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>{lang.text("longitude")}</FormLabel>
            <FormControl>
              <Input
                name="lon"
                placeholder={lang.text("longitude")}
                value={position.lng}
                disabled
              />
            </FormControl>
          </FormItem>
        </div>
      );
    };

    const renderMap = () => {
      return (
        <div>
          <Label className="mb-4 block">{label}</Label>
          <div className="w-full aspect-video rounded-xl overflow-hidden relative mb-2">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={false} 
              touchZoom={true} 
              zoomControl={true} 
              className="aspect-video w-full"
              ref={setMap}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={position} icon={customIcon}>
                <Popup>{markerContent || lang.text("howToUseMap")}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      );
    };

    return (
      <div className="relative w-full pt-4">
        {renderMap()}
        {renderInput()}
      </div>
    );
  },
);
