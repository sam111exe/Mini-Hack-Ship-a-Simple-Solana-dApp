import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Geopoint } from "../../codegen/types";
import "leaflet/dist/leaflet.css";

// Fix for default markers not showing up
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapPickerProps {
  value: Geopoint;
  onChange: (geopoint: Geopoint) => void;
}

// Almaty city coordinates
const almaty_center: Geopoint = { lat: 43.222, lng: 76.8512 };

function MapClickHandler({ onChange }: { onChange: (geopoint: Geopoint) => void }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onChange({ lat, lng });
    },
  });
  return null;
}

export function MapPicker({ value, onChange }: MapPickerProps) {
  const [map_position, set_map_position] = useState<Geopoint>(value || almaty_center);

  useEffect(() => {
    if (value) {
      set_map_position(value);
    }
  }, [value]);

  const handle_position_change = (new_position: Geopoint) => {
    set_map_position(new_position);
    onChange(new_position);
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border">
      <MapContainer center={[map_position.lat, map_position.lng]} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[map_position.lat, map_position.lng]} />
        <MapClickHandler onChange={handle_position_change} />
      </MapContainer>
    </div>
  );
}
