import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UserFavState } from "./user_fav_cubit";

interface FavSearchBarProps {
  filter: UserFavState["filter"];
  on_filter_change: (filter: UserFavState["filter"]) => void;
  on_clear_filter: () => void;
}

export function FavSearchBar({ filter, on_filter_change, on_clear_filter }: FavSearchBarProps) {
  const handle_search_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    on_filter_change({ ...filter, search_text: e.target.value });
  };

  const handle_clear = () => {
    on_clear_filter();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
        <Input
          type="text"
          placeholder="Search favorites by name or description..."
          value={filter.search_text || ""}
          onChange={handle_search_change}
          className="pl-10 pr-10 bg-white "
        />
        {filter.search_text && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handle_clear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-100"
          >
            <i className="bx bx-x text-slate-400"></i>
          </Button>
        )}
      </div>
    </div>
  );
}
