import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  Search, 
  Menu, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wallet, 
  TrendingUp, 
  Users, 
  Calendar, 
  Filter, 
  Download, 
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Shield,
  AlertCircle,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import LoadingSpinner from "./LoadingSpinner";
import api from "../api";

const statusColors = {
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusIcons = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle,
};

export default function AdminDeposits() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/deposits');
      setDeposits(res.data);
    } catch (err) {
      console.error('Failed to fetch deposits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDeposits();
    setIsRefreshing(false);
  };

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = 
      (deposit.user?.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (deposit.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      deposit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || deposit.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: deposits.length,
    completed: deposits.filter(d => d.status === 'completed').length,
    pending: deposits.filter(d => d.status === 'pending').length,
    failed: deposits.filter(d => d.status === 'failed').length,
    totalAmount: deposits.reduce((sum, d) => sum + d.amount, 0)
  };

  const getStatusBadge = (status) => {
    const Icon = statusIcons[status] || CheckCircle;
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[status] || statusColors.pending}`}>
        <Icon size={12} className={status === "pending" ? "animate-pulse" : ""} />
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
            <h1 className="text-xl font-bold gradient-text">Deposits</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              ₦{stats.totalAmount.toLocaleString()}
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
              <DollarSign className="text-emerald-400" size={28} />
              Deposit History
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              View all successful wallet funding transactions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
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
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          <StatCard 
            title="Total Deposits" 
            value={stats.total} 
            icon={Wallet} 
            color="purple" 
          />
          <StatCard 
            title="Completed" 
            value={stats.completed} 
            icon={CheckCircle} 
            color="emerald" 
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon={Clock} 
            color="amber" 
          />
          <StatCard 
            title="Total Amount" 
            value={`₦${stats.totalAmount.toLocaleString()}`} 
            icon={TrendingUp} 
            color="emerald" 
          />
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
              placeholder="Search by user, email, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full input-glass pl-10 py-3 min-h-[44px] text-sm"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="flex items-center gap-2 glass rounded-xl px-4 py-2 min-h-[44px]">
            <Filter size={16} className="text-purple-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none text-sm cursor-pointer w-full"
            >
              <option className="bg-[#12002b]" value="all">All Status</option>
              <option className="bg-[#12002b]" value="completed">Completed</option>
              <option className="bg-[#12002b]" value="pending">Pending</option>
              <option className="bg-[#12002b]" value="failed">Failed</option>
            </select>
          </div>

          {/* REFRESH - Mobile */}
          <button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="lg:hidden btn-secondary flex items-center justify-center gap-2 min-h-[44px]"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </motion.div>

        {/* DEPOSITS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden border border-white/5"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <p className="text-gray-400 mt-4 text-sm">Loading deposit history...</p>
            </div>
          ) : filteredDeposits.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Wallet size={40} className="text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg font-medium">No deposits found</p>
              <p className="text-gray-500 text-sm mt-1">
                {searchTerm ? "Try adjusting your search" : "No deposits have been made yet"}
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black/40 text-gray-400">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">User</th>
                      <th className="px-6 py-4 text-left font-medium">Amount</th>
                      <th className="px-6 py-4 text-left font-medium">Description</th>
                      <th className="px-6 py-4 text-left font-medium">Status</th>
                      <th className="px-6 py-4 text-left font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeposits.map((deposit, index) => (
                      <motion.tr
                        key={deposit._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-t border-white/5 hover:bg-white/5 transition group"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-sm">{deposit.user?.username || 'N/A'}</p>
                            <p className="text-xs text-gray-400">{deposit.user?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <ArrowUpRight size={14} />
                            ₦{deposit.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{deposit.description || 'Deposit'}</td>
                        <td className="px-6 py-4">
                          {getStatusBadge(deposit.status)}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(deposit.createdAt).toLocaleString()}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="lg:hidden space-y-3 p-4">
                {filteredDeposits.map((deposit, index) => (
                  <motion.div
                    key={deposit._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-xl p-4 space-y-3 border border-white/5 hover:border-white/10 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{deposit.user?.username || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{deposit.user?.email || 'N/A'}</p>
                      </div>
                      {getStatusBadge(deposit.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-400 text-xs">Amount</p>
                        <p className="text-emerald-400 font-semibold flex items-center gap-1">
                          <ArrowUpRight size={14} />
                          ₦{deposit.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Date</p>
                        <p className="text-xs text-gray-400">
                          {new Date(deposit.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs">Description</p>
                      <p className="text-sm">{deposit.description || 'Deposit'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* QUICK STATS BADGE */}
        {deposits.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500"
          >
            <span className="flex items-center gap-1">
              <Sparkles size={12} className="text-purple-400" />
              {filteredDeposits.length} deposits shown
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-400" />
              ₦{stats.totalAmount.toLocaleString()} total
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1">
              <Users size={12} className="text-blue-400" />
              {new Set(deposits.map(d => d.user?._id)).size} unique users
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
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
  };

  const iconColors = {
    purple: "text-purple-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    blue: "text-blue-400",
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