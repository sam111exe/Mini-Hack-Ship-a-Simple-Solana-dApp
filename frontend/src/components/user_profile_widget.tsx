import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { UserProfileCubit } from "@/sections/user_profile/user_profile_cubit";
import { AuthCubit } from "@/sections/auth/auth_cubit";
import { cn } from "@/lib/utils";
import { useStore } from "@nanostores/react";

export function UserProfileWidget() {
  const navigate = useNavigate();
  const { profile, loading } = useStore(UserProfileCubit.state);
  const auth_state = useStore(AuthCubit.state);
  const current_account = AuthCubit.get_current_account();

  useEffect(() => {
    if (AuthCubit.is_authenticated()) {
      UserProfileCubit.load_profile();
    }
  }, []);

  const get_initials = () => {
    if (!profile?.name && !profile?.surname) return "U";

    const initials = [profile?.name?.[0] || "", profile?.surname?.[0] || ""].filter(Boolean).join("").toUpperCase();

    return initials || "U";
  };

  const get_display_name = () => {
    if (!profile) return current_account?.login || "User";

    const name_parts = [profile.name, profile.surname].filter(Boolean);
    if (name_parts.length > 0) {
      return name_parts.join(" ");
    }

    return current_account?.login || "User";
  };

  const handle_profile_click = () => {
    navigate("/settings/profile");
  };

  if (loading && !profile) {
    return (
      <div className="p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={handle_profile_click}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={`${get_display_name()}'s avatar`}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {get_initials()}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm truncate">
            {profile?.name && profile?.surname ? (
              <>
                {profile.name} {profile.surname}
              </>
            ) : (
              get_display_name()
            )}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {auth_state.is_role_gov ? "Government Official" : auth_state.is_role_admin ? "Administrator" : "User"}
          </div>
        </div>

        <div className="text-gray-400">
          <i className="bx bx-chevron-right text-xl"></i>
        </div>
      </div>

      {profile && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Profile</span>
            <span
              className={cn(
                "font-medium",
                UserProfileCubit.get_profile_completion_percentage() === 100 ? "text-green-600" : "text-amber-600",
              )}
            >
              {UserProfileCubit.get_profile_completion_percentage()}% complete
            </span>
          </div>
          {profile.kyc_verified && (
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
              <i className="bx bx-check-circle"></i>
              <span>KYC Verified</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
