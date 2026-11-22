import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  BarChart3,
  Layers,
  FileText,
  Video,
  HelpCircle,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Users,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states for creating resources
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catSlug, setCatSlug] = useState('');
  const [catTitle, setCatTitle] = useState('');
  const [catSummary, setCatSummary] = useState('');
  const [catIcon, setCatIcon] = useState('Accessibility');

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaCatId, setMediaCatId] = useState('');
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaAlt, setMediaAlt] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaTranscript, setMediaTranscript] = useState('');
  const [mediaCredit, setMediaCredit] = useState('');

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizCatId, setQuizCatId] = useState('');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOpt1, setQuizOpt1] = useState('');
  const [quizOpt2, setQuizOpt2] = useState('');
  const [quizOpt3, setQuizOpt3] = useState('');
  const [quizOpt4, setQuizOpt4] = useState('');
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('');

  useEffect(() => {
    async function loadAdminData() {
      try {
        setIsLoading(true);
        // Load stats
        const sRes = await fetch('/api/v1/admin/stats');
        if (sRes.ok) {
          const sData = await sRes.json();
          setStats(sData.data);
        }

        // Load categories
        const cRes = await fetch('/api/v1/categories');
        if (cRes.ok) {
          const cData = await cRes.json();
          setCategories(cData.data || []);
          if (cData.data?.length > 0) {
            setMediaCatId(cData.data[0].id);
            setQuizCatId(cData.data[0].id);
          }
        }

        // Load feedback
        const fRes = await fetch('/api/v1/admin/feedback');
        if (fRes.ok) {
          const fData = await fRes.json();
          setFeedback(fData.data || []);
        }
      } catch (err) {
        console.error('Admin data load error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="p-8 rounded-3xl border-2 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 shadow-xl">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-2xl font-extrabold mb-2">Administrator Access Required</h2>
          <p className="text-sm mb-6">
            You must be signed in with an administrator role to manage categories, media, and quizzes.
          </p>
          <Link to="/login">
            <Button variant="primary">Sign in as Administrator</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Create Category Handler
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/v1/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: catSlug.toLowerCase().trim().replace(/\s+/g, '-'),
          title: catTitle.trim(),
          summary: catSummary.trim(),
          icon: catIcon,
          color: 'blue'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category');

      setMessage(`Category "${catTitle}" created live in SQLite database!`);
      setIsCatModalOpen(false);
      setCatTitle('');
      setCatSlug('');
      setCatSummary('');

      // Refresh categories
      const refresh = await fetch('/api/v1/categories').then(r => r.json());
      setCategories(refresh.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Create Media Handler
  const handleCreateMedia = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/v1/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: mediaCatId,
          type: 'video',
          url: mediaUrl.trim(),
          title: mediaTitle.trim(),
          alt_text: mediaAlt.trim(),
          caption: mediaCaption.trim(),
          transcript: mediaTranscript.trim(),
          source_credit: mediaCredit.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add media');

      setMessage(`Media item "${mediaTitle}" added with transcript!`);
      setIsMediaModalOpen(false);
      setMediaTitle('');
      setMediaUrl('');
      setMediaAlt('');
      setMediaCaption('');
      setMediaTranscript('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Create Quiz Question Handler
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const options = [quizOpt1, quizOpt2, quizOpt3, quizOpt4].filter(Boolean);
      const res = await fetch('/api/v1/admin/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: quizCatId,
          question: quizQuestion.trim(),
          options,
          correct_index: Number(quizCorrect),
          explanation: quizExplanation.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create quiz question');

      setMessage(`Quiz question created and live on category page!`);
      setIsQuizModalOpen(false);
      setQuizQuestion('');
      setQuizOpt1('');
      setQuizOpt2('');
      setQuizOpt3('');
      setQuizOpt4('');
      setQuizExplanation('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Admin Header */}
      <div className="pb-6 border-b-2 border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Sahay Management Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dynamic content management for categories, captioned media, and quiz questions. Changes persist immediately in SQLite.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsCatModalOpen(true)} icon={Plus}>
            New Category
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsMediaModalOpen(true)} icon={Video}>
            New Media
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsQuizModalOpen(true)} icon={HelpCircle} className="bg-purple-600 hover:bg-purple-700 text-white">
            New Quiz Question
          </Button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Users</span>
            <span className="text-2xl font-extrabold text-blue-600">{stats.totalUsers}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Categories</span>
            <span className="text-2xl font-extrabold text-purple-600">{stats.totalCategories}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Content Blocks</span>
            <span className="text-2xl font-extrabold text-emerald-600">{stats.totalBlocks}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Media Items</span>
            <span className="text-2xl font-extrabold text-amber-600">{stats.totalMedia}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Quiz Questions</span>
            <span className="text-2xl font-extrabold text-indigo-600">{stats.totalQuizzes}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Avg Score</span>
            <span className="text-2xl font-extrabold text-teal-600">{stats.averageQuizScore}%</span>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${activeTab === 'stats' ? 'bg-purple-600 text-white border-purple-600' : 'border-slate-300'}`}
        >
          Categories Table ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${activeTab === 'feedback' ? 'bg-purple-600 text-white border-purple-600' : 'border-slate-300'}`}
        >
          Feedback Inbox ({feedback.length})
        </button>
      </div>

      {/* Categories Table View */}
      {activeTab === 'stats' && (
        <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4">Title & Slug</th>
                <th className="p-4">Summary</th>
                <th className="p-4">Content Blocks</th>
                <th className="p-4">Quizzes</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                  <td className="p-4">
                    <span className="font-bold text-base block text-slate-900 dark:text-slate-100">{c.title}</span>
                    <span className="text-xs font-mono text-slate-400">/category/{c.slug}</span>
                  </td>
                  <td className="p-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {c.summary}
                  </td>
                  <td className="p-4 font-semibold text-blue-600">{c.content_blocks_count || 0} blocks</td>
                  <td className="p-4 font-semibold text-purple-600">{c.quiz_count || 0} questions</td>
                  <td className="p-4">
                    <Link to={`/category/${c.slug}`} className="text-xs font-bold text-blue-600 hover:underline">
                      View Live Page →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Feedback View */}
      {activeTab === 'feedback' && (
        <div className="space-y-3">
          {feedback.length > 0 ? (
            feedback.map((f) => (
              <div key={f.id} className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Rating: {'★'.repeat(f.rating || 5)}</span>
                  <span>{new Date(f.created_at).toLocaleString()}</span>
                </div>
                <p className="text-base text-slate-800 dark:text-slate-200 font-medium">"{f.message}"</p>
                <span className="text-xs text-slate-500 mt-2 block">By: {f.user_name || 'Anonymous Visitor'}</span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 border rounded-2xl">
              No feedback submissions received yet.
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Add Category */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="Add New Disability Category"
        description="Creates a new top-level category in the SQLite database without code modification."
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Category Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Intellectual & Developmental Disability"
              value={catTitle}
              onChange={(e) => {
                setCatTitle(e.target.value);
                setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">URL Slug</label>
            <input
              type="text"
              required
              value={catSlug}
              onChange={(e) => setCatSlug(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Summary Description</label>
            <textarea
              required
              rows={3}
              value={catSummary}
              onChange={(e) => setCatSummary(e.target.value)}
              placeholder="Overview of the condition and assistive solutions..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsCatModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Category</Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Add Media */}
      <Modal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        title="Add Captioned Media Resource"
        description="Every media item must include alt-text and a full transcript for WCAG compliance."
      >
        <form onSubmit={handleCreateMedia} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Target Category</label>
            <select
              value={mediaCatId}
              onChange={(e) => setMediaCatId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Video Title</label>
            <input
              type="text"
              required
              value={mediaTitle}
              onChange={(e) => setMediaTitle(e.target.value)}
              placeholder="e.g. How to use an Adaptive Trackball"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Embed URL (YouTube nocookie embed)</label>
            <input
              type="url"
              required
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://www.youtube-nocookie.com/embed/..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Alt Text (Screen Reader Description)</label>
            <input
              type="text"
              required
              value={mediaAlt}
              onChange={(e) => setMediaAlt(e.target.value)}
              placeholder="Visual description of the video contents..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Full Text Transcript</label>
            <textarea
              rows={3}
              value={mediaTranscript}
              onChange={(e) => setMediaTranscript(e.target.value)}
              placeholder="Spoken words and audio descriptions transcript..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-mono text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsMediaModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Captioned Media</Button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Add Quiz Question */}
      <Modal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        title="Add Interactive Quiz Question"
        description="Creates an interactive question with instant feedback for student assessment."
      >
        <form onSubmit={handleCreateQuiz} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Category</label>
            <select
              value={quizCatId}
              onChange={(e) => setQuizCatId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Question Prompt</label>
            <input
              type="text"
              required
              value={quizQuestion}
              onChange={(e) => setQuizQuestion(e.target.value)}
              placeholder="e.g. What is the minimum target size under WCAG 2.2?"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Option 1"
              value={quizOpt1}
              onChange={(e) => setQuizOpt1(e.target.value)}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Option 2"
              value={quizOpt2}
              onChange={(e) => setQuizOpt2(e.target.value)}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Option 3"
              value={quizOpt3}
              onChange={(e) => setQuizOpt3(e.target.value)}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Option 4"
              value={quizOpt4}
              onChange={(e) => setQuizOpt4(e.target.value)}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Correct Option (0 to 3)</label>
            <select
              value={quizCorrect}
              onChange={(e) => setQuizCorrect(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800"
            >
              <option value={0}>Option 1 is correct</option>
              <option value={1}>Option 2 is correct</option>
              <option value={2}>Option 3 is correct</option>
              <option value={3}>Option 4 is correct</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Explanation (Shown after answering)</label>
            <textarea
              required
              rows={2}
              value={quizExplanation}
              onChange={(e) => setQuizExplanation(e.target.value)}
              placeholder="Explanation of why this answer is correct..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsQuizModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Quiz Question</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AdminDashboardPage;
