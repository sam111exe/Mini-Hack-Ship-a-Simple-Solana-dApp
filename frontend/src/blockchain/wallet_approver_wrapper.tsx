import { web3 } from "@coral-xyz/anchor";
import { bus } from "@/nanobus";
import Swal from "sweetalert2";

export async function wallet_approval_wrapper(
  approval_function: Promise<web3.Transaction>,
): Promise<web3.Transaction> {
  try {
    bus.emit("awaiter", {
      title: "Wallet approval",
      message: "Please sign the transaction in your wallet.",
      shown: true,
      icon: "bx-wallet-alt",
    });
    const signed = await approval_function;
    bus.emit("awaiter", { shown: false });
    return signed;
  } catch (e) {
    console.log(e);
    bus.emit("awaiter", { shown: false });

    Swal.fire({
      title: "Wallet approval failed",
      text: "Transaction was not signed, please try again",
      icon: "error",
    });
    throw e;
  }
}
