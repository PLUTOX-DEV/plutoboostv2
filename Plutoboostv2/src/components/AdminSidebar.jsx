import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserContext";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Wallet,
  Server,
  LogOut,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  X,
  Eye,
  Bell,
  Menu,
  Sparkles,
  ChevronRight,
  Settings,
  HelpCircle,
  Gift,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react";

export default function AdminSidebar({ open, setOpen }) {
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  const links = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, color: "text-purple-400" },
    { name: "Users", path: "/admin/users", icon: Users, color: "text-blue-400" },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart, color: "text-amber-400" },
    { name: "Deposits", path: "/admin/deposits", icon: DollarSign, color: "text-emerald-400" },
    { name: "Blog", path: "/admin/blog", icon: BookOpen, color: "text-pink-400" },
    { name: "Fees Report", path: "/admin/fees", icon: TrendingUp, color: "text-indigo-400" },
    { name: "System", path: "/admin/system", icon: Server, color: "text-cyan-400" },
    { name: "Watchdog", path: "/admin/watchdog", icon: Eye, color: "text-red-400" },
    { name: "Notifications", path: "/admin/notifications", icon: Bell, color: "text-yellow-400" },
  ];

  const bottomLinks = [
    { name: "Settings", path: "/admin/settings", icon: Settings },
    { name: "Help", path: "/admin/help", icon: HelpCircle },
  ];

  return (
    <>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="fixed left-0 top-0 h-screen w-64 lg:w-72 xl:w-80 2xl:w-96 bg-black/60 backdrop-blur-xl border-r border-white/10 hidden lg:flex flex-col z-50 shadow-2xl shadow-purple-500/5">
        <SidebarContent 
          links={links} 
          bottomLinks={bottomLinks}
          isMobile={false}
        />
      </aside>

      {/* ===== MOBILE SIDEBAR ===== */}
      <AnimatePresence>
        {open && (
          <>
            {/* OVERLAY */}
            <motion.div
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* DRAWER */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-screen w-[280px] sm:w-72 bg-black/95 backdrop-blur-xl border-r border-white/10 z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent 
                links={links} 
                bottomLinks={bottomLinks}
                isMobile={true}
                onClose={() => setOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ===== SHARED CONTENT ===== */
function SidebarContent({ links, bottomLinks, isMobile, onClose }) {
  const { logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* LOGO / HEADER */}
      <div className={`flex items-center justify-between px-5 py-5 border-b border-white/10 ${isMobile ? 'pt-6' : ''}`}>
        <NavLink 
          to="/admin" 
          className="flex items-center gap-2.5 group"
          onClick={onClose}
        >
          <motion.div 
            whileHover={{ rotate: -10, scale: 1.1 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25"
          >
            <ShieldCheck size={18} className="text-white" />
          </motion.div>
          <div>
            <span className="text-lg font-bold text-white">
              Pluto<span className="text-purple-400">Admin</span>
            </span>
            <p className="text-[10px] text-gray-500 leading-none">Management Panel</p>
          </div>
        </NavLink>

        {/* Close button - only on mobile */}
        {isMobile && (
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition touch-manipulation"
          >
            <X size={20} className="text-gray-400 hover:text-white" />
          </button>
        )}
      </div>

      {/* USER PROFILE (Mobile) */}
      {isMobile && user && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.username || 'Admin'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email || 'admin@plutoboost.com'}</p>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none">
        <p className="px-3 text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">
          Main Menu
        </p>
        {links.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end
              onClick={onClose}
              className={({ isActive: active }) =>
                `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 relative
                ${
                  active
                    ? "bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.15)] border border-purple-500/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="admin-sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-purple-500 to-indigo-500"
                />
              )}
              
              <item.icon size={18} className={`${isActive ? item.color || 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'} transition`} />
              <span className="flex-1">{item.name}</span>
              
              {isActive && (
                <ChevronRight size={14} className="text-purple-400 opacity-50" />
              )}
            </NavLink>
          );
        })}

        {/* Divider */}
        <div className="my-4 px-3">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Bottom Links */}
        <p className="px-3 text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">
          System
        </p>
        {bottomLinks.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200
              ${
                isActive
                  ? "bg-white/5 text-purple-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon size={18} className="text-gray-500" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM SECTION */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {/* Admin Stats (Desktop) */}
        <div className="hidden lg:flex items-center justify-between px-3 py-2 rounded-xl bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-400">Online</span>
          </div>
          <span className="text-xs text-gray-500">v2.0.0</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          <span>Logout</span>
        </button>
      </div>

      {/* VERSION (Mobile) */}
      {isMobile && (
        <div className="text-center py-3 text-[10px] text-gray-500 border-t border-white/10">
          PlutoAdmin v2.0.0
        </div>
      )}
    </div>
  );
}