import { useState } from 'react';
import Button from '../components/Button';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    // Simple client-side auth for admin UI (dev only)
    if (username === 'admin' && password === 'Password123') {
      localStorage.setItem('adminToken', 'dev-token');
      window.location.hash = 'admin';
      window.location.reload();
      return;
    }
    setError('Invalid credentials');
  }

  return (
    <div className="min-h-screen w-full flex bg-black">
      {/* LEFT: large image panel - visible on medium+ screens */}
      <div className="hidden lg:flex lg:w-2/3 xl:w-3/4 relative">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/Screenshot 2026-04-07 174800.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40" />
      </div>

      {/* RIGHT: dark form panel */}
      <div className="w-full lg:w-1/3 xl:w-1/4 flex items-center justify-center">
        <div className="w-full max-w-lg px-10 py-16">
          <div className="text-white text-4xl font-light mb-3">Go For It</div>

          
          <div className="text-gray-400 mb-8">Let's turn Promises to Reality.</div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="text-sm text-gray-300">E-mail</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="YOU@NCBAGROUP.com"
                className="mt-3 w-full px-4 py-3 rounded-md bg-[#1f1f1f] text-gray-100 placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="mt-3 w-full px-4 py-3 rounded-md bg-[#1f1f1f] text-gray-100 placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* terms checkbox removed per request */}

            {error && <div className="text-red-500">{error}</div>}

            <div>
              <Button type="submit" variant="primary" className="w-full py-3 rounded-md" style={{ background: '#0b79ff', color: '#fff' }}>
                Sign In
              </Button>
            </div>

            <div className="text-center text-sm text-gray-400 mt-2"><a href="#" className="text-blue-400"></a></div>
          </form>
        </div>
      </div>
    </div>
  );
}
