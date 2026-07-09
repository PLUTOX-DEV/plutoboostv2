import { NavLink } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import UserContext from "../context/UserContext";
import api from "../api";
import {
  Bell,
  LayoutDashboard,
  Wallet,
  Users,
  ShoppingCart,
  BarChart3,
  LogOut,
  HelpCircle,
  Menu,
  X,
  Gift,
  Sparkles,
  ChevronRight,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const { user, balance, logout } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const closeBtnRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Close on swipe right (mobile)
  useEffect(() => {
    if (!open) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX < 50 && touchEndX - touchStartX > 50) {
        setOpen(false);
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [open]);

  const items = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Add Funds", path: "/addfunds", icon: Wallet },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Wallet", path: "/wallet", icon: Wallet },
  ];

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get('/api/notifications');
        const unread = res.data.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Could not fetch unread count", err);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const SidebarContent = ({ mobile }) => (
    <aside
      ref={sidebarRef}
      className={`w-[280px] sm:w-64 lg:w-72 xl:w-80 2xl:w-96 max-w-[85vw] min-h-screen bg-black/60 backdrop-blur-xl border-r border-white/10
      p-4 lg:p-5 xl:p-6 flex flex-col overflow-y-auto
      ${mobile ? "fixed inset-y-0 left-0 z-50" : "hidden lg:flex fixed inset-y-0 left-0 z-40"}`}
    >
      {/* CLOSE BUTTON - Only show when sidebar is open on mobile */}
      {mobile && open && (
        <button
          type="button"
          ref={closeBtnRef}
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition touch-manipulation lg:hidden"
        >
          <X size={20} />
        </button>
      )}

      {/* LOGO */}
      <div className="flex items-center gap-2 mb-6 lg:mb-8">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Sparkles size={16} className="lg:w-5 lg:h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg lg:text-xl font-bold gradient-text truncate">PlutoBoost</h1>
          <p className="text-[9px] lg:text-[10px] text-gray-400">Social Growth Platform</p>
        </div>
      </div>
      
      {/* USER CARD */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-3 lg:p-4 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 border border-purple-500/20">
        <div className="absolute top-0 right-0 w-16 lg:w-20 h-16 lg:h-20 bg-purple-500/20 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 lg:gap-3 min-w-0">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs lg:text-sm font-bold flex-shrink-0">
                {user ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs lg:text-sm truncate">{user ? user.username : 'User'}</p>
                <p className="text-[10px] lg:text-xs text-gray-400 truncate">{user ? 'Logged in' : 'Not logged in'}</p>
              </div>
            </div>
            <ChevronRight size={14} className="lg:w-4 lg:h-4 text-gray-400 flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-white/10">
          <p className="text-[10px] lg:text-xs text-gray-400">Balance</p>
          <p className="text-base lg:text-lg font-bold text-purple-400">₦{balance.toLocaleString()}</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="space-y-1 flex-1 overflow-y-auto">
        <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider mb-2 px-2 lg:px-3">Menu</p>
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/dashboard"}
            onClick={() => mobile && setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm transition-all duration-300 min-h-[44px]
              ${
                isActive
                  ? "bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-purple-300 border border-purple-500/30 shadow-glow-sm"
                  : "text-gray-400 hover:bg-white/5 hover:text-white active:bg-white/10"
              }`
            }
          >
            <item.icon size={16} className="lg:w-[18px] lg:h-[18px] flex-shrink-0" />
            <span className="truncate flex-1 pr-2">{item.name}</span>
            {item.name === "Notifications" && unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-purple-600 rounded-full">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </NavLink>
        ))}

        {/* AFFILIATE CTA */}
        <div className="pt-3 lg:pt-4">
          <NavLink
            to="/affiliate"
            onClick={() => mobile && setOpen(false)}
            className="relative overflow-hidden flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm min-h-[44px]
            bg-gradient-to-r from-purple-600 to-indigo-600
            text-white font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
          >
            <Gift size={16} className="lg:w-[18px] lg:h-[18px] flex-shrink-0" />
            <span className="truncate">Affiliate Program</span>
            <span className="absolute top-1 right-1 lg:right-2 px-1 lg:px-1.5 py-0.5 text-[7px] lg:text-[8px] bg-amber-500 rounded-full font-bold">
              NEW
            </span>
          </NavLink>
        </div>
      </nav>

      {/* FOOTER */}
      <div className="pt-3 lg:pt-4 mt-3 lg:mt-4 border-t border-white/10 space-y-1">
        <NavLink
          to="/settings"
          onClick={() => mobile && setOpen(false)}
          className={({ isActive }) =>
            `flex w-full items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition text-xs lg:text-sm min-h-[44px]
            ${isActive ? "text-purple-300 bg-white/5" : "text-gray-400 hover:bg-white/5 hover:text-white active:bg-white/10"}`
          }
        >
          <Settings size={16} className="lg:w-[18px] lg:h-[18px] flex-shrink-0" />
          <span className="truncate">Settings</span>
        </NavLink>
        
        <NavLink
          to="/help"
          onClick={() => mobile && setOpen(false)}
          className={({ isActive }) =>
            `flex w-full items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition text-xs lg:text-sm min-h-[44px]
            ${isActive ? "text-purple-300 bg-white/5" : "text-gray-400 hover:bg-white/5 hover:text-white active:bg-white/10"}`
          }
        >
          <HelpCircle size={16} className="lg:w-[18px] lg:h-[18px] flex-shrink-0" />
          <span className="truncate">Get Help</span>
        </NavLink>

        <button
          onClick={() => {
            logout();
            if (mobile) setOpen(false);
          }}
          className="flex w-full items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition text-xs lg:text-sm min-h-[44px]"
        >
          <LogOut size={16} className="lg:w-[18px] lg:h-[18px] flex-shrink-0" />
          <span className="truncate">Logout</span>
        </button>
      </div>

      {/* VERSION */}
      <div className="mt-3 lg:mt-4 text-center">
        <p className="text-[9px] lg:text-[10px] text-gray-600">PlutoBoost v2.0.0</p>
      </div>
    </aside>
  );

  return (
    <>
      {/* FLOATING HAMBURGER BUTTON - Visible only on mobile */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="lg:hidden fixed top-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl text-white shadow-lg active:scale-95 transition touch-manipulation"
      >
        <Menu size={24} />
      </button>

      {/* DESKTOP SIDEBAR */}
      <SidebarContent />

      {/* MOBILE OVERLAY + SIDEBAR */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-y-0 left-0 z-50 lg:hidden"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative h-full animate-slide-in-left"
            >
              <SidebarContent mobile />
            </div>
          </div>
        </>
      )}
    </>
  );
}