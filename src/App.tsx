import { HashRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Assistant } from "./pages/Assistant";
import { ContentPage } from "./pages/ContentPage";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { StoreProvider, useStore } from "./store";
import { CONTENT_PAGES } from "./types";

function Guard() {
  const { ready, error, currentUser } = useStore();
  if (error) return <div className="empty">{error}</div>;
  if (!ready) return <div className="empty">Loading demo data…</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Guard />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          {CONTENT_PAGES.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={<ContentPage title={page.label} contentType={page.contentType} />}
            />
          ))}
          <Route path="/assistant" element={<Assistant />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </StoreProvider>
  );
}
