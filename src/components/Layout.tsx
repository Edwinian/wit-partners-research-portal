import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { CONTENT_PAGES } from "../types";
import { useStore } from "../store";

export function Layout() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  return (
    <div className="app">
      <aside className="sidebar">
        <p className="brand-kicker">WIT Partners</p>
        <div className="brand">Research Portal</div>
        <NavLink to="/home" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          Home
        </NavLink>
        {CONTENT_PAGES.map((page) => (
          <NavLink
            key={page.path}
            to={page.path}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            {page.label}
          </NavLink>
        ))}
        <NavLink to="/assistant" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          Assistant
        </NavLink>
        <div className="sidebar-foot">
          <strong>{currentUser?.display_name}</strong>
          {currentUser?.role.replaceAll("_", " ")}
          <div className="row-actions">
            <button
              className="btn ghost small"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
