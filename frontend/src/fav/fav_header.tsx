import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section_header";

interface FavHeaderProps {
  fav_count: number;
}

export function FavHeader({ fav_count }: FavHeaderProps) {
  return (
    <SectionHeader 
      title="My Favorites"
      subtitle="Assets you've saved for later"
      icon="bx-heart"
      icon_class="text-2xl text-red-500"
      badge={
        <Badge variant="secondary" className="text-sm">
          {fav_count} {fav_count === 1 ? "asset" : "assets"}
        </Badge>
      }
    />
  );
}