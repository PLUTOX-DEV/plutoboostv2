import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import { 
  Wallet as WalletIcon, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Send,
  History,
  TrendingUp,
  Shield,
  Zap,
  Copy,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Sidebar from '../components/Sidebar';
import UserContext from "../context/UserContext";

const quickActions = [
  { icon: Plus, label: "Add Funds", color: "from-purple-500 to-indigo-500", href: "/addfunds", desc: "Deposit instantly" },
  { icon: Send, label: "Withdraw", color: "from-cyan-500 to-blue-500", href: "#", desc: "Coming soon" },
  { icon: History, label: "History", color: "from-amber-500 to-orange-500", href: "#", desc: "View all" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

function WalletSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-pulse">
      <div>
        <div className="h-8 bg-gray-700/50 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6 h-48 bg-gray-800/30"></div>
        <div className="space-y-4">
          <div className="glass rounded-xl p-4 h-20 bg-gray-800/30"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4 h-20 bg-gray-800/30"></div>
            <div className="glass rounded-xl p-4 h-20 bg-gray-800/30"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 h-28 bg-gray-800/30"></div>
        <div className="glass rounded-xl p-4 h-28 bg-gray-800/30"></div>
        <div className="glass rounded-xl p-4 h-28 bg-gray-800/30"></div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="h-6 bg-gray-700/50 rounded w-1/2 mb-6"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-700/50"></div>
                <div>
                  <div className="h-4 bg-gray-700/50 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-700/50 rounded w-20"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-5 bg-gray-700/50 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-700/50 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Wallet() {
  const { balance, setBalance } = useContext(UserContext);
  const [filter, setFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  const fetchTransactions = async (page = 1) => {
    if (!initialLoading) setLoading(true);
    try {
      const res = await api.get(`/api/transactions?page=${page}&limit=10`);
      const { transactions: fetchedTransactions, totalPages, currentPage } = res.data;

      const formattedTxs = fetchedTransactions.map(tx => ({
        id: tx._id,
        type: tx.type,
        description: tx.description,
        amount: tx.type === 'deposit' || tx.type === 'refund' ? tx.amount : -tx.amount,
        date: new Date(tx.createdAt).toLocaleDateString(),
        status: tx.status || 'Completed',
      }));
      setTransactions(formattedTxs);
      if (currentPage !== pagination.currentPage || totalPages !== pagination.totalPages) {
        setPagination({ currentPage, totalPages });
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (reference) {
      const verifyPayment = async () => {
        setNotification({ show: true, message: 'Verifying payment...', type: 'info' });
        try {
          const res = await api.post('/paystack/verify', { reference });
          setBalance(res.data.newBalance);
          setNotification({ show: true, message: res.data.message, type: 'success' });
          if (pagination.currentPage !== 1) {
            setPagination(prev => ({ ...prev, currentPage: 1 }));
          } else {
            fetchTransactions(1);
          }
        } catch (err) {
          console.error('Payment verification failed:', err);
          setNotification({ show: true, message: 'Payment verification failed. Please contact support.', type: 'error' });
        }
        navigate('/wallet', { replace: true });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
      };
      verifyPayment();
    }
  }, [searchParams, setBalance, navigate]);

  useEffect(() => {
    fetchTransactions(pagination.currentPage);
  }, [pagination.currentPage]);

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "deposits") return t.type === "deposit" || t.type === "refund";
    if (filter === "purchases") return t.type === "purchase";
    return true;
  });

  const handleWithdraw = () => {
    setNotification({ show: true, message: "Withdrawal feature is coming soon!", type: 'info' });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle size={14} className="text-emerald-400" />;
      case 'Pending': return <Clock size={14} className="text-amber-400" />;
      case 'Failed': return <XCircle size={14} className="text-red-400" />;
      default: return <CheckCircle size={14} className="text-emerald-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case 'Pending': return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case 'Failed': return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
  };

  if (initialLoading) {
    return (
      <div className="flex bg-[#07091F] text-white min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden pt-16 sm:pt-6">
          <WalletSkeleton />
        </main>
      </div>
    );
  };

  return (
    <div className="flex bg-[#07091F] text-white min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden pt-16 sm:pt-6">
        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-8">
          {/* HEADER */}
          <motion.div {...(isMobileView ? {} : fadeInUp)} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text flex items-center gap-2">
                <WalletIcon className="text-purple-400" size={24} />
                Wallet
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Manage your funds and transactions
              </p>
            </div>
            <button 
              onClick={() => fetchTransactions(pagination.currentPage)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition text-sm text-gray-400 hover:text-white"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </motion.div>

          {/* NOTIFICATION */}
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-3 sm:p-4 rounded-xl border text-sm sm:text-base ${
                notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                notification.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                notification.type === 'info' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' :
                'bg-amber-500/20 border-amber-500/30 text-amber-400'
              }`}
            >
              {notification.message}
            </motion.div>
          )}

          {/* BALANCE CARDS */}
          <motion.div 
            {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.1 } })}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {/* MAIN BALANCE */}
            <div className="relative overflow-hidden glass rounded-2xl p-5 sm:p-6 card-hover">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <WalletIcon size={16} />
                  Available Balance
                </div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text">₦{balance.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                  <Sparkles size={12} className="text-purple-400" />
                  <span>Ready to use</span>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
                <a href="/addfunds" className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm min-h-[44px]">
                  <Plus size={16} />
                  Add Funds
                </a>
                <button onClick={handleWithdraw} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm min-h-[44px]">
                  <Send size={16} />
                  Withdraw
                </button>
              </div>
            </div>

            {/* PENDING & STATS */}
            <div className="space-y-3 sm:space-y-4">
              <div className="glass rounded-xl p-4 card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Pending Orders</p>
                    <p className="text-xl sm:text-2xl font-bold text-amber-400">
                      {transactions.filter(t => t.status === 'Pending').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/20">
                    <History size={20} className="text-amber-400" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="glass rounded-xl p-4 card-hover">
                  <p className="text-xs text-gray-400">Total Deposits</p>
                  <p className="text-lg sm:text-xl font-bold text-emerald-400">
                    ₦{transactions.reduce((sum, t) => t.amount > 0 ? sum + t.amount : sum, 0).toLocaleString()}
                  </p>
                </div>
                <div className="glass rounded-xl p-4 card-hover">
                  <p className="text-xs text-gray-400">Total Spent</p>
                  <p className="text-lg sm:text-xl font-bold text-purple-400">
                    ₦{transactions.reduce((sum, t) => t.amount < 0 ? sum - t.amount : sum, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* QUICK ACTIONS */}
          <motion.div 
            {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.2 } })}
            className="grid grid-cols-3 gap-3"
          >
            {quickActions.map((action, i) => (
              <a
                key={i}
                href={action.href}
                onClick={action.label === 'Withdraw' ? handleWithdraw : undefined}
                className="glass rounded-xl p-3 sm:p-4 text-center card-hover group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon size={18} className="sm:w-5 sm:h-5" />
                </div>
                <p className="text-xs sm:text-sm font-medium">{action.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 hidden xs:block">{action.desc}</p>
              </a>
            ))}
          </motion.div>

          {/* TRANSACTIONS */}
          <motion.div 
            {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.3 } })}
            className="glass rounded-2xl p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <History size={18} className="text-purple-400" />
                Transaction History
                {!loading && (
                  <span className="text-xs text-gray-400 font-normal">
                    ({filteredTransactions.length})
                  </span>
                )}
              </h2>
              
              <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
                {["all", "deposits", "purchases"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap touch-manipulation ${
                      filter === f
                        ? "bg-purple-600 text-white shadow-glow-sm"
                        : "bg-black/40 text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <RefreshCw size={32} className="animate-spin text-purple-400" />
                  <p className="text-gray-400 text-sm">Loading transactions...</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <History size={28} className="text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-sm">No transactions yet</p>
                  <p className="text-xs text-gray-500 mt-1">Start by adding funds to your wallet</p>
                </div>
              ) : (
                filteredTransactions.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${
                        tx.type === "deposit" || tx.type === "refund"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}>
                        {tx.type === "deposit" || tx.type === "refund" ? (
                          <ArrowDownRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                        ) : (
                          <ArrowUpRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">{tx.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] sm:text-xs text-gray-400">{tx.date}</p>
                          <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${getStatusColor(tx.status)}`}>
                            {getStatusIcon(tx.status)}
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className={`font-semibold text-sm sm:text-base ${
                        tx.amount > 0 ? "text-emerald-400" : "text-white"
                      }`}>
                        {tx.amount > 0 ? "+" : ""}₦{Math.abs(tx.amount).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation w-full sm:w-auto"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation w-full sm:w-auto"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>

          {/* SECURITY INFO */}
          <motion.div 
            {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.4 } })}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <div className="glass rounded-xl p-3 sm:p-4 flex items-center gap-3 card-hover">
              <div className="p-2 rounded-lg bg-emerald-500/20 shrink-0">
                <Shield size={16} className="sm:w-[18px] sm:h-[18px] text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-xs sm:text-sm">Secure Wallet</p>
                <p className="text-[10px] sm:text-xs text-gray-400">256-bit encryption</p>
              </div>
            </div>
            <div className="glass rounded-xl p-3 sm:p-4 flex items-center gap-3 card-hover">
              <div className="p-2 rounded-lg bg-purple-500/20 shrink-0">
                <Zap size={16} className="sm:w-[18px] sm:h-[18px] text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-xs sm:text-sm">Instant Deposits</p>
                <p className="text-[10px] sm:text-xs text-gray-400">Credit in seconds</p>
              </div>
            </div>
            <div className="glass rounded-xl p-3 sm:p-4 flex items-center gap-3 card-hover">
              <div className="p-2 rounded-lg bg-cyan-500/20 shrink-0">
                <CreditCard size={16} className="sm:w-[18px] sm:h-[18px] text-cyan-400" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-xs sm:text-sm">Multiple Methods</p>
                <p className="text-[10px] sm:text-xs text-gray-400">Card, Bank, Crypto</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}