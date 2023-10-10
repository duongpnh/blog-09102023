import { createContext } from "react";

export type TAuthUser = {
  token?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  username?: string;
};

export type TAuthContext = {
  user?: string | null;
  isAuthenticated: boolean;
  signIn: (args: string, callback: VoidFunction) => void;
  signOut: (callback: VoidFunction) => void;
};

export const defaultAuthContext: TAuthContext = {
  isAuthenticated: false,
  user: null,
  signIn(args: string, cb: VoidFunction) {
    defaultAuthContext.isAuthenticated = !!args;
    setTimeout(cb, 100);
  },
  signOut(cb: VoidFunction) {
    defaultAuthContext.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

export const AuthContext = createContext<TAuthContext>(defaultAuthContext);
