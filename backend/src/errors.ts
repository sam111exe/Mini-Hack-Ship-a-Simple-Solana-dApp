export enum AppErrors {
  NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
  JWT_EXPIRED = "JWT_EXPIRED",
  JWT_INVALID = "JWT_INVALID",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  PASSWORD_MISMATCH = "PASSWORD_MISMATCH",
  UNDEFINED_ERROR = "UNDEFINED_ERROR",
  REFRESH_PLEASE = "REFRESH_PLEASE",
  USER_NOT_IN_ROOM = "USER_NOT_IN_ROOM",
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  USER_NOT_IN_ACTIVE_ROOM = "USER_NOT_IN_ACTIVE_ROOM",
}

export class AppError {
  code: AppErrors;
  constructor(code: AppErrors) {
    if (AppErrors.hasOwnProperty(code)) {
      this.code = code as AppErrors;
    } else {
      throw new Error("Invalid error code: " + code);
    }
  }

  static NOT_IMPLEMENTED = new AppError(AppErrors.NOT_IMPLEMENTED);
  static JWT_EXPIRED = new AppError(AppErrors.JWT_EXPIRED);
  static JWT_INVALID = new AppError(AppErrors.JWT_INVALID);
  static PERMISSION_DENIED = new AppError(AppErrors.PERMISSION_DENIED);
  static USER_ALREADY_EXISTS = new AppError(AppErrors.USER_ALREADY_EXISTS);
  static USER_NOT_FOUND = new AppError(AppErrors.USER_NOT_FOUND);
  static PASSWORD_MISMATCH = new AppError(AppErrors.PASSWORD_MISMATCH);
  static UNDEFINED_ERROR = new AppError(AppErrors.UNDEFINED_ERROR);
  static REFRESH_PLEASE = new AppError(AppErrors.REFRESH_PLEASE);
  static USER_NOT_IN_ROOM = new AppError(AppErrors.USER_NOT_IN_ROOM);
  static ROOM_NOT_FOUND = new AppError(AppErrors.ROOM_NOT_FOUND);
  static USER_NOT_IN_ACTIVE_ROOM = new AppError(AppErrors.USER_NOT_IN_ACTIVE_ROOM);

  get message() {
    switch (this.code) {
      case AppErrors.NOT_IMPLEMENTED:
        return "This method is not implemented yet, please ask the developer to implement it.";
      case AppErrors.JWT_EXPIRED:
        return "Session expired, please login again.";
      case AppErrors.JWT_INVALID:
        return "Invalid token, please login again.";
      case AppErrors.PERMISSION_DENIED:
        return "Permission denied.";
      case AppErrors.USER_ALREADY_EXISTS:
        return "User already exists. Please choose another login.";
      case AppErrors.USER_NOT_FOUND:
        return "User not found. Please check the login.";
      case AppErrors.PASSWORD_MISMATCH:
        return "Password mismatch. Please check the password.";
      case AppErrors.UNDEFINED_ERROR:
        return "Undefined error. Please contact the developer.";
      case AppErrors.REFRESH_PLEASE:
        return "Data is outdated, please refresh.";
      case AppErrors.USER_NOT_IN_ROOM:
        return "User is not in the specified room.";
      case AppErrors.ROOM_NOT_FOUND:
        return "The specified room was not found.";
      default:
        return "Unknown error.";
    }
  }
}

import type { ErrorRequestHandler } from "express";
export const error_middleware: ErrorRequestHandler = function (err: Error, _req, res, _next) {
  console.log("AppError", err);
  let error = err instanceof AppError ? err : new AppError(AppErrors.UNDEFINED_ERROR);
  res.status(400).json({ domain: "APP_ERROR", code: error.code, message: error.message });
};
