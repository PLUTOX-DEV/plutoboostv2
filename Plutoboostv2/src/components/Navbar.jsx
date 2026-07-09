import React, { useState, useEffect, useRef, useContext } from "react";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  ArrowRight, 
  LogOut, 
  BookOpen, 
  Home, 
  Layers, 
  Phone, 
  CreditCard, 
  Youtube, 
  Instagram, 
  Twitter, 
  Globe, 
  ChevronRight, 
  Zap,
  User,
  HelpCircle,
  Gift,
  Settings
} from "lucide-react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserContext from "../context/UserContext";

// Custom TikTok Icon Component (since lucide-react doesn't export it)
const TikTokIcon = ({ className, size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-2.84 3.37-2.52V9.76c-3.53-.25-6.68 2.29-6.68 5.91 0 3.28 2.67 5.91 5.94 5.91 3.28 0 5.94-2.63 5.94-5.91V10.1c.93.66 2.03 1.06 3.18 1.09V8.09c-1.55 0-2.77-1.08-2.77-2.27z" />
  </svg>
);

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  // Check if mobile view
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  // Track scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { 
      name: "Home", 
      path: "/", 
      icon: Home 
    },
    {
      name: "Features",
      icon: Layers,
      children: [
        { name: "Instagram", path: "/pricing/instagram", icon: Instagram, color: "text-pink-500" },
        { name: "YouTube", path: "/pricing/youtube", icon: Youtube, color: "text-red-500" },
        { name: "X (Twitter)", path: "/pricing/twitter", icon: Twitter, color: "text-sky-400" },
        { name: "TikTok", path: "/pricing/tiktok", icon: TikTokIcon, color: "text-black" },
      ],
    },
    {
      name: "Resources",
      icon: BookOpen,
      children: [
        { name: "Blog", path: "/blog", icon: BookOpen },
        { name: "Help Center", path: "/help", icon: HelpCircle },
        { name: "Affiliate Program", path: "/affiliate", icon: Gift },
      ],
    },
    { 
      name: "Contact", 
      path: "/contact", 
      icon: Phone 
    },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-[60] transition-all duration-300 ${
        scrolled 
          ? "backdrop-blur-xl bg-black/80 border-b border-white/10 py-2 sm:py-3 shadow-lg" 
          : "bg-transparent py-3 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* LOGO */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-white font-bold text-lg sm:text-xl group"
        >
          <motion.div 
            whileHover={{ rotate: -10, scale: 1.1 }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25"
          >
            <Sparkles size={16} className="sm:w-[18px] sm:h-[18px]" />
          </motion.div>
          <span className="hidden xs:inline">
            Pluto<span className="text-purple-400">Boost</span>
          </span>
          <span className="xs:hidden">
            P<span className="text-purple-400">B</span>
          </span>
        </NavLink>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-gray-300">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              {item.children ? (
                <button
                  aria-expanded={dropdown === item.name}
                  onClick={() => setDropdown(dropdown === item.name ? null : item.name)}
                  onMouseEnter={() => setDropdown(item.name)}
                  onMouseLeave={() => setDropdown(null)}
                  className="flex items-center gap-1 hover:text-white transition relative py-2 text-sm lg:text-base"
                >
                  <item.icon size={16} className="opacity-60" />
                  {item.name}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdown === item.name ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1 hover:text-white transition relative py-2 text-sm lg:text-base
                    ${isActive ? "text-white" : ""}`
                  }
                >
                  <item.icon size={16} className="opacity-60" />
                  {item.name}
                  {isActivePath(item.path) && (
                    <motion.div 
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    />
                  )}
                </NavLink>
              )}

              {/* DESKTOP DROPDOWN */}
              <AnimatePresence>
                {item.children && dropdown === item.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    onMouseEnter={() => setDropdown(item.name)}
                    onMouseLeave={() => setDropdown(null)}
                    className="absolute left-0 mt-2 min-w-[220px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        onClick={() => setDropdown(null)}
                        to={child.path}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-purple-500/20 hover:text-white transition border-b border-white/5 last:border-0 group"
                      >
                        {child.icon && (
                          <div className={`${child.color || 'text-gray-400'} group-hover:scale-110 transition-transform`}>
                            <child.icon size={18} />
                          </div>
                        )}
                        <span>{child.name}</span>
                        <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="flex items-center gap-3 ml-2">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                    px-5 py-2.5 rounded-full text-white font-medium shadow-lg shadow-purple-500/25
                    hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm"
                >
                  Dashboard
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition px-3 py-2 text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                    px-5 py-2.5 rounded-full text-white font-medium shadow-lg shadow-purple-500/25
                    hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm"
                >
                  Get Started
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition touch-manipulation relative"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU - Improved */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 sm:px-6 py-6 flex flex-col gap-1 text-gray-300 max-h-[75vh] overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.name} className="border-b border-white/5 last:border-0">
                  {item.children ? (
                    <button
                      onClick={() => setDropdown(dropdown === item.name ? null : item.name)}
                      className="flex w-full justify-between items-center py-3.5 text-base hover:text-white transition"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className="text-purple-400" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${
                          dropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-3.5 text-base hover:text-white transition ${
                          isActive ? "text-white" : ""
                        }`
                      }
                    >
                      <item.icon size={18} className="text-purple-400" />
                      {item.name}
                    </NavLink>
                  )}

                  {/* MOBILE DROPDOWN */}
                  <AnimatePresence>
                    {item.children && dropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-4 pb-2 flex flex-col gap-1"
                      >
                        {item.children.map((child) => (
                          <NavLink
                            key={child.name}
                            to={child.path}
                            onClick={() => {
                              setOpen(false);
                              setDropdown(null);
                            }}
                            className="flex items-center gap-3 py-2.5 text-sm text-gray-400 hover:text-white transition pl-2"
                          >
                            {child.icon && <child.icon size={16} className={child.color || "text-gray-500"} />}
                            {child.name}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Mobile CTA */}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                        {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.username || 'User'}</p>
                        <p className="text-xs text-gray-400">{user.email || 'user@email.com'}</p>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="block bg-gradient-to-r from-purple-600 to-indigo-600
                        py-4 rounded-xl text-white font-semibold text-center
                        hover:from-purple-500 hover:to-indigo-500 transition-all"
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="block py-3 text-center text-white hover:text-purple-400 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="block bg-gradient-to-r from-purple-600 to-indigo-600
                        py-4 rounded-xl text-white font-semibold text-center
                        hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25"
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-center gap-6 text-xs text-gray-500">
                <span>© 2026 PlutoBoost</span>
                <span className="w-px h-4 bg-white/10" />
                <span>v2.0.0</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}