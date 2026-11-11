
"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import React, { useState, useEffect, useCallback } from "react";
import { MainClock } from '@/components/main-clock';

interface HeaderActionsProps {
  onOpenUserManual: () => void;
  onOpenExamSetup: () => void;
  fontScale: number;
  onFontScaleChange: (scale: number) => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  language: string; 
  onHideTopBar: () => void;
}

const MIN_FONT_SCALE = 0.8;
const MAX_FONT_SCALE = 1.5;
const FONT_SCALE_STEP = 0.05;

export function HeaderActions({ 
  onOpenUserManual, 
  onOpenExamSetup,
  fontScale,
  onFontScaleChange,
  currentLanguage,
  onLanguageChange,
  language,
  onHideTopBar
}: HeaderActionsProps) {
  const { setTheme, theme } = useTheme();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const availableThemes = ["light", "dark"]; 

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        alert(currentLanguage === 'zh-hk' ? `進入全螢幕模式時發生錯誤：${err.message} (${err.name})` : `Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const cycleTheme = useCallback(() => {
    const currentThemeIndex = availableThemes.indexOf(theme || availableThemes[0]);
    const nextThemeIndex = (currentThemeIndex + 1) % availableThemes.length;
    setTheme(availableThemes[nextThemeIndex]);
  }, [theme, setTheme, availableThemes]);

  const toggleLanguage = useCallback(() => {
    const newLanguage = currentLanguage === "en" ? "zh-hk" : "en";
    onLanguageChange(newLanguage);
  }, [currentLanguage, onLanguageChange]);

  const getThemeIcon = () => {
    if (theme === "light") return <Icons.Sun className="h-5 w-5" />;
    if (theme === "dark") return <Icons.Moon className="h-5 w-5" />;
    return <Icons.Sun className="h-5 w-5" />; 
  };

  const decreaseFontScale = () => {
    onFontScaleChange(Math.max(MIN_FONT_SCALE, parseFloat((fontScale - FONT_SCALE_STEP).toFixed(2))));
  };

  const increaseFontScale = () => {
    onFontScaleChange(Math.min(MAX_FONT_SCALE, parseFloat((fontScale + FONT_SCALE_STEP).toFixed(2))));
  };
  
  const T = {
    decreaseFontSize: currentLanguage === 'zh-hk' ? '減小字型' : 'Decrease font size',
    increaseFontSize: currentLanguage === 'zh-hk' ? '增大字型' : 'Increase font size',
    currentFontSize: currentLanguage === 'zh-hk' ? `目前字型大小: ${fontScale.toFixed(2)}` : `Current Font Size: ${fontScale.toFixed(2)}`,
    cycleTheme: currentLanguage === 'zh-hk' ? `切換主題 (目前為 ${theme === 'light' ? '淺色' : '深色'})` : `Cycle theme (Currently ${theme === 'light' ? 'Light' : 'Dark'})`,
    examSetup: currentLanguage === 'zh-hk' ? '考試設定' : 'Exam Setup',
    toggleLanguage: currentLanguage === 'zh-hk' ? `切換語言 (目前為 繁)` : `Toggle language (Currently EN)`,
    toggleFullscreen: currentLanguage === 'zh-hk' ? '切換全螢幕' : 'Toggle fullscreen',
    openUserManual: currentLanguage === 'zh-hk' ? '開啟用戶手冊' : 'Open user manual',
    hideTopBar: currentLanguage === 'zh-hk' ? '隱藏頂部工具列' : 'Hide top bar',
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-1 md:gap-2">
      <Button variant="outline" size="icon" onClick={decreaseFontScale} aria-label={T.decreaseFontSize} disabled={fontScale <= MIN_FONT_SCALE}>
        <Icons.Minus className="h-5 w-5" />
        <span className="sr-only">{T.decreaseFontSize}</span>
      </Button>
      <Button variant="outline" size="icon" onClick={increaseFontScale} aria-label={T.increaseFontSize} disabled={fontScale >= MAX_FONT_SCALE}>
        <Icons.Plus className="h-5 w-5" />
        <span className="sr-only">{T.increaseFontSize}</span>
      </Button>
      <span className="sr-only">{T.currentFontSize}</span>

      <Button variant="outline" size="icon" onClick={cycleTheme} aria-label={T.cycleTheme}>
        {getThemeIcon()}
        <span className="sr-only">{T.cycleTheme}</span>
      </Button>
      
      <Button variant="outline" size="icon" onClick={onOpenExamSetup} aria-label={T.examSetup}>
        <Icons.Settings2 className="h-5 w-5" />
        <span className="sr-only">{T.examSetup}</span>
      </Button>

      <Button variant="outline" size="icon" onClick={toggleLanguage} aria-label={T.toggleLanguage}>
        <span className="text-xs font-semibold w-5 h-5 flex items-center justify-center">{currentLanguage === 'zh-hk' ? '繁' : 'EN'}</span>
        <span className="sr-only">{T.toggleLanguage}</span>
      </Button>

      <Button variant="outline" size="icon" onClick={toggleFullScreen} aria-label={T.toggleFullscreen}>
        {isFullScreen ? <Icons.Shrink className="h-5 w-5" /> : <Icons.Expand className="h-5 w-5" />}
        <span className="sr-only">{T.toggleFullscreen}</span>
      </Button>

      <Button variant="outline" size="icon" onClick={onOpenUserManual} aria-label={T.openUserManual}>
        <Icons.BookOpenText className="h-5 w-5" />
        <span className="sr-only">{T.openUserManual}</span>
      </Button>
      
      <MainClock language={language} className="text-sm font-medium" />

      <Button variant="outline" size="icon" onClick={onHideTopBar} aria-label={T.hideTopBar} title={T.hideTopBar}>
        <Icons.ChevronUp className="h-5 w-5" />
        <span className="sr-only">{T.hideTopBar}</span>
      </Button>
    </div>
  );
}
