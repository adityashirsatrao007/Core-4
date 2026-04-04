import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Landing page
import Landing from "@/pages/Landing";

// Auth pages
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import AuthCallback from "@/pages/auth/AuthCallback";

// App pages
import Dashboard from "@/pages/dashboard/Dashboard";
import Projects from "@/pages/projects/Projects";
import ProjectDetails from "@/pages/projects/ProjectDetails";
import ErrorsList from "@/pages/errors/ErrorsList";
import ErrorDetails from "@/pages/errors/ErrorDetails";
import Settings from "@/pages/settings/Settings";

const router = createBrowserRouter([
  // ── Landing page — public, redirect to dashboard if already logged in ──────
  { path: "/", element: <PublicOnlyRoute><Landing /></PublicOnlyRoute> },

  // ── Public auth routes ────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },

  // OAuth callback — no layout, handled inline
  { path: "/auth/callback", element: <AuthCallback /> },

  // ── Protected app routes ──────────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          // Dashboard
          { path: "/dashboard", element: <Dashboard /> },

          // Projects — scoped under org
          { path: "/orgs/:orgId/projects", element: <Projects /> },
          { path: "/orgs/:orgId/projects/:projectId", element: <ProjectDetails /> },

          // Issues — scoped under project
          {
            path: "/orgs/:orgId/projects/:projectId/issues",
            element: <ErrorsList />,
          },
          {
            path: "/orgs/:orgId/projects/:projectId/issues/:issueId",
            element: <ErrorDetails />,
          },

          // Settings
          { path: "/settings", element: <Settings /> },
        ],
      },
    ],
  },

  // Catch-all
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
