import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api";
import Sidebar from "../components/Sidebar";
import { LineStats, PlatformPie } from "../components/Charts";
import { AnalyticsSkeleton } from "../components/Skeletons";
import {
  DollarSign,
  Users,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  RefreshCw,
  Eye,
  MessageCircle,
  Zap,
  Sparkles,
  Clock,
  Award,
  Target,
  CheckCircle,
  ChevronRight,
  Activity,
  PieChart,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");
  const [analyticsData, setAnalyticsData] = useState({
    stats: { totalEarnings: 0, followersPurchased: 0, totalOrders: 0, avgPerOrder: 0 },
    recentActivity: [],
    topServices: [],
    platformDistribution: []
  });

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/analytics?range=${timeRange}`);
        setAnalyticsData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  const stats = [
    { 
      title: "Total Spent", 
      value: `₦${analyticsData.stats.totalEarnings.toLocaleString()}`, 
      icon: DollarSign, 
      trend: "+12.5%", 
      trendUp: true, 
      color: "purple",
      description: "Total investment" 
    },
    { 
      title: "Followers Purchased", 
      value: analyticsData.stats.followersPurchased.toLocaleString(), 
      icon: Users, 
      trend: "+24.3%", 
      trendUp: true, 
      color: "indigo",
      description: "Total followers gained" 
    },
    { 
      title: "Total Orders", 
      value: analyticsData.stats.totalOrders.toString(), 
      icon: ShoppingCart, 
      trend: "+8.1%", 
      trendUp: true, 
      color: "cyan",
      description: "Orders placed" 
    },
    { 
      title: "Avg per Order", 
      value: `₦${analyticsData.stats.avgPerOrder.toFixed(2)}`, 
      icon: BarChart3, 
      trend: "-2.4%", 
      trendUp: false, 
      color: "amber",
      description: "Average order value" 
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#07091F] text-white">
        <Sidebar />
        <main className="flex-1 relative p-4 sm:p-6 lg:p-10 xl:p-12 2xl:p-16 space-y-6 sm:space-y-8 overflow-x-hidden lg:ml-72 xl:ml-80 2xl:ml-96 pt-16 sm:pt-6">
          <AnalyticsSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#07091F] text-white">
      <Sidebar />

      <main className="flex-1 relative p-4 sm:p-6 lg:p-10 xl:p-12 2xl:p-16 space-y-5 sm:space-y-8 overflow-x-hidden lg:ml-72 xl:ml-80 2xl:ml-96 pt-16 sm:pt-6">
        {/* Cosmic background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed_0%,transparent_55%),radial-gradient(circle_at_bottom,#9333ea_0%,transparent_60%)] opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-5 sm:space-y-8">
          {/* HEADER */}
          <motion.div {...(isMobileView ? {} : fadeInUp)} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text flex items-center gap-2">
                <BarChart3 className="text-purple-400" size={24} />
                Analytics
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Track your growth and performance metrics
              </p>
            </div>

            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 sm:px-4">
              <Calendar size={16} className="text-purple-400 shrink-0" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent outline-none text-xs sm:text-sm cursor-pointer min-w-[100px]"
              >
                <option className="bg-[#12002b]" value="7d">Last 7 days</option>
                <option className="bg-[#12002b]" value="30d">Last 30 days</option>
                <option className="bg-[#12002b]" value="90d">Last 90 days</option>
                <option className="bg-[#12002b]" value="1y">Last year</option>
              </select>
            </div>
          </motion.div>

          {/* STATS */}
          <motion.div 
            {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.1 } })}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} delay={i * 0.05} isMobileView={isMobileView} />
            ))}
          </motion.div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Line chart */}
            <motion.div 
              {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.2 } })}
              className="lg:col-span-2 glass card-hover rounded-2xl p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-400" />
                    Earnings Growth
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">Monthly revenue trend</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm">
                  <TrendingUp size={14} />
                  +18.2%
                </div>
              </div>
              <div className="h-[200px] sm:h-[250px]">
                <LineStats data={analyticsData.topServices.map(s => ({ name: s.name, value: s.revenue }))} />
              </div>
            </motion.div>

            {/* Pie chart */}
            <motion.div 
              {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.3 } })}
              className="glass card-hover rounded-2xl p-4 sm:p-6"
            >
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                  <PieChart size={18} className="text-purple-400" />
                  Platform Distribution
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">Orders by platform</p>
              </div>
              <div className="h-[180px] sm:h-[220px]">
                <PlatformPie data={analyticsData.platformDistribution} />
              </div>
            </motion.div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* TOP SERVICES */}
            <motion.div 
              {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.4 } })}
              className="glass card-hover rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <Award size={18} className="text-amber-400" />
                    Top Services
                  </h3>
                  <p className="text-xs text-gray-400">Most popular services</p>
                </div>
                <button className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 transition flex items-center gap-1">
                  View All <ChevronRight size={14} />
                </button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {analyticsData.topServices && analyticsData.topServices.map((service, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 hover:bg-white/5 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${
                        i === 0 ? 'bg-amber-500/20 text-amber-400' :
                        i === 1 ? 'bg-gray-400/20 text-gray-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">{service.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">{service.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="font-semibold text-purple-400 text-xs sm:text-sm">₦{service.revenue.toLocaleString()}</p>
                      <p className="text-[10px] sm:text-xs text-emerald-400">{service.orders} orders</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* RECENT ACTIVITY */}
            <motion.div 
              {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.5 } })}
              className="glass card-hover rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <Activity size={18} className="text-purple-400" />
                    Recent Activity
                  </h3>
                  <p className="text-xs text-gray-400">Latest actions</p>
                </div>
                <span className="badge-info flex items-center gap-1 text-[10px] sm:text-xs">
                  <Zap size={12} className="text-purple-400" /> Live
                </span>
              </div>
              <div className="space-y-2 sm:space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                {analyticsData.recentActivity.length > 0 ? (
                  analyticsData.recentActivity.map((activity, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition"
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${
                        activity.type === "order" 
                          ? "bg-purple-500/20 text-purple-400" 
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {activity.type === "order" ? <ShoppingCart size={14} sm={16} /> : <DollarSign size={14} sm={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        {activity.type === "order" ? (
                          <>
                            <p className="text-xs sm:text-sm font-medium truncate">
                              {activity.platform} • {activity.service.split(' ')[0]}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-400">
                              {activity.qty.toLocaleString()} units
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs sm:text-sm font-medium">Wallet Funded</p>
                            <p className="text-[10px] sm:text-xs text-emerald-400">₦{activity.amount.toLocaleString()}</p>
                          </>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-400 shrink-0">
                        {new Date(activity.time).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-3">
                      <Activity size={24} className="text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-sm">No recent activity</p>
                    <p className="text-xs text-gray-500 mt-1">Start ordering to see activity here</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* QUICK STATS */}
          <motion.div 
            {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.6 } })}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <QuickStat icon={Eye} label="Profile Views" value="12.5K" change="+15%" />
            <QuickStat icon={MessageCircle} label="Engagement Rate" value="4.8%" change="+0.6%" />
            <QuickStat icon={Users} label="New Followers" value="2.3K" change="+18%" />
            <QuickStat icon={ArrowUpRight} label="Conversion" value="68%" change="+4%" />
          </motion.div>

          {/* ACHIEVEMENTS / MILESTONES */}
          <motion.div 
            {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.7 } })}
            className="glass rounded-2xl p-4 sm:p-6"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Target size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">First Order</p>
                  <p className="text-[10px] text-gray-400">Completed your first boost</p>
                </div>
                <CheckCircle size={16} className="text-emerald-400 ml-auto" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Users size={18} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">1K Followers</p>
                  <p className="text-[10px] text-gray-400">Reached 1K total followers</p>
                </div>
                <Clock size={16} className="text-amber-400 ml-auto" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Big Spender</p>
                  <p className="text-[10px] text-gray-400">Spent over ₦100,000</p>
                </div>
                <CheckCircle size={16} className="text-emerald-400 ml-auto" />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp, color, delay, isMobileView, description }) {
  const colors = {
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
    cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  };

  const iconColors = {
    purple: "text-purple-400",
    indigo: "text-indigo-400",
    cyan: "text-cyan-400",
    amber: "text-amber-400",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-xl p-3 sm:p-4 bg-gradient-to-br ${colors[color]} border backdrop-blur-sm card-hover`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs text-gray-400 truncate">{title}</p>
          <p className="text-base sm:text-xl lg:text-2xl font-bold mt-0.5 sm:mt-1 truncate">{value}</p>
          {description && (
            <p className="text-[8px] sm:text-[10px] text-gray-500 hidden sm:block">{description}</p>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-black/20 ${iconColors[color]} shrink-0 ml-2`}>
          <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
        </div>
      </div>
      <div className={`flex items-center gap-1 mt-1 sm:mt-2 text-[10px] sm:text-xs ${trendUp ? "text-emerald-400" : "text-red-400"}`}>
        {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </motion.div>
  );
}

function QuickStat({ icon: Icon, label, value, change }) {
  return (
    <div className="glass rounded-xl p-3 sm:p-4 text-center card-hover transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
      <Icon size={18} className="sm:w-5 sm:h-5 mx-auto text-purple-400 mb-1.5 sm:mb-2" />
      <p className="font-bold text-sm sm:text-base">{value}</p>
      <p className="text-[9px] sm:text-xs text-gray-400">{label}</p>
      {change && (
        <p className="text-[8px] sm:text-[9px] text-emerald-400 mt-0.5">{change}</p>
      )}
    </div>
  );
}