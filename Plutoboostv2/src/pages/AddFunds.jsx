import { useState, useContext } from "react";
import {
  Wallet,
  CreditCard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserContext from "../context/UserContext";
import api from "../api";

const amounts = [5000, 10000, 15000, 25000, 50000, 100000];

export default function AddFunds() {
  const { balance } = useContext(UserContext);
  const [amount, setAmount] = useState(15000);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const finalAmount = customAmount ? Number(customAmount) : amount;
  const depositFee = 2.9;
  const feeAmount = finalAmount * (depositFee / 100);
  const amountToReceive = finalAmount - feeAmount;
  const bonusAmount = finalAmount >= 50000 ? finalAmount * 0.05 : 0;

  const handleFundWallet = async () => {
    if (finalAmount < 100) {
      setNotification({
        show: true,
        message: "Minimum deposit is ₦100",
        type: "error",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/paystack/initialize", { amount: finalAmount });
      if (res.data?.url) {
        window.location.assign(res.data.url);
        return;
      }

      throw new Error("Paystack checkout URL was not returned.");
    } catch (err) {
      console.error("Funding error:", err);
      setNotification({
        show: true,
        message: err.response?.data?.error || "Failed to start Paystack checkout. Please try again.",
        type: "error",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountSelect = (amt) => {
    setAmount(amt);
    setCustomAmount("");
  };

  return (
    <div className="flex min-h-screen bg-[#07091F] text-white">
      <Sidebar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8 lg:ml-72 xl:ml-80 2xl:ml-96 pt-16 sm:pt-6">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
                <Sparkles className="text-purple-400" size={24} />
                Add Funds
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Fund your wallet securely with Paystack checkout
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
              <div className="rounded-lg bg-purple-500/20 p-2">
                <Wallet size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Current Balance</p>
                <p className="text-base font-semibold">₦{balance.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {notification.show && (
            <div
              className={`rounded-xl border p-3 text-sm ${
                notification.type === "success"
                  ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                  : notification.type === "error"
                  ? "border-red-500/30 bg-red-500/20 text-red-400"
                  : "border-amber-500/30 bg-amber-500/20 text-amber-400"
              }`}
            >
              {notification.message}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                <div className="rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 p-2">
                  <CreditCard size={18} className="text-purple-400" />
                </div>
                Choose amount
              </h2>
              <span className="text-[10px] text-gray-400 sm:text-xs">Min: ₦100</span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {amounts.map((amt) => {
                const isSelected = amount === amt && !customAmount;
                return (
                  <button
                    key={amt}
                    onClick={() => handleAmountSelect(amt)}
                    className={`rounded-xl py-3 text-sm font-semibold transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"
                        : "border border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/10"
                    }`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Or enter custom amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount(0);
                  }}
                  placeholder="Enter amount"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-4 py-3 text-sm outline-none ring-0"
                  min="100"
                />
              </div>
              {customAmount && customAmount < 100 && (
                <p className="flex items-center gap-1 text-[10px] text-red-400 sm:text-xs">
                  <AlertCircle size={12} />
                  Minimum amount is ₦100
                </p>
              )}
            </div>

            <div className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Amount to pay</span>
                <span className="text-xl font-semibold">₦{finalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Processing fee ({depositFee}%)</span>
                <span className="text-red-400">-₦{feeAmount.toFixed(2).toLocaleString()}</span>
              </div>
              {bonusAmount > 0 && (
                <div className="flex items-center justify-between text-sm text-amber-400">
                  <span>Bonus (5%)</span>
                  <span>+₦{bonusAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-white/10 pt-2 text-sm">
                <span className="text-gray-400">You will receive</span>
                <span className="font-semibold text-emerald-400">
                  ₦{(amountToReceive + bonusAmount).toFixed(2).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleFundWallet}
              disabled={loading || (customAmount && customAmount < 100)}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-semibold transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Preparing checkout...
                </>
              ) : (
                <>
                  Pay with Paystack
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 sm:text-xs">
              <ShieldCheck size={14} className="text-emerald-400" />
              Secured Paystack Checkout • 256-bit encryption
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}