import { Navigate, useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { SidebarItem } from "./sidebar_item";
import { RealXLogo } from "./logo";
import Swal from "sweetalert2";
import { AuthCubit } from "@/sections/auth/auth_cubit";
import { WalletWidget } from "@/sections/blockchain/wallet_widget";
import { UserProfileWidget } from "./user_profile_widget";
import { useStore } from "@nanostores/react";

interface SidebarProps {
  onClose: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const auth_state = useStore(AuthCubit.state);

  return (
    <>
      <div className="p-6  border-gray-100 flex items-center justify-between">
        <RealXLogo />
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2 hover:bg-gray-100 hidden">
          <i className="bx bx-x text-2xl"></i>
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">
        {auth_state.is_role_gov ? (
          <GovSidebarItems />
        ) : auth_state.is_role_admin ? (
          <AdminSidebarItems />
        ) : (
          <UserSidebarItems />
        )}
        <div className="grow"></div>
      </div>

      <div className="p-2 space-y-2">
        <WalletWidget />
        <UserProfileWidget />
        <div className="hover:bg-red-50 rounded-lg [&_span]:text-red-600 [&_span]:hover:text-red-700">
          <SidebarItem
            icon={<i className="bx bx-log-out text-red-600"></i>}
            label="Sign Out"
            isActive={false}
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You will be logged out of your account.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, log me out!",
              }).then((result) => {
                if (result.isConfirmed) {
                  AuthCubit.sign_out();
                }
              });
            }}
          />
        </div>
      </div>
    </>
  );
};

const GovSidebarItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const get_active_widget = () => {
    const path = location.pathname;
    if (path.startsWith("/gov/approvals")) return "gov/approvals";
    if (path.startsWith("/settings/profile")) return "/settings/profile";
    return "";
  };

  const active_widget = get_active_widget();
  return (
    <>
      <SidebarItem
        icon={<i className="bx bx-check-circle"></i>}
        label="Pending Approvals"
        isActive={active_widget === "gov/approvals"}
        onClick={() => navigate("/gov/approvals")}
        isExpanded={active_widget === "gov/approvals"}
      />
      <SidebarItem
        icon={<i className="bx bx-cog"></i>}
        label="Gov Profile"
        isActive={active_widget === "/settings/profile"}
        onClick={() => {
          navigate("/settings/profile");
        }}
        isExpanded={active_widget === "/settings/profile"}
      />
    </>
  );
};

const AdminSidebarItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const get_active_widget = () => {
    const path = location.pathname;
    if (path.startsWith("/admin/users")) return "admin/users";
    if (path.startsWith("/admin/kyc")) return "admin/kyc";
    if (path.startsWith("/settings/profile")) return "/settings/profile";
    return "";
  };

  const active_widget = get_active_widget();
  return (
    <>
      <SidebarItem
        icon={<i className="bx bx-group"></i>}
        label="Users"
        isActive={active_widget === "admin/users"}
        onClick={() => navigate("/admin/users")}
        isExpanded={active_widget === "admin/users"}
      />
      <SidebarItem
        icon={<i className="bx bx-shield"></i>}
        label="KYC Pendings"
        isActive={active_widget === "admin/kyc"}
        onClick={() => navigate("/admin/kyc")}
        isExpanded={active_widget === "admin/kyc"}
      />
      <SidebarItem
        icon={<i className="bx bx-cog"></i>}
        label="Admin Profile"
        isActive={active_widget === "/settings/profile"}
        onClick={() => {
          navigate("/settings/profile");
        }}
        isExpanded={active_widget === "/settings/profile"}
      />
    </>
  );
};

const UserSidebarItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const get_active_widget = () => {
    const path = location.pathname;
    if (path.startsWith("/settings")) return "settings";
    if (path.startsWith("/explore")) return "explore";
    if (path.startsWith("/assets/fav")) return "assets/fav";
    if (path.startsWith("/assets/real")) return "assets/real";
    if (path.startsWith("/assets/crypto")) return "assets/crypto";
    if (path.startsWith("/")) return "home";

    return "";
  };

  const active_widget = get_active_widget();
  return (
    <>
      <SidebarItem
        icon={<i className="bx bx-home"></i>}
        label="Home"
        isActive={active_widget === "home"}
        onClick={() => navigate("/")}
        isExpanded={active_widget === "home"}
      />
      <SidebarItem
        icon={<i className="bx bx-compass"></i>}
        label="Explore"
        isActive={active_widget === "explore"}
        onClick={() => navigate("/explore")}
        isExpanded={active_widget === "explore"}
      />
      <SidebarItem
        icon={<i className="bx bx-heart"></i>}
        label="Favorites"
        isActive={active_widget === "assets/fav"}
        onClick={() => navigate("/assets/fav")}
        isExpanded={active_widget === "assets/fav"}
      />
      <SidebarItem
        icon={<i className="bx bx-briefcase"></i>}
        label="My Real Assets"
        isActive={active_widget === "assets/real"}
        onClick={() => navigate("/assets/real")}
        isExpanded={active_widget === "assets/real"}
      />
      <SidebarItem
        icon={<i className="bx bx-coin-stack"></i>}
        label="My NFTs"
        isActive={active_widget === "assets/crypto"}
        onClick={() => navigate("/assets/crypto")}
        isExpanded={active_widget === "assets/crypto"}
      />

      <SidebarItem
        icon={<i className="bx bx-cog"></i>}
        label="Settings"
        isActive={active_widget === "settings"}
        onClick={() => {}}
        subitems={[
          {
            icon: <i className="bx bx-user"></i>,
            label: "Profile",
            is_active: location.pathname === "/settings/profile",
            href: "/settings/profile",
          },
          {
            icon: <i className="bx bx-shield"></i>,
            label: "KYC Verification",
            is_active: location.pathname === "/settings/kyc",
            href: "/settings/kyc",
          },
        ]}
        isExpanded={active_widget === "settings"}
      />
    </>
  );
};
