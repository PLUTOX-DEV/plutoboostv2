import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import {
  ArrowRight,
  Users,
  Zap,
  DollarSign,
  Youtube,
  Instagram,
  Twitter,
  BarChart3,
  Linkedin,
  Play,
  Shield,
  Star,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Globe,
  Clock,
  Award,
  Rocket,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Facebook,
  Twitch,
  Heart,
  Cloud,
  Sun,
  Moon,
  Menu,
  X,
  Cpu,
  Database,
  Lock,
  Gift,
  ThumbsUp,
  MessageCircle,
  Share2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import HeroImage from "/images/px.png";

// Custom TikTok Icon Component
const TikTokIcon = ({ className, size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-2.84 3.37-2.52V9.76c-3.53-.25-6.68 2.29-6.68 5.91 0 3.28 2.67 5.91 5.94 5.91 3.28 0 5.94-2.63 5.94-5.91V10.1c.93.66 2.03 1.06 3.18 1.09V8.09c-1.55 0-2.77-1.08-2.77-2.27z" />
  </svg>
);

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1 }
};

/* ===================== HERO ===================== */
const Hero = () => {
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { value: "50K+", label: "Happy Users" },
    { value: "10M+", label: "Followers Delivered" },
    { value: "4.9", label: "Rating" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen overflow-hidden text-white bg-[#0B0E2A]">
      {/* Base Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.30),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(236,72,153,0.20),transparent_60%),linear-gradient(180deg,#0B0E2A,#0A0D26)]" />

      {/* Animated Particles */}
      <div className="absolute inset-0 z-[1]">
        {[...Array(30)].map((_, i) => (
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
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Hero Image - Now shows on ALL devices with responsive styling */}
      <div className="absolute inset-0 z-[2]">
        <img
          src={HeroImage}
          alt="Hero Background - Social Media Growth Platform"
          className="w-full h-full object-cover object-center sm:object-center md:object-center opacity-60 sm:opacity-70 md:opacity-80 lg:opacity-70"
          loading="lazy"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E2A]/95 via-[#0B0E2A]/85 to-[#0B0E2A]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E2A]/50 to-transparent hidden lg:block" />
      </div>

      {/* Floating Icons - Desktop only */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        whileHover={{ scale: 1.2, y: -20 }}
        className="hidden lg:block absolute z-[4] left-[55%] top-24"
      >
        <Youtube className="text-red-500 drop-shadow-[0_0_30px_rgba(255,0,0,0.3)]" size={44} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 18, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        whileHover={{ scale: 1.2, y: 22 }}
        className="hidden lg:block absolute z-[4] left-[46%] top-60"
      >
        <Instagram className="text-pink-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]" size={42} />
      </motion.div>
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 4.5 }}
        whileHover={{ scale: 1.2, y: -16 }}
        className="hidden lg:block absolute z-[4] right-[48%] top-36"
      >
        <Twitter className="text-blue-400 drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]" size={40} />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        whileHover={{ scale: 1.3 }}
        className="hidden lg:block absolute z-[4] right-[30%] bottom-40"
      >
        <BarChart3 className="text-indigo-400 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]" size={48} />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        whileHover={{ scale: 1.2 }}
        className="hidden lg:block absolute z-[4] left-[10%] bottom-32"
      >
        <TikTokIcon className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" size={40} />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pt-28 pb-36 flex items-center min-h-[90vh]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6 backdrop-blur-sm"
          >
            <Sparkles size={14} className="text-purple-400 animate-pulse" />
            <span className="text-sm text-purple-300 font-medium">#1 Social Growth Platform</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight mb-6">
            Skyrocket Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 animate-gradient bg-[length:200%_auto]">
              Social Media Presence
            </span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Boost your followers and engagement instantly with intelligent,
            scalable growth solutions built for creators and brands.
          </p>

          {/* Animated Stats */}
          <div className="flex justify-center lg:justify-start gap-6 mb-10">
            <div className="text-center">
              <motion.p 
                key={currentStat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl sm:text-3xl font-bold text-white"
              >
                {stats[currentStat].value}
              </motion.p>
              <p className="text-xs text-gray-400">{stats[currentStat].label}</p>
            </div>
            <div className="w-px bg-white/20 h-12 self-center" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">4.9</p>
              <div className="flex justify-center gap-0.5 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              to="/login"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 px-7 sm:px-10 py-4 rounded-full font-semibold shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-105 hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="group flex items-center justify-center gap-3 px-7 sm:px-10 py-4 rounded-full border border-white/30 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={14} fill="white" className="ml-0.5" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <CheckCircle size={14} className="text-emerald-400" />
              No Password Required
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <CheckCircle size={14} className="text-emerald-400" />
              Instant Delivery
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <CheckCircle size={14} className="text-emerald-400" />
              24/7 Support
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[90px] sm:h-[110px] z-10"
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
      >
        <path
          fill="#ffffff"
          d="M0,70 C240,110 480,40 720,40 960,40 1200,110 1440,70 L1440,110 L0,110 Z"
        />
      </svg>
    </section>
  );
};

/* ===================== TRUSTED BY ===================== */
const TrustedBy = () => {
  const platforms = [
    { icon: Youtube, name: "YouTube", color: "text-red-500" },
    { icon: Instagram, name: "Instagram", color: "text-pink-500" },
    { icon: Twitter, name: "Twitter", color: "text-sky-400" },
    { icon: Linkedin, name: "LinkedIn", color: "text-blue-500" },
    { icon: TikTokIcon, name: "TikTok", color: "text-black" },
    { icon: Facebook, name: "Facebook", color: "text-blue-600" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-8">
          Trusted by creators on
        </p>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          className="flex justify-center items-center gap-6 sm:gap-12 flex-wrap"
        >
          {platforms.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ scale: 1.15, y: -5 }}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-all cursor-pointer group"
            >
              <p.icon size={28} className={`${p.color} group-hover:scale-110 transition-transform`} />
              <span className="font-medium hidden sm:block text-sm">{p.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ===================== FEATURES ===================== */
const Features = () => {
  const items = [
    {
      icon: Users,
      title: "Real Followers",
      desc: "Authentic engagement from real, niche‑relevant users that boost your credibility and authority.",
      accent: "from-indigo-500 to-purple-500",
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      desc: "Lightning‑fast processing with full automation. Start seeing results in minutes, not days.",
      accent: "from-purple-500 to-pink-500",
    },
    {
      icon: DollarSign,
      title: "Earn & Scale",
      desc: "High‑commission affiliate system that scales with you. Earn up to 30% per referral.",
      accent: "from-emerald-400 to-teal-500",
    },
    {
      icon: Shield,
      title: "100% Safe",
      desc: "No password required. Your account security is our top priority with 256-bit encryption.",
      accent: "from-cyan-500 to-blue-500",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      desc: "Round-the-clock customer support to help you with any questions or concerns.",
      accent: "from-amber-500 to-orange-500",
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      desc: "Track your growth with detailed analytics and insights dashboard. Make data-driven decisions.",
      accent: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50/80">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            Built for <span className="text-purple-600">Creators & Brands</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Everything you need to grow your social media presence and build your brand.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border border-gray-100 group"
            >
              <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${f.accent}`} />

              <div className={`w-14 h-14 mb-5 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <f.icon size={24} />
              </div>

              <h3 className="text-lg font-semibold mb-2 text-gray-900">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>

              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="mt-4 flex items-center gap-1 text-purple-600 text-sm font-medium"
              >
                Learn More <ChevronRight size={14} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===================== HOW IT WORKS ===================== */
const HowItWorks = () => {
  const steps = [
    { 
      num: "01", 
      title: "Create Account", 
      desc: "Sign up in seconds with just your email and get started immediately",
      icon: Rocket,
      color: "from-purple-500 to-indigo-500"
    },
    { 
      num: "02", 
      title: "Choose Service", 
      desc: "Select your platform and desired service that matches your goals",
      icon: Globe,
      color: "from-pink-500 to-rose-500"
    },
    { 
      num: "03", 
      title: "Add Funds", 
      desc: "Fund your wallet securely with multiple payment options available",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500"
    },
    { 
      num: "04", 
      title: "Watch Growth", 
      desc: "Sit back and watch your followers grow with real-time analytics",
      icon: TrendingUp,
      color: "from-amber-500 to-orange-500"
    },
  ];

  return (
    <section className="py-24 bg-[#0B0E2A] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4 backdrop-blur-sm border border-purple-500/20">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get Started in <span className="text-purple-400">4 Simple Steps</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Follow these easy steps to start growing your social media presence today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${step.color}`} />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl sm:text-5xl font-bold text-purple-500/20">{step.num}</span>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <step.icon size={20} />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              
              {i < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-purple-500/30" size={24} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===================== TESTIMONIALS ===================== */
const Testimonials = () => {
  const reviews = [
    { 
      name: "Sarah K.", 
      role: "Content Creator", 
      text: "PlutoBoost helped me reach 100K followers in just 3 months. The quality is amazing and the support is outstanding!", 
      rating: 5,
      platform: "Instagram",
      avatar: "https://ui-avatars.com/api/?name=Sarah+K&background=7c3aed&color=fff&size=40"
    },
    { 
      name: "Mike T.", 
      role: "Business Owner", 
      text: "Best investment for my brand. Real followers that actually engage with my content. Highly recommended!", 
      rating: 5,
      platform: "YouTube",
      avatar: "https://ui-avatars.com/api/?name=Mike+T&background=2563eb&color=fff&size=40"
    },
    { 
      name: "Jessica L.", 
      role: "Influencer", 
      text: "Fast delivery and excellent support. I've tried others but PlutoBoost is definitely the best in the market.", 
      rating: 5,
      platform: "TikTok",
      avatar: "https://ui-avatars.com/api/?name=Jessica+L&background=db2777&color=fff&size=40"
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            Loved by <span className="text-purple-600">50,000+ Users</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            See what our satisfied customers have to say about their experience with PlutoBoost.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-purple-500/10 transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {review.platform}
                </span>
              </div>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===================== STATS SECTION ===================== */
const StatsSection = () => {
  const stats = [
    { value: "50K+", label: "Happy Users", icon: Heart },
    { value: "10M+", label: "Followers Delivered", icon: Users },
    { value: "4.9", label: "Average Rating", icon: Star },
    { value: "99.9%", label: "Uptime", icon: Cloud },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-2">
                <stat.icon size={32} className="text-purple-200" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold">{stat.value}</p>
              <p className="text-purple-100 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===================== CTA ===================== */
const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-purple-600 to-indigo-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
      
      {/* Floating bubbles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: 20 + Math.random() * 40,
              height: 20 + Math.random() * 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      <motion.div {...fadeInUp} className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6 border border-white/20"
        >
          <Sparkles size={16} className="text-yellow-300" />
          <span className="text-sm font-medium">Limited Time Offer</span>
        </motion.div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Ready to Grow Your Audience?
        </h2>
        <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto">
          Join 50,000+ creators and brands who trust PlutoBoost for their social media growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 shadow-2xl hover:shadow-white/30 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Start Growing Now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="border-2 border-white/50 px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm">
            View Pricing
          </button>
        </div>
        <p className="text-purple-200 text-sm mt-6">
          🚀 No credit card required • 30-day money-back guarantee
        </p>
      </motion.div>
    </section>
  );
};

/* ===================== FOOTER ===================== */
export const Footer = () => {
  return (
    <footer className="bg-[#070A1F] text-gray-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles size={20} className="text-white" />
              </div>
              <h3 className="text-white text-xl font-bold">PlutoBoost</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4 max-w-sm">
              Intelligent growth solutions helping creators dominate social media with real engagement and authentic followers.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-purple-500/20 hover:text-purple-400 transition-all hover:scale-110">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-purple-500/20 hover:text-purple-400 transition-all hover:scale-110">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-purple-500/20 hover:text-purple-400 transition-all hover:scale-110">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-purple-500/20 hover:text-purple-400 transition-all hover:scale-110">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/features/instagram" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">Instagram</Link></li>
              <li><Link to="/features/youtube" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">YouTube</Link></li>
              <li><Link to="/features/tiktok" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">TikTok</Link></li>
              <li><Link to="/features/analytics" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">Analytics</Link></li>
              <li><Link to="/affiliate" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">Affiliate Program</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">About</Link></li>
              <li><Link to="/blog" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">Refund Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2026 PlutoBoost. All rights reserved. Made with ❤️</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Globe size={14} />
              <span>Available Worldwide</span>
            </div>
            <span className="text-purple-400 animate-pulse">🚀</span>
            <div className="flex items-center gap-1">
              <Shield size={14} className="text-emerald-400" />
              <span>Secure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ===================== APP ===================== */
export default function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    if (token && user) {
      navigate('/dashboard');
    } else if (adminToken) {
      navigate('/admin');
    }
  }, [user, navigate]);

  return (
    <div className="overflow-hidden">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <StatsSection />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}