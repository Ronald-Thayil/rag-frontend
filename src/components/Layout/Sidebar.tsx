import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  const role = user?.role;

  const isAdmin = role === "admin";
  const canManageUsers = isAdmin || role === "company_admin";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-900">
            {isAdmin ? "Admin Panel" : "Company Panel"}
          </span>
        </div>

        <nav className="p-4 space-y-1">
          <NavLink
            to="/dashboard"
            end
            onClick={onClose}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span>📊</span>
            Dashboard
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin/companies"
              onClick={onClose}
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span>🏢</span>
              Companies
            </NavLink>
          )}

          {canManageUsers && (
            <NavLink
              to="/admin/users"
              onClick={onClose}
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span>👥</span>
              Users
            </NavLink>
          )}
        </nav>

        {/* <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-400 truncate">{user?.email}</div>
          <div className="text-xs text-gray-400 capitalize">Role: {role}</div>
        </div> */}
      </aside>
    </>
  );
}
