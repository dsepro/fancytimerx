"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import useLocalStorage from '@/hooks/use-local-storage';
import { TimeEditModal } from './time-edit-modal';

interface TimerCardProps {
  initialDurationMinutes?: number;
  language: string;
  onOpenConfirmation: (title: string, description: string, onConfirm: () => void) => void;
}

const formatTime = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Seconds genuinely left, derived from the wall clock instead of counting ticks.
// A missed tick (background tab, lock screen, jank) can no longer make the
// countdown drift: every render recomputes from the deadline.
const secondsUntil = (deadline: number): number =>
  Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

export function TimerCard({
  initialDurationMinutes = 90,
  language,
  onOpenConfirmation
}: TimerCardProps) {
  // ---- persisted state (written only when the timer starts or stops) -------
  const [totalSeconds, setTotalSeconds] = useLocalStorage<number>('timerInitialSeconds', initialDurationMinutes * 60);
  const [storedRemaining, setStoredRemaining] = useLocalStorage<number>('timerTimeLeft', totalSeconds);
  const [isRunning, setIsRunning] = useLocalStorage<boolean>('timerIsRunning', false);
  const [endsAt, setEndsAt] = useLocalStorage<number | null>('timerEndsAt', null);

  // ---- ephemeral ----
  const [, setTick] = useState(0);
  const [isTimeEditModalOpen, setIsTimeEditModalOpen] = useState(false);

  const deadline = isRunning && endsAt !== null ? endsAt : null;
  const timeLeft = deadline !== null ? secondsUntil(deadline) : Math.max(0, storedRemaining);

  // Re-render while running so the display follows the wall clock. This effect
  // only re-runs on start/stop - never per tick - so the interval cannot add
  // its own lag the way the old setInterval(() => -1) implementation did.
  useEffect(() => {
    if (!isRunning || endsAt === null) return;

    const tick = () => setTick(t => t + 1);
    const timerId = window.setInterval(tick, 250);

    // Returning from a background tab / lock screen: repaint immediately
    // instead of waiting for the next interval.
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);

    return () => {
      window.clearInterval(timerId);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [isRunning, endsAt]);

  // Finish exactly when the deadline passes (re-checked on every tick).
  useEffect(() => {
    if (isRunning && endsAt !== null && Date.now() >= endsAt) {
      setStoredRemaining(0);
      setIsRunning(false);
      setEndsAt(null);
    }
  }, [isRunning, endsAt, timeLeft, setStoredRemaining, setIsRunning, setEndsAt]);

  // Upgrade path: an older version stored "running" without a deadline, so the
  // remaining time could never be recovered reliably. Re-anchor it once.
  useEffect(() => {
    if (isRunning && endsAt === null) {
      setEndsAt(Date.now() + Math.max(0, storedRemaining) * 1000);
    }
  }, [isRunning, endsAt, storedRemaining, setEndsAt]);

  // Adopt a new exam duration only when the duration setting really changed,
  // so pausing and reloading never resets a half-finished timer.
  const lastDurationRef = useRef(initialDurationMinutes);
  useEffect(() => {
    if (lastDurationRef.current === initialDurationMinutes) return;
    lastDurationRef.current = initialDurationMinutes;
    if (isRunning) return;
    const nextSeconds = initialDurationMinutes * 60;
    setTotalSeconds(nextSeconds);
    setStoredRemaining(nextSeconds);
    setEndsAt(null);
  }, [initialDurationMinutes, isRunning, setTotalSeconds, setStoredRemaining, setEndsAt]);

  // Let the shell (mesh backdrop, footer switch) react to the countdown without
  // passing state through every component in between.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('examtimer:running', { detail: isRunning }));
  }, [isRunning]);

  const T = {
    timeLeftTitle: language === 'zh-hk' ? '剩餘時間' : 'Time Left',
    start: language === 'zh-hk' ? '開始' : 'Start',
    stop: language === 'zh-hk' ? '停止' : 'Stop',
    reset: language === 'zh-hk' ? '重設' : 'Reset',
    editTime: language === 'zh-hk' ? '編輯時間' : 'Edit Time',
  };

  const handleStart = () => {
    const from = Math.max(0, storedRemaining);
    if (from <= 0) return;
    setEndsAt(Date.now() + from * 1000);
    setIsRunning(true);
  };

  const handleStop = () => {
    if (isRunning && endsAt !== null) {
      setStoredRemaining(secondsUntil(endsAt));
    }
    setIsRunning(false);
    setEndsAt(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setEndsAt(null);
    setStoredRemaining(totalSeconds);
  };

  const adjustCurrentTimeByOneMinute = (amount: number) => {
    if (isRunning) return;
    setStoredRemaining((prevTime: number) => {
      const newTime = prevTime + (amount * 60);
      const maxAllowed = Math.max(totalSeconds, prevTime) + (24 * 3600);
      return Math.max(0, Math.min(newTime, maxAllowed));
    });
  };

  const handleTimeDisplayClick = () => {
    if (!isRunning) {
      setIsTimeEditModalOpen(true);
    }
  };

  const handleSaveEditedTime = (newTimeInSeconds: number) => {
    setStoredRemaining(newTimeInSeconds);
    if (newTimeInSeconds > totalSeconds) {
        setTotalSeconds(newTimeInSeconds);
    }
  };

  const maxTimeForModal = Math.max(totalSeconds, timeLeft) + (10 * 3600);

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pt-4 pb-1 sm:pt-6 sm:pb-2">
          <CardTitle className="text-lg md:text-xl text-center font-medium text-muted-foreground">{T.timeLeftTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center space-y-3 sm:space-y-4 px-4 py-2">
          <div className="flex items-center justify-center w-full gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 rounded-full h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => adjustCurrentTimeByOneMinute(-1)}
              disabled={isRunning}
              aria-label={language === 'zh-hk' ? "減少1分鐘" : "Decrease 1 minute"}
            >
              <Icons.Minus className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div
              className="timer-digits flex-1 min-w-0 text-center font-mono font-black tabular-nums select-none"
              style={{
                color: 'hsl(var(--foreground))',
                cursor: isRunning ? 'default' : 'pointer'
              }}
              onClick={handleTimeDisplayClick}
              title={!isRunning ? T.editTime : undefined}
            >
              {formatTime(timeLeft)}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 rounded-full h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => adjustCurrentTimeByOneMinute(1)}
              disabled={isRunning}
              aria-label={language === 'zh-hk' ? "增加1分鐘" : "Increase 1 minute"}
            >
              <Icons.Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-xs pt-2">
            <Button
              onClick={handleStart}
              disabled={isRunning || timeLeft === 0}
              className="flex-1 min-w-[5rem] text-xs py-2"
              size="sm"
            >
               {T.start}
            </Button>
            <Button
              onClick={handleStop}
              disabled={!isRunning}
              variant="secondary"
              className="flex-1 min-w-[5rem] text-xs py-2"
              size="sm"
            >
               {T.stop}
            </Button>
            <Button
              onClick={handleReset}
              variant="destructive"
              className="flex-1 min-w-[5rem] text-xs py-2"
              size="sm"
            >
               {T.reset}
            </Button>
          </div>
        </CardContent>
      </Card>
      <TimeEditModal
        isOpen={isTimeEditModalOpen}
        onClose={() => setIsTimeEditModalOpen(false)}
        currentTimeInSeconds={timeLeft}
        onSave={handleSaveEditedTime}
        language={language}
        maxTimeInSeconds={maxTimeForModal}
      />
    </>
  );
}
