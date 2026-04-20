import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import NCBALogo from '../assets/images/logoIcon.png';
import M2Image from '../assets/images/m2.png';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simple client-side auth for admin UI (dev only)
    setTimeout(() => {
      if (username === 'admin' && password === 'Password123') {
        localStorage.setItem('adminToken', 'dev-token');
        window.location.hash = 'admin';
        window.location.reload();
        return;
      }
      setError('Invalid username or password. Please try again.');
      setIsLoading(false);
    }, 500);
  }

  return (
    <div className="min-h-screen w-full flex overflow-x-hidden">
      {/* LEFT: Blue Brand Panel - visible on medium+ screens */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-between p-8 bg-gradient-to-br from-blue-600 to-blue-700">
        {/* Background Pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        />

        {/* Logo and Title */}
        <div className="relative z-10 text-center text-white space-y-8">
          <div className="flex justify-center">
            <img 
              src={NCBALogo} 
              alt="NCBA Logo" 
              className="h-24 w-auto object-contain drop-shadow-lg"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight">NCBA Mortgage</h1>
            <p className="text-xl text-blue-100 font-medium">Admin Portal</p>
          </div>
        </div>

        {/* M2 Illustration */}
        <div className="relative z-10 flex justify-center">
          <img 
            src={M2Image} 
            alt="Mortgage illustration" 
            className="h-48 w-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* Description */}
        <div className="relative z-10 text-center text-blue-100 space-y-4 mb-12">
          <p className="text-lg font-medium leading-relaxed max-w-xs">
            Manage callback requests and track mortgage prequalification submissions with ease.
          </p>
          <p className="text-sm text-blue-50">
            © 2026 NCBA Group. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT: White Login Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-10 lg:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-6">
            <img 
              src={NCBALogo} 
              alt="NCBA Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Welcome Back!</h2>
            <p className="text-gray-600 text-base">
              Access your admin dashboard to manage mortgage submissions.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value);
                    setError(null);
                  }}
                  placeholder="admin"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="pt-6 mt-2 border-t border-gray-200">
            <details className="cursor-pointer group">
              <summary className="text-sm text-gray-600 hover:text-gray-900 font-medium select-none flex items-center gap-2">
                <span className="inline-block transition-transform group-open:rotate-90">▶</span>
                <span>Demo Credentials</span>
              </summary>
              <div className="mt-4 space-y-3 text-sm">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors">
                  <p className="text-gray-700"><span className="font-semibold">Email:</span> <span className="text-blue-600 font-mono">admin</span></p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors">
                  <p className="text-gray-700"><span className="font-semibold">Password:</span> <span className="text-blue-600 font-mono">Password123</span></p>
                </div>
              </div>
            </details>
          </div>

          {/* Footer Message */}
          <p className="text-center text-xs text-gray-500 pt-2">
            For security purposes, only authorized personnel can access the admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
