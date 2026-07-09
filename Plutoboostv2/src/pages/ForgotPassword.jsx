import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Sparkles,
  Shield,
  Lock,
  Key,
  ArrowRight
} from "lucide-react";
import api from "../api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus({ type: "error", text: "Please enter your email address" });
      return;
    }
    setLoading(true);
    setStatus({ type: "", text: "" });
    try {
      const res = await api.post("/api/forgot-password", { email });
      setStatus({ type: "success", text: res.data.message || "Reset link sent to your email!" });
      setEmail("");
    } catch (err) {
      setStatus({ 
        type: "error", 
        text: err.response?.data?.error || "An error occurred. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0E2A] text-white">
      {/* NAVBAR */}
      <Navbar />

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.20),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.15),transparent_60%)]" />
        
        {/* Animated particles */}
        {[...Array(15)].map((_, i) => (
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

      {/* FORGOT PASSWORD FORM */}
      <section className="relative z-10 min-h-[80vh] flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-12">
        <motion.div
          {...(isMobileView ? {} : fadeInUp)}
          className="w-full max-w-md"
        >
          <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-purple-500/10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center mb-4"
              >
                <Key size={28} className="text-purple-400" />
              </motion.div>
              
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                Forgot Password
              </h1>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                Enter your email to receive a password reset link
              </p>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {status.type === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-sm p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 mb-4"
                >
                  <CheckCircle size={18} className="shrink-0" />
                  <span>{status.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-purple-300 transition" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status.text) setStatus({ type: "", text: "" });
                  }}
                  placeholder="Enter your email address"
                  className="input-glass w-full pl-10 pr-4 py-3 text-sm sm:text-base min-h-[48px]"
                  required
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {status.type === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-sm p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300"
                  >
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{status.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading} 
                className="btn-primary w-full flex items-center justify-center gap-2 min-h-[52px] text-sm sm:text-base font-semibold"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Reset Link
                    <ArrowRight size={16} className="ml-1" />
                  </>
                )}
              </motion.button>

              {/* Security Info */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                <Shield size={14} className="text-emerald-400" />
                <span>Secure & Encrypted</span>
              </div>
            </form>

            {/* Back to Login */}
            <div className="text-center mt-6 pt-6 border-t border-white/10">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition hover:underline group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>

            {/* Help Text */}
            <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-4">
              We'll send you a link to reset your password if an account exists with this email.
            </p>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 mb-6 text-center text-xs text-gray-500">
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