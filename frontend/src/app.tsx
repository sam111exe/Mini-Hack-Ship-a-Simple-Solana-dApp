import { useStore } from "@nanostores/react";
import { Sidebar } from "./components/sidebar";
import { Outlet, useNavigate, useLocation } from "react-router";
import { AuthCubit } from "./sections/auth/auth_cubit";
import { AuthScreen } from "./sections/auth";
import { useEffect } from "react";

export const App = () => {
  const auth_state = useStore(AuthCubit.state);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle role-based routing after successful authentication
  useEffect(() => {
    if (AuthCubit.is_authenticated() && location.pathname === "/") {
      if (auth_state.is_role_gov) {
        navigate("/gov/approvals", { replace: true });
      } else if (auth_state.is_role_admin) {
        navigate("/admin/users", { replace: true });
      }
    }
  }, [auth_state.is_role_gov, auth_state.is_role_admin, location.pathname, navigate]);

  if (AuthCubit.is_authenticated() == false) {
    return <AuthScreen />;
  }
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className=" lg:flex w-72 bg-white border-r border-gray-200 flex-col">
        <Sidebar onClose={() => {}} />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto">
          {/*
          <div className="p-2  fixed top-2 right-2">
            <WalletWidget />
          </div>
           */}

          <Outlet />
        </div>
      </div>
    </div>
  );
};
