import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { HouseOfMourning } from './components/HouseOfMourning';
import { StoryBehindMarble } from './components/StoryBehindMarble';
import { UnansweredQuestion } from './components/UnansweredQuestion';
import { ChaptersArchive } from './components/ChaptersArchive';
import { LetterRoomEntrance } from './components/LetterRoomEntrance';
import { BridesLetterDesk } from './components/BridesLetterDesk';
import { FerjemLetterDesk } from './components/FerjemLetterDesk';
import { CorrespondenceArchive } from './components/CorrespondenceArchive';
import { KeepersDesk } from './components/KeepersDesk';
import { Footer } from './components/Footer';
import type { Chapter, Letter } from './types';

export default function App() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Active correspondence room: 'brides' or 'ferjem'
  const [activeCorrespondenceRoom, setActiveCorrespondenceRoom] = useState<'brides' | 'ferjem'>('brides');

  // Administrative interface state
  const [isKeepersDeskOpen, setIsKeepersDeskOpen] = useState<boolean>(() => {
    return window.location.pathname.startsWith('/admin') || window.location.search.includes('admin=true');
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('kokedves_admin_token'));
  });

  const loadArchiveData = useCallback(async () => {
    try {
      const [chaptersRes, lettersRes] = await Promise.all([
        fetch('/api/chapters'),
        fetch('/api/letters'),
      ]);

      if (chaptersRes.ok && lettersRes.ok) {
        const [chaptersData, lettersData] = await Promise.all([
          chaptersRes.json(),
          lettersRes.json(),
        ]);
        setChapters(chaptersData);
        setLetters(lettersData);
      }
    } catch (err) {
      console.error('Failed to load archive data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArchiveData();

    const token = localStorage.getItem('kokedves_admin_token');
    if (token) {
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setIsAdminLoggedIn(Boolean(data.valid));
          if (!data.valid) {
            localStorage.removeItem('kokedves_admin_token');
          }
        })
        .catch(() => {
          setIsAdminLoggedIn(false);
        });
    }
  }, [loadArchiveData]);

  const handleSelectRoom = (room: 'brides' | 'ferjem') => {
    setActiveCorrespondenceRoom(room);
    const targetId = room === 'brides' ? '#room-brides' : '#room-ferjem';
    setTimeout(() => {
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenAdmin = () => {
    setIsKeepersDeskOpen(true);
  };

  const handleCloseAdmin = () => {
    setIsKeepersDeskOpen(false);
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
  };

  return (
    <div className="min-h-screen bg-[#08090A] text-[#F0EFEB] flex flex-col selection:bg-[#333336] selection:text-[#F0EFEB]">
      {/* Top Bar Navigation */}
      <Navigation
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Experience */}
      <main className="flex-1">
        {/* 01. The Threshold (Hero with Asset 01) */}
        <Hero />

        {/* 02. The House of Mourning (Introduction) */}
        <HouseOfMourning />

        {/* 03. The Story Behind Marble (Original Legend) */}
        <StoryBehindMarble />

        {/* 04. The Unanswered Question (Visual Interlude with Asset 02) */}
        <UnansweredQuestion />

        {/* 05. The Unfinished Chapters (Interactive Chapter Archive) */}
        <ChaptersArchive
          chapters={chapters}
          isLoading={isLoading}
        />

        {/* 06. The Chambers of Unsent Words (Two Rooms Entrance) */}
        <LetterRoomEntrance
          onSelectRoom={handleSelectRoom}
          activeRoom={activeCorrespondenceRoom}
        />

        {/* 07. The Active Correspondence Desk (Room One or Room Two) */}
        <section className="py-12 sm:py-20 px-6 sm:px-12 bg-[#0D0E10]">
          <div className="max-w-4xl mx-auto space-y-12">
            {activeCorrespondenceRoom === 'brides' ? (
              <BridesLetterDesk onLetterSubmitted={loadArchiveData} />
            ) : (
              <FerjemLetterDesk onLetterSubmitted={loadArchiveData} />
            )}

            {/* Quick Switch Ribbon */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => handleSelectRoom(activeCorrespondenceRoom === 'brides' ? 'ferjem' : 'brides')}
                className="text-xs font-mono uppercase tracking-widest text-[#77777A] hover:text-[#F0EFEB] py-2 px-4 border border-[#333336] hover:border-[#77777A] transition-colors"
              >
                {activeCorrespondenceRoom === 'brides'
                  ? 'Switch to Room II: Write to Férjem →'
                  : '← Switch to Room I: Write to the Brides'}
              </button>
            </div>
          </div>
        </section>

        {/* 08. The Public Correspondence Vault (Two Distinct Collections) */}
        <CorrespondenceArchive
          letters={letters}
          isLoading={isLoading}
        />
      </main>

      {/* Administrative System (Keeper's Desk) */}
      <KeepersDesk
        isOpen={isKeepersDeskOpen}
        onClose={handleCloseAdmin}
        onDataChanged={loadArchiveData}
      />

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />
    </div>
  );
}
