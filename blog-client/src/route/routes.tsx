import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { SignIn } from "../containers/auth/SignIn";
import { AuthProvider } from "../providers/AuthProvider";
import { RequireAuth } from "../components/RequireAuth";
import { SignUp } from "../containers/auth/SignUp";

const Chat = lazy(() => import("../containers/catalogs"));

export const AllRoutes = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<RequireAuth />}>
            <Route path="catalogs" element={<Chat />} />
          </Route>
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};
