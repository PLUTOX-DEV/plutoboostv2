import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  ShieldCheck,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Menu,
  Zap,
  Users,
  ShoppingCart,
  DollarSign,
  Clock,
  BarChart3,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Printer,
  Sparkles,
  Globe,
  Lock,
  Unlock,
  Cloud,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import OwnerWithdrawPanel from "./OwnerWithdrawPanel";
import api from "../api";

const iconMap = {
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  ShieldCheck,
  Globe,
  Cloud,
};

const statusColors = {
  operational: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30",
  info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const statusIcons = {
  operational: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: AlertCircle,
};

const logColors = {
  info: "text-blue-400 bg-blue-500/10",
  warning: "text-amber-400 bg-amber-500/10",
  error: "text-red-400 bg-red-500/10",
  success: "text-emerald-400 bg-emerald-500/10",
};

const logTypeColors = {
  user: "bg-blue-500/20 text-blue-400",
  order: "bg-purple-500/20 text-purple-400",
  payment: "bg-emerald-500/20 text-emerald-400",
  security: "bg-red-500/20 text-red-400",
  system: "bg-amber-500/20 text-amber-400",
  info: "bg-gray-500/20 text-gray-400",
};

export default function AdminSystem() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [systemMetrics, setSystemMetrics] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [controls, setControls] = useState({ maintenanceMode: false });
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalOrders: 0,
    revenue: 0,
    serverLoad: 0
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  const fetchSystemData = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get('/api/admin/system');
      setSystemMetrics(res.data.metrics);
      setRecentLogs(res.data.logs);
      setStats(res.data.stats);
      setControls(res.data.controls);
    } catch (err) {
      console.error('Failed to fetch system data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  const toggleMaintenanceMode = async () => {
    const newStatus = !controls.maintenanceMode;
    try {
      const res = await api.post('/api/admin/system/maintenance', { enabled: newStatus });
      setControls(res.data);
    } catch (err) {
      alert('Failed to update maintenance mode');
    }
  };

  const handleQuickAction = async (action) => {
    try {
      let res;
      if (action === 'clear-cache') {
        res = await api.post('/api/admin/system/clear-cache');
      } else if (action === 'run-diagnostics') {
        res = await api.post('/api/admin/system/run-diagnostics');
      } else if (action === 'backup') {
        res = await api.post('/api/admin/system/backup');
      }
      alert(res.data.message || 'Action completed successfully!');
    } catch (err) {
      alert(`Action failed: ${err.response?.data?.error || 'Server error'}`);
    }
  };

  const getStatusBadge = (status) => {
    const Icon = statusIcons[status] || CheckCircle;
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[status] || statusColors.info}`}>
        <Icon size={12} className={status === "warning" ? "animate-pulse" : ""} />
        {label}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#07091F] text-white flex">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-4 sm:py-8 space-y-6 lg:ml-72 xl:ml-80 2xl:ml-96 pt-16 lg:pt-8">
        {/* MOBILE HEADER */}
        <div className="flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition touch-manipulation"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold gradient-text">System</h1>
          </div>
          <button
            onClick={fetchSystemData}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition touch-manipulation"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>

        {/* DESKTOP HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Server className="text-purple-400" size={28} />
              System Monitoring
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Monitor system health, performance metrics, and manage platform settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchSystemData}
              disabled={isRefreshing}
              className="btn-secondary flex items-center gap-2 text-sm min-h-[44px]"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button className="btn-secondary flex items-center gap-2 text-sm min-h-[44px]">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </motion.div>

        {/* QUICK STATS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          <QuickStat title="Active Users" value={stats.activeUsers} icon={Users} color="blue" />
          <QuickStat title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="purple" />
          <QuickStat title="Revenue" value={`₦${stats.revenue.toLocaleString()}`} icon={DollarSign} color="emerald" />
          <QuickStat title="Server Load" value={`${stats.serverLoad}%`} icon={Activity} color="amber" />
        </motion.div>

        {/* SYSTEM STATUS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-black/30 border border-white/5"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium">All Systems Operational</span>
            </div>
            <span className="text-xs text-gray-500">|</span>
            <span className="text-xs text-gray-400">{systemMetrics.length} services monitored</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock size={14} />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </motion.div>

        {/* SYSTEM METRICS GRID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {systemMetrics.map((metric, index) => {
            const Icon = iconMap[metric.icon] || Server;
            return (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass card-hover rounded-2xl p-5 sm:p-6 border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      metric.status === "operational" ? "bg-emerald-500/20" :
                      metric.status === "warning" ? "bg-amber-500/20" :
                      "bg-red-500/20"
                    }`}>
                      <Icon size={20} className={
                        metric.status === "operational" ? "text-emerald-400" :
                        metric.status === "warning" ? "text-amber-400" :
                        "text-red-400"
                      } />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">{metric.name}</h3>
                      {getStatusBadge(metric.status)}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-xl transition touch-manipulation">
                    <Settings size={16} className="text-gray-400 hover:text-white" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Status:</span>
                    <span className="font-medium">{metric.value}</span>
                  </div>
                  {metric.balance && (
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Provider:</span>
                      <span className="font-medium text-purple-400">{metric.balance}</span>
                    </div>
                  )}
                  {metric.uptime && (
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Uptime:</span>
                      <span className="font-medium text-emerald-400">{metric.uptime}</span>
                    </div>
                  )}
                  {metric.responseTime && (
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Response:</span>
                      <span className="font-medium">{metric.responseTime}</span>
                    </div>
                  )}
                  {metric.connections && (
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Connections:</span>
                      <span className="font-medium">{metric.connections}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* SYSTEM LOGS & CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* SYSTEM LOGS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass rounded-2xl p-4 sm:p-6 border border-white/5"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Activity size={20} className="text-purple-400" />
                  System Logs
                </h3>
                <p className="text-xs text-gray-400">Real-time system activity</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setExpandedLogs(!expandedLogs)}
                  className="p-2 rounded-lg hover:bg-white/10 transition touch-manipulation"
                >
                  {expandedLogs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 transition text-sm touch-manipulation">
                  <RefreshCw size={14} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            <div className={`space-y-2 sm:space-y-3 ${expandedLogs ? 'max-h-[500px]' : 'max-h-80'} overflow-y-auto pr-1 scrollbar-thin transition-all duration-300`}>
              {recentLogs.slice(0, expandedLogs ? undefined : 10).map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-black/30 rounded-xl border border-white/5 hover:border-white/10 transition"
                >
                  <div className={`text-xs font-mono px-2 py-1 rounded ${logColors[log.level]}`}>
                    {log.time}
                  </div>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    log.level === "info" ? "bg-blue-400" :
                    log.level === "warning" ? "bg-amber-400" :
                    log.level === "error" ? "bg-red-400" :
                    "bg-emerald-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm truncate">{log.message}</p>
                  </div>
                  <div className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${logTypeColors[log.type] || logTypeColors.info} shrink-0`}>
                    {log.type}
                  </div>
                </motion.div>
              ))}
              
              {recentLogs.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <Activity size={32} className="mx-auto text-gray-500 mb-2" />
                  No logs available
                </div>
              )}
            </div>
          </motion.div>

          {/* SYSTEM CONTROLS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* MAINTENANCE MODE */}
            <div className="glass rounded-2xl p-4 sm:p-6 border border-white/5">
              <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings size={20} className="text-purple-400" />
                System Controls
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
                  <div>
                    <span className="text-sm font-medium">Maintenance Mode</span>
                    <p className="text-[10px] text-gray-400">Temporarily disable public access</p>
                  </div>
                  <button
                    onClick={toggleMaintenanceMode}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                      controls.maintenanceMode ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      controls.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
                  <div>
                    <span className="text-sm font-medium">API Rate Limiting</span>
                    <p className="text-[10px] text-gray-400">Prevent API abuse</p>
                  </div>
                  <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-purple-600 transition-colors focus:outline-none">
                    <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
                  <div>
                    <span className="text-sm font-medium">Auto Backups</span>
                    <p className="text-[10px] text-gray-400">Daily automatic backups</p>
                  </div>
                  <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-emerald-600 transition-colors focus:outline-none">
                    <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="glass rounded-2xl p-4 sm:p-6 border border-white/5">
              <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-amber-400" />
                Quick Actions
              </h3>

              <div className="space-y-2">
                <button 
                  onClick={() => handleQuickAction('clear-cache')} 
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition touch-manipulation"
                >
                  <span className="text-sm">Clear Cache</span>
                  <Zap size={16} className="text-blue-400" />
                </button>

                <button 
                  onClick={() => handleQuickAction('run-diagnostics')} 
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 transition touch-manipulation"
                >
                  <span className="text-sm">Run Diagnostics</span>
                  <Activity size={16} className="text-purple-400" />
                </button>

                <button 
                  onClick={() => handleQuickAction('backup')} 
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition touch-manipulation"
                >
                  <span className="text-sm">Backup Database</span>
                  <Database size={16} className="text-emerald-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 transition touch-manipulation">
                  <span className="text-sm">Restart Services</span>
                  <RefreshCw size={16} className="text-amber-400" />
                </button>
              </div>
            </div>

            {/* OWNER WITHDRAWAL PANEL */}
            <OwnerWithdrawPanel />
          </motion.div>
        </div>

        {/* SYSTEM STATUS FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 pt-4"
        >
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-400" />
            System Protected
          </span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-1">
            <Database size={12} className="text-blue-400" />
            Database Online
          </span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-1">
            <Globe size={12} className="text-purple-400" />
            All Services Active
          </span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-amber-400" />
            v2.0.0
          </span>
        </motion.div>
      </main>
    </div>
  );
}

/* ===================== QUICK STAT ===================== */
function QuickStat({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
  };

  const iconColors = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
  };

  return (
    <motion.div 
      whileHover={{ y: -2, scale: 1.02 }}
      className={`glass p-3 sm:p-4 rounded-xl border backdrop-blur-sm bg-gradient-to-br ${colorClasses[color]} transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs text-gray-400 truncate">{title}</p>
          <p className="text-base sm:text-lg lg:text-xl font-bold truncate">{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-black/20 ${iconColors[color]} shrink-0 ml-2`}>
          <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
        </div>
      </div>
    </motion.div>
  );
}