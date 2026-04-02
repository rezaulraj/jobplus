import React, { useState } from "react";
import { X, Clock, Rocket, Mail, Bell } from "lucide-react";

const ApplyPopUps = ({ isOpen, onClose, jobTitle, company }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`We'll notify you at ${email} when this feature is ready!`);
    setEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 max-h-screen">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
        <div className="relative h-28 overflow-hidden bg-linear-to-r from-primary to-secondary">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10 p-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Rocket className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  Feature Under Development
                </h2>
                <p className="text-white/80">
                  We're working hard to bring this to you!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 max-h-[500px] overflow-auto">
          <div className="mb-8 p-6 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{jobTitle}</h3>
            <p className="text-gray-600 mb-4">{company}</p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-gray-500">
                Application feature coming soon
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Development Progress
              </h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                75% Complete
              </span>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: "75%" }}
              >
                <div className="h-full bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
              {["Planning", "Development", "Testing", "Launch"].map(
                (step, index) => (
                  <div key={step} className="relative">
                    <div
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        index < 3
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {index < 3 ? "✓" : index + 1}
                    </div>
                    <p className="text-sm font-medium text-gray-700">{step}</p>
                    {index < 3 && (
                      <div className="absolute top-5 left-3/4 w-full h-0.5 bg-green-500"></div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Get Notified When Ready
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg font-medium bg-linear-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  Notify Me
                </button>
              </div>
            </form>
            <p className="text-sm text-gray-500 mt-4 text-center">
              We'll email you as soon as this feature launches. No spam,
              promise!
            </p>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Estimated Launch: March 2026
              </span>
            </div>
          </div>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Thank you for your patience! Our team is working around the clock to
            deliver the best experience.
          </p>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ApplyPopUps;
