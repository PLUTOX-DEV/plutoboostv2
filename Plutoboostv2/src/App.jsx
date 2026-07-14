import React, { useEffect, useContext, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserContext from './context/UserContext';
import LoadingSpinner from './components/LoadingSpinner';

// Page Loader Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0B0E2A]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-400 text-sm">Loading Plutoboost...</p>
    </div>
  </div>
);

// Error Fallback Component
const ErrorFallback = ({ error, resetError }) => (
  <div className="flex items-center justify-center min-h-screen bg-[#0B0E2A] text-white p-6">
    <div className="text-center max-w-md">
      <div className="text-6xl mb-6">😅</div>
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p className="text-gray-400 mb-6">
        We're sorry for the inconvenience. Please try refreshing the page.
      </p>
      <button
        onClick={resetError || (() => window.location.reload())}
        className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25"
      >
        Refresh Page
      </button>
      {error && (
        <p className="text-gray-500 text-xs mt-4">
          Error: {error.message || 'Unknown error'}
        </p>
      )}
    </div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
    // You can send to analytics here
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

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

// Service Worker Registration Helper
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New version available!');
                // You could show a notification/toast here
              }
            });
          });
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    });

    // Handle updates
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }
};

// Force unregister old service workers
const unregisterOldServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        if (registration.active && registration.active.scriptURL.includes('sw.js')) {
          await registration.unregister();
          console.log('Old service worker unregistered');
        }
      }
    } catch (error) {
      console.log('Service worker unregister error:', error);
    }
  }
};

// Clear old caches
const clearOldCaches = async () => {
  if ('caches' in window) {
    try {
      const keys = await caches.keys();
      for (const key of keys) {
        if (key.includes('plutoboost') || key.includes('vite') || key.includes('workbox')) {
          await caches.delete(key);
          console.log('Cache deleted:', key);
        }
      }
    } catch (error) {
      console.log('Cache clear error:', error);
    }
  }
};

export default function App() {
  // Service Worker and Cache management
  useEffect(() => {
    const initServiceWorker = async () => {
      // First, unregister old service workers
      await unregisterOldServiceWorkers();
      
      // Clear old caches
      await clearOldCaches();
      
      // Then register the new one
      registerServiceWorker();
    };

    initServiceWorker();

    // Handle online/offline status
    const handleOnline = () => {
      console.log('App is online');
      // Refresh data when coming back online
    };

    const handleOffline = () => {
      console.log('App is offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global error handler for unhandled rejections
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      // You could send this to an error tracking service
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
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
          
          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}