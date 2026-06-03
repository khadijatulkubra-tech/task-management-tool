import React from "react";
import {
  ArrowLeft,
  Mail,
  User,
  Shield,
  LogOut,
  Edit3,
  Calendar,
} from "lucide-react";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Banner */}
          <div className="h-40 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 relative">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-10 w-20 h-20 bg-white/30 rounded-full blur-2xl" />
              <div className="absolute bottom-4 right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
            </div>
          </div>

          <div className="px-6 md:px-10 pb-10">
            {/* Avatar */}
            <div className="relative -mt-16 mb-6 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-bold text-indigo-600">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.fullName}
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2 text-gray-500">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 mt-4 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold border border-indigo-100">
                <Shield className="w-3.5 h-3.5" />
                {user.role}
              </span>
            </div>

            {/* Info Cards */}
            <div className="space-y-3 mb-8">
              {[
                { label: "Full Name", value: user.fullName, icon: User },
                { label: "Email Address", value: user.email, icon: Mail },
                { label: "Account Role", value: user.role, icon: Shield },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-2xl transition-all active:scale-[0.98] border border-red-200 hover:border-red-300"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
