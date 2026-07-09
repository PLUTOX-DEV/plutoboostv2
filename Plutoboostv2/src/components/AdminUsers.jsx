import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingCart,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Menu,
  TrendingUp,
  UserPlus,
  Clock,
  Shield,
  Star,
  Award,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import api from "../api";

const statusColors = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  suspended: "bg-red-500/20 text-red-400 border-red-500/30",
  verified: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const statusIcons = {
  active: CheckCircle,
  inactive: UserX,
  suspended: Ban,
  verified: Shield,
};

export default function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    inactive: 0,
    verified: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [sortBy, setSortBy] = useState("joinDate");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/users?page=${page}&limit=10`);
      const { users: fetchedUsers, totalPages, currentPage, stats: fetchedStats } = res.data;

      setUsers(fetchedUsers.map(user => ({
        id: user._id,
        name: user.username,
        email: user.email,
        phone: user.phone || 'N/A',
        status: user.status || 'active',
        joinDate: user.createdAt,
        totalOrders: user.orderCount || 0,
        totalSpent: user.totalSpent || 0,
        lastOrder: user.lastOrder || null,
        avatar: `https://ui-avatars.com/api/?name=${user.username}&background=7c3aed&color=fff&size=40`,
        verified: user.verified || false,
      })));
      setPagination({ currentPage, totalPages });
      if (fetchedStats) setStats(prev => ({ ...prev, ...fetchedStats }));
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, [pagination.currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleUpdateUser = async (updatedDetails) => {
    try {
      const res = await api.put(`/api/admin/users/${selectedUser.id}`, updatedDetails);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...res.data } : u));
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const suspendUser = async (id) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    try {
      await api.put(`/api/admin/users/${id}/suspend`);
      setUsers(users.map(u => u.id === id ? { ...u, status: 'suspended' } : u));
    } catch (err) {
      alert('Failed to suspend user');
    }
  };

  const activateUser = async (id) => {
    try {
      await api.put(`/api/admin/users/${id}/activate`);
      setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u));
    } catch (err) {
      alert('Failed to activate user');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status, verified) => {
    const Icon = statusIcons[status] || CheckCircle;
    const label = verified ? 'Verified' : status.charAt(0).toUpperCase() + status.slice(1);
    const color = verified ? statusColors.verified : statusColors[status] || statusColors.active;
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
        <Icon size={12} />
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
            <h1 className="text-xl font-bold gradient-text">Users</h1>
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
              <Users className="text-purple-400" size={28} />
              User Management
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Manage user accounts, view activity, and handle support requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-2 text-sm min-h-[44px]">
              <UserPlus size={16} />
              Add User
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
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          <StatCard title="Total Users" value={stats.total} icon={Users} color="blue" />
          <StatCard title="Active" value={stats.active} icon={UserCheck} color="emerald" />
          <StatCard title="Verified" value={stats.verified || 0} icon={Shield} color="purple" />
          <StatCard title="Inactive" value={stats.inactive || 0} icon={UserX} color="gray" />
          <StatCard title="Suspended" value={stats.suspended || 0} icon={Ban} color="red" />
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
              placeholder="Search users by name or email..."
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
              <option className="bg-[#12002b]" value="active">Active</option>
              <option className="bg-[#12002b]" value="inactive">Inactive</option>
              <option className="bg-[#12002b]" value="suspended">Suspended</option>
              <option className="bg-[#12002b]" value="verified">Verified</option>
            </select>
          </div>
        </motion.div>

        {/* USERS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden border border-white/5"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <p className="text-gray-400 mt-4 text-sm">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Users size={40} className="text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg font-medium">No users found</p>
              <p className="text-gray-500 text-sm mt-1">
                {searchTerm ? "Try adjusting your search" : "No users registered yet"}
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
                      <th className="px-6 py-4 text-left font-medium">Contact</th>
                      <th className="px-6 py-4 text-left font-medium">Status</th>
                      <th className="px-6 py-4 text-left font-medium">Orders</th>
                      <th className="px-6 py-4 text-left font-medium">Spent</th>
                      <th className="px-6 py-4 text-left font-medium">Joined</th>
                      <th className="px-6 py-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-t border-white/5 hover:bg-white/5 transition group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" />
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-gray-400">ID: {user.id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs">
                              <Mail size={12} className="text-gray-400" />
                              <span className="truncate max-w-[120px]">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <Phone size={12} />
                              {user.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(user.status, user.verified)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <ShoppingCart size={14} className="text-purple-400" />
                            <span className="font-medium">{user.totalOrders}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-purple-400 font-semibold">
                          ₦{user.totalSpent.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} />
                            {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => alert(`Viewing details for ${user.name}`)}
                              className="p-1.5 hover:bg-white/10 rounded-lg transition touch-manipulation"
                            >
                              <Eye size={15} className="text-gray-400 hover:text-white" />
                            </button>
                            <button 
                              onClick={() => openEditModal(user)}
                              className="p-1.5 hover:bg-white/10 rounded-lg transition touch-manipulation"
                            >
                              <Edit size={15} className="text-gray-400 hover:text-white" />
                            </button>
                            {user.status === 'suspended' ? (
                              <button 
                                onClick={() => activateUser(user.id)}
                                className="p-1.5 hover:bg-emerald-500/20 rounded-lg transition touch-manipulation"
                              >
                                <CheckCircle size={15} className="text-emerald-400" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => suspendUser(user.id)}
                                className="p-1.5 hover:bg-red-500/20 rounded-lg transition touch-manipulation"
                              >
                                <Ban size={15} className="text-red-400" />
                              </button>
                            )}
                            <button 
                              onClick={() => deleteUser(user.id)}
                              className="p-1.5 hover:bg-red-500/20 rounded-lg transition touch-manipulation"
                            >
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
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-xl p-4 space-y-3 border border-white/5 hover:border-white/10 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">ID: {user.id.slice(-6)}</p>
                        </div>
                      </div>
                      {getStatusBadge(user.status, user.verified)}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Email</p>
                        <p className="truncate text-xs">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Phone</p>
                        <p className="text-xs">{user.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Orders</p>
                        <p className="text-purple-400 font-medium">{user.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Spent</p>
                        <p className="text-purple-400 font-medium">₦{user.totalSpent.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => alert(`Viewing details for ${user.name}`)}
                          className="p-2 hover:bg-white/10 rounded-lg transition touch-manipulation"
                        >
                          <Eye size={15} className="text-gray-400" />
                        </button>
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-white/10 rounded-lg transition touch-manipulation"
                        >
                          <Edit size={15} className="text-gray-400" />
                        </button>
                        {user.status === 'suspended' ? (
                          <button 
                            onClick={() => activateUser(user.id)}
                            className="p-2 hover:bg-emerald-500/20 rounded-lg transition touch-manipulation"
                          >
                            <CheckCircle size={15} className="text-emerald-400" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => suspendUser(user.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition touch-manipulation"
                          >
                            <Ban size={15} className="text-red-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* PAGINATION */}
        {filteredUsers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2"
          >
            <span className="text-xs text-gray-400">
              Showing {(pagination.currentPage - 1) * 10 + 1} to {Math.min(pagination.currentPage * 10, filteredUsers.length)} of {filteredUsers.length} users
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
        {users.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500"
          >
            <span className="flex items-center gap-1">
              <Users size={12} className="text-purple-400" />
              {stats.total} total users
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-400" />
              {stats.active} active
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1">
              <Shield size={12} className="text-blue-400" />
              {stats.verified || 0} verified
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1">
              <UserX size={12} className="text-red-400" />
              {stats.suspended || 0} suspended
            </span>
          </motion.div>
        )}
      </main>

      {/* EDIT MODAL */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSave={handleUpdateUser}
      />
    </div>
  );
}

/* ===================== EDIT USER MODAL ===================== */
function EditUserModal({ isOpen, onClose, user, onSave }) {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (user) {
      setUserDetails({
        username: user.name,
        email: user.email,
        balance: user.totalSpent || 0,
        phone: user.phone || '',
      });
    }
  }, [user]);

  if (!isOpen || !userDetails) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(userDetails);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass rounded-2xl p-6 sm:p-8 w-full max-w-md border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Edit size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Edit User</h2>
                <p className="text-xs text-gray-400">{user?.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={userDetails.username} 
                  onChange={handleChange} 
                  className="input-glass w-full min-h-[44px] text-sm" 
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={userDetails.email} 
                  onChange={handleChange} 
                  className="input-glass w-full min-h-[44px] text-sm" 
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">Phone</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={userDetails.phone} 
                  onChange={handleChange} 
                  className="input-glass w-full min-h-[44px] text-sm" 
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">Balance</label>
                <input 
                  type="number" 
                  name="balance" 
                  value={userDetails.balance} 
                  onChange={handleChange} 
                  className="input-glass w-full min-h-[44px] text-sm" 
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                className="btn-secondary flex items-center justify-center gap-2 min-h-[44px] text-sm"
              >
                <XCircle size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center justify-center gap-2 min-h-[44px] text-sm"
              >
                <CheckCircle size={16} />
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ===================== STAT CARD ===================== */
function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    gray: "from-gray-500/20 to-gray-600/10 border-gray-500/30 text-gray-400",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
  };

  const iconColors = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    gray: "text-gray-400",
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