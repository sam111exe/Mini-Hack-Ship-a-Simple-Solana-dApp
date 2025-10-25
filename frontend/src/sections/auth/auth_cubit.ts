import * as nanostores from "nanostores";
import axios from "axios";
import { AuthLocalStorage } from "./auth_storage";
import { API } from "@/codegen";
import type { AuthJwtBundle } from "@/codegen";
import { api } from "@/api";

export type AuthAccount = {
  user_uuid: string;
  login: string;
  access_token: string;
  refresh_token: string;
  roles: string[];
};

export type AuthStorage = {
  accounts: AuthAccount[];
  current_account_uuid: string | null;
};

export const AuthScreens = {
  INITIAL: "INITIAL",
  LOADING: "LOADING",
  LOGIN: "LOGIN",
  AUTHENTICATED: "AUTHENTICATED",
  ACCOUNT_SELECTION: "ACCOUNT_SELECTION",
} as const;

export type AuthScreens = (typeof AuthScreens)[keyof typeof AuthScreens];

export type AuthState = {
  screen: AuthScreens;
  accounts: AuthAccount[];
  current_account: AuthAccount | null;
  login: string;
  password: string;
  captcha_token: string;
  two_fa_code: string;
  code: string;
  loading: boolean;
  errors: string[];
  is_role_admin: boolean;
  is_role_gov: boolean;
  captcha_site_key: string;
};

const on_auth_callbacks: (() => void)[] = [];

const state = nanostores.map<AuthState>({
  screen: AuthScreens.INITIAL,
  accounts: [],
  current_account: null,
  login: "",
  password: "",
  captcha_token: "",
  code: "",
  two_fa_code: "",
  loading: false,
  errors: [],
  is_role_admin: false,
  is_role_gov: false,
  captcha_site_key: "",
});

const storage = new AuthLocalStorage();

state.subscribe((next, prev) => {
  if (!prev) return;

  if (next.accounts !== prev.accounts) {
    // console.log(next, prev);
    storage.set_item("accounts", next.accounts || []);
  }

  if (next.current_account !== prev.current_account) {
    storage.set_item("current_account_uuid", next.current_account?.user_uuid || null);
    AuthCubit.update_axios_header(next.current_account);
  }
});

export class AuthCubit {
  static state = state;

  static on_auth(callback: (is_admin: boolean) => void) {
    on_auth_callbacks.push(() => callback(this.state.value.is_role_admin));
  }

  // Новый метод для обновления заголовков axios
  static update_axios_header(account: AuthAccount | null) {
    if (account) {
      if (!localStorage.getItem("guest_auth")) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${account.access_token}`;
      } else {
        const { access_token } = JSON.parse(localStorage.getItem("guest_auth") || "{}");
        axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      }
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }

  static async auth_success(account: AuthAccount) {
    state.setKey("current_account", account);
    this.update_axios_header(account);
    state.setKey("screen", AuthScreens.AUTHENTICATED);
    this.check_role(account.access_token);
    await Promise.all(on_auth_callbacks.map((cb) => cb()));
  }

  static api: API = api;

  static async check_auth() {
    const { accounts, current_account_uuid } = storage.get_store();
    // Find current account
    const current_account = accounts?.find((acc) => acc.user_uuid === current_account_uuid);

    if (current_account) {
      try {
        // Check auth with current account
        this.update_axios_header(current_account);
        await this.api.auth_check();
        this.auth_success(current_account);
      } catch (e: any) {
        console.log("Auth error", e);
        // Try to refresh token if possible
        try {
          const jwt_bundle = await this.api.auth_jwt_refresh({ refresh_token: current_account.refresh_token });
          const updatedAccount = await this.update_account_tokens(current_account.user_uuid, jwt_bundle);
          this.auth_success(updatedAccount);
        } catch (e) {
          this.remove_account(current_account.user_uuid);
          this.show_account_selection_or_login();
          return;
        }
      }
    } else {
      this.show_account_selection_or_login();
    }
  }

  static init = async () => {
    await storage.init();
    state.setKey("loading", true);

    state.setKey("screen", AuthScreens.LOADING);

    const { accounts } = storage.get_store();

    // Restore data from storage
    state.set({
      ...state.get(),
      accounts: accounts || [],
    });

    await this.check_auth();

    state.setKey("loading", false);
    console.log(this.state.value);
  };

  static show_account_selection_or_login() {
    const { accounts } = state.get();
    if (accounts.length > 0) {
      state.setKey("screen", AuthScreens.ACCOUNT_SELECTION);
    } else {
      state.setKey("screen", AuthScreens.LOGIN);
    }
  }

  static async create_account_from_tokens(jwt_bundle: AuthJwtBundle): Promise<AuthAccount> {
    const { login } = state.get();
    const claims = this.decode_jwt(jwt_bundle.access_token);
    console.log("claims", claims);

    const account: AuthAccount = {
      user_uuid: claims.user_uuid,
      login: login,
      access_token: jwt_bundle.access_token,
      refresh_token: jwt_bundle.refresh_token,
      roles: claims.roles || [],
    };

    this.add_account(account);
    return account;
  }

  static decode_jwt(token: string) {
    const claims_b64 = token.split(".")[1];
    return JSON.parse(atob(claims_b64));
  }

  static add_account(account: AuthAccount) {
    const { accounts } = state.get();
    console.log("Accounts now: ", accounts);
    console.log("should add: ", account);
    const existingIndex = accounts.findIndex((acc) => acc.user_uuid === account.user_uuid);

    if (existingIndex >= 0) {
      const updatedAccounts = [...accounts];
      updatedAccounts[existingIndex] = account;
      state.setKey("accounts", updatedAccounts);
    } else {
      console.log("Not found", [...accounts, account]);
      state.setKey("accounts", [...accounts, account]);
    }
  }

  static remove_account(user_uuid: string) {
    const { accounts, current_account } = state.get();
    const updatedAccounts = accounts.filter((acc) => acc.user_uuid !== user_uuid);
    state.setKey("accounts", updatedAccounts);

    if (current_account?.user_uuid === user_uuid) {
      state.setKey("current_account", null);
      this.update_axios_header(null);
    }
  }

  // ИСПРАВЛЕННЫЙ МЕТОД: Теперь правильно обновляет заголовки и проверяет авторизацию
  static async switch_account(user_uuid: string) {
    const { accounts } = state.get();
    const account = accounts.find((acc) => acc.user_uuid === user_uuid);

    if (account) {
      try {
        state.setKey("loading", true);

        // Обновляем заголовки с новым токеном
        this.update_axios_header(account);

        // Проверяем что токен все еще валидный
        await this.api.auth_check();

        // Если все ок, устанавливаем аккаунт как текущий
        state.setKey("current_account", account);
        state.setKey("screen", AuthScreens.AUTHENTICATED);
        this.check_role(account.access_token);

        // Вызываем колбэки авторизации
        await Promise.all(on_auth_callbacks.map((cb) => cb()));
      } catch (error) {
        console.log("Switch account error", error);

        // Пытаемся обновить токен
        try {
          const jwt_bundle = await this.api.auth_jwt_refresh({ refresh_token: account.refresh_token });
          const updatedAccount = await this.update_account_tokens(account.user_uuid, jwt_bundle);

          // Повторно устанавливаем аккаунт с новыми токенами
          this.update_axios_header(updatedAccount);
          state.setKey("current_account", updatedAccount);
          state.setKey("screen", AuthScreens.AUTHENTICATED);
          this.check_role(updatedAccount.access_token);

          await Promise.all(on_auth_callbacks.map((cb) => cb()));
        } catch (refreshError) {
          console.log("Token refresh failed", refreshError);
          // Удаляем неработающий аккаунт
          this.remove_account(user_uuid);
          this.add_error("Не удалось переключиться на аккаунт. Токен истек.");
          this.show_account_selection_or_login();
        }
      } finally {
        state.setKey("loading", false);
      }
    }
  }

  static async update_account_tokens(user_uuid: string, jwt_bundle: AuthJwtBundle): Promise<AuthAccount> {
    const { accounts } = state.get();
    const accountIndex = accounts.findIndex((acc) => acc.user_uuid === user_uuid);

    if (accountIndex >= 0) {
      const updatedAccount = {
        ...accounts[accountIndex],
        access_token: jwt_bundle.access_token,
        refresh_token: jwt_bundle.refresh_token,
      };

      const updatedAccounts = [...accounts];
      updatedAccounts[accountIndex] = updatedAccount;
      state.setKey("accounts", updatedAccounts);

      // Если это текущий аккаунт, обновляем его в state
      const { current_account } = state.get();
      if (current_account?.user_uuid === user_uuid) {
        state.setKey("current_account", updatedAccount);
        this.update_axios_header(updatedAccount);
      }

      return updatedAccount;
    }

    throw new Error("Account not found");
  }

  static async google_login(token: string) {
    state.setKey("loading", true);
    const jwt_bundle = await this.api.auth_google_sign_up_sert({ token });
    const account = await this.create_account_from_tokens(jwt_bundle);
    this.auth_success(account);
    state.setKey("loading", false);
  }

  static async dev_login(player: string) {
    state.setKey("loading", true);
    const jwt_bundle = await this.api.dev_sign_in(player);
    const account = await this.create_account_from_tokens(jwt_bundle);
    this.auth_success(account);
    state.setKey("loading", false);
  }

  static set_login(login: string) {
    state.setKey("login", login);
    this.clear_errors();
  }

  static set_password(password: string) {
    state.setKey("password", password);
    this.clear_errors();
  }

  static sign_out() {
    const { current_account } = state.get();
    if (current_account) {
      this.remove_account(current_account.user_uuid);
    }

    state.set({
      ...state.get(),
      current_account: null,
      code: "",
      is_role_admin: false,
      is_role_gov: false,
      loading: false,
    });

    this.show_account_selection_or_login();
  }

  static add_account_screen() {
    state.set({
      ...state.get(),
      screen: AuthScreens.LOGIN,
      login: "",
      password: "",
      captcha_token: "",
      code: "",
      two_fa_code: "",
      errors: [],
    });
  }

  static add_error(error: string) {
    state.setKey("errors", [...state.get().errors, error]);
  }

  private static check_role(jwt_token: string) {
    if (!jwt_token) {
      state.setKey("is_role_admin", false);
      state.setKey("is_role_gov", false);
      return;
    }

    const claims = this.decode_jwt(jwt_token);
    state.setKey("login", claims.login);
    console.log("Checking role for token", claims);

    if (claims.roles && Array.isArray(claims.roles)) {
      if (claims.roles.includes("ADMIN")) {
        state.setKey("is_role_admin", true);
        state.setKey("is_role_gov", false);
        return;
      } else if (claims.roles.includes("GOV")) {
        state.setKey("is_role_gov", true);
        state.setKey("is_role_admin", false);
        return;
      }
    } else {
      state.setKey("is_role_admin", false);
      state.setKey("is_role_gov", false);
    }
  }

  static clear_errors() {
    state.setKey("errors", []);
  }

  static set_screen(screen: AuthScreens) {
    state.setKey("screen", screen);
  }

  static get_current_account(): AuthAccount | null {
    return state.get().current_account;
  }

  static get_accounts(): AuthAccount[] {
    return state.get().accounts;
  }
  static is_authenticated(): boolean {
    return state.get().screen === AuthScreens.AUTHENTICATED && state.get().current_account !== null;
  }
}
