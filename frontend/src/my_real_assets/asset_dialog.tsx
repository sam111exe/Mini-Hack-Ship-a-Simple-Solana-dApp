import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RealAssetType, type RealAssetPublic, type RealAssetResolved } from "@/codegen";
import { MapPicker } from "@/components/custom/map_picker";
import { BulkUploader } from "@/components/custom/bulk_uploader";
import { PropertyDetailsForm } from "./property_details_form";
import { get_real_asset_type_label_text } from "./utils";

interface AssetDialogProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: RealAssetResolved | null;
  assetData: RealAssetPublic;
  onAssetDataChange: (asset: RealAssetPublic) => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
  trigger?: React.ReactNode;
}

export function AssetDialog({
  mode,
  open,
  onOpenChange,
  asset,
  assetData,
  onAssetDataChange,
  onSubmit,
  submitting,
  trigger,
}: AssetDialogProps) {
  const dialog_title = mode === "create" ? "Create New Real Asset" : "Edit Real Asset";
  const dialog_description =
    mode === "create"
      ? "Add a new real estate asset to your portfolio"
      : "Update your real estate asset information";
  const submit_button_text = mode === "create" ? "Create" : "Update Asset";
  const submitting_text = mode === "create" ? "Creating..." : "Updating...";

  const validate_required_fields = () => {
    // Basic information validation
    if (!assetData.name?.trim()) return false;
    if (!assetData.asset_type) return false;
    
    // Location validation
    if (!assetData.location || (!assetData.location.lat && !assetData.location.lng)) return false;
    
    // Images validation
    if (!assetData.photo_list || assetData.photo_list.length === 0) return false;
    
    // Property details validation - check if at least one parameter exists
    if (!assetData.parameters || assetData.parameters.length === 0) return false;
    
    // Check if at least one parameter has a value
    const has_filled_parameter = assetData.parameters.some(param => param.value?.trim());
    if (!has_filled_parameter) return false;
    
    return true;
  };

  const is_form_valid = validate_required_fields();

  const fill_test_data = () => {
    const locations = [
      { lat: 43.2220, lng: 76.8512 }, // Almaty center
      { lat: 43.2385, lng: 76.9062 }, // Medeu district
      { lat: 43.2565, lng: 76.9286 }, // Kok-Tobe area
      { lat: 43.2105, lng: 76.8405 }, // Al-Farabi avenue
      { lat: 43.2442, lng: 76.8794 }, // Samal district
      { lat: 43.1932, lng: 76.8295 }, // Auezov district
      { lat: 43.2851, lng: 76.9733 }, // Bostandyk district
      { lat: 43.2183, lng: 76.7925 }, // Turksib district
      { lat: 43.2267, lng: 76.9155 }, // Almalinskiy district
      { lat: 43.2078, lng: 76.8669 }  // Alatau district
    ];

    const test_data_sets = {
      [RealAssetType.Apartment]: [
        {
          name: "Luxury Downtown Apartment",
          description: "Modern 3-bedroom apartment in the heart of the city with stunning views and premium amenities.",
          parameters: [
            { name: "rooms", value: "3" }, { name: "bedrooms", value: "2" }, { name: "bathrooms", value: "2" },
            { name: "area", value: "120" }, { name: "floor", value: "15" }, { name: "total_floors", value: "25" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]
        },
        {
          name: "Cozy Studio Apartment",
          description: "Perfect studio for young professionals with modern furnishing and great location.",
          parameters: [
            { name: "rooms", value: "1" }, { name: "bedrooms", value: "1" }, { name: "bathrooms", value: "1" },
            { name: "area", value: "45" }, { name: "floor", value: "7" }, { name: "total_floors", value: "12" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]
        },
        {
          name: "Spacious Family Apartment",
          description: "Large 4-bedroom apartment perfect for families with balcony and storage space.",
          parameters: [
            { name: "rooms", value: "5" }, { name: "bedrooms", value: "4" }, { name: "bathrooms", value: "3" },
            { name: "area", value: "180" }, { name: "floor", value: "22" }, { name: "total_floors", value: "30" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"]
        },
        {
          name: "Modern Penthouse",
          description: "Exclusive penthouse with panoramic city views and luxury finishes throughout.",
          parameters: [
            { name: "rooms", value: "6" }, { name: "bedrooms", value: "3" }, { name: "bathrooms", value: "4" },
            { name: "area", value: "250" }, { name: "floor", value: "35" }, { name: "total_floors", value: "35" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800"]
        },
        {
          name: "Compact City Flat",
          description: "Efficient 2-bedroom apartment with smart design and convenient location.",
          parameters: [
            { name: "rooms", value: "2" }, { name: "bedrooms", value: "2" }, { name: "bathrooms", value: "1" },
            { name: "area", value: "75" }, { name: "floor", value: "5" }, { name: "total_floors", value: "9" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]
        },
        {
          name: "Executive Apartment",
          description: "High-end apartment with premium amenities and concierge services.",
          parameters: [
            { name: "rooms", value: "4" }, { name: "bedrooms", value: "3" }, { name: "bathrooms", value: "2" },
            { name: "area", value: "160" }, { name: "floor", value: "18" }, { name: "total_floors", value: "25" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800"]
        },
        {
          name: "Student Housing Unit",
          description: "Affordable apartment designed for students with study areas and shared facilities.",
          parameters: [
            { name: "rooms", value: "2" }, { name: "bedrooms", value: "1" }, { name: "bathrooms", value: "1" },
            { name: "area", value: "55" }, { name: "floor", value: "3" }, { name: "total_floors", value: "6" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"]
        },
        {
          name: "Luxury Loft Apartment",
          description: "Contemporary loft with high ceilings and industrial design elements.",
          parameters: [
            { name: "rooms", value: "3" }, { name: "bedrooms", value: "2" }, { name: "bathrooms", value: "2" },
            { name: "area", value: "140" }, { name: "floor", value: "12" }, { name: "total_floors", value: "15" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800", "https://images.unsplash.com/photo-1556909114-4f6e5cce862a?w=800"]
        },
        {
          name: "Garden View Apartment",
          description: "Peaceful apartment overlooking beautiful gardens with natural light.",
          parameters: [
            { name: "rooms", value: "3" }, { name: "bedrooms", value: "2" }, { name: "bathrooms", value: "2" },
            { name: "area", value: "110" }, { name: "floor", value: "2" }, { name: "total_floors", value: "8" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"]
        },
        {
          name: "City Center Duplex",
          description: "Two-level apartment in prime location with modern amenities and parking.",
          parameters: [
            { name: "rooms", value: "5" }, { name: "bedrooms", value: "3" }, { name: "bathrooms", value: "3" },
            { name: "area", value: "200" }, { name: "floor", value: "10" }, { name: "total_floors", value: "20" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800", "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800"]
        }
      ],

      [RealAssetType.House]: [
        {
          name: "Family House with Garden",
          description: "Spacious family house with large garden, perfect for families with children.",
          parameters: [
            { name: "rooms", value: "6" }, { name: "bedrooms", value: "4" }, { name: "bathrooms", value: "3" },
            { name: "area", value: "250" }, { name: "lot_size", value: "800" }, { name: "floors", value: "2" }, { name: "garage_spaces", value: "2" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800"]
        },
        {
          name: "Mountain View Villa",
          description: "Luxury villa with stunning mountain views and premium finishes throughout.",
          parameters: [
            { name: "rooms", value: "8" }, { name: "bedrooms", value: "5" }, { name: "bathrooms", value: "4" },
            { name: "area", value: "400" }, { name: "lot_size", value: "1200" }, { name: "floors", value: "3" }, { name: "garage_spaces", value: "3" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"]
        },
        {
          name: "Cozy Cottage",
          description: "Charming cottage with rustic features and peaceful surroundings.",
          parameters: [
            { name: "rooms", value: "4" }, { name: "bedrooms", value: "2" }, { name: "bathrooms", value: "2" },
            { name: "area", value: "120" }, { name: "lot_size", value: "600" }, { name: "floors", value: "1" }, { name: "garage_spaces", value: "1" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"]
        },
        {
          name: "Modern Smart Home",
          description: "High-tech home with smart automation and energy-efficient systems.",
          parameters: [
            { name: "rooms", value: "7" }, { name: "bedrooms", value: "4" }, { name: "bathrooms", value: "3" },
            { name: "area", value: "320" }, { name: "lot_size", value: "900" }, { name: "floors", value: "2" }, { name: "garage_spaces", value: "2" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800"]
        },
        {
          name: "Historic Mansion",
          description: "Beautifully restored historic mansion with original architectural details.",
          parameters: [
            { name: "rooms", value: "12" }, { name: "bedrooms", value: "6" }, { name: "bathrooms", value: "5" },
            { name: "area", value: "600" }, { name: "lot_size", value: "2000" }, { name: "floors", value: "3" }, { name: "garage_spaces", value: "4" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1605276373954-0c4a0dac5d42?w=800", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"]
        },
        {
          name: "Suburban Ranch",
          description: "Single-story ranch home with open floor plan and covered patio.",
          parameters: [
            { name: "rooms", value: "5" }, { name: "bedrooms", value: "3" }, { name: "bathrooms", value: "2" },
            { name: "area", value: "180" }, { name: "lot_size", value: "700" }, { name: "floors", value: "1" }, { name: "garage_spaces", value: "2" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1599423300746-b62533397364?w=800"]
        },
        {
          name: "Eco-Friendly Home",
          description: "Sustainable home with solar panels and green building materials.",
          parameters: [
            { name: "rooms", value: "6" }, { name: "bedrooms", value: "3" }, { name: "bathrooms", value: "3" },
            { name: "area", value: "220" }, { name: "lot_size", value: "750" }, { name: "floors", value: "2" }, { name: "garage_spaces", value: "1" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800", "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800"]
        },
        {
          name: "Lakefront Property",
          description: "Stunning lakefront home with private dock and water views.",
          parameters: [
            { name: "rooms", value: "7" }, { name: "bedrooms", value: "4" }, { name: "bathrooms", value: "4" },
            { name: "area", value: "350" }, { name: "lot_size", value: "1500" }, { name: "floors", value: "2" }, { name: "garage_spaces", value: "3" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800", "https://images.unsplash.com/photo-1600563438938-a42ab5c9d1cc?w=800"]
        },
        {
          name: "Urban Townhouse",
          description: "Contemporary townhouse in trendy neighborhood with rooftop terrace.",
          parameters: [
            { name: "rooms", value: "5" }, { name: "bedrooms", value: "3" }, { name: "bathrooms", value: "3" },
            { name: "area", value: "190" }, { name: "lot_size", value: "200" }, { name: "floors", value: "3" }, { name: "garage_spaces", value: "1" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"]
        },
        {
          name: "Country Estate",
          description: "Grand country estate with extensive grounds and guest quarters.",
          parameters: [
            { name: "rooms", value: "15" }, { name: "bedrooms", value: "8" }, { name: "bathrooms", value: "6" },
            { name: "area", value: "800" }, { name: "lot_size", value: "5000" }, { name: "floors", value: "3" }, { name: "garage_spaces", value: "6" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800"]
        }
      ],

      [RealAssetType.Commercial]: [
        {
          name: "Modern Office Space",
          description: "Premium office space in business district with modern facilities and parking.",
          parameters: [
            { name: "area", value: "500" }, { name: "floor", value: "8" }, { name: "office_spaces", value: "12" },
            { name: "conference_rooms", value: "3" }, { name: "parking_spaces", value: "20" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"]
        },
        {
          name: "Retail Shopping Center",
          description: "Prime retail location with high foot traffic and excellent visibility.",
          parameters: [
            { name: "area", value: "2000" }, { name: "floor", value: "1" }, { name: "office_spaces", value: "2" },
            { name: "conference_rooms", value: "1" }, { name: "parking_spaces", value: "80" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800", "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800"]
        },
        {
          name: "Corporate Headquarters",
          description: "Prestigious corporate building with executive suites and amenities.",
          parameters: [
            { name: "area", value: "1500" }, { name: "floor", value: "15" }, { name: "office_spaces", value: "30" },
            { name: "conference_rooms", value: "8" }, { name: "parking_spaces", value: "60" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800"]
        },
        {
          name: "Medical Office Building",
          description: "Professional medical facility with specialized infrastructure and parking.",
          parameters: [
            { name: "area", value: "800" }, { name: "floor", value: "3" }, { name: "office_spaces", value: "15" },
            { name: "conference_rooms", value: "2" }, { name: "parking_spaces", value: "40" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800"]
        },
        {
          name: "Tech Hub Workspace",
          description: "Modern tech workspace with open floor plans and collaborative areas.",
          parameters: [
            { name: "area", value: "1200" }, { name: "floor", value: "12" }, { name: "office_spaces", value: "20" },
            { name: "conference_rooms", value: "6" }, { name: "parking_spaces", value: "50" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800", "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800"]
        },
        {
          name: "Executive Business Center",
          description: "High-end business center with concierge services and premium amenities.",
          parameters: [
            { name: "area", value: "600" }, { name: "floor", value: "20" }, { name: "office_spaces", value: "18" },
            { name: "conference_rooms", value: "4" }, { name: "parking_spaces", value: "30" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1521790361543-f645cf042ec4?w=800"]
        },
        {
          name: "Creative Studio Complex",
          description: "Artistic workspace with high ceilings and natural light for creative professionals.",
          parameters: [
            { name: "area", value: "900" }, { name: "floor", value: "2" }, { name: "office_spaces", value: "8" },
            { name: "conference_rooms", value: "2" }, { name: "parking_spaces", value: "25" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800", "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=800"]
        },
        {
          name: "Banking Branch Office",
          description: "Professional banking facility with security features and customer areas.",
          parameters: [
            { name: "area", value: "400" }, { name: "floor", value: "1" }, { name: "office_spaces", value: "6" },
            { name: "conference_rooms", value: "2" }, { name: "parking_spaces", value: "15" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800"]
        },
        {
          name: "Coworking Space",
          description: "Flexible coworking environment with hot desks and private offices.",
          parameters: [
            { name: "area", value: "700" }, { name: "floor", value: "5" }, { name: "office_spaces", value: "25" },
            { name: "conference_rooms", value: "5" }, { name: "parking_spaces", value: "20" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800", "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800"]
        },
        {
          name: "Legal Firm Offices",
          description: "Professional law office building with meeting rooms and client areas.",
          parameters: [
            { name: "area", value: "1000" }, { name: "floor", value: "18" }, { name: "office_spaces", value: "22" },
            { name: "conference_rooms", value: "6" }, { name: "parking_spaces", value: "45" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800", "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=800"]
        }
      ],

      [RealAssetType.Land]: [
        {
          name: "Development Land Plot",
          description: "Prime development land in growing area, perfect for residential or commercial development.",
          parameters: [
            { name: "area", value: "5000" }, { name: "zoning", value: "residential" }, { name: "topography", value: "flat" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"]
        },
        {
          name: "Agricultural Farmland",
          description: "Fertile agricultural land with irrigation systems and farm infrastructure.",
          parameters: [
            { name: "area", value: "50000" }, { name: "zoning", value: "agricultural" }, { name: "topography", value: "rolling" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800", "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800"]
        },
        {
          name: "Commercial Development Site",
          description: "Strategic commercial land with highway access and utilities available.",
          parameters: [
            { name: "area", value: "15000" }, { name: "zoning", value: "commercial" }, { name: "topography", value: "flat" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1502780402662-acc01917669e?w=800"]
        },
        {
          name: "Recreational Land",
          description: "Beautiful recreational property with lake access and mountain views.",
          parameters: [
            { name: "area", value: "25000" }, { name: "zoning", value: "recreational" }, { name: "topography", value: "mountainous" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"]
        },
        {
          name: "Industrial Zone Plot",
          description: "Large industrial land with rail access and heavy utility infrastructure.",
          parameters: [
            { name: "area", value: "100000" }, { name: "zoning", value: "industrial" }, { name: "topography", value: "flat" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1535966043808-8f0a0c7ca39b?w=800"]
        },
        {
          name: "Suburban Lot",
          description: "Ready-to-build residential lot in established suburban neighborhood.",
          parameters: [
            { name: "area", value: "1200" }, { name: "zoning", value: "residential" }, { name: "topography", value: "flat" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=800"]
        },
        {
          name: "Waterfront Property",
          description: "Premium waterfront land with private beach access and development potential.",
          parameters: [
            { name: "area", value: "8000" }, { name: "zoning", value: "residential" }, { name: "topography", value: "sloped" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800"]
        },
        {
          name: "Forest Conservation Land",
          description: "Protected forest land with conservation easements and timber value.",
          parameters: [
            { name: "area", value: "200000" }, { name: "zoning", value: "conservation" }, { name: "topography", value: "mountainous" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800", "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800"]
        },
        {
          name: "Mixed-Use Development",
          description: "Large mixed-use zoned land perfect for residential and commercial development.",
          parameters: [
            { name: "area", value: "30000" }, { name: "zoning", value: "mixed_use" }, { name: "topography", value: "flat" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"]
        },
        {
          name: "Urban Infill Lot",
          description: "Downtown infill opportunity with excellent access to public transportation.",
          parameters: [
            { name: "area", value: "800" }, { name: "zoning", value: "mixed_use" }, { name: "topography", value: "flat" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800"]
        }
      ],

      [RealAssetType.Garage]: [
        {
          name: "Underground Parking Garage",
          description: "Secure underground garage with automatic gates and surveillance.",
          parameters: [
            { name: "area", value: "25" }, { name: "vehicle_capacity", value: "1" }, { name: "height", value: "2.2" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"]
        },
        {
          name: "Double Car Garage",
          description: "Spacious double garage with storage space and workbench area.",
          parameters: [
            { name: "area", value: "50" }, { name: "vehicle_capacity", value: "2" }, { name: "height", value: "2.5" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800"]
        },
        {
          name: "Commercial Vehicle Garage",
          description: "Large garage suitable for commercial vehicles and equipment storage.",
          parameters: [
            { name: "area", value: "80" }, { name: "vehicle_capacity", value: "1" }, { name: "height", value: "3.5" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800"]
        },
        {
          name: "Luxury Car Storage",
          description: "Climate-controlled luxury car storage with security systems.",
          parameters: [
            { name: "area", value: "35" }, { name: "vehicle_capacity", value: "1" }, { name: "height", value: "2.8" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1549924231-f129b911e442?w=800"]
        },
        {
          name: "Multi-Level Garage Space",
          description: "Automated multi-level parking system with efficient space utilization.",
          parameters: [
            { name: "area", value: "20" }, { name: "vehicle_capacity", value: "1" }, { name: "height", value: "2.0" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"]
        },
        {
          name: "Workshop Garage",
          description: "Garage with workshop facilities including tools and equipment storage.",
          parameters: [
            { name: "area", value: "60" }, { name: "vehicle_capacity", value: "2" }, { name: "height", value: "3.0" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800"]
        },
        {
          name: "Motorcycle Garage",
          description: "Specialized garage for motorcycle storage with security features.",
          parameters: [
            { name: "area", value: "15" }, { name: "vehicle_capacity", value: "3" }, { name: "height", value: "2.2" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800"]
        },
        {
          name: "RV Storage Garage",
          description: "Extra-large garage designed for RV and boat storage.",
          parameters: [
            { name: "area", value: "100" }, { name: "vehicle_capacity", value: "1" }, { name: "height", value: "4.0" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800"]
        },
        {
          name: "Covered Parking Space",
          description: "Simple covered parking with weather protection and easy access.",
          parameters: [
            { name: "area", value: "18" }, { name: "vehicle_capacity", value: "1" }, { name: "height", value: "2.3" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"]
        },
        {
          name: "Vintage Car Garage",
          description: "Specialized storage for vintage and classic automobiles.",
          parameters: [
            { name: "area", value: "40" }, { name: "vehicle_capacity", value: "1" }, { name: "height", value: "2.5" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1549924231-f129b911e442?w=800"]
        }
      ],

      [RealAssetType.Parking]: [
        {
          name: "Downtown Parking Lot",
          description: "Prime downtown parking facility with high turnover and security.",
          parameters: [
            { name: "spaces", value: "50" }, { name: "area", value: "1500" }, { name: "parking_type", value: "surface" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"]
        },
        {
          name: "Shopping Center Parking",
          description: "Large parking area serving busy shopping center with excellent access.",
          parameters: [
            { name: "spaces", value: "200" }, { name: "area", value: "8000" }, { name: "parking_type", value: "surface" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800"]
        },
        {
          name: "Airport Long-Term Parking",
          description: "Secure long-term parking facility with shuttle service to airport.",
          parameters: [
            { name: "spaces", value: "300" }, { name: "area", value: "12000" }, { name: "parking_type", value: "covered" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800"]
        },
        {
          name: "Residential Parking Structure",
          description: "Multi-level parking structure serving residential complex.",
          parameters: [
            { name: "spaces", value: "120" }, { name: "area", value: "3600" }, { name: "parking_type", value: "structure" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"]
        },
        {
          name: "Event Venue Parking",
          description: "Large parking area for special events and entertainment venues.",
          parameters: [
            { name: "spaces", value: "500" }, { name: "area", value: "20000" }, { name: "parking_type", value: "surface" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1565063444743-3f3a92b2dd20?w=800"]
        },
        {
          name: "Medical Center Parking",
          description: "Convenient parking facility serving medical center with patient access.",
          parameters: [
            { name: "spaces", value: "80" }, { name: "area", value: "2400" }, { name: "parking_type", value: "covered" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800"]
        },
        {
          name: "Valet Parking Service",
          description: "Premium valet parking service for upscale establishments.",
          parameters: [
            { name: "spaces", value: "30" }, { name: "area", value: "900" }, { name: "parking_type", value: "valet" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1549924231-f129b911e442?w=800"]
        },
        {
          name: "Employee Parking Lot",
          description: "Dedicated employee parking for large corporate campus.",
          parameters: [
            { name: "spaces", value: "150" }, { name: "area", value: "4500" }, { name: "parking_type", value: "surface" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"]
        },
        {
          name: "Stadium Parking",
          description: "Massive parking facility for sports stadium and large events.",
          parameters: [
            { name: "spaces", value: "1000" }, { name: "area", value: "40000" }, { name: "parking_type", value: "surface" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1565063444743-3f3a92b2dd20?w=800"]
        },
        {
          name: "Hotel Guest Parking",
          description: "Convenient guest parking for luxury hotel with concierge service.",
          parameters: [
            { name: "spaces", value: "60" }, { name: "area", value: "1800" }, { name: "parking_type", value: "covered" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800"]
        }
      ],

      [RealAssetType.Business]: [
        {
          name: "Downtown Restaurant",
          description: "Popular restaurant in prime location with outdoor seating and full kitchen.",
          parameters: [
            { name: "area", value: "200" }, { name: "business_type", value: "restaurant" },
            { name: "seating_capacity", value: "80" }, { name: "annual_revenue", value: "500000" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800"]
        },
        {
          name: "Neighborhood Cafe",
          description: "Cozy neighborhood cafe with loyal customer base and excellent coffee.",
          parameters: [
            { name: "area", value: "80" }, { name: "business_type", value: "cafe" },
            { name: "seating_capacity", value: "30" }, { name: "annual_revenue", value: "150000" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800"]
        },
        {
          name: "Fitness Center",
          description: "Modern fitness center with latest equipment and group exercise studios.",
          parameters: [
            { name: "area", value: "800" }, { name: "business_type", value: "fitness" },
            { name: "seating_capacity", value: "0" }, { name: "annual_revenue", value: "800000" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800", "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"]
        },
        {
          name: "Retail Boutique",
          description: "Upscale boutique with designer clothing and accessories.",
          parameters: [
            { name: "area", value: "120" }, { name: "business_type", value: "retail" },
            { name: "seating_capacity", value: "5" }, { name: "annual_revenue", value: "300000" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"]
        },
        {
          name: "Beauty Salon",
          description: "Full-service beauty salon with experienced stylists and modern equipment.",
          parameters: [
            { name: "area", value: "150" }, { name: "business_type", value: "salon" },
            { name: "seating_capacity", value: "12" }, { name: "annual_revenue", value: "250000" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800"]
        },
        {
          name: "Auto Repair Shop",
          description: "Professional auto repair facility with modern diagnostic equipment.",
          parameters: [
            { name: "area", value: "600" }, { name: "business_type", value: "automotive" },
            { name: "seating_capacity", value: "10" }, { name: "annual_revenue", value: "600000" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800"]
        },
        {
          name: "Medical Practice",
          description: "Established medical practice with multiple doctors and support staff.",
          parameters: [
            { name: "area", value: "400" }, { name: "business_type", value: "medical" },
            { name: "seating_capacity", value: "25" }, { name: "annual_revenue", value: "1200000" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800"]
        },
        {
          name: "Grocery Store",
          description: "Well-established grocery store serving local community with fresh produce.",
          parameters: [
            { name: "area", value: "1000" }, { name: "business_type", value: "grocery" },
            { name: "seating_capacity", value: "0" }, { name: "annual_revenue", value: "2000000" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"]
        },
        {
          name: "Bakery",
          description: "Artisan bakery with fresh breads, pastries, and custom cake services.",
          parameters: [
            { name: "area", value: "100" }, { name: "business_type", value: "bakery" },
            { name: "seating_capacity", value: "20" }, { name: "annual_revenue", value: "180000" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800"]
        },
        {
          name: "Laundromat",
          description: "Modern laundromat with high-efficiency machines and clean facilities.",
          parameters: [
            { name: "area", value: "300" }, { name: "business_type", value: "laundry" },
            { name: "seating_capacity", value: "15" }, { name: "annual_revenue", value: "120000" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800"]
        }
      ],

      [RealAssetType.Industrial]: [
        {
          name: "Manufacturing Facility",
          description: "Large manufacturing plant with heavy machinery and production lines.",
          parameters: [
            { name: "area", value: "5000" }, { name: "ceiling_height", value: "8" },
            { name: "loading_docks", value: "6" }, { name: "crane_capacity", value: "10" }, { name: "power_supply", value: "480V" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800", "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800"]
        },
        {
          name: "Warehouse Distribution Center",
          description: "Modern distribution center with automated systems and climate control.",
          parameters: [
            { name: "area", value: "10000" }, { name: "ceiling_height", value: "12" },
            { name: "loading_docks", value: "12" }, { name: "crane_capacity", value: "5" }, { name: "power_supply", value: "208V" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"]
        },
        {
          name: "Food Processing Plant",
          description: "Specialized food processing facility with hygiene standards and cold storage.",
          parameters: [
            { name: "area", value: "3000" }, { name: "ceiling_height", value: "6" },
            { name: "loading_docks", value: "4" }, { name: "crane_capacity", value: "2" }, { name: "power_supply", value: "240V" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=800"]
        },
        {
          name: "Automotive Assembly Plant",
          description: "High-tech automotive assembly facility with robotic systems.",
          parameters: [
            { name: "area", value: "15000" }, { name: "ceiling_height", value: "15" },
            { name: "loading_docks", value: "20" }, { name: "crane_capacity", value: "25" }, { name: "power_supply", value: "480V" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800", "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800"]
        },
        {
          name: "Chemical Processing Facility",
          description: "Specialized chemical processing plant with safety systems and containment.",
          parameters: [
            { name: "area", value: "8000" }, { name: "ceiling_height", value: "20" },
            { name: "loading_docks", value: "8" }, { name: "crane_capacity", value: "50" }, { name: "power_supply", value: "600V" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800"]
        },
        {
          name: "Textile Manufacturing",
          description: "Textile production facility with specialized equipment and quality control.",
          parameters: [
            { name: "area", value: "4000" }, { name: "ceiling_height", value: "10" },
            { name: "loading_docks", value: "5" }, { name: "crane_capacity", value: "3" }, { name: "power_supply", value: "240V" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"]
        },
        {
          name: "Electronics Assembly",
          description: "Clean room electronics assembly facility with precision equipment.",
          parameters: [
            { name: "area", value: "2000" }, { name: "ceiling_height", value: "4" },
            { name: "loading_docks", value: "2" }, { name: "crane_capacity", value: "1" }, { name: "power_supply", value: "120V" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800"]
        },
        {
          name: "Steel Fabrication Shop",
          description: "Heavy steel fabrication facility with welding stations and heavy machinery.",
          parameters: [
            { name: "area", value: "6000" }, { name: "ceiling_height", value: "18" },
            { name: "loading_docks", value: "8" }, { name: "crane_capacity", value: "40" }, { name: "power_supply", value: "480V" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800"]
        },
        {
          name: "Pharmaceutical Production",
          description: "GMP-compliant pharmaceutical manufacturing with clean rooms and validation.",
          parameters: [
            { name: "area", value: "1500" }, { name: "ceiling_height", value: "5" },
            { name: "loading_docks", value: "3" }, { name: "crane_capacity", value: "1" }, { name: "power_supply", value: "208V" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=800"]
        },
        {
          name: "Recycling Processing Center",
          description: "Environmental recycling facility with sorting and processing equipment.",
          parameters: [
            { name: "area", value: "7000" }, { name: "ceiling_height", value: "14" },
            { name: "loading_docks", value: "10" }, { name: "crane_capacity", value: "15" }, { name: "power_supply", value: "480V" }
          ],
          photo_list: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800", "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800"]
        }
      ]
    };

    const current_type = assetData.asset_type || RealAssetType.Apartment;
    const type_data_sets = test_data_sets[current_type] || test_data_sets[RealAssetType.Apartment];
    
    // Randomly select one of the 10 data sets
    const random_index = Math.floor(Math.random() * type_data_sets.length);
    const selected_data = type_data_sets[random_index];
    
    // Randomly select location
    const random_location_index = Math.floor(Math.random() * locations.length);
    const selected_location = locations[random_location_index];

    onAssetDataChange({
      ...assetData,
      name: selected_data.name,
      description: selected_data.description,
      location: selected_location,
      parameters: selected_data.parameters,
      photo_list: selected_data.photo_list
    });
  };

  const dialog_content = (
    <DialogContent className="sm:max-w-[800px] w-full h-[65vh] flex flex-col bg-white">
      <DialogHeader className="flex-shrink-0">
        <DialogTitle>{dialog_title}</DialogTitle>
        <DialogDescription>{dialog_description}</DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="basic" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="details">Property Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <div className="flex-1  mt-6">
            <TabsContent value="basic" className="space-y-4 m-0 h-full">
              <div className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={assetData.name}
                    onChange={(e) => onAssetDataChange({ ...assetData, name: e.target.value })}
                    className={!assetData.name?.trim() ? "border-red-300 focus:border-red-500" : ""}
                  />
                  {!assetData.name?.trim() && (
                    <p className="text-xs text-red-500">Name is required</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={assetData.asset_type}
                    onValueChange={(value) =>
                      onAssetDataChange({ ...assetData, asset_type: value as RealAssetType })
                    }
                  >
                    <SelectTrigger className={!assetData.asset_type ? "border-red-300 focus:border-red-500" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {Object.values(RealAssetType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {get_real_asset_type_label_text(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!assetData.asset_type && (
                    <p className="text-xs text-red-500">Type is required</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={assetData.description || ""}
                    onChange={(e) => onAssetDataChange({ ...assetData, description: e.target.value })}
                    rows={6}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="m-0 h-full">
              <div className="h-full pb-4 space-y-2">
                <Label>
                  Location <span className="text-red-500">*</span>
                </Label>
                <MapPicker
                  value={assetData.location}
                  onChange={(location) => onAssetDataChange({ ...assetData, location })}
                />
                {(!assetData.location || (!assetData.location.lat && !assetData.location.lng)) && (
                  <p className="text-xs text-red-500">Location is required</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="m-0 h-full">
              <div className="pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">
                    Property Details <span className="text-red-500">*</span>
                  </h4>
                  {(!assetData.parameters || assetData.parameters.length === 0 || !assetData.parameters.some(param => param.value?.trim())) && (
                    <p className="text-xs text-red-500">At least one property detail is required</p>
                  )}
                </div>
                <PropertyDetailsForm
                  asset_type={assetData.asset_type}
                  assetData={assetData}
                  onAssetDataChange={onAssetDataChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="images" className="m-0 h-full">
              <div className="pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Label>
                    Images <span className="text-red-500">*</span>
                  </Label>
                  {(!assetData.photo_list || assetData.photo_list.length === 0) && (
                    <p className="text-xs text-red-500">At least one image is required</p>
                  )}
                </div>
                <BulkUploader
                  value={assetData.photo_list || []}
                  onChange={(photo_list) => onAssetDataChange({ ...assetData, photo_list })}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <DialogFooter className="flex-shrink-0 mt-4">
        <div className="flex w-full justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={fill_test_data}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <i className="bx bx-flask mr-1"></i>
            Fill Test Data
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={submitting || !is_form_valid}>
              {submitting ? submitting_text : submit_button_text}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );

  if (mode === "create" && trigger) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {dialog_content}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {dialog_content}
    </Dialog>
  );
}
