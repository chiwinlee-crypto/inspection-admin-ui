import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./state/auth";
import { AppLayout } from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Issues from "./pages/Issues";
import IssueDetail from "./pages/IssueDetail";
import Inspections from "./pages/Inspections";
import Areas from "./pages/Areas";
import Exports from "./pages/Exports";
import AdminUsers from "./pages/admin/Users";
import AdminOrgs from "./pages/admin/Orgs";
import AdminProjects from "./pages/admin/Projects";

function RequireAuth({ children }: { children: any }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}

function RequireAdmin({ children }: { children: any }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/*"
        element={
          <RequireAuth>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/issues" element={<Issues />} />
                <Route path="/issues/:id" element={<IssueDetail />} />
                <Route path="/inspections" element={<Inspections />} />
                <Route path="/areas" element={<Areas />} />
                <Route path="/exports" element={<Exports />} />

                <Route
                  path="/admin/users"
                  element={
                    <RequireAdmin>
                      <AdminUsers />
                    </RequireAdmin>
                  }
                />
                <Route
                  path="/admin/orgs"
                  element={
                    <RequireAdmin>
                      <AdminOrgs />
                    </RequireAdmin>
                  }
                />
                <Route
                  path="/admin/projects"
                  element={
                    <RequireAdmin>
                      <AdminProjects />
                    </RequireAdmin>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </RequireAuth>
        }
      />
    </Routes>
  );
}
