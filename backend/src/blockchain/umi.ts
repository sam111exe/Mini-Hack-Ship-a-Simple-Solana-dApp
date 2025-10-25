import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import * as UMI from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { SolGateWay, SolTx } from "./@soltools";
import { app_account } from "./app_account";
import { web3 } from "@coral-xyz/anchor";
import { fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";

export const umi = createUmi(SolGateWay.instance.rpc_endpoint);

umi.use(mplTokenMetadata());

umi.use(
  UMI.keypairIdentity({
    secretKey: app_account.key_holder.key_pair.secretKey,
    publicKey: app_account.public_key.toBase58() as any,
  }),
);

export async function send_umi_tx(tx: UMI.Transaction) {
  const resp = await umi.rpc.sendTransaction(tx);
  const [tx_hash] = base58.deserialize(resp);
  const sol_tx = SolTx.from_tx_hash(tx_hash);
  await sol_tx.wait_for_confirmation();
  return sol_tx;
}

// REASON: This function is used to get the umi object with a dummy signer for set payer
export function get_umi_dummy(payer: web3.PublicKey) {
  const token_owner_signer = {
    publicKey: fromWeb3JsPublicKey(payer),
    signMessage: async (_message: any) => {
      console.log("signMessage", _message);
      return true as any;
    },
    signTransaction: async (_transaction: any) => {
      console.log("signTransaction", _transaction);
      return true as any;
    },
    signAllTransactions: async (_transaction: any) => {
      console.log("signAllTransactions", _transaction);
      return true as any;
    },
  };

  const umi_dummy = {
    ...umi,
    identity: token_owner_signer,
    payer: token_owner_signer,
  };
  return umi_dummy as typeof umi;
}
