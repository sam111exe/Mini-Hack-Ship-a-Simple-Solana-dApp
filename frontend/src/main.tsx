// @ts-nocheck
window.process = { env: {} };

import { StrictMode } from "react";
import "./init_cubits";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./app.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthScreen } from "./sections/auth/index.tsx";
import { HomeSection } from "./sections/home/index.tsx";
import { ExploreSection } from "./sections/explore/index.tsx";
import { MyRealAssets } from "./sections/my_real_assets/index.tsx";
import { FavSection } from "./sections/fav/index.tsx";
import { FnftSection } from "./modules/fnft/index.tsx";
import { UserProfileSection } from "./sections/user_profile/index.tsx";
import { KycVerificationSection } from "./sections/kyc_verification/index.tsx";
import { AdminKycSection } from "./sections/admin_kyc/index.tsx";
import { AdminUsersSection } from "./sections/admin_users/index.tsx";
import { GovApprovalsSection } from "./sections/gov_approvals/index.tsx";
import { WalletWrapper } from "./sections/blockchain/wallet_widget.tsx";
import { MyCryptoAssets } from "./sections/my_crypto_assets/index.tsx";

createRoot(document.getElementById("root")!).render(
  <WalletWrapper>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<HomeSection />} />
            <Route path="/explore" element={<ExploreSection />} />
            <Route path="/assets">
              <Route path="real" element={<MyRealAssets />} />
              <Route path="fav" element={<FavSection />} />
              <Route path="crypto" element={<MyCryptoAssets />} />
              <Route path="fragments" element={<div>Asset History</div>} />
            </Route>
            <Route path="/fnft" element={<FnftSection />} />
            <Route path="/settings/profile" element={<UserProfileSection />} />
            <Route path="/settings/kyc" element={<KycVerificationSection />} />
            <Route path="/admin/kyc" element={<AdminKycSection />} />
            <Route path="/admin/users" element={<AdminUsersSection />} />
            <Route path="/gov/approvals" element={<GovApprovalsSection />} />
          </Route>
          <Route path="/auth/login" element={<AuthScreen />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </WalletWrapper>,
);
