import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import { AuthProvider } from "./contexts/auth.context";
import ProtectedRoutes from "./components/Routing/ProtectedRoutes";
import { Layout } from "./components/layout/layout";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import PostAuthRedirect from "./pages/PostAuthRedirect";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "./index.css";
import ChooseRole from "./pages/ChooseRole";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/account">
            <Route index element={<Profile />} />
            <Route path="edit-profile" element={<EditProfile />} />
          </Route>
        </Route>
        <Route path="/auth/callback" element={<PostAuthRedirect />} />
        <Route path="/choose-role" element={<ChooseRole />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <MantineProvider defaultColorScheme="dark">
        <RouterProvider router={router} />
      </MantineProvider>
    </AuthProvider>
  </React.StrictMode>
);
