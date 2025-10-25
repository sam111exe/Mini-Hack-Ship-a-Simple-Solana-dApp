import React, { type ReactNode } from "react";
import { useStore } from "@nanostores/react";
import Swal from "sweetalert2";
import { AuthCubit, AuthScreens, type AuthAccount } from "./auth_cubit";
import { LoadingSpinner } from "@/components/custom/loading_spinner";
import { RealXLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CONFIG } from "@/config";

const AuthForm: React.FC = () => {
  const state = useStore(AuthCubit.state);

  const screen = state.screen;
  const S = AuthScreens;
  const set_screen = AuthCubit.set_screen;

  // AUTHENTICATED =======================================================================================================
  if (screen == S.AUTHENTICATED) return <div>Auth Done</div>;
  //
  // LOGIN =======================================================================================================
  if (screen == S.LOGIN) {
    return (
      <ScreenWrapper
        title="Sign in to continue"
        subtitle="Use your Google account to sign in or Dev accounts for testing"
        showExternalAuthProviders={true}
        content={
          <>
            <div className="space-y-4">
              <Button
                onClick={() => login()}
                className="w-full h-11 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 "
                variant="outline"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </div>

            {/* Dev Players Section */}

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Dev Accounts</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {["user", "admin", "gov", "user2"].map((p) => (
                  <Button
                    key={p}
                    onClick={() => AuthCubit.dev_login(p)}
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            {state.accounts.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <Button onClick={() => set_screen(S.ACCOUNT_SELECTION)} variant="ghost" className="w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Account Selection
                </Button>
              </div>
            )}
          </>
        }
      />
    );
  }

  // ACCOUNT SELECTION =======================================================================================================
  if (screen == S.ACCOUNT_SELECTION) {
    return (
      <ScreenWrapper
        title={"Select Account"}
        subtitle={"Choose an account to sign in or add a new one"}
        content={
          <>
            <div className="space-y-3">
              {state.accounts.map((account) => (
                <AccountCard
                  key={account.user_uuid}
                  account={account}
                  onSelect={() => AuthCubit.switch_account(account.user_uuid)}
                  onRemove={() => AuthCubit.remove_account(account.user_uuid)}
                />
              ))}
            </div>

            <div className="mt-6">
              <Button onClick={() => AuthCubit.add_account_screen()} variant="outline" className="w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Account
              </Button>
            </div>
          </>
        }
      />
    );
  }
};

// Account Card Component =======================================================================================================
const AccountCard: React.FC<{
  account: AuthAccount;
  onSelect: () => void;
  onRemove: () => void;
}> = ({ account, onSelect, onRemove }) => {
  return (
    <div
      className="relative group cursor-pointer rounded-lg border bg-card p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <div className="font-medium">{account.login}</div>
            <div className="text-sm text-muted-foreground">
              {account.roles.includes("ADMIN") ? "Administrator" : "User"}
            </div>
          </div>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

// HELPERS =======================================================================================================

export function AuthScreen($: { title?: string; children?: React.ReactNode | undefined }) {
  const state = useStore(AuthCubit.state);
  // INITIAL =======================================================================================================
  if (state.screen == AuthScreens.INITIAL)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" isLoading={true} />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  // LOADING =======================================================================================================
  if (state.screen == AuthScreens.LOADING)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" isLoading={true} />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );

  if (state.screen !== AuthScreens.AUTHENTICATED)
    return (
      <div className="flex min-h-screen w-full">
        {/* Left side - Auth Form */}
        <div className="flex w-full flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
          <div className="w-full max-w-sm space-y-8 flex items-center flex-col">
            <RealXLogo size={2} />
            <AuthForm />
          </div>
        </div>

        {/* Right side - Wallpaper */}
        <div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(/assets/auth_bg.jpg)` }}
        >
          <div className="flex h-full w-full flex-col bg-white/50">
            <div className="relative h-full w-full overflow-hidden bg-gradient-to-r from-white via-primary/5 to-background">
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 bg-grid-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

              {/* Animated gradient orbs */}

              {/* Content */}
              <div className="relative flex h-full items-center justify-center p-12">
                <div className="text-center space-y-8 max-w-lg">
                  <div className="space-y-4">
                    <h1 className="text-5xl font-bold tracking-tight text-foreground/90">RealX World Assets</h1>
                    <p className="text-2xl">Tokenized for the Future</p>
                  </div>

                  {/* Feature highlights */}
                  <div className="grid grid-cols-2 gap-4 mt-12 text-sm ">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Secure & Transparent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      <span>Instant Transactions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Global Accessibility</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                      </svg>
                      <span>Smart Contracts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  return $.children;
}

interface ConfirmButtonProps {
  testId?: string;
  text: string;
  active: boolean;
  isLoading?: boolean;
  action: () => Promise<void> | void;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({ testId, text, active, isLoading = false, action }) => {
  const state = useStore(AuthCubit.state);

  const handleClick = async () => {
    console.log(state);
    if (!active || isLoading) return;

    console.log(text);

    try {
      await action();
    } catch (error: any) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "An unexpected error occurred",
      });
    }
  };

  const isDisabled = !active || isLoading;

  return (
    <Button
      data-testid={testId}
      onClick={handleClick}
      disabled={isDisabled || state.loading}
      className="w-full"
      variant="default"
    >
      {isLoading || state.loading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" isLoading={true} />
          {text}
        </>
      ) : (
        text
      )}
    </Button>
  );
};

const ScreenWrapper: React.FC<{
  title?: string;
  subtitle?: string;
  showExternalAuthProviders?: boolean;
  info?: ReactNode;
  content?: ReactNode;
  action?: ReactNode;
}> = ($) => {
  return (
    <div className=" space-y-9">
      {$.title && (
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-bold tracking-tight">{$.title}</h2>
          {$.subtitle && <p className="text-muted-foreground">{$.subtitle}</p>}
        </div>
      )}

      <div>
        {$.info && <div className="rounded-lg bg-muted p-4 mb-4">{$.info}</div>}
        {$.content}
        {$.action && <CardFooter>{$.action}</CardFooter>}
      </div>
    </div>
  );
};

function loadGSI(): Promise<any> {
  const google = (window as any).google;
  return new Promise((resolve) => {
    if (google) resolve(google);
    else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = async () => {
        const google = (window as any).google!;
        google.accounts.id.initialize({
          client_id: CONFIG.GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            if (!response.credential) return;
            AuthCubit.google_login(response.credential);
            try {
              //await AuthCubit.api.auth_check();
              await AuthCubit.check_auth();
            } catch (e) {
              console.log(e);
              Swal.fire({
                title: "Ошибка",
                text: "Произошла ошибка при авторизации",
                icon: "error",
                confirmButtonText: "Понятно",
                confirmButtonColor: "#3B82F6",
              });
            }
          },
        });
        resolve(google);
      };
      document.body.appendChild(script);
    }
  });
}

let google = await loadGSI();
/*
async function login() {
  console.log(google);
  document.cookie = "g_state=";
  google!.accounts.id.prompt();
}
* **/
function login() {
  console.log(google);
  document.cookie = "g_state=";

  // Cancel any existing prompts before showing a new one
  try {
    google!.accounts.id.cancel();
  } catch (e) {
    console.log(e);
    // Ignore errors if there's nothing to cancel
  }

  // Small delay to ensure cancellation is processed
  setTimeout(() => {
    google!.accounts.id.prompt();
  }, 100);
}
