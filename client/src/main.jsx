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
import '@mantine/core/styles.css';
import "./index.css";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

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
