import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Link2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Trash2,
  RefreshCw,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  Smartphone,
  Fingerprint,
  Key,
  LogOut,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import GoogleIcon from "../components/icons/GoogleIcon";
import UserContext from "../context/UserContext";
import api from "../api";
import XIcon from "../components/icons/XIcon";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

function SettingsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-pulse">
      <div>
        <div className="h-8 bg-gray-700/50 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 space-y-6">
            <div className="h-6 bg-gray-700/50 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-700/50 rounded-lg"></div>
              <div className="h-12 bg-gray-700/50 rounded-lg"></div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 space-y-6">
            <div className="h-6 bg-gray-700/50 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-700/50 rounded-lg"></div>
              <div className="h-12 bg-gray-700/50 rounded-lg"></div>
              <div className="h-12 bg-gray-700/50 rounded-lg"></div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 space-y-6">
            <div className="h-6 bg-gray-700/50 rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-700/50 rounded-xl"></div>
              <div className="h-16 bg-gray-700/50 rounded-xl"></div>
            </div>
          </div>
          <div className="h-12 bg-gray-700/50 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user, setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [theme, setTheme] = useState('dark');
  
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    loading: false,
  });

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        username: user.username,
        email: user.email,
      }));
    }
  }, [user]);

  const [connectedAccounts, setConnectedAccounts] = useState({
    google: true,
    twitter: false,
  });

  const handleSave = async () => {
    setProfile(prev => ({ ...prev, loading: true }));
    setNotification({ show: false, message: '', type: '' });
    try {
      if (profile.username !== user.username || profile.email !== user.email) {
        const res = await api.put('/api/user/profile', { username: profile.username, email: profile.email });
        setUser(prevUser => ({ ...prevUser, username: profile.username, email: profile.email }));
      }

      if (profile.newPassword) {
        if (profile.newPassword !== profile.confirmPassword) {
          setNotification({ show: true, message: 'New passwords do not match.', type: 'error' });
          setProfile(prev => ({ ...prev, loading: false }));
          return;
        }
        if (profile.newPassword.length < 8) {
          setNotification({ show: true, message: 'Password must be at least 8 characters.', type: 'error' });
          setProfile(prev => ({ ...prev, loading: false }));
          return;
        }
        await api.put('/api/user/password', { currentPassword: profile.currentPassword, newPassword: profile.newPassword });
        setProfile(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      }

      setNotification({ show: true, message: 'Settings saved successfully!', type: 'success' });
    } catch (err) {
      setNotification({ show: true, message: err.response?.data?.error || 'Failed to save settings.', type: 'error' });
    } finally {
      setProfile(prev => ({ ...prev, loading: false }));
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
    }
  };

  const handleDeleteAccount = async () => {
    setProfile(prev => ({ ...prev, loading: true }));
    try {
      await api.delete('/api/user/account');
      alert("Account deleted successfully. You will be logged out.");
      window.location.href = '/login';
    } catch (err) {
      setNotification({ show: true, message: err.response?.data?.error || 'Failed to delete account.', type: 'error' });
      setProfile(prev => ({ ...prev, loading: false }));
    }
  };

  const toggleConnection = (provider) => {
    setConnectedAccounts(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  if (!user) {
    return (
      <div className="flex min-h-screen bg-[#07091F] text-white">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden pt-16 sm:pt-6">
          <SettingsSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#07091F] text-white">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden pt-16 sm:pt-6">
        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-8">
          {/* HEADER */}
          <motion.div {...(isMobileView ? {} : fadeInUp)} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text flex items-center gap-2">
                <SettingsIcon className="text-purple-400" size={24} />
                Settings
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Manage your account settings and preferences
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="glass rounded-xl px-3 py-2 flex items-center gap-2">
                <Shield size={16} className="text-emerald-400" />
                <span className="text-xs text-gray-400">Secure Account</span>
              </div>
            </div>
          </motion.div>

          {/* NOTIFICATION */}
          <AnimatePresence>
            {notification.show && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border text-sm sm:text-base ${
                  notification.type === 'success' 
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                    : 'bg-red-500/20 border-red-500/30 text-red-400'
                }`}
              >
                {notification.type === 'success' ? <CheckCircle size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
                <span>{notification.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-5 sm:space-y-8">
              {/* PROFILE SECTION */}
              <motion.div {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.1 } })} className="glass card-hover rounded-2xl p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-5 sm:mb-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <User size={18} className="text-purple-400" />
                  </div>
                  Profile Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm text-gray-400 mb-2 block">Username</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        value={profile.username} 
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })} 
                        className="input-glass w-full pl-10 min-h-[48px] text-sm sm:text-base" 
                        placeholder="Enter username" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-400 mb-2 block">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        value={profile.email} 
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                        className="input-glass w-full pl-10 min-h-[48px] text-sm sm:text-base" 
                        placeholder="Enter email" 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* PASSWORD SECTION */}
              <motion.div {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.2 } })} className="glass card-hover rounded-2xl p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-5 sm:mb-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Lock size={18} className="text-purple-400" />
                  </div>
                  Change Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm text-gray-400 mb-2 block">Current Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={profile.currentPassword} 
                        onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })} 
                        className="input-glass w-full pl-10 pr-10 min-h-[48px] text-sm sm:text-base" 
                        placeholder="Enter current password" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition touch-manipulation"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-400 mb-2 block">New Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        value={profile.newPassword} 
                        onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })} 
                        className="input-glass w-full pl-10 pr-10 min-h-[48px] text-sm sm:text-base" 
                        placeholder="Enter new password" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowNewPassword(!showNewPassword)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition touch-manipulation"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {profile.newPassword && profile.newPassword.length > 0 && profile.newPassword.length < 8 && (
                      <p className="text-[10px] sm:text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        Password must be at least 8 characters
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-400 mb-2 block">Confirm New Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={profile.confirmPassword} 
                        onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })} 
                        className="input-glass w-full pl-10 pr-10 min-h-[48px] text-sm sm:text-base" 
                        placeholder="Confirm new password" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition touch-manipulation"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {profile.newPassword && profile.confirmPassword && profile.newPassword !== profile.confirmPassword && (
                      <p className="text-[10px] sm:text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        Passwords do not match
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-5 sm:space-y-8">
              {/* CONNECTED ACCOUNTS */}
              <motion.div {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.3 } })} className="glass card-hover rounded-2xl p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-5 sm:mb-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Link2 size={18} className="text-purple-400" />
                  </div>
                  Connected Accounts
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                        <GoogleIcon />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">Google</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">{connectedAccounts.google ? "Connected" : "Not connected"}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleConnection("google")} 
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium transition-all touch-manipulation ${
                        connectedAccounts.google 
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                          : "bg-purple-600 text-white hover:bg-purple-500"
                      }`}
                    >
                      {connectedAccounts.google ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-black flex items-center justify-center border border-white/10 shrink-0">
                        <XIcon />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">X (Twitter)</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">{connectedAccounts.twitter ? "Connected" : "Not connected"}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleConnection("twitter")} 
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium transition-all touch-manipulation ${
                        connectedAccounts.twitter 
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                          : "bg-purple-600 text-white hover:bg-purple-500"
                      }`}
                    >
                      {connectedAccounts.twitter ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-4">Connect your social accounts for easier login.</p>
              </motion.div>

              {/* THEME PREFERENCE */}
              <motion.div {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.35 } })} className="glass card-hover rounded-2xl p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Monitor size={18} className="text-purple-400" />
                  </div>
                  Appearance
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition ${
                      theme === 'light' 
                        ? 'bg-purple-500/20 border-purple-500' 
                        : 'bg-black/30 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Sun size={18} className={theme === 'light' ? 'text-purple-400' : 'text-gray-400'} />
                    <span className="text-[10px]">Light</span>
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition ${
                      theme === 'dark' 
                        ? 'bg-purple-500/20 border-purple-500' 
                        : 'bg-black/30 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Moon size={18} className={theme === 'dark' ? 'text-purple-400' : 'text-gray-400'} />
                    <span className="text-[10px]">Dark</span>
                  </button>
                  <button 
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition ${
                      theme === 'system' 
                        ? 'bg-purple-500/20 border-purple-500' 
                        : 'bg-black/30 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Monitor size={18} className={theme === 'system' ? 'text-purple-400' : 'text-gray-400'} />
                    <span className="text-[10px]">System</span>
                  </button>
                </div>
              </motion.div>

              {/* SAVE & DANGER ZONE */}
              <motion.div {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.4 } })} className="space-y-3">
                <button 
                  onClick={handleSave} 
                  disabled={profile.loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 min-h-[48px] text-sm sm:text-base font-semibold disabled:opacity-50"
                >
                  {profile.loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  {profile.loading ? "Saving..." : "Save Changes"}
                </button>

                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition min-h-[48px] text-sm font-medium"
                >
                  <Trash2 size={18} />
                  Delete Account
                </button>
              </motion.div>
            </div>
          </div>

          {/* ACCOUNT INFO */}
          <motion.div {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.5 } })} className="glass rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Shield size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Account Security</p>
                  <p className="text-xs text-gray-400">Your account is protected with 256-bit encryption</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle size={14} className="text-emerald-400" />
                <span>Verified</span>
                <span className="w-px h-4 bg-white/10 mx-2"></span>
                <span>2FA Available</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* DELETE ACCOUNT MODAL */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={profile.loading}
      />
    </div>
  );
}

function DeleteAccountModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }} 
        className="glass rounded-2xl p-6 w-full max-w-md border border-red-500/30" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 mb-4">
            <AlertTriangle size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold">Delete Account?</h2>
          <p className="text-gray-400 mt-2 text-sm">
            This action <span className="text-red-400 font-semibold">cannot be undone</span>. 
            This will permanently delete your account and remove all your data from our servers.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-gray-400">
            <p>⚠️ You will lose:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>All your order history</li>
              <li>Wallet balance and transaction records</li>
              <li>Connected accounts and settings</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button 
            onClick={onClose} 
            disabled={loading} 
            className="btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px] text-sm font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={loading} 
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:opacity-50 min-h-[44px] text-sm"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}