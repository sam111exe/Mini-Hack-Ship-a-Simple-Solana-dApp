import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RealAssetType, type RealAssetPublic } from "@/codegen";

interface PropertyDetailsFormProps {
  asset_type: RealAssetType;
  assetData: RealAssetPublic;
  onAssetDataChange: (asset: RealAssetPublic) => void;
}

export function PropertyDetailsForm({ asset_type, assetData, onAssetDataChange }: PropertyDetailsFormProps) {
  const get_parameter_value = (name: string) => {
    const param = assetData.parameters?.find((p) => p.name === name);
    return param?.value || "";
  };

  const update_parameter = (name: string, value: string) => {
    const existing_params = assetData.parameters || [];
    const param_index = existing_params.findIndex((p) => p.name === name);

    let new_params;
    if (param_index >= 0) {
      new_params = [...existing_params];
      new_params[param_index] = { name, value };
    } else {
      new_params = [...existing_params, { name, value }];
    }

    onAssetDataChange({ ...assetData, parameters: new_params });
  };

  const render_apartment_fields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="rooms">Rooms</Label>
        <Input
          id="rooms"
          type="number"
          value={get_parameter_value("rooms")}
          onChange={(e) => update_parameter("rooms", e.target.value)}
          placeholder="Number of rooms"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <Input
          id="bedrooms"
          type="number"
          value={get_parameter_value("bedrooms")}
          onChange={(e) => update_parameter("bedrooms", e.target.value)}
          placeholder="Number of bedrooms"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bathrooms">Bathrooms</Label>
        <Input
          id="bathrooms"
          type="number"
          value={get_parameter_value("bathrooms")}
          onChange={(e) => update_parameter("bathrooms", e.target.value)}
          placeholder="Number of bathrooms"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="area">Area (m²)</Label>
        <Input
          id="area"
          type="number"
          value={get_parameter_value("area")}
          onChange={(e) => update_parameter("area", e.target.value)}
          placeholder="Area in square meters"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="floor">Floor</Label>
        <Input
          id="floor"
          type="number"
          value={get_parameter_value("floor")}
          onChange={(e) => update_parameter("floor", e.target.value)}
          placeholder="Floor number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_floors">Total Floors</Label>
        <Input
          id="total_floors"
          type="number"
          value={get_parameter_value("total_floors")}
          onChange={(e) => update_parameter("total_floors", e.target.value)}
          placeholder="Total floors in building"
        />
      </div>
    </>
  );

  const render_house_fields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="rooms">Rooms</Label>
        <Input
          id="rooms"
          type="number"
          value={get_parameter_value("rooms")}
          onChange={(e) => update_parameter("rooms", e.target.value)}
          placeholder="Number of rooms"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <Input
          id="bedrooms"
          type="number"
          value={get_parameter_value("bedrooms")}
          onChange={(e) => update_parameter("bedrooms", e.target.value)}
          placeholder="Number of bedrooms"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bathrooms">Bathrooms</Label>
        <Input
          id="bathrooms"
          type="number"
          value={get_parameter_value("bathrooms")}
          onChange={(e) => update_parameter("bathrooms", e.target.value)}
          placeholder="Number of bathrooms"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="area">Area (m²)</Label>
        <Input
          id="area"
          type="number"
          value={get_parameter_value("area")}
          onChange={(e) => update_parameter("area", e.target.value)}
          placeholder="Area in square meters"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="floors">Floors</Label>
        <Input
          id="floors"
          type="number"
          value={get_parameter_value("floors")}
          onChange={(e) => update_parameter("floors", e.target.value)}
          placeholder="Number of floors"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="garage_spaces">Garage Spaces</Label>
        <Input
          id="garage_spaces"
          type="number"
          value={get_parameter_value("garage_spaces")}
          onChange={(e) => update_parameter("garage_spaces", e.target.value)}
          placeholder="Number of garage spaces"
        />
      </div>
    </>
  );

  const render_garage_fields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="area">Area (m²)</Label>
        <Input
          id="area"
          type="number"
          value={get_parameter_value("area")}
          onChange={(e) => update_parameter("area", e.target.value)}
          placeholder="Area in square meters"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicle_capacity">Vehicle Capacity</Label>
        <Input
          id="vehicle_capacity"
          type="number"
          value={get_parameter_value("vehicle_capacity")}
          onChange={(e) => update_parameter("vehicle_capacity", e.target.value)}
          placeholder="Number of vehicles"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="height">Height (m)</Label>
        <Input
          id="height"
          type="number"
          step="0.1"
          value={get_parameter_value("height")}
          onChange={(e) => update_parameter("height", e.target.value)}
          placeholder="Height in meters"
        />
      </div>
    </>
  );

  const render_parking_fields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="spaces">Parking Spaces</Label>
        <Input
          id="spaces"
          type="number"
          value={get_parameter_value("spaces")}
          onChange={(e) => update_parameter("spaces", e.target.value)}
          placeholder="Number of parking spaces"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="area">Area (m²)</Label>
        <Input
          id="area"
          type="number"
          value={get_parameter_value("area")}
          onChange={(e) => update_parameter("area", e.target.value)}
          placeholder="Area in square meters"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parking_type">Parking Type</Label>
        <Input
          id="parking_type"
          value={get_parameter_value("parking_type")}
          onChange={(e) => update_parameter("parking_type", e.target.value)}
          placeholder="e.g., covered, underground, surface"
        />
      </div>
    </>
  );

  const render_land_fields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="area">Area (m²)</Label>
        <Input
          id="area"
          type="number"
          value={get_parameter_value("area")}
          onChange={(e) => update_parameter("area", e.target.value)}
          placeholder="Area in square meters"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="zoning">Zoning</Label>
        <Input
          id="zoning"
          value={get_parameter_value("zoning")}
          onChange={(e) => update_parameter("zoning", e.target.value)}
          placeholder="e.g., residential, commercial, agricultural"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="topography">Topography</Label>
        <Input
          id="topography"
          value={get_parameter_value("topography")}
          onChange={(e) => update_parameter("topography", e.target.value)}
          placeholder="e.g., flat, sloped, hilly"
        />
      </div>
    </>
  );

  const render_commercial_fields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="area">Area (m²)</Label>
        <Input
          id="area"
          type="number"
          value={get_parameter_value("area")}
          onChange={(e) => update_parameter("area", e.target.value)}
          placeholder="Area in square meters"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="floor">Floor</Label>
        <Input
          id="floor"
          type="number"
          value={get_parameter_value("floor")}
          onChange={(e) => update_parameter("floor", e.target.value)}
          placeholder="Floor number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="office_spaces">Office Spaces</Label>
        <Input
          id="office_spaces"
          type="number"
          value={get_parameter_value("office_spaces")}
          onChange={(e) => update_parameter("office_spaces", e.target.value)}
          placeholder="Number of office spaces"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conference_rooms">Conference Rooms</Label>
        <Input
          id="conference_rooms"
          type="number"
          value={get_parameter_value("conference_rooms")}
          onChange={(e) => update_parameter("conference_rooms", e.target.value)}
          placeholder="Number of conference rooms"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parking_spaces">Parking Spaces</Label>
        <Input
          id="parking_spaces"
          type="number"
          value={get_parameter_value("parking_spaces")}
          onChange={(e) => update_parameter("parking_spaces", e.target.value)}
          placeholder="Number of parking spaces"
        />
      </div>
    </>
  );

  const render_business_fields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="area">Area (m²)</Label>
        <Input
          id="area"
          type="number"
          value={get_parameter_value("area")}
          onChange={(e) => update_parameter("area", e.target.value)}
          placeholder="Area in square meters"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="business_type">Business Type</Label>
        <Input
          id="business_type"
          value={get_parameter_value("business_type")}
          onChange={(e) => update_parameter("business_type", e.target.value)}
          placeholder="e.g., restaurant, retail, service"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seating_capacity">Seating Capacity</Label>
        <Input
          id="seating_capacity"
          type="number"
          value={get_parameter_value("seating_capacity")}
          onChange={(e) => update_parameter("seating_capacity", e.target.value)}
          placeholder="Customer seating capacity"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="annual_revenue">Annual Revenue ($)</Label>
        <Input
          id="annual_revenue"
          type="number"
          value={get_parameter_value("annual_revenue")}
          onChange={(e) => update_parameter("annual_revenue", e.target.value)}
          placeholder="Annual revenue"
        />
      </div>
    </>
  );

  const render_industrial_fields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="area">Area (m²)</Label>
        <Input
          id="area"
          type="number"
          value={get_parameter_value("area")}
          onChange={(e) => update_parameter("area", e.target.value)}
          placeholder="Area in square meters"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ceiling_height">Ceiling Height (m)</Label>
        <Input
          id="ceiling_height"
          type="number"
          step="0.1"
          value={get_parameter_value("ceiling_height")}
          onChange={(e) => update_parameter("ceiling_height", e.target.value)}
          placeholder="Ceiling height in meters"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="loading_docks">Loading Docks</Label>
        <Input
          id="loading_docks"
          type="number"
          value={get_parameter_value("loading_docks")}
          onChange={(e) => update_parameter("loading_docks", e.target.value)}
          placeholder="Number of loading docks"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="crane_capacity">Crane Capacity (tons)</Label>
        <Input
          id="crane_capacity"
          type="number"
          value={get_parameter_value("crane_capacity")}
          onChange={(e) => update_parameter("crane_capacity", e.target.value)}
          placeholder="Crane capacity in tons"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="power_supply">Power Supply (kW)</Label>
        <Input
          id="power_supply"
          type="number"
          value={get_parameter_value("power_supply")}
          onChange={(e) => update_parameter("power_supply", e.target.value)}
          placeholder="Power supply in kilowatts"
        />
      </div>
    </>
  );

  const render_fields_by_type = () => {
    switch (asset_type) {
      case RealAssetType.Apartment:
        return render_apartment_fields();
      case RealAssetType.House:
        return render_house_fields();
      case RealAssetType.Garage:
        return render_garage_fields();
      case RealAssetType.Parking:
        return render_parking_fields();
      case RealAssetType.Land:
        return render_land_fields();
      case RealAssetType.Commercial:
        return render_commercial_fields();
      case RealAssetType.Business:
        return render_business_fields();
      case RealAssetType.Industrial:
        return render_industrial_fields();
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">{render_fields_by_type()}</div>
  );
}
