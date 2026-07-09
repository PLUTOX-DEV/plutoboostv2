import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Landmark,
  ShieldCheck,
  Wallet,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Lock,
  Clock,
  Percent,
  Wallet as WalletIcon,
  Building2,
  Copy,
  ExternalLink,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserContext from "../context/UserContext";
import api from "../api";

const amounts = [5000, 10000, 15000, 25000, 50000, 100000];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function AddFunds() {
  const { balance, setBalance } = useContext(UserContext);
  const [amount, setAmount] = useState(15000);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [depositFee, setDepositFee] = useState(2.9); // 2.9% processing fee
  const [isMobileView, setIsMobileView] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: "GTBank",
    accountName: "PlutoBoost Limited",
    accountNumber: "0123456789",
    amount: 0
  });

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  const finalAmount = customAmount ? Number(customAmount) : amount;
  const feeAmount = finalAmount * (depositFee / 100);
  const amountToReceive = finalAmount - feeAmount;
  const bonusAmount = finalAmount >= 50000 ? finalAmount * 0.05 : 0;

  const handleFundWallet = async () => {
    if (finalAmount < 100) {
      setNotification({ 
        show: true, 
        message: 'Minimum deposit is ₦100', 
        type: 'error' 
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
      return;
    }

    setLoading(true);
    try {
      // Show bank details instead of processing payment
      setBankDetails(prev => ({
        ...prev,
        amount: finalAmount
      }));
      setShowBankDetails(true);
      setNotification({ 
        show: true, 
        message: 'Bank transfer details generated successfully!', 
        type: 'success' 
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
    } catch (err) {
      console.error("Funding error:", err);
      setNotification({ 
        show: true, 
        message: 'Failed to generate bank details. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
    }
    setLoading(false);
  };

  const handleAmountSelect = (amt) => {
    setAmount(amt);
    setCustomAmount("");
    setShowBankDetails(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setNotification({ 
      show: true, 
      message: 'Copied to clipboard!', 
      type: 'success' 
    });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#07091F] text-white">
      <Sidebar />

      <main className="relative flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-6 lg:py-8 overflow-hidden lg:ml-72 xl:ml-80 2xl:ml-96 pt-16 sm:pt-6">
        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed_0%,transparent_55%),radial-gradient(circle_at_bottom,#9333ea_0%,transparent_60%)] opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-5 sm:space-y-8 max-w-6xl mx-auto">
          {/* HEADER */}
          <motion.div {...(isMobileView ? {} : fadeInUp)} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text flex items-center gap-2">
                <Sparkles className="text-purple-400" size={24} />
                Add Funds
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Fund your wallet via bank transfer
              </p>
            </div>

            <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 card-hover">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <WalletIcon size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Current Balance</p>
                <p className="font-bold text-base sm:text-lg">₦{balance.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          {/* NOTIFICATION */}
          <AnimatePresence>
            {notification.show && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-3 sm:p-4 rounded-xl border text-sm sm:text-base ${
                  notification.type === 'success' 
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                    : notification.type === 'error' 
                    ? 'bg-red-500/20 border-red-500/30 text-red-400'
                    : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                }`}
              >
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* AMOUNT SELECTION */}
            <motion.div 
              {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.1 } })}
              className="lg:col-span-2 glass card-hover rounded-2xl p-4 sm:p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                    <Zap size={18} className="text-purple-400" />
                  </div>
                  Choose Amount
                </h2>
                <span className="text-[10px] sm:text-xs text-gray-400">Min: ₦100</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {amounts.map((amt) => {
                  const isPopular = amt === 15000;
                  const isSelected = amount === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      onClick={() => handleAmountSelect(amt)}
                      className={`relative py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 touch-manipulation ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-glow-sm scale-[1.02]"
                          : "bg-black/40 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 hover:scale-[1.01]"
                      }`}
                    >
                      {isPopular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[8px] sm:text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 rounded-full whitespace-nowrap">
                          ⭐ POPULAR
                        </span>
                      )}
                      ₦{amt.toLocaleString()}
                    </button>
                  );
                })}
              </div>

              {/* CUSTOM AMOUNT */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <span>Or enter custom amount</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₦</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount(0);
                      setShowBankDetails(false);
                    }}
                    placeholder="Enter amount"
                    className="input-glass w-full pl-8 min-h-[48px] text-sm sm:text-base"
                    min="100"
                  />
                  {customAmount && customAmount < 100 && (
                    <p className="text-[10px] sm:text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Minimum amount is ₦100
                    </p>
                  )}
                </div>
              </div>

              {/* BONUS INFO */}
              {finalAmount >= 50000 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
                >
                  <Sparkles size={16} className="text-amber-400 animate-pulse" />
                  <span className="text-xs sm:text-sm text-amber-400">
                    🎉 You qualify for a <strong>5% bonus</strong> on this deposit!
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* PAYMENT SUMMARY & ACTION */}
            <motion.div
              {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.2 } })}
              className="lg:col-span-2 glass card-hover rounded-2xl p-4 sm:p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                    <Landmark size={18} className="text-emerald-400" />
                  </div>
                  Bank Transfer
                </h2>
                <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
                  <Lock size={12} className="text-emerald-400" />
                  Secure
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Amount to pay</span>
                  <span className="text-xl sm:text-2xl font-bold">₦{finalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Processing Fee ({depositFee}%)</span>
                  <span className="text-red-400">-₦{feeAmount.toFixed(2).toLocaleString()}</span>
                </div>
                {bonusAmount > 0 && (
                  <div className="flex justify-between items-center text-sm animate-pulse">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Sparkles size={12} className="text-amber-400" />
                      Bonus (5%)
                    </span>
                    <span className="text-amber-400 font-semibold">+₦{bonusAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                  <span className="text-gray-400 text-sm font-medium">You will receive</span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                    ₦{(amountToReceive + bonusAmount).toFixed(2).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* BANK DETAILS SECTION - Shown after clicking generate */}
              {showBankDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-black/40 border border-emerald-500/30 space-y-3"
                >
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle size={18} />
                    <span className="text-sm font-semibold">Bank Transfer Details</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div>
                        <p className="text-[10px] text-gray-400">Bank</p>
                        <p className="font-semibold text-sm">{bankDetails.bankName}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(bankDetails.bankName)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition"
                      >
                        <Copy size={14} className="text-gray-400" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div>
                        <p className="text-[10px] text-gray-400">Account Name</p>
                        <p className="font-semibold text-sm">{bankDetails.accountName}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(bankDetails.accountName)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition"
                      >
                        <Copy size={14} className="text-gray-400" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-purple-500/30">
                      <div>
                        <p className="text-[10px] text-gray-400">Account Number</p>
                        <p className="font-semibold text-sm text-purple-400">{bankDetails.accountNumber}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(bankDetails.accountNumber)}
                        className="p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition"
                      >
                        <Copy size={14} className="text-purple-400" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div>
                        <p className="text-[10px] text-gray-400">Amount to Transfer</p>
                        <p className="font-semibold text-sm text-emerald-400">₦{bankDetails.amount.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(bankDetails.amount.toString())}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition"
                      >
                        <Copy size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-gray-500 mt-2">
                    <p>After transfer, your wallet will be credited automatically</p>
                    <p className="mt-1">Expected credit time: 5-30 minutes</p>
                  </div>
                </motion.div>
              )}

              <button
                onClick={handleFundWallet}
                disabled={loading || (customAmount && customAmount < 100)}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 min-h-[52px] text-sm sm:text-base font-semibold"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Details...
                  </>
                ) : showBankDetails ? (
                  <>
                    <CheckCircle size={18} />
                    Details Generated
                  </>
                ) : (
                  <>
                    Generate Transfer Details
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-gray-400">
                <ShieldCheck size={14} className="text-emerald-400" />
                Secured Bank Transfer • 256-bit encryption
              </div>
            </motion.div>
          </div>

          {/* FEATURES */}
          <motion.div 
            {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.3 } })}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <FeatureCard icon={Zap} title="Instant" description="Credit in seconds" color="text-purple-400" />
            <FeatureCard icon={ShieldCheck} title="Secure" description="256-bit encryption" color="text-emerald-400" />
            <FeatureCard icon={Clock} title="24/7" description="Available anytime" color="text-blue-400" />
            <FeatureCard icon={Percent} title="Bonus" description="On large deposits" color="text-amber-400" />
          </motion.div>

          {/* TRUST BADGES */}
          <motion.div 
            {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.4 } })}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-500"
          >
            <span className="flex items-center gap-1">
              <CheckCircle size={12} className="text-emerald-400" />
              PCI Compliant
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle size={12} className="text-emerald-400" />
              SSL Secure
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle size={12} className="text-emerald-400" />
              Instant Processing
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle size={12} className="text-emerald-400" />
              No Hidden Fees
            </span>
          </motion.div>

          {/* HOW IT WORKS */}
          <motion.div 
            {...(isMobileView ? {} : { ...fadeInUp, transition: { delay: 0.5 } })}
            className="glass rounded-2xl p-4 sm:p-6"
          >
            <h3 className="text-sm sm:text-base font-semibold mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-purple-400" />
              How It Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium text-sm">Select Amount</p>
                  <p className="text-xs text-gray-400">Choose or enter your desired deposit amount</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium text-sm">Get Details</p>
                  <p className="text-xs text-gray-400">Generate bank transfer details for your payment</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium text-sm">Send & Confirm</p>
                  <p className="text-xs text-gray-400">Transfer and wait for automatic credit</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <div className="glass rounded-xl p-3 sm:p-4 text-center card-hover transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
      <Icon size={18} className={`mx-auto ${color} mb-1.5 sm:mb-2`} />
      <p className="font-semibold text-xs sm:text-sm">{title}</p>
      <p className="text-[9px] sm:text-[10px] text-gray-400">{description}</p>
    </div>
  );
}