
import React, { useEffect, useContext, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserContext from './context/UserContext';
import LoadingSpinner from './components/LoadingSpinner';

// Page Loader Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
  </div>
);

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  if (loading) return <LoadingSpinner text="" />;
  return user && user.role !== 'admin' ? children : <Navigate to="/login" />;
}

function AdminProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  if (loading) return <LoadingSpinner text="" />;
  return user && user.role === 'admin' ? children : <Navigate to="/admin-login" />;
}

// Lazy load Core Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

// Lazy load User Dashboard Pages
const AdminDashboard = lazy(() => import('./pages/Admin'));
const AddFunds = lazy(() => import("./pages/AddFunds"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const Dashboard2 = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const Analytics = lazy(() => import('./pages/Analytics'));
const Wallet = lazy(() => import('./pages/Wallet'));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));

// Lazy load Admin Pages
const AdminUsers = lazy(() => import("./components/AdminUsers"));
const AdminOrders = lazy(() => import("./components/AdminOrders"));
const AdminDeposits = lazy(() => import("./components/AdminDeposits"));
const AdminSystem = lazy(() => import("./components/AdminSystem"));
const AdminFees = lazy(() => import("./pages/AdminFees"));
const AdminBlog = lazy(() => import("./components/AdminBlog"));
const AdminNotifications = lazy(() => import("./components/AdminNotifications"));
const AdminWatchdog = lazy(() => import("./components/AdminWatchdog"));

// Lazy load Public Info Pages
const PricingPage = lazy(() => import("./components/PricingPage"));
const BlogPage = lazy(() => import("./components/BlogPage"));
const PostPage = lazy(() => import("./components/PostPage"));
const AffiliatePage = lazy(() => import("./components/AffiliatePage"));
const ContactPage = lazy(() => import("./components/ContactPage"));
const FeaturesInstagram = lazy(() => import("./pages/FeaturesInstagram"));
const About = lazy(() => import("./pages/About"));
const FeaturesYoutube = lazy(() => import("./pages/FeaturesYoutube"));
const Careers = lazy(() => import("./pages/Careers"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const FeaturesAnalytics = lazy(() => import("./pages/FeaturesAnalytics"));

export default function App(){

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* User Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard2/></ProtectedRoute>}/>
        <Route path="/addfunds" element={<ProtectedRoute><AddFunds/></ProtectedRoute>}/>
        <Route path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
        <Route path="/analytics" element={<ProtectedRoute><Analytics/></ProtectedRoute>}/>
        <Route path="/wallet" element={<ProtectedRoute><Wallet/></ProtectedRoute>}/>
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage/></ProtectedRoute>}/>
        <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
        <Route path="/affiliate" element={<ProtectedRoute><AffiliatePage/></ProtectedRoute>}/>

        {/* Public Info Routes */}
        <Route path="/pricing/:platform" element={<PricingPage />} />
        <Route path="/features/instagram" element={<FeaturesInstagram />} />
        <Route path="/features/youtube" element={<FeaturesYoutube />} />
        <Route path="/features/analytics" element={<FeaturesAnalytics />} />
        <Route path="/blog" element={<BlogPage/>}/>
        <Route path="/blog/:slug" element={<PostPage/>}/>
        <Route path="/contact" element={<ContactPage/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/careers" element={<Careers/>}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
        <Route path="/terms-of-service" element={<TermsOfService/>}/>
        <Route path="/refund-policy" element={<RefundPolicy/>}/>
        <Route path="/help" element={<ContactPage/>}/>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>}/>
        <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
        <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
        <Route path="/admin/deposits" element={<AdminProtectedRoute><AdminDeposits /></AdminProtectedRoute>} />
        <Route path="/admin/blog" element={<AdminProtectedRoute><AdminBlog /></AdminProtectedRoute>} />
        <Route path="/admin/fees" element={<AdminProtectedRoute><AdminFees /></AdminProtectedRoute>} />
        <Route path="/admin/system" element={<AdminProtectedRoute><AdminSystem /></AdminProtectedRoute>} />
        <Route path="/admin/watchdog" element={<AdminProtectedRoute><AdminWatchdog /></AdminProtectedRoute>} />
        <Route path="/admin/notifications" element={<AdminProtectedRoute><AdminNotifications /></AdminProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}
