import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Geopoint } from "../../codegen/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import "leaflet/dist/leaflet.css";

// Fix for default markers not showing up
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface AreaMapPickerProps {
  value: Geopoint[];
  onChange: (geopoints: Geopoint[]) => void;
}

// Almaty city coordinates
const almaty_center: Geopoint = { lat: 43.222, lng: 76.8512 };

interface MapDrawHandlerProps {
  polygon_points: Geopoint[];
  set_polygon_points: (points: Geopoint[]) => void;
  is_drawing: boolean;
}

function MapDrawHandler({ polygon_points, set_polygon_points, is_drawing }: MapDrawHandlerProps) {
  useMapEvents({
    click(event) {
      if (!is_drawing) return;
      
      const { lat, lng } = event.latlng;
      const new_point = { lat, lng };
      
      set_polygon_points([...polygon_points, new_point]);
    },
  });
  
  return null;
}

function AreaMapContent({ 
  polygon_points, 
  set_polygon_points,
  is_drawing,
  set_is_drawing 
}: {
  polygon_points: Geopoint[];
  set_polygon_points: (points: Geopoint[]) => void;
  is_drawing: boolean;
  set_is_drawing: (drawing: boolean) => void;
}) {
  const handle_clear_area = () => {
    set_polygon_points([]);
    set_is_drawing(false);
  };

  const handle_start_drawing = () => {
    set_polygon_points([]);
    set_is_drawing(true);
  };

  const handle_finish_drawing = () => {
    set_is_drawing(false);
  };

  // Convert Geopoint[] to LatLngTuple[] for react-leaflet
  const polygon_positions: [number, number][] = polygon_points.map(point => [point.lat, point.lng]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Map Controls */}
      <div className="flex gap-2 p-3 bg-white border-b z-10 relative">
        <Button
          variant={is_drawing ? "default" : "outline"}
          size="sm"
          onClick={handle_start_drawing}
          disabled={is_drawing}
        >
          <i className="bx bx-edit-alt mr-2"></i>
          {is_drawing ? "Drawing..." : "Start Drawing"}
        </Button>
        
        {is_drawing && polygon_points.length >= 3 && (
          <Button
            variant="default"
            size="sm"
            onClick={handle_finish_drawing}
          >
            <i className="bx bx-check mr-2"></i>
            Finish Area
          </Button>
        )}
        
        {polygon_points.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handle_clear_area}
          >
            <i className="bx bx-trash mr-2"></i>
            Clear
          </Button>
        )}
        
        <div className="ml-auto text-sm text-muted-foreground flex items-center">
          {is_drawing ? (
            <>
              <i className="bx bx-info-circle mr-1"></i>
              Click on map to add points. Need at least 3 points to create area.
            </>
          ) : polygon_points.length > 0 ? (
            <>
              <i className="bx bx-check-circle mr-1 text-green-600"></i>
              Area selected ({polygon_points.length} points)
            </>
          ) : (
            <>
              <i className="bx bx-map mr-1"></i>
              Click "Start Drawing" to select an area
            </>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer 
          center={[almaty_center.lat, almaty_center.lng]} 
          zoom={13} 
          className="h-full w-full"
          style={{ height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Draw the polygon if we have enough points */}
          {polygon_points.length >= 3 && (
            <Polygon
              positions={polygon_positions}
              pathOptions={{
                color: 'blue',
                fillColor: 'lightblue',
                fillOpacity: 0.3,
                weight: 2,
              }}
            />
          )}
          
          {/* Draw temporary lines for incomplete polygon */}
          {is_drawing && polygon_points.length >= 2 && (
            <Polygon
              positions={polygon_positions}
              pathOptions={{
                color: 'gray',
                fillOpacity: 0,
                weight: 1,
                dashArray: '5, 5',
              }}
            />
          )}
          
          <MapDrawHandler 
            polygon_points={polygon_points}
            set_polygon_points={set_polygon_points}
            is_drawing={is_drawing}
          />
        </MapContainer>
      </div>
    </div>
  );
}

export function AreaMapPicker({ value, onChange }: AreaMapPickerProps) {
  const [is_dialog_open, set_is_dialog_open] = useState(false);
  const [temp_polygon_points, set_temp_polygon_points] = useState<Geopoint[]>([]);
  const [is_drawing, set_is_drawing] = useState(false);

  // Initialize temp points when dialog opens
  useEffect(() => {
    if (is_dialog_open) {
      set_temp_polygon_points(value || []);
      set_is_drawing(false);
    }
  }, [is_dialog_open, value]);

  const handle_save_area = () => {
    onChange(temp_polygon_points);
    set_is_dialog_open(false);
  };

  const handle_cancel = () => {
    set_temp_polygon_points(value || []);
    set_is_drawing(false);
    set_is_dialog_open(false);
  };

  const has_valid_area = temp_polygon_points.length >= 3;
  const has_current_area = value && value.length >= 3;

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={() => set_is_dialog_open(true)}
        className="w-full justify-start"
      >
        <i className="bx bx-map mr-2"></i>
        {has_current_area 
          ? `Area Selected (${value.length} points)` 
          : "Choose Area"
        }
      </Button>
      
      {has_current_area && (
        <div className="text-xs text-muted-foreground">
          Geographic area filter is active
        </div>
      )}

      <Dialog open={is_dialog_open} onOpenChange={set_is_dialog_open}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] h-[80vh] w-[90vw] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Select Geographic Area</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 px-6">
            <AreaMapContent
              polygon_points={temp_polygon_points}
              set_polygon_points={set_temp_polygon_points}
              is_drawing={is_drawing}
              set_is_drawing={set_is_drawing}
            />
          </div>

          <DialogFooter className="p-6 pt-0">
            <DialogClose asChild>
              <Button variant="outline" onClick={handle_cancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handle_save_area}
              disabled={!has_valid_area}
            >
              <i className="bx bx-check mr-2"></i>
              Apply Area Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}