
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { HeaderActions } from '@/components/header-actions';
import { ExamInfoCard } from '@/components/exam-info-card';
import { TimerCard } from '@/components/timer-card';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { UserManualModal } from '@/components/user-manual-modal';
import { ExamSetupModal } from '@/components/exam-setup-modal';
import { DaylightSwitch } from '@/components/daylight-switch';
import useLocalStorage from '@/hooks/use-local-storage';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';


export interface ExamDetails {
  title: string;
  centreName: string;
  centreNumber: string;
  subject: string;
  paper: string;
  durationMinutes: number;
  examStartTime: string;
  examEndTime: string;
  examLanguage: 'en' | 'zh-hk';
}

const initialExamDetails: ExamDetails = {
  title: "中國語文 試卷一",
  centreName: "香城中學",
  centreNumber: "A1234",
  subject: "中國語文",
  paper: "試卷一",
  durationMinutes: 90,
  examStartTime: "08:30",
  examEndTime: "10:00",
  examLanguage: 'zh-hk',
};


export default function Home() {
  const [fontScale, setFontScale] = useLocalStorage<number>('fontScale', 1);
  const [examDetails, setExamDetails] = useLocalStorage<ExamDetails>('examDetails', initialExamDetails);
  const [language, setLanguage] = useLocalStorage<string>('language', 'zh-hk'); 
  // Exam-info text size (step index into EXAM_INFO_TEXT_SCALES); changed via Exam Setup.
  const [examInfoTextStep, setExamInfoTextStep] = useLocalStorage<number>('examInfoTextStep', 0);
  // Opt-out of the glass look for projectors and low-power devices.
  const [solidSurfaces, setSolidSurfaces] = useLocalStorage<boolean>('solidSurfaces', false);

  const [isUserManualOpen, setIsUserManualOpen] = useState(false);
  const [isExamSetupOpen, setIsExamSetupOpen] = useState(false);
  // Deliberately not persisted: a reload always brings the top bar back.
  const [isTopBarHidden, setIsTopBarHidden] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', description: '', onConfirm: () => {} });

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale-factor', fontScale.toString());
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-transparency', solidSurfaces);
  }, [solidSurfaces]);

  // The timer card broadcasts its run state; the shell freezes the backdrop
  // while the countdown runs, and the footer switch falls asleep with it.
  useEffect(() => {
    const onRunningChange = (event: Event) => {
      setIsTimerRunning(Boolean((event as CustomEvent<boolean>).detail));
    };
    window.addEventListener('examtimer:running', onRunningChange);
    return () => window.removeEventListener('examtimer:running', onRunningChange);
  }, []);

  // Keyboard shortcut for desktop: "h" toggles the top bar.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      if (event.key.toLowerCase() !== 'h') return;
      setIsTopBarHidden(previous => !previous);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleOpenConfirmation = useCallback((title: string, description: string, onConfirm: () => void) => {
    setConfirmationState({ isOpen: true, title, description, onConfirm });
  }, []);

  const handleCloseConfirmation = useCallback(() => {
    setConfirmationState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const appFooterCreator = language === 'zh-hk' ? '由鍾永老師製作' : 'Created by Mr. Louis Chung';

  return (
    <div
      className="relative isolate flex flex-col min-h-[100dvh] text-foreground"
      data-timer-running={isTimerRunning ? 'true' : 'false'}
    >
      {/* Fixed, slow-moving colour field behind the glass. Paused while the
          countdown runs so the room stays calm and the battery stays put. */}
      <div className="mesh-bg" aria-hidden="true">
        <span className="mesh-blob mesh-blob-a" />
        <span className="mesh-blob mesh-blob-b" />
        <span className="mesh-blob mesh-blob-c" />
        <span className="mesh-blob mesh-blob-d" />
      </div>

      {!isTopBarHidden && (
        <header className="glass-bar sticky top-0 z-40 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
            <div className="flex min-h-16 flex-wrap items-center justify-end gap-y-1 py-1">
              <div className="flex w-full flex-wrap items-center justify-end gap-1 md:gap-2">
                <HeaderActions
                  onOpenUserManual={() => setIsUserManualOpen(true)}
                  onOpenExamSetup={() => setIsExamSetupOpen(true)}
                  fontScale={fontScale}
                  onFontScaleChange={setFontScale}
                  currentLanguage={language}
                  onLanguageChange={setLanguage}
                  language={language}
                  onHideTopBar={() => setIsTopBarHidden(true)}
                />
              </div>
            </div>
          </div>
        </header>
      )}

      {isTopBarHidden && (
        // Same chevron affordance as the header button, pinned where the
        // header's last icon used to sit. It floats over the card's empty
        // top-right corner instead of reserving a strip, so hiding the bar
        // gives the timer the full height back.
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsTopBarHidden(false)}
          aria-label={language === 'zh-hk' ? '顯示頂部工具列' : 'Show top bar'}
          title={language === 'zh-hk' ? '顯示頂部工具列 (H)' : 'Show top bar (H)'}
          className="fixed right-3 top-3 z-50 h-[44px] w-[44px] rounded-full text-foreground/70 shadow-sm"
        >
          <Icons.ChevronDown className="h-5 w-5" />
        </Button>
      )}

      <main className="flex-grow flex flex-col container mx-auto max-w-full p-4 md:p-6 lg:p-8 w-full">
        <div className="flex flex-col gap-6 flex-grow">
          <div className="flex-[2_2_0%] min-h-0">
            <TimerCard
              initialDurationMinutes={examDetails.durationMinutes}
              language={language}
              onOpenConfirmation={handleOpenConfirmation}
            />
          </div>
          <div className="flex-[1_1_0%] min-h-0">
            <ExamInfoCard
              key={`exam-info-${language}`} 
              examDetails={examDetails}
              language={language}
              textStep={examInfoTextStep}
            />
          </div>
        </div>
      </main>

      <footer className="glass-bar relative z-10 mt-auto">
        <div className="container mx-auto flex max-w-full flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
            <p className="text-xs text-muted-foreground">{appFooterCreator}</p>
            <p className="daylight-attribution text-muted-foreground">
              {language === 'zh-hk' ? '日夜開關：' : 'Day/night switch: '}
              <a
                href="https://ludion.ai/p/toggle-daylight"
                target="_blank"
                rel="noreferrer noopener"
              >
                @Lattice_Node
              </a>{' '}
              (MIT)
            </p>
          </div>
          <div className="daylight-frame">
            <DaylightSwitch paused={isTimerRunning} />
          </div>
        </div>
      </footer>

      <UserManualModal isOpen={isUserManualOpen} onClose={() => setIsUserManualOpen(false)} language={language} />
      <ExamSetupModal
        isOpen={isExamSetupOpen}
        onClose={() => setIsExamSetupOpen(false)}
        currentDetails={examDetails}
        onSave={(newDetails) => {
          setExamDetails(newDetails);
          // If the timer is not running, update its duration to match new exam details
          // This assumes TimerCard will pick up new initialDurationMinutes if it's not running
        }}
        currentAppLanguage={language}
        examInfoTextStep={examInfoTextStep}
        onExamInfoTextStepChange={setExamInfoTextStep}
        solidSurfaces={solidSurfaces}
        onSolidSurfacesChange={setSolidSurfaces}
      />
      <ConfirmationDialog
        isOpen={confirmationState.isOpen}
        onClose={handleCloseConfirmation}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        description={confirmationState.description}
        language={language}
      />
    </div>
  );
}
