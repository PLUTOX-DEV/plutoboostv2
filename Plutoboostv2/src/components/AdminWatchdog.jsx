import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Menu,
  Clock,
  Filter,
  Search,
  Calendar,
  Shield,
  Zap,
  Activity,
  Server,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  Sparkles,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import api from "../api";

const logIcons = {
  info: <Info size={16} className="text-blue-400" />,
  warning: <AlertTriangle size={16} className="text-amber-400" />,
  error: <AlertCircle size={16} className="text-red-400" />,
  success: <CheckCircle size={16} className="text-emerald-400" />,
};

const logColors = {
  info: "border-blue-500/20 bg-blue-500/5",
  warning: "border-amber-500/20 bg-amber-500/5",
  error: "border-red-500/20 bg-red-500/5",
  success: "border-emerald-500/20 bg-emerald-500/5",
};

const logTypeColors = {
  balance: "bg-emerald-500/20 text-emerald-400",
  provider: "bg-purple-500/20 text-purple-400",
  system: "bg-blue-500/20 text-blue-400",
  error: "bg-red-500/20 text-red-400",
  info: "bg-gray-500/20 text-gray-400",
  report: "bg-amber-500/20 text-amber-400",
};

const logTypeIcons = {
  balance: DollarSign,
  provider: Server,
  system: Activity,
  error: AlertCircle,
  info: Info,
  report: TrendingUp,
};

export default function AdminWatchdog() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [expandedLogs, setExpandedLogs] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    info: 0,
    warning: 0,
    error: 0,
    success: 0,
  });

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  const fetchLogs = async () => {
    setIsRefreshing(true);
    setLoading(true);
    try {
      const res = await api.get("/api/admin/logs/watchdog");
      setLogs(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error("Failed to fetch watchdog logs:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const calculateStats = (logData) => {
    const stats = {
      total: logData.length,
      info: logData.filter(l => l.level === 'info').length,
      warning: logData.filter(l => l.level === 'warning').length,
      error: logData.filter(l => l.level === 'error').length,
      success: logData.filter(l => l.level === 'success').length,
    };
    setStats(stats);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(log => log.type === typeFilter);
    }
    
    // Apply level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter(log => log.level === levelFilter);
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchTerm, typeFilter, levelFilter]);

  const getLogIcon = (type) => {
    const Icon = logTypeIcons[type] || Info;
    return <Icon size={14} className="text-gray-400" />;
  };

  const getLogTypeColor = (type) => {
    return logTypeColors[type] || logTypeColors.info;
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.floor((now - past) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
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
            <h1 className="text-xl font-bold gradient-text">Watchdog</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              {stats.total} logs
            </span>
          </div>
        </div>

        {/* DESKTOP HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Eye className="text-purple-400" size={28} />
              Watchdog Logs
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Live logs from the automated provider balance and daily report service
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchLogs}
              disabled={isRefreshing}
              className="btn-secondary flex items-center gap-2 text-sm min-h-[44px]"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button className="btn-secondary flex items-center gap-2 text-sm min-h-[44px]">
              <Download size={16} />
              Export
            </button>
          </div>
        </motion.div>

        {/* STATS CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4"
        >
          <StatCard 
            title="Total Logs" 
            value={stats.total} 
            icon={Activity} 
            color="purple" 
          />
          <StatCard 
            title="Info" 
            value={stats.info} 
            icon={Info} 
            color="blue" 
          />
          <StatCard 
            title="Success" 
            value={stats.success} 
            icon={CheckCircle} 
            color="emerald" 
          />
          <StatCard 
            title="Warnings" 
            value={stats.warning} 
            icon={AlertTriangle} 
            color="amber" 
          />
          <StatCard 
            title="Errors" 
            value={stats.error} 
            icon={AlertCircle} 
            color="red" 
          />
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
              <span className="text-sm font-medium">Watchdog Active</span>
            </div>
            <span className="text-xs text-gray-500">|</span>
            <span className="text-xs text-gray-400">Last run: {logs.length > 0 ? getTimeAgo(logs[0]?.timestamp) : 'Never'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Shield size={14} className="text-emerald-400" />
            <span>Monitoring {logs.length} events</span>
          </div>
        </motion.div>

        {/* FILTERS & SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          {/* SEARCH */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs by message or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full input-glass pl-10 py-3 min-h-[44px] text-sm"
            />
          </div>

          {/* TYPE FILTER */}
          <div className="flex items-center gap-2 glass rounded-xl px-4 py-2 min-h-[44px]">
            <Filter size={16} className="text-purple-400 shrink-0" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent outline-none text-sm cursor-pointer w-full"
            >
              <option className="bg-[#12002b]" value="all">All Types</option>
              <option className="bg-[#12002b]" value="balance">Balance</option>
              <option className="bg-[#12002b]" value="provider">Provider</option>
              <option className="bg-[#12002b]" value="system">System</option>
              <option className="bg-[#12002b]" value="report">Report</option>
              <option className="bg-[#12002b]" value="error">Error</option>
            </select>
          </div>

          {/* LEVEL FILTER */}
          <div className="flex items-center gap-2 glass rounded-xl px-4 py-2 min-h-[44px]">
            <AlertCircle size={16} className="text-purple-400 shrink-0" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-transparent outline-none text-sm cursor-pointer w-full"
            >
              <option className="bg-[#12002b]" value="all">All Levels</option>
              <option className="bg-[#12002b]" value="info">Info</option>
              <option className="bg-[#12002b]" value="success">Success</option>
              <option className="bg-[#12002b]" value="warning">Warning</option>
              <option className="bg-[#12002b]" value="error">Error</option>
            </select>
          </div>

          {/* REFRESH - Mobile */}
          <button 
            onClick={fetchLogs} 
            disabled={isRefreshing}
            className="lg:hidden btn-secondary flex items-center justify-center gap-2 min-h-[44px]"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </motion.div>

        {/* LOGS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden border border-white/5"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <p className="text-gray-400 mt-4 text-sm">Fetching watchdog logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Eye size={40} className="text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg font-medium">No logs found</p>
              <p className="text-gray-500 text-sm mt-1">
                {searchTerm || typeFilter !== "all" || levelFilter !== "all" 
                  ? "Try adjusting your filters" 
                  : "The watchdog service hasn't generated any logs yet"}
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black/40 text-gray-400">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">Level</th>
                      <th className="px-6 py-4 text-left font-medium">Message</th>
                      <th className="px-6 py-4 text-left font-medium">Type</th>
                      <th className="px-6 py-4 text-left font-medium">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, index) => {
                      const Icon = logTypeIcons[log.type] || Info;
                      return (
                        <motion.tr
                          key={log._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className={`border-t border-white/5 hover:bg-white/5 transition group ${logColors[log.level]}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {logIcons[log.level] || <Info size={16} className="text-gray-400" />}
                              <span className="capitalize text-xs">{log.level}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm max-w-md truncate">{log.message}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit ${getLogTypeColor(log.type)}`}>
                              <Icon size={12} />
                              {log.type}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <Clock size={12} />
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="lg:hidden space-y-3 p-4">
                {filteredLogs.map((log, index) => {
                  const Icon = logTypeIcons[log.type] || Info;
                  return (
                    <motion.div
                      key={log._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`glass rounded-xl p-4 space-y-3 border ${logColors[log.level]}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {logIcons[log.level] || <Info size={16} className="text-gray-400" />}
                          <span className={`text-xs font-medium capitalize`}>
                            {log.level}
                          </span>
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full ${getLogTypeColor(log.type)}`}>
                          <Icon size={12} />
                          {log.type}
                        </div>
                      </div>

                      <p className="text-sm">{log.message}</p>

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock size={12} />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>

        {/* QUICK STATS BADGE */}
        {filteredLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500"
          >
            <span className="flex items-center gap-1">
              <Sparkles size={12} className="text-purple-400" />
              {filteredLogs.length} logs displayed
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-blue-400" />
              Last 24 hours: {logs.filter(l => new Date(l.timestamp) > new Date(Date.now() - 86400000)).length}
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1">
              <Server size={12} className="text-purple-400" />
              {new Set(logs.map(l => l.type)).size} log types
            </span>
          </motion.div>
        )}
      </main>
    </div>
  );
}

/* ===================== STAT CARD ===================== */
function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
  };

  const iconColors = {
    purple: "text-purple-400",
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
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