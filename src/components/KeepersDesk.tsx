import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  X,
  Check,
  Ban,
  Trash2,
  Plus,
  Edit2,
  Eye,
  BookOpen,
  Mail,
  Lock,
  LogOut,
  RefreshCw,
  AlertCircle,
  HeartHandshake,
  Feather,
} from 'lucide-react';
import type { Chapter, Letter, AdminStats } from '../types';

interface KeepersDeskProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const KeepersDesk: React.FC<KeepersDeskProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kokedves_admin_token'));
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Active Tab: 'moderation' | 'chapters'
  const [activeTab, setActiveTab] = useState<'moderation' | 'chapters'>('moderation');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'to_brides' | 'to_ferjem'>('all');

  // Data state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [allLetters, setAllLetters] = useState<Letter[]>([]);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Modal / form states
  const [inspectLetter, setInspectLetter] = useState<Letter | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isAddingChapter, setIsAddingChapter] = useState<boolean>(false);

  // Chapter form fields
  const [chapterForm, setChapterForm] = useState({
    title: '',
    chapter_label: '',
    subtitle: '',
    content: '',
    cover_image_url: '',
    display_order: 1,
    status: 'published' as 'published' | 'draft',
  });

  const fetchAdminData = async (authToken: string) => {
    setIsLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      const [statsRes, lettersRes, chaptersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/letters?admin=true', { headers }),
        fetch('/api/chapters?admin=true', { headers }),
      ]);

      if (statsRes.ok && lettersRes.ok && chaptersRes.ok) {
        const statsData = await statsRes.json();
        const lettersData = await lettersRes.json();
        const chaptersData = await chaptersRes.json();

        setStats(statsData);
        setAllLetters(lettersData);
        setAllChapters(chaptersData);
      } else if (statsRes.status === 401 || statsRes.status === 403) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchAdminData(token);
    }
  }, [isOpen, token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Passphrase rejected');
      }

      setToken(data.token);
      localStorage.setItem('kokedves_admin_token', data.token);
      setPasswordInput('');
      fetchAdminData(data.token);
    } catch (err) {
      setAuthError((err as Error).message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('kokedves_admin_token');
  };

  const handleModerateLetter = async (id: string, status: 'approved' | 'rejected', action?: 'delete') => {
    if (!token) return;
    try {
      const res = await fetch(`/api/letters/${id}/moderate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, action }),
      });

      if (res.ok) {
        fetchAdminData(token);
        onDataChanged();
        if (inspectLetter?.id === id) setInspectLetter(null);
      }
    } catch (err) {
      console.error('Error moderating letter:', err);
    }
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !chapterForm.title.trim() || !chapterForm.content.trim()) return;

    try {
      const isEdit = Boolean(editingChapter);
      const url = isEdit ? `/api/chapters/${editingChapter!.id}` : '/api/chapters';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(chapterForm),
      });

      if (res.ok) {
        setIsAddingChapter(false);
        setEditingChapter(null);
        setChapterForm({
          title: '',
          chapter_label: '',
          subtitle: '',
          content: '',
          cover_image_url: '',
          display_order: 1,
          status: 'published',
        });
        fetchAdminData(token);
        onDataChanged();
      }
    } catch (err) {
      console.error('Error saving chapter:', err);
    }
  };

  const handleDeleteChapter = async (id: string) => {
    if (!token) return;
    if (!confirm('Are you certain you wish to remove this manuscript chapter?')) return;

    try {
      const res = await fetch(`/api/chapters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchAdminData(token);
        onDataChanged();
      }
    } catch (err) {
      console.error('Error deleting chapter:', err);
    }
  };

  if (!isOpen) return null;

  const filteredLetters = allLetters.filter((l) => {
    if (categoryFilter === 'all') return true;
    return l.category === categoryFilter;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="keepers-desk-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#08090A]/95 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 lg:p-8"
    >
      <div className="relative w-full max-w-6xl bg-[#0D0E10] border border-[#77777A] p-4 sm:p-8 shadow-2xl my-6 min-h-[70vh] flex flex-col justify-between">
        {/* Top Header */}
        <div>
          <div className="sticky top-0 z-20 bg-[#0D0E10] flex items-center justify-between pb-4 border-b border-[#333336]">
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-[#BDBDBB]" />
              <div>
                <h2 id="keepers-desk-title" className="font-display text-xl sm:text-2xl text-[#F0EFEB] tracking-wide">
                  The Keeper's Desk
                </h2>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#77777A]">
                  ARCHIVAL ADMINISTRATION · TWO CORRESPONDENCE CHAMBERS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {token && (
                <button
                  onClick={handleLogout}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#77777A] hover:text-[#F0EFEB] px-2.5 py-1 border border-[#333336]"
                  title="Seal Desk (Log Out)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Seal Desk</span>
                </button>
              )}
              <button
                onClick={onClose}
                type="button"
                className="text-[#77777A] hover:text-[#F0EFEB] p-1.5 border border-[#333336] hover:border-[#77777A]"
                aria-label="Close Keeper's Desk"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!token ? (
            <div className="py-16 max-w-md mx-auto text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#171719] border border-[#333336] flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#BDBDBB]" />
              </div>
              <h3 className="font-display text-2xl text-[#F0EFEB]">
                Enter Keeper's Key
              </h3>
              <p className="font-serif italic text-sm text-[#BDBDBB]">
                This room is reserved for the archivist who guards the correspondence of the brides and Férjem.
              </p>

              <form onSubmit={handleLogin} className="space-y-4 pt-2">
                <input
                  type="password"
                  placeholder="Passphrase (default: kokedves1914)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#171719] border border-[#333336] text-[#F0EFEB] font-mono text-center text-sm px-4 py-2.5 focus:outline-none focus:border-[#BDBDBB]"
                  autoFocus
                />

                {authError && (
                  <p className="text-xs font-mono text-[#BDBDBB] flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full text-xs font-mono uppercase tracking-widest text-[#08090A] bg-[#F0EFEB] hover:bg-[#BDBDBB] py-3 transition-colors font-medium shadow-md"
                >
                  {isAuthenticating ? 'Unlocking...' : 'Unlock The Desk'}
                </button>
              </form>

              <p className="text-[11px] font-mono text-[#77777A]">
                HINT FOR REVIEW: Default administrator passphrase is <span className="text-[#F0EFEB] underline">kokedves1914</span>
              </p>
            </div>
          ) : (
            <div className="pt-6 space-y-8">
              {/* Dynamic Stats Overview */}
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  <div className="border border-[#333336] bg-[#171719] p-3 text-center">
                    <span className="block text-[10px] font-mono uppercase text-[#77777A]">Total Letters</span>
                    <span className="font-display text-2xl font-normal text-[#F0EFEB]">{stats.totalLetters}</span>
                  </div>
                  <div className="border border-[#333336] bg-[#171719] p-3 text-center">
                    <span className="block text-[10px] font-mono uppercase text-[#77777A]">To The Brides</span>
                    <span className="font-display text-2xl font-normal text-[#F0EFEB]">{stats.bridesLettersCount}</span>
                  </div>
                  <div className="border border-[#333336] bg-[#171719] p-3 text-center">
                    <span className="block text-[10px] font-mono uppercase text-[#77777A]">To Férjem</span>
                    <span className="font-display text-2xl font-normal text-[#F0EFEB]">{stats.ferjemLettersCount}</span>
                  </div>
                  <div className="border border-[#333336] bg-[#171719] p-3 text-center border-l-2 border-l-[#BDBDBB]">
                    <span className="block text-[10px] font-mono uppercase text-[#BDBDBB]">Pending Review</span>
                    <span className="font-display text-2xl font-normal text-[#F0EFEB]">{stats.pendingLetters}</span>
                  </div>
                  <div className="border border-[#333336] bg-[#171719] p-3 text-center">
                    <span className="block text-[10px] font-mono uppercase text-[#77777A]">Approved Public</span>
                    <span className="font-display text-2xl font-normal text-[#F0EFEB]">{stats.approvedLetters}</span>
                  </div>
                  <div className="border border-[#333336] bg-[#171719] p-3 text-center">
                    <span className="block text-[10px] font-mono uppercase text-[#77777A]">Private Kept</span>
                    <span className="font-display text-2xl font-normal text-[#F0EFEB]">{stats.privateLetters}</span>
                  </div>
                  <div className="border border-[#333336] bg-[#171719] p-3 text-center">
                    <span className="block text-[10px] font-mono uppercase text-[#77777A]">Chapters Folio</span>
                    <span className="font-display text-2xl font-normal text-[#F0EFEB]">{stats.publishedChapters}</span>
                  </div>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="flex items-center gap-4 border-b border-[#333336] pb-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('moderation')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
                    activeTab === 'moderation'
                      ? 'border-[#F0EFEB] text-[#F0EFEB] font-medium'
                      : 'border-transparent text-[#77777A] hover:text-[#BDBDBB]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  Correspondence Moderation
                  {stats && stats.pendingLetters > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] bg-[#333336] text-[#F0EFEB]">
                      {stats.pendingLetters}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('chapters')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
                    activeTab === 'chapters'
                      ? 'border-[#F0EFEB] text-[#F0EFEB] font-medium'
                      : 'border-transparent text-[#77777A] hover:text-[#BDBDBB]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Chapters Folio ({allChapters.length})
                </button>

                <button
                  onClick={() => token && fetchAdminData(token)}
                  type="button"
                  className="ml-auto p-1.5 text-[#77777A] hover:text-[#F0EFEB]"
                  title="Refresh Archive Data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* TAB 1: CORRESPONDENCE MODERATION */}
              {activeTab === 'moderation' && (
                <div className="space-y-4">
                  {/* Category Filter for Admin */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-[#77777A] uppercase">Filter by Room:</span>
                      <button
                        onClick={() => setCategoryFilter('all')}
                        className={`px-2.5 py-1 border transition-colors ${
                          categoryFilter === 'all'
                            ? 'border-[#F0EFEB] text-[#F0EFEB] bg-[#171719]'
                            : 'border-[#333336] text-[#77777A] hover:text-[#BDBDBB]'
                        }`}
                      >
                        All ({allLetters.length})
                      </button>
                      <button
                        onClick={() => setCategoryFilter('to_brides')}
                        className={`px-2.5 py-1 border transition-colors ${
                          categoryFilter === 'to_brides'
                            ? 'border-[#F0EFEB] text-[#F0EFEB] bg-[#171719]'
                            : 'border-[#333336] text-[#77777A] hover:text-[#BDBDBB]'
                        }`}
                      >
                        To Brides ({allLetters.filter((l) => l.category === 'to_brides').length})
                      </button>
                      <button
                        onClick={() => setCategoryFilter('to_ferjem')}
                        className={`px-2.5 py-1 border transition-colors ${
                          categoryFilter === 'to_ferjem'
                            ? 'border-[#F0EFEB] text-[#F0EFEB] bg-[#171719]'
                            : 'border-[#333336] text-[#77777A] hover:text-[#BDBDBB]'
                        }`}
                      >
                        To Férjem ({allLetters.filter((l) => l.category === 'to_ferjem').length})
                      </button>
                    </div>

                    <span className="text-xs font-mono text-[#77777A]">
                      Showing {filteredLetters.length} Submissions
                    </span>
                  </div>

                  {filteredLetters.length === 0 ? (
                    <div className="py-12 text-center font-serif italic text-base text-[#77777A]">
                      No letters found in this view.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#333336]/60 border border-[#333336]">
                      {filteredLetters.map((l) => (
                        <div key={l.id} className="p-4 sm:p-5 bg-[#08090A] flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1.5 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider">
                              <span className={`px-2 py-0.5 text-[10px] font-medium ${
                                l.moderation_status === 'approved'
                                  ? 'bg-[#171719] text-[#F0EFEB] border border-[#BDBDBB]'
                                  : l.moderation_status === 'rejected'
                                  ? 'bg-[#171719] text-[#77777A] line-through'
                                  : 'bg-[#333336] text-[#F0EFEB]'
                              }`}>
                                {l.moderation_status.toUpperCase()}
                              </span>

                              <span className="text-[#BDBDBB] flex items-center gap-1">
                                {l.category === 'to_brides' ? (
                                  <>
                                    <Feather className="w-3 h-3" />
                                    To Brides
                                  </>
                                ) : (
                                  <>
                                    <HeartHandshake className="w-3 h-3" />
                                    To Férjem
                                  </>
                                )}
                              </span>

                              <span className="text-[10px] px-1.5 py-0.5 border border-[#333336] text-[#77777A]">
                                {l.publication_preference === 'private' ? 'PRIVATE KEEPING' : 'PUBLIC CONSIDERATION'}
                              </span>

                              <span className="text-[#77777A]">From: {l.sender_name || 'Anonymous'}</span>
                              <span className="text-[#77777A]">{new Date(l.submitted_at).toLocaleDateString()}</span>
                            </div>

                            {l.subject && (
                              <p className="font-display text-base text-[#F0EFEB]">
                                {l.subject}
                              </p>
                            )}

                            <p className="font-serif text-sm text-[#D6D5D1] line-clamp-2">
                              {l.body}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setInspectLetter(l)}
                              type="button"
                              className="p-2 border border-[#333336] hover:border-[#BDBDBB] text-[#BDBDBB] hover:text-[#F0EFEB]"
                              title="Inspect Full Letter"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {l.moderation_status !== 'approved' && (
                              <button
                                onClick={() => handleModerateLetter(l.id, 'approved')}
                                type="button"
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F0EFEB] text-[#08090A] text-xs font-mono uppercase tracking-wider hover:bg-[#BDBDBB]"
                                title={l.publication_preference === 'private' ? 'Approve for private repository' : 'Approve & Release to Public Archive'}
                              >
                                <Check className="w-3.5 h-3.5" />
                                Approve
                              </button>
                            )}

                            {l.moderation_status !== 'rejected' && (
                              <button
                                onClick={() => handleModerateLetter(l.id, 'rejected')}
                                type="button"
                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#333336] text-[#77777A] hover:text-[#F0EFEB] text-xs font-mono uppercase tracking-wider"
                                title="Reject"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            )}

                            <button
                              onClick={() => handleModerateLetter(l.id, 'rejected', 'delete')}
                              type="button"
                              className="p-2 border border-[#333336] text-[#77777A] hover:text-[#BDBDBB]"
                              title="Delete Letter"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CHAPTER MANAGEMENT */}
              {activeTab === 'chapters' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#77777A]">
                      Editorial Manuscript Leaves
                    </span>
                    <button
                      onClick={() => {
                        setEditingChapter(null);
                        setChapterForm({
                          title: '',
                          chapter_label: `CHAPTER ${allChapters.length + 1}`,
                          subtitle: '',
                          content: '',
                          cover_image_url: '',
                          display_order: allChapters.length + 1,
                          status: 'published',
                        });
                        setIsAddingChapter(true);
                      }}
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#08090A] bg-[#F0EFEB] hover:bg-[#BDBDBB] px-3.5 py-2 font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" /> Inscribe New Chapter
                    </button>
                  </div>

                  <div className="space-y-4">
                    {allChapters.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 sm:p-5 border border-[#333336] bg-[#08090A] flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-[#77777A]">
                            <span>{c.chapter_label || 'LEAF'}</span>
                            <span className="text-[#BDBDBB]">Order: {c.display_order}</span>
                            <span className={c.status === 'published' ? 'text-[#F0EFEB]' : 'text-[#77777A]'}>
                              [{c.status.toUpperCase()}]
                            </span>
                          </div>
                          <h4 className="font-display text-lg text-[#F0EFEB]">{c.title}</h4>
                          {c.subtitle && <p className="font-serif italic text-xs text-[#BDBDBB]">{c.subtitle}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingChapter(c);
                              setChapterForm({
                                title: c.title,
                                chapter_label: c.chapter_label || '',
                                subtitle: c.subtitle || '',
                                content: c.content,
                                cover_image_url: c.cover_image_url || '',
                                display_order: c.display_order,
                                status: c.status,
                              });
                              setIsAddingChapter(true);
                            }}
                            type="button"
                            className="p-2 border border-[#333336] text-[#BDBDBB] hover:text-[#F0EFEB]"
                            title="Edit Chapter"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteChapter(c.id)}
                            type="button"
                            className="p-2 border border-[#333336] text-[#77777A] hover:text-[#BDBDBB]"
                            title="Delete Chapter"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Status Ribbon */}
        <div className="mt-8 pt-4 border-t border-[#333336] flex items-center justify-between text-[11px] font-mono text-[#77777A]">
          <span>KÖKEDVES ARCHIVE PROTOCOL · PERSISTENT VAULT</span>
          <span>DEVOTION NEVER RETIRES</span>
        </div>
      </div>

      {/* INSPECT LETTER MODAL */}
      {inspectLetter && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#0D0E10] border border-[#BDBDBB] p-6 sm:p-8 max-w-xl w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#333336]">
              <span className="text-xs font-mono uppercase text-[#77777A]">
                {inspectLetter.category === 'to_brides' ? 'CORRESPONDENCE TO THE BRIDES' : 'CORRESPONDENCE TO FÉRJEM'}
              </span>
              <button onClick={() => setInspectLetter(null)} className="text-[#77777A] hover:text-[#F0EFEB]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#BDBDBB]">
                <span>From: {inspectLetter.sender_name || 'Anonymous'}</span>
                <span>Preference: {inspectLetter.publication_preference === 'private' ? 'Keep Private' : 'Public Consideration'}</span>
              </div>
              {inspectLetter.subject && <h3 className="font-display text-xl text-[#F0EFEB]">{inspectLetter.subject}</h3>}
              <p className="font-serif text-base text-[#D6D5D1] whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto p-3 bg-[#08090A] border border-[#333336]">
                {inspectLetter.body}
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#333336]">
              <button
                onClick={() => handleModerateLetter(inspectLetter.id, 'approved')}
                className="px-4 py-2 bg-[#F0EFEB] text-[#08090A] text-xs font-mono uppercase tracking-widest font-medium"
              >
                Approve
              </button>
              <button
                onClick={() => handleModerateLetter(inspectLetter.id, 'rejected')}
                className="px-4 py-2 border border-[#333336] text-[#BDBDBB] text-xs font-mono uppercase tracking-widest"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT CHAPTER MODAL */}
      {isAddingChapter && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <form onSubmit={handleSaveChapter} className="bg-[#0D0E10] border border-[#BDBDBB] p-6 max-w-xl w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#333336]">
              <span className="text-xs font-mono uppercase text-[#77777A]">
                {editingChapter ? 'Edit Manuscript Leaf' : 'Inscribe New Chapter'}
              </span>
              <button onClick={() => setIsAddingChapter(false)} type="button" className="text-[#77777A] hover:text-[#F0EFEB]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#77777A] mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. CHAPTER IV"
                    value={chapterForm.chapter_label}
                    onChange={(e) => setChapterForm({ ...chapterForm, chapter_label: e.target.value })}
                    className="w-full bg-[#171719] border border-[#333336] text-[#F0EFEB] text-sm px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#77777A] mb-1">Display Order</label>
                  <input
                    type="number"
                    value={chapterForm.display_order}
                    onChange={(e) => setChapterForm({ ...chapterForm, display_order: Number(e.target.value) })}
                    className="w-full bg-[#171719] border border-[#333336] text-[#F0EFEB] text-sm px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#77777A] mb-1">Chapter Title *</label>
                <input
                  type="text"
                  required
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                  className="w-full bg-[#171719] border border-[#333336] text-[#F0EFEB] text-sm px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#77777A] mb-1">Subtitle</label>
                <input
                  type="text"
                  value={chapterForm.subtitle}
                  onChange={(e) => setChapterForm({ ...chapterForm, subtitle: e.target.value })}
                  className="w-full bg-[#171719] border border-[#333336] text-[#F0EFEB] text-sm px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#77777A] mb-1">Full Content (Manuscript Text) *</label>
                <textarea
                  rows={7}
                  required
                  value={chapterForm.content}
                  onChange={(e) => setChapterForm({ ...chapterForm, content: e.target.value })}
                  className="w-full bg-[#171719] border border-[#333336] text-[#F0EFEB] font-serif text-sm px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#77777A] mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={chapterForm.cover_image_url}
                    onChange={(e) => setChapterForm({ ...chapterForm, cover_image_url: e.target.value })}
                    placeholder="/assets/come-home-bride.jpg"
                    className="w-full bg-[#171719] border border-[#333336] text-[#F0EFEB] text-sm px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#77777A] mb-1">Status</label>
                  <select
                    value={chapterForm.status}
                    onChange={(e) => setChapterForm({ ...chapterForm, status: e.target.value as 'published' | 'draft' })}
                    className="w-full bg-[#171719] border border-[#333336] text-[#F0EFEB] text-sm px-3 py-2"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#333336]">
              <button
                type="button"
                onClick={() => setIsAddingChapter(false)}
                className="px-4 py-2 border border-[#333336] text-[#77777A] text-xs font-mono uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#F0EFEB] text-[#08090A] text-xs font-mono uppercase font-medium"
              >
                Save Chapter
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
