import { ConnectionProvider, useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import { useMemo } from "react";

export const WalletWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network]);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const WalletWidget: React.FC = () => {
  return <WalletButtons />;
};

export const WalletButtons: React.FC = () => {
  const { connected } = useWallet();
  return (
    <div className="flex gap-2">
      {connected}
      <WalletMultiButton
        style={{
          width: "100%",
          backgroundColor: connected ? "transparent" : "#3b82f6",
          color: connected ? "black" : "white",
          border: connected ? "1px solid #d1d5db" : "none",
          display: "flex",
          justifyContent: "center",
          userSelect: connected ? "none" : "auto",
        }}
      />
      {connected && (
        <WalletDisconnectButton
          style={{
            width: "48px",
            paddingLeft: "0px",
            paddingRight: "12px",
            backgroundColor: "#be6161",
          }}
        >
          <i className="bx bx-power-off text-2xl"></i>
        </WalletDisconnectButton>
      )}
      {/* Your app's components go here, nested within the context providers. */}
    </div>
  );
};
