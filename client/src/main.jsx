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
import ChooseRole from "./pages/ChooseRole";
import { theme } from "./utils/mantineTheme";
import { Notifications } from "@mantine/notifications";
import JobDetail from "./pages/JobDetail.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import NotFound from "./pages/NotFound";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

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
          <Route path="/job/:id" element={<JobDetail />} />
        </Route>

        <Route path="/auth/callback" element={<PostAuthRedirect />} />
        {/* <Route path="/choose-role" element={<ChooseRole />} /> */}
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  )
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications />
          <RouterProvider router={router} />
        </MantineProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
