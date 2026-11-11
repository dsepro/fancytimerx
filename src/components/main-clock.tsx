"use client";

import { useState, useEffect } from 'react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

interface MainClockProps {
  language: string;
  className?: string;
}

const formatNow = (language: string): string => {
  const locale = language === 'zh-hk' ? 'zh-HK' : 'en-GB'; // en-GB for 24-hour English
  return new Date().toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });
};

export function MainClock({ language, className }: MainClockProps) {
  // Static placeholder so server and client markup match on the first paint.
  const [displayTime, setDisplayTime] = useState<string>("00:00:00");

  useEffect(() => {
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    const render = () => setDisplayTime(formatNow(language));

    // Tick on the real second boundary. A plain setInterval(1000) drifts and
    // can sit up to a full second behind the wall clock.
    const alignToSecondBoundary = () => {
      render();
      const msToNextSecond = 1000 - new Date().getMilliseconds();
      timeoutId = window.setTimeout(() => {
        render();
        intervalId = window.setInterval(render, 1000);
      }, msToNextSecond);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') render();
    };

    alignToSecondBoundary();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [language]);

  return (
    <div className={cn("flex items-center space-x-2 whitespace-nowrap tabular-nums", className)}>
      <Icons.ClockIcon className="h-5 w-5 shrink-0" />
      <span>{displayTime}</span>
    </div>
  );
}
