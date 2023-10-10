// import { useProvideAuth } from "../hooks/useProvideAuth"
import { useState } from "react";
import { AuthContext, defaultAuthContext } from "../contexts/authContext";

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<string | null>(null);

  const signIn = (userInfo: string, callback: VoidFunction) => {
    return defaultAuthContext.signIn(userInfo, () => {
      localStorage.setItem("user", userInfo);
      setUser(userInfo);
      callback();
    });
  };

  const signOut = (callback: VoidFunction) => {
    return defaultAuthContext.signOut(() => {
      localStorage.removeItem("user");
      setUser(null);
      callback();
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
