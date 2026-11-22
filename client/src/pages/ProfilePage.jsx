import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Award,
  Bookmark,
  MessageSquare,
  ShieldAlert,
  LogOut,
  Clock,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('quiz');
  const [quizHistory, setQuizHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadUserData() {
      try {
        setIsLoading(true);
        // Load quiz history
        const qRes = await fetch('/api/v1/me/quiz-history');
        if (qRes.ok) {
          const qData = await qRes.json();
          setQuizHistory(qData.data || []);
        }

        // Load bookmarks
        const bRes = await fetch('/api/v1/me/bookmarks');
        if (bRes.ok) {
          const bData = await bRes.json();
          setBookmarks(bData.data || []);
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleRemoveBookmark = async (id) => {
    try {
      const res = await fetch(`/api/v1/me/bookmarks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id && b.content_block_id !== id));
      }
    } catch (e) {
      console.error('Failed to remove bookmark:', e);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* User Banner */}
      <div className="p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {user.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isAdmin
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
              }`}>
                {user.role}
              </span>
            </div>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="primary" className="bg-purple-600 hover:bg-purple-700 text-white">
                Admin Dashboard
              </Button>
            </Link>
          )}

          <Button variant="outline" onClick={handleLogout} icon={LogOut}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
            activeTab === 'quiz'
              ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-900/60 dark:text-blue-100'
              : 'border-transparent text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Quiz Scores ({quizHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
            activeTab === 'bookmarks'
              ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-900/60 dark:text-blue-100'
              : 'border-transparent text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Bookmarks ({bookmarks.length})</span>
        </button>

        <Link
          to="/tools"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 ml-auto"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Go to AAC & Tools</span>
        </Link>
      </div>

      {/* Tab 1: Quiz History */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Your Quiz Performance</h3>
          {isLoading ? (
            <p className="text-slate-500">Loading attempts...</p>
          ) : quizHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizHistory.map((item) => {
                const pct = Math.round((item.score / item.total) * 100);
                return (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                        {item.category_title}
                      </h4>
                      <span className="text-xs text-slate-500">
                        Score: <strong>{item.score}</strong> / {item.total}
                      </span>
                    </div>

                    <div className={`px-4 py-2 rounded-xl text-lg font-extrabold ${
                      pct >= 70
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
              <Award className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">You haven't completed any quizzes yet.</p>
              <Link to="/category/visual-impairment#sec-quiz" className="mt-3 inline-block">
                <Button variant="primary" size="sm">Try Visual Impairment Quiz</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Bookmarked Sections</h3>
          {isLoading ? (
            <p className="text-slate-500">Loading bookmarks...</p>
          ) : bookmarks.length > 0 ? (
            <div className="space-y-3">
              {bookmarks.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                      {b.category_title} • {b.block_type}
                    </span>
                    <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {b.block_title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/category/${b.category_slug}#${b.block_type}`}>
                      <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                        View
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleRemoveBookmark(b.id)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg touch-target"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
              <Bookmark className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">No bookmarks saved yet. Click the bookmark icon on any topic page to save it here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
