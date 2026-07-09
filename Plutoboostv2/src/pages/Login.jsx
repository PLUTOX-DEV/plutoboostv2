import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Mail,
  ArrowRight,
  Sparkles,
  Shield,
  CheckCircle,
  AlertCircle,
  Github,
  Chrome,
  Facebook as FacebookIcon,
  UserPlus,
} from "lucide-react";
import Navbar from "../components/Navbar";
import GoogleIcon from "../components/icons/GoogleIcon";
import api from "../api";
import { useUser } from "../context/UserContext";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { staggerChildren: 0.1 }
};

export default function LoginPage() {
  const { login, user } = useUser();
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

  const handleGoogleLogin = () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(username.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0E2A] text-white">
      {/* NAVBAR */}
      <Navbar />

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.25),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.15),transparent_60%)]" />
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
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

      {/* LOGIN FORM */}
      <section className="relative z-10 mx-auto mt-20 sm:mt-24 lg:mt-28 max-w-6xl px-4 sm:px-6 min-h-[80vh] flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* LEFT - Brand Section */}
          <motion.div 
            {...(isMobileView ? {} : fadeInUp)}
            className="flex flex-col justify-center space-y-6 order-2 lg:order-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mx-auto lg:mx-0 w-fit"
            >
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-xs font-medium text-purple-300">Secure Login</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              Welcome Back to <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400">
                PlutoBoost
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-sm mx-auto lg:mx-0">
              Sign in to manage your campaigns, track growth, and boost your social media presence.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Shield size={14} className="text-emerald-400" />
                Secure Encryption
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <CheckCircle size={14} className="text-emerald-400" />
                Instant Access
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <CheckCircle size={14} className="text-emerald-400" />
                24/7 Support
              </div>
            </div>

            {/* Sign Up Button - Added here */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center lg:justify-start">
              <button 
                onClick={() => navigate("/register")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                <UserPlus size={18} />
                Create Account
                <ArrowRight size={16} />
              </button>
              <p className="text-xs text-gray-500 self-center">
                or{" "}
                <button 
                  onClick={() => navigate("/register")}
                  className="text-purple-400 hover:text-purple-300 font-medium transition hover:underline"
                >
                  sign up here
                </button>
              </p>
            </div>
          </motion.div>

          {/* RIGHT - Login Form */}
          <motion.div 
            {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.1 } })}
            className="order-1 lg:order-2"
          >
            <GlassCard>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Lock size={16} className="text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Sign In
                  </h2>
                </div>

                {/* Social Login */}
                <SocialButton 
                  icon={<GoogleIcon />} 
                  text="Continue with Google" 
                  onClick={handleGoogleLogin} 
                />

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-[#0B0E2A] text-gray-500">or continue with</span>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <Input 
                    icon={User} 
                    placeholder="Username or Email" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <PasswordInput
                    show={showPass}
                    setShow={setShowPass}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 text-sm text-red-400 flex items-center gap-2"
                    >
                      <AlertCircle size={14} />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Forgot Password */}
                <div className="flex items-center justify-between mt-3">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-purple-400 hover:text-purple-300 transition hover:underline"
                  >
                    Forgot password?
                  </Link>
                  <span className="text-xs text-gray-500">Need help?</span>
                </div>

                {/* Login Button */}
                <PrimaryButton 
                  text={loading ? "Logging in..." : "Sign In"} 
                  onClick={handleLogin} 
                  disabled={loading} 
                />

                {/* Sign Up Link - Added inside the card */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Don't have an account?{" "}
                    <button 
                      onClick={() => navigate("/register")}
                      className="text-purple-400 hover:text-purple-300 font-medium transition hover:underline inline-flex items-center gap-1"
                    >
                      Sign up now
                      <ArrowRight size={12} />
                    </button>
                  </p>
                </div>

                {/* Terms */}
                <p className="text-[10px] text-gray-500 text-center mt-4">
                  By signing in, you agree to our{" "}
                  <Link to="/terms" className="text-purple-400 hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link>
                </p>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 mt-16 sm:mt-20 lg:mt-28 mb-6 text-center text-xs sm:text-sm text-gray-500">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <span>© 2026 PlutoBoost</span>
          <span className="w-px h-4 bg-white/10" />
          <Link to="/privacy" className="hover:text-gray-300 transition">Privacy Policy</Link>
          <span className="w-px h-4 bg-white/10" />
          <Link to="/terms" className="hover:text-gray-300 transition">Terms of Service</Link>
          <span className="w-px h-4 bg-white/10" />
          <Link to="/help" className="hover:text-gray-300 transition">Help Center</Link>
        </div>
      </footer>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function GlassCard({ children }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-shadow"
    >
      {children}
    </motion.div>
  );
}

function SocialButton({ icon, text, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-white transition hover:bg-white/10 hover:border-white/20"
    >
      {icon}
      <span className="text-sm">{text}</span>
    </motion.button>
  );
}

function PrimaryButton({ text, onClick, disabled }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 font-semibold text-white transition hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
    >
      {disabled ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Logging in...
        </>
      ) : (
        <>
          Sign In
          <ArrowRight size={18} />
        </>
      )}
    </motion.button>
  );
}

function Input({ icon: Icon, placeholder, value, onChange, onKeyPress }) {
  return (
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-10 py-3 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500"
      />
    </div>
  );
}

function PasswordInput({ show, setShow, placeholder, value, onChange, onKeyPress }) {
  return (
    <div className="relative group">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition" />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-10 py-3 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500 pr-12"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}