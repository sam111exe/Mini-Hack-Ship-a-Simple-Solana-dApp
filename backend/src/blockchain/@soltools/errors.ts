
export enum SolErrors {
  InsufficientFundsForRent = "failed to send transaction: Transaction simulation failed: Transaction results in an account (1) with insufficient funds for rent",
}

enum AppErrorCodes {
  InsufficientFundsForRent,
}

export class AppError {
  code: AppErrorCodes;

  private constructor(code: AppErrorCodes) {
    this.code = code;
  }

  CODES = AppErrorCodes;

  static try_from(e: any): AppError | undefined {
    if (e instanceof Error) {
      switch (e.message) {
        case SolErrors.InsufficientFundsForRent:
          return new AppError(AppErrorCodes.InsufficientFundsForRent);
        default:
          console.log("Not Implemented Error", e.message, e);
      }
    }
    console.log("Not Implemented", e);
  }
}
