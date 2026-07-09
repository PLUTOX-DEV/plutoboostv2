import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Eye,
  Edit,
  DollarSign,
  User,
  Calendar,
  Package,
  Menu,
  TrendingUp,
  Users,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  Zap,
  Sparkles,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import api from "../api";

const statusColors = {
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
  cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const statusIcons = {
  completed: CheckCircle,
  processing: RefreshCw,
  pending: Clock,
  failed: XCircle,
  cancelled: XCircle,
};

const statusLabels = {
  completed: "Completed",
  processing: "Processing",
  pending: "Pending",
  failed: "Failed",
  cancelled: "Cancelled",
};

export default function AdminOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  const fetchOrders = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/orders?page=${page}&limit=10&search=${search}`);
      const { orders: fetchedOrders, totalPages, currentPage } = res.data;
      setOrders(fetchedOrders.map(order => ({
        id: `#PB-${order._id.slice(-6)}`,
        user: order.user ? order.user.username : 'N/A',
        userEmail: order.user ? (order.user.email || 'N/A') : 'N/A',
        service: order.serviceType,
        providerOrderId: order.providerOrderId,
        platform: order.platform,
        quantity: order.quantity,
        price: order.price,
        profit: order.profit || 0,
        status: order.status,
        date: order.createdAt,
        progress: order.status === 'completed' ? 100 : order.status === 'processing' ? 75 : order.status === 'pending' ? 25 : 0,
        deliveryDate: order.status === 'completed' ? order.updatedAt : null
      })));
      setPagination({ currentPage, totalPages });
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOrders(pagination.currentPage, searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, pagination.currentPage, statusFilter, fetchOrders]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      const providerOrderIds = orders
        .filter(o => o.status === 'processing' || o.status === 'pending')
        .map(o => o.providerOrderId)
        .filter(Boolean);

      if (providerOrderIds.length > 0) {
        await api.post('/api/admin/orders/status', { orderIds: providerOrderIds });
        fetchOrders(pagination.currentPage, searchTerm);
      }
    } catch (err) {
      console.error("Failed to refresh all statuses:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === "completed").length,
    processing: orders.filter(o => o.status === "processing").length,
    pending: orders.filter(o => o.status === "pending").length,
    failed: orders.filter(o => o.status === "failed").length,
    revenue: orders.reduce((sum, order) => sum + order.profit, 0)
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getStatusBadge = (status) => {
    const Icon = statusIcons[status] || CheckCircle;
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[status] || statusColors.pending}`}>
        <Icon size={12} className={status === "processing" ? "animate-spin" : ""} />
        {statusLabels[status] || status}
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
            <h1 className="text-xl font-bold gradient-text">Orders</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              {stats.total} total
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
              <ShoppingCart className="text-purple-400" size={28} />
              Order Management
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Monitor and manage all customer orders across the platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="btn-secondary flex items-center gap-2 text-sm min-h-[44px]"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              Refresh Statuses
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
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
        >
          <StatCard title="Total Orders" value={stats.total} icon={ShoppingCart} color="blue" />
          <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="emerald" />
          <StatCard title="Processing" value={stats.processing} icon={RefreshCw} color="blue" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} color="amber" />
          <StatCard title="Failed" value={stats.failed} icon={XCircle} color="red" />
          <StatCard title="Revenue" value={`₦${stats.revenue.toLocaleString()}`} icon={DollarSign} color="purple" />
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
              placeholder="Search orders by ID, user, or service..."
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
              <option className="bg-[#12002b]" value="processing">Processing</option>
              <option className="bg-[#12002b]" value="pending">Pending</option>
              <option className="bg-[#12002b]" value="failed">Failed</option>
            </select>
          </div>

          {/* REFRESH - Mobile */}
          <button 
            onClick={handleRefreshAll} 
            disabled={isRefreshing}
            className="lg:hidden btn-secondary flex items-center justify-center gap-2 min-h-[44px]"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </motion.div>

        {/* ORDERS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden border border-white/5"
        >
          {/* LOADING STATE */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <RefreshCw size={40} className="animate-spin text-purple-400" />
              <p className="text-gray-400 mt-4 text-sm">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Package size={40} className="text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg font-medium">No orders found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black/40 text-gray-400">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">Order ID</th>
                      <th className="px-6 py-4 text-left font-medium">Customer</th>
                      <th className="px-6 py-4 text-left font-medium">Service</th>
                      <th className="px-6 py-4 text-left font-medium">Quantity</th>
                      <th className="px-6 py-4 text-left font-medium">Price</th>
                      <th className="px-6 py-4 text-left font-medium">Status</th>
                      <th className="px-6 py-4 text-left font-medium">Progress</th>
                      <th className="px-6 py-4 text-left font-medium">Date</th>
                      <th className="px-6 py-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-t border-white/5 hover:bg-white/5 transition group"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono font-medium text-purple-400 text-xs">{order.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-sm truncate max-w-[120px]">{order.user}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[120px]">{order.userEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-sm truncate max-w-[100px]">{order.service}</p>
                            <p className="text-xs text-gray-400">{order.platform}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{order.quantity.toLocaleString()}</td>
                        <td className="px-6 py-4 text-purple-400 font-semibold">₦{order.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 w-32">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-black/40 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${order.progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${
                                  order.status === "completed" ? "bg-emerald-500" :
                                  order.status === "failed" ? "bg-red-500" :
                                  "bg-purple-500"
                                }`}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{order.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-white/10 rounded-lg transition">
                              <Eye size={15} className="text-gray-400 hover:text-white" />
                            </button>
                            <button className="p-1.5 hover:bg-white/10 rounded-lg transition">
                              <Edit size={15} className="text-gray-400 hover:text-white" />
                            </button>
                            <button className="p-1.5 hover:bg-red-500/20 rounded-lg transition">
                              <MoreVertical size={15} className="text-gray-400 hover:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="lg:hidden space-y-3 p-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-xl p-4 space-y-3 border border-white/5 hover:border-white/10 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono font-medium text-purple-400 text-xs">{order.id}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm font-medium">{order.user}</p>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{order.userEmail}</span>
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Service</p>
                        <p className="font-medium">{order.service}</p>
                        <p className="text-xs text-gray-500">{order.platform}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Quantity</p>
                        <p className="font-medium">{order.quantity.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Price</p>
                        <p className="text-purple-400 font-semibold">₦{order.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Progress</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                order.status === "completed" ? "bg-emerald-500" :
                                order.status === "failed" ? "bg-red-500" :
                                "bg-purple-500"
                              }`}
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{order.progress}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition touch-manipulation">
                          <Eye size={15} className="text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition touch-manipulation">
                          <Edit size={15} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* PAGINATION */}
        {orders.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2"
          >
            <span className="text-xs text-gray-400">
              Showing {(pagination.currentPage - 1) * 10 + 1} to {Math.min(pagination.currentPage * 10, orders.length)} of {orders.length} orders
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[40px]"
              >
                Previous
              </button>
              <span className="text-sm text-gray-400 px-3">
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[40px]"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* QUICK STATS BADGE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500"
        >
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-purple-400" />
            {stats.total} total orders
          </span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-400" />
            {stats.completed} completed
          </span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-amber-400" />
            {stats.pending} pending
          </span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-1">
            <AlertCircle size={12} className="text-red-400" />
            {stats.failed} failed
          </span>
        </motion.div>
      </main>
    </div>
  );
}

/* ===================== STAT CARD ===================== */
function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
  };

  const iconColors = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
    purple: "text-purple-400",
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