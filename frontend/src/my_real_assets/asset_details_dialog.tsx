import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RealAssetStatus, type RealAssetResolved } from "@/codegen";
import { get_status_label_text, get_real_asset_type_label_text, get_status_badge_variant, get_asset_type_icon } from "./utils";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AssetDetailsDialogProps {
  asset: RealAssetResolved | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PhotoCarouselProps {
  photos: string[];
}

function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [current_index, set_current_index] = useState(0);
  const [is_fullscreen, set_is_fullscreen] = useState(false);
  const [zoom_level, set_zoom_level] = useState(1);
  const [is_zoomed, set_is_zoomed] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <i className="bx bx-image text-5xl text-slate-400 mb-2"></i>
          <p className="text-slate-500 text-sm">No Images Available</p>
        </div>
      </div>
    );
  }

  const go_to_previous = () => {
    set_current_index((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const go_to_next = () => {
    set_current_index((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const zoom_in = () => {
    set_zoom_level((prev) => Math.min(prev + 0.5, 3));
    set_is_zoomed(true);
  };

  const zoom_out = () => {
    set_zoom_level((prev) => Math.max(prev - 0.5, 0.5));
    if (zoom_level <= 1) set_is_zoomed(false);
  };

  const reset_zoom = () => {
    set_zoom_level(1);
    set_is_zoomed(false);
  };

  const toggle_fullscreen = () => {
    set_is_fullscreen(!is_fullscreen);
  };

  const carousel_content = (
    <div className={`relative ${is_fullscreen ? 'fixed inset-0 z-[9999] bg-black flex items-center justify-center' : 'w-full h-96 bg-black rounded-lg overflow-hidden'}`}>
      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <img
          src={photos[current_index]}
          alt={`Photo ${current_index + 1}`}
          className={`max-w-full max-h-full object-contain transition-transform duration-300 ${is_zoomed ? 'cursor-move' : 'cursor-zoom-in'}`}
          style={{ transform: `scale(${zoom_level})` }}
          onClick={is_zoomed ? reset_zoom : zoom_in}
        />
        
        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={go_to_previous}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <i className="bx bx-chevron-left text-xl"></i>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={go_to_next}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <i className="bx bx-chevron-right text-xl"></i>
            </Button>
          </>
        )}

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={zoom_out}
            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
            disabled={zoom_level <= 0.5}
          >
            <i className="bx bx-minus text-lg"></i>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={zoom_in}
            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
            disabled={zoom_level >= 3}
          >
            <i className="bx bx-plus text-lg"></i>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={toggle_fullscreen}
            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
          >
            <i className={`bx ${is_fullscreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'} text-lg`}></i>
          </Button>
          {is_fullscreen && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => set_is_fullscreen(false)}
              className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <i className="bx bx-x text-lg"></i>
            </Button>
          )}
        </div>

        {/* Photo Counter */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {current_index + 1} / {photos.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {photos.length > 1 && !is_fullscreen && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => set_current_index(index)}
              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                index === current_index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
              }`}
            >
              <img src={photo} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return carousel_content;
}

interface PropertyMapProps {
  location: any;
  name: string;
}

function PropertyMap({ location, name }: PropertyMapProps) {
  if (!location || typeof location !== "object" || !location.lat || !location.lng) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-3">
            <i className="bx bx-map text-primary text-2xl"></i>
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full h-80 bg-slate-100 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <i className="bx bx-map text-4xl text-slate-400 mb-3"></i>
              <p className="text-slate-500">Location not available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const get_2gis_link = () => {
    return `https://2gis.kz/geo/9430150454182001/${location.lng}%2C${location.lat}?m=${location.lng}%2C${location.lat}%2F13`;
  };

  const get_google_maps_link = () => {
    return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  };

  const get_yandex_maps_link = () => {
    return `https://yandex.com/maps/?ll=${location.lng},${location.lat}&z=16&l=map`;
  };

  // Default to Almaty center if coordinates are invalid
  const map_center: [number, number] = [
    typeof location.lat === 'number' && !isNaN(location.lat) ? location.lat : 43.2220,
    typeof location.lng === 'number' && !isNaN(location.lng) ? location.lng : 76.8512
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-3">
          <i className="bx bx-map text-primary text-2xl"></i>
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="w-full h-80 rounded-xl overflow-hidden shadow-md">
          <MapContainer
            center={map_center}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={map_center}>
              <Popup>
                <div className="text-center p-2">
                  <h3 className="font-semibold text-slate-900 mb-1">{name}</h3>
                  <p className="text-xs text-slate-600">
                    {location.lat?.toFixed(6)}, {location.lng?.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <i className="bx bx-map-pin text-primary"></i>
              <span className="font-medium">Coordinates</span>
            </div>
            <p className="text-slate-700 font-mono">
              {location.lat?.toFixed(6)}, {location.lng?.toFixed(6)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button size="sm" variant="outline" className="w-full" asChild>
              <a href={get_2gis_link()} target="_blank" rel="noopener noreferrer">
                <i className="bx bx-map mr-2"></i>
                2GIS
                <i className="bx bx-link-external ml-1"></i>
              </a>
            </Button>
            <Button size="sm" variant="outline" className="w-full" asChild>
              <a href={get_google_maps_link()} target="_blank" rel="noopener noreferrer">
                <i className="bx bx-map mr-2"></i>
                Google Maps
                <i className="bx bx-link-external ml-1"></i>
              </a>
            </Button>
            <Button size="sm" variant="outline" className="w-full" asChild>
              <a href={get_yandex_maps_link()} target="_blank" rel="noopener noreferrer">
                <i className="bx bx-map mr-2"></i>
                Yandex Maps
                <i className="bx bx-link-external ml-1"></i>
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AssetDetailsDialog({ asset, open, onOpenChange }: AssetDetailsDialogProps) {
  if (!asset) return null;

  const format_date = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const get_parameter_value = (key: string) => {
    const param = asset.parameters?.find((p) => p.name === key);
    return param?.value;
  };

  const get_verification_badges = () => {
    const badges = [];
    if (asset.is_approved_by_gov) {
      badges.push(
        <Badge key="verified" variant="secondary" className="text-green-600 bg-green-50">
          <i className="bx bx-shield-check mr-1"></i>
          Government Verified
        </Badge>,
      );
    }
    if (asset.is_tokenized) {
      badges.push(
        <Badge key="tokenized" variant="secondary" className="text-blue-600 bg-blue-50">
          <i className="bx bx-coin-stack mr-1"></i>
          Tokenized
        </Badge>,
      );
    }
    return badges;
  };

  const render_property_details = () => {
    if (!asset.parameters || asset.parameters.length === 0) {
      return (
        <div className="text-center py-8">
          <i className="bx bx-info-circle text-3xl text-slate-400 mb-2"></i>
          <p className="text-slate-500">No property details available</p>
        </div>
      );
    }

    const grouped_params = asset.parameters.reduce((acc, param) => {
      const category = get_parameter_category(param.name);
      if (!acc[category]) acc[category] = [];
      acc[category].push(param);
      return acc;
    }, {} as Record<string, typeof asset.parameters>);

    return (
      <div className="space-y-6">
        {Object.entries(grouped_params).map(([category, params]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg capitalize">{category.replace('_', ' ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {params.map((param) => (
                  <div key={param.name} className="space-y-1">
                    <div className="text-sm font-medium text-slate-600 capitalize">
                      {param.name.replace(/_/g, ' ')}
                    </div>
                    <div className="text-base font-semibold">
                      {format_parameter_value(param.name, param.value)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const get_parameter_category = (param_name: string) => {
    const categories = {
      'basic_info': ['rooms', 'bedrooms', 'bathrooms', 'area', 'price'],
      'building_details': ['floor', 'total_floors', 'floors', 'ceiling_height', 'height'],
      'features': ['garage_spaces', 'parking_spaces', 'vehicle_capacity', 'lot_size'],
      'business': ['business_type', 'seating_capacity', 'annual_revenue', 'office_spaces', 'conference_rooms'],
      'industrial': ['loading_docks', 'crane_capacity', 'power_supply'],
      'land': ['zoning', 'topography', 'spaces', 'parking_type'],
    };

    for (const [category, params] of Object.entries(categories)) {
      if (params.includes(param_name)) return category;
    }
    return 'other';
  };

  const format_parameter_value = (name: string, value: string) => {
    if (!value) return 'N/A';
    
    switch (name) {
      case 'price':
      case 'annual_revenue':
        return `$${Number(value).toLocaleString()}`;
      case 'area':
      case 'lot_size':
        return `${value} m²`;
      case 'ceiling_height':
      case 'height':
        return `${value} m`;
      case 'crane_capacity':
        return `${value} tons`;
      case 'power_supply':
        return value;
      default:
        return value;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col bg-white p-0">
        <DialogHeader className="px-6 py-6 border-b flex-shrink-0 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <DialogTitle className="text-3xl font-bold text-slate-900 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <i className={`bx ${get_asset_type_icon(asset.asset_type)} text-2xl text-primary`}></i>
                </div>
                {asset.name}
              </DialogTitle>
              <div className="flex items-center gap-4">
                <Badge variant={get_status_badge_variant(asset.status)} className="text-sm px-3 py-1">
                  {get_status_label_text(asset.status)}
                </Badge>
                <span className="text-sm text-muted-foreground font-medium">
                  {get_real_asset_type_label_text(asset.asset_type)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Created {format_date(asset.created_at)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {get_verification_badges()}
              </div>
            </div>
            {get_parameter_value("price") && (
              <div className="text-right">
                <div className="text-4xl font-bold text-slate-900">
                  ${Number(get_parameter_value("price")).toLocaleString()}
                </div>
                {get_parameter_value("area") && (
                  <div className="text-sm text-slate-500 mt-1">
                    ${Math.round(
                      Number(get_parameter_value("price")) / (Number(get_parameter_value("area")) || 1),
                    ).toLocaleString()}/m²
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="px-6 py-8 space-y-12">
            {/* Hero Photo Gallery */}
            <section>
              <div className="h-96">
                <PhotoCarousel photos={asset.photo_list || []} />
              </div>
            </section>

            {/* Key Features Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {get_parameter_value("rooms") && (
                  <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:shadow-lg transition-shadow">
                    <i className="bx bx-door-open text-3xl text-primary mb-3"></i>
                    <div className="text-2xl font-bold text-slate-900">{get_parameter_value("rooms")}</div>
                    <div className="text-sm text-slate-600 mt-1">Rooms</div>
                  </div>
                )}
                {get_parameter_value("area") && (
                  <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:shadow-lg transition-shadow">
                    <i className="bx bx-expand text-3xl text-primary mb-3"></i>
                    <div className="text-2xl font-bold text-slate-900">{get_parameter_value("area")} m²</div>
                    <div className="text-sm text-slate-600 mt-1">Area</div>
                  </div>
                )}
                {get_parameter_value("floor") && (
                  <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:shadow-lg transition-shadow">
                    <i className="bx bx-building text-3xl text-primary mb-3"></i>
                    <div className="text-2xl font-bold text-slate-900">{get_parameter_value("floor")}</div>
                    <div className="text-sm text-slate-600 mt-1">Floor</div>
                  </div>
                )}
                {asset.photo_list && asset.photo_list.length > 0 && (
                  <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:shadow-lg transition-shadow">
                    <i className="bx bx-image text-3xl text-primary mb-3"></i>
                    <div className="text-2xl font-bold text-slate-900">{asset.photo_list.length}</div>
                    <div className="text-sm text-slate-600 mt-1">Photos</div>
                  </div>
                )}
              </div>
            </section>

            {/* Description Section */}
            {asset.description && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">About This Property</h2>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <p className="text-lg text-slate-700 leading-relaxed">{asset.description}</p>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Property Details Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Property Details</h2>
              <div className="space-y-6">
                {render_property_details()}
              </div>
            </section>

            {/* Location Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Location</h2>
              <PropertyMap location={asset.location} name={asset.name} />
            </section>

            {/* Government Comment Section */}
            {asset.gov_comment && asset.status === RealAssetStatus.RejectedByGov && (
              <section>
                <h2 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
                  <i className="bx bx-error-circle"></i>
                  Rejection Notice
                </h2>
                <Card className="border-red-200 bg-red-50 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-100 rounded-full">
                        <i className="bx bx-error-circle text-2xl text-red-600"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-red-800 mb-3">Reason for Rejection</h3>
                        <p className="text-red-800 leading-relaxed">{asset.gov_comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}