import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Key,
  Fingerprint,
  Server,
  Zap,
} from "lucide-react";
import { useContext } from "react";
import UserContext from "../context/UserContext";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function AdminLoginPage() {
  const { adminLogin } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  const handleAdminLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await adminLogin(username, password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Admin login failed. Please try again.");
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdminLogin();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07091F] text-white flex items-center justify-center">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.25),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.15),transparent_60%)]" />
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* ADMIN LOGIN CARD */}
      <motion.div 
        {...(isMobileView ? {} : fadeInUp)}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-red-500/5">
          {/* HEADER */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30"
            >
              <Shield size={36} className="text-white" />
            </motion.div>
            
            <h1 className="text-2xl sm:text-3xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-400 to-red-400">
                Admin Access
              </span>
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Enter admin credentials to access the control panel
            </p>
            
            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle size={12} />
                Secure Connection
              </div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <Input
              icon={User}
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <PasswordInput
              show={showPass}
              setShow={setShowPass}
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </form>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-sm text-red-400 text-center flex items-center justify-center gap-2"
              >
                <AlertCircle size={16} />
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdminLogin}
            disabled={loading}
            className="w-full mt-6 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 py-3.5 font-semibold text-white transition hover:from-red-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Access Admin Panel
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Lock size={12} className="text-emerald-400" />
                <span>256-bit Encryption</span>
              </div>
              <span className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Fingerprint size={12} className="text-purple-400" />
                <span>Secure Session</span>
              </div>
              <span className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Server size={12} className="text-blue-400" />
                <span>Restricted Access</span>
              </div>
            </div>
          </div>

          {/* Back to Site */}
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-gray-500 hover:text-gray-300 transition flex items-center justify-center gap-1 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Return to PlutoBoost
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6">
          <p className="text-[10px] text-gray-600">
            ⚠️ This area is restricted to authorized administrators only
          </p>
          <p className="text-[10px] text-gray-600 mt-1">
            All access attempts are logged and monitored
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Input({ icon: Icon, placeholder, value, onChange, onKeyPress, disabled }) {
  return (
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={disabled}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-10 py-3 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500 min-h-[48px] disabled:opacity-50"
      />
    </div>
  );
}

function PasswordInput({ show, setShow, placeholder, value, onChange, onKeyPress, disabled }) {
  return (
    <div className="relative group">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition" />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={disabled}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-10 py-3 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500 pr-12 min-h-[48px] disabled:opacity-50"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition touch-manipulation disabled:opacity-50"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}