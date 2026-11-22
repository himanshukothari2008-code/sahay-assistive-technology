import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Key, Mail, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(demoEmail, demoPass);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-2xl mx-auto mb-3 shadow-md">
            S
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Sign In to Sahay
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your saved preferences, quiz progress, and custom AAC boards.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs sm:text-sm flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus-visible:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus-visible:outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full mt-2"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Quick Demo Logins for Evaluation & Presentation */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3 text-center">
            One-Click Quick Evaluation Logins:
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@sahay.org', 'AdminPass123!')}
              className="p-2.5 rounded-xl border-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100 text-purple-900 dark:text-purple-200 text-xs font-bold text-center transition-colors"
            >
              👑 Demo Admin
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('user@sahay.org', 'UserPass123!')}
              className="p-2.5 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 text-blue-900 dark:text-blue-200 text-xs font-bold text-center transition-colors"
            >
              🎓 Demo Student
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
