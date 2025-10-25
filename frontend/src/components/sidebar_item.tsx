import { cn } from "../lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

interface SubItem {
  icon: React.ReactElement;
  label: string;
  is_active?: boolean;
  on_click?: () => void;
  href?: string;
}

interface SidebarItemProps {
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  subitems?: SubItem[];
  isExpanded?: boolean;
}

export const SidebarItem = ({
  icon,
  label,
  isActive,
  onClick,
  disabled = false,
  subitems = [],
  isExpanded = false,
}: SidebarItemProps) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const hasSubitems = subitems.length > 0;
  const navigate = useNavigate();

  const handleMainClick = () => {
    if (hasSubitems) {
      setExpanded(!expanded);
    }
    onClick();
  };

  return (
    <div>
      <button
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out border border-transparent",
          "hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isActive
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
            : "text-slate-600 hover:text-slate-900",
        )}
        onClick={handleMainClick}
        disabled={disabled}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-500 to-indigo-600" />
        )}
        <div
          className={cn(
            "h-5 w-6 transition-colors duration-200 bx text-2xl flex items-center justify-center leading-none ",
            isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600",
          )}
        >
          {icon}
        </div>
        <span className="truncate flex-1 text-left">{label}</span>
        {hasSubitems && (
          <div className="ml-auto">
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            )}
          </div>
        )}
        {isActive && !hasSubitems && <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />}
      </button>

      {hasSubitems && expanded && (
        <div className="mt-1 space-y-1">
          {subitems.map((subitem, index) => {
            return (
              <button
                key={index}
                className={cn(
                  "group relative flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                  "hover:bg-slate-50",
                  "focus:outline-none focus:ring-1 ",
                )}
                onClick={
                  subitem.on_click ? subitem.on_click : subitem.href ? () => navigate(subitem.href!) : undefined
                }
              >
                <div
                  className={
                    "h-1.5 w-1.5 rounded-full " + (subitem.is_active ? "bg-blue-500" : "group-hover:bg-slate-400")
                  }
                />
                <div
                  className={cn(
                    "h-5 w-6 transition-colors duration-200 bx text-xl flex items-center justify-center leading-none ",
                    subitem.is_active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600",
                  )}
                >
                  {subitem.icon}
                </div>
                <span
                  className={cn("truncate flex-1 text-left", subitem.is_active ? "text-blue-700" : "text-slate-600")}
                >
                  {subitem.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
