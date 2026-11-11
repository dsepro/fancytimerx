
"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import type { ExamDetails } from '@/app/page';
import { EXAM_INFO_TEXT_SCALES } from './exam-info-card';

// Helper to derive title from subject and paper
const deriveTitle = (subject: string, paper: string, lang: string): string => {
  const s = subject?.trim() || "";
  const p = paper?.trim() || "";
  if (!s && !p) return lang === 'zh-hk' ? '自訂考試' : 'Custom Exam';
  return `${s}${p ? ` ${p}` : ""}`.trim();
};

const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  if (!startTime || durationMinutes < 0) return "";

  const [startHours, startMinutes] = startTime.split(':').map(Number);
  if (isNaN(startHours) || isNaN(startMinutes)) return "";

  const totalStartMinutes = startHours * 60 + startMinutes;
  const totalEndMinutes = totalStartMinutes + durationMinutes;

  const endHours = Math.floor(totalEndMinutes / 60) % 24;
  const endMinutes = totalEndMinutes % 60;

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

const DURATION_PRESETS = [30, 45, 60, 90, 120];

// One row per field: label on the left, control on the right, so the whole
// form fits on a single screen without an inner scroll area.
const FIELD_ROW_CLASS = "grid grid-cols-[max-content_1fr] items-center gap-x-3 gap-y-2";
const LABEL_CLASS = "text-sm font-medium text-foreground/80";
const CONTROL_CLASS = "h-9 bg-input text-input-foreground border-border";

interface ExamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDetails: ExamDetails;
  onSave: (details: ExamDetails) => void;
  currentAppLanguage: string;
  examInfoTextStep: number;
  onExamInfoTextStepChange: (step: number) => void;
  solidSurfaces: boolean;
  onSolidSurfacesChange: (value: boolean) => void;
}

export function ExamSetupModal({
  isOpen,
  onClose,
  currentDetails,
  onSave,
  currentAppLanguage,
  examInfoTextStep,
  onExamInfoTextStepChange,
  solidSurfaces,
  onSolidSurfacesChange,
}: ExamSetupModalProps) {
  const [formState, setFormState] = useState<ExamDetails>(currentDetails);
  const [textSizeStep, setTextSizeStep] = useState<number>(examInfoTextStep);

  useEffect(() => {
    if (isOpen) {
      let initialStartTime = currentDetails.examStartTime || "08:30";
      let initialDuration = currentDetails.durationMinutes >= 0 ? currentDetails.durationMinutes : 90;
      let initialEndTime = currentDetails.examEndTime || calculateEndTime(initialStartTime, initialDuration);

      if ((!currentDetails.examEndTime && initialStartTime && initialDuration >= 0) || (currentDetails.examEndTime !== calculateEndTime(initialStartTime, initialDuration))) {
        initialEndTime = calculateEndTime(initialStartTime, initialDuration);
      }

      const initialTitle = currentDetails.title || deriveTitle(currentDetails.subject, currentDetails.paper, currentAppLanguage);

      setFormState({
        ...currentDetails,
        title: initialTitle,
        examStartTime: initialStartTime,
        durationMinutes: initialDuration,
        examEndTime: initialEndTime,
      });
      setTextSizeStep(examInfoTextStep);
    }
  }, [currentDetails, isOpen, currentAppLanguage, examInfoTextStep]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormState(prevFormState => {
      const updatedFormState = { ...prevFormState, [name]: value };

      if (name === "durationMinutes") {
        const newDuration = Math.max(0, parseInt(value, 10) || 0);
        updatedFormState.durationMinutes = newDuration;
        updatedFormState.examEndTime = calculateEndTime(updatedFormState.examStartTime, newDuration);
      } else if (name === "examStartTime") {
        updatedFormState.examEndTime = calculateEndTime(value, updatedFormState.durationMinutes);
      }

      if (name === "subject" || name === "paper") {
        updatedFormState.title = deriveTitle(updatedFormState.subject, updatedFormState.paper, currentAppLanguage);
      }
      return updatedFormState;
    });
  }, [currentAppLanguage]);

  const applyDuration = (minutes: number) => {
    const safeMinutes = Math.max(0, Math.round(minutes));
    setFormState(prev => ({
      ...prev,
      durationMinutes: safeMinutes,
      examEndTime: calculateEndTime(prev.examStartTime, safeMinutes),
    }));
  };

  const adjustDuration = (amount: number) => {
    setFormState(prev => {
      const newDuration = Math.max(0, (prev.durationMinutes || 0) + amount);
      const newEndTime = calculateEndTime(prev.examStartTime, newDuration);
      return {
        ...prev,
        durationMinutes: newDuration,
        title: deriveTitle(prev.subject, prev.paper, currentAppLanguage),
        examEndTime: newEndTime,
      };
    });
  };

  const handleExamLanguageChange = (lang: 'en' | 'zh-hk') => {
    setFormState(prev => ({ ...prev, examLanguage: lang }));
  };

  const handleSave = () => {
    let finalDetails = { ...formState };
    finalDetails.title = deriveTitle(finalDetails.subject, finalDetails.paper, currentAppLanguage);
    if (!finalDetails.title.trim()) {
      finalDetails.title = currentAppLanguage === 'zh-hk' ? '自訂考試' : 'Custom Exam';
    }
    finalDetails.examEndTime = calculateEndTime(finalDetails.examStartTime, finalDetails.durationMinutes);
    onExamInfoTextStepChange(textSizeStep);
    onSave(finalDetails);
    onClose();
  };

  const T = {
    modalTitle: currentAppLanguage === 'zh-hk' ? '考試設定' : 'Exam Setup',
    centreNameLabel: currentAppLanguage === 'zh-hk' ? '考場名稱:' : 'Centre Name:',
    centreNumberLabel: currentAppLanguage === 'zh-hk' ? '考場編號:' : 'Centre Number:',
    subjectLabel: currentAppLanguage === 'zh-hk' ? '科目:' : 'Subject:',
    paperLabel: currentAppLanguage === 'zh-hk' ? '試卷:' : 'Paper:',
    durationLabel: currentAppLanguage === 'zh-hk' ? '時長:' : 'Duration:',
    minutesSuffix: currentAppLanguage === 'zh-hk' ? '分鐘' : 'min',
    quickDurationLabel: currentAppLanguage === 'zh-hk' ? '常用時長' : 'Common durations',
    startTimeLabel: currentAppLanguage === 'zh-hk' ? '開始時間:' : 'Starts:',
    endTimeLabel: currentAppLanguage === 'zh-hk' ? '結束時間' : 'Ends',
    endTimeAutoHint: currentAppLanguage === 'zh-hk' ? '(自動)' : '(auto)',
    languageLabel: currentAppLanguage === 'zh-hk' ? '語言:' : 'Language:',
    langZhHkButton: '中文',
    langEnButton: 'English',
    examInfoTextSizeLabel: currentAppLanguage === 'zh-hk' ? '考試資訊字型:' : 'Exam Info Text Size:',
    examInfoTextSizeHint: currentAppLanguage === 'zh-hk' ? '只影響「考試資訊」卡片，不影響計時器。' : 'Affects the "Examination Information" card only, not the timer.',
    surfacesLabel: currentAppLanguage === 'zh-hk' ? '介面效果:' : 'Surfaces:',
    surfacesGlass: currentAppLanguage === 'zh-hk' ? '玻璃' : 'Glass',
    surfacesSolid: currentAppLanguage === 'zh-hk' ? '實色' : 'Solid',
    surfacesHint: currentAppLanguage === 'zh-hk' ? '「實色」關閉透明與模糊效果，適合投影機或較慢的裝置。' : '"Solid" turns off transparency and blur for projectors or slower devices.',
    cancelButton: currentAppLanguage === 'zh-hk' ? '取消' : 'Cancel',
    saveButton: currentAppLanguage === 'zh-hk' ? '儲存' : 'Save',
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-1.5rem)] p-5 sm:max-w-3xl max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <DialogHeader>
            <DialogTitle>{T.modalTitle}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
            <div className={FIELD_ROW_CLASS}>
              <Label htmlFor="centreName" className={LABEL_CLASS}>{T.centreNameLabel}</Label>
              <Input id="centreName" name="centreName" value={formState.centreName} onChange={handleInputChange} className={CONTROL_CLASS} />
            </div>

            <div className={FIELD_ROW_CLASS}>
              <Label htmlFor="centreNumber" className={LABEL_CLASS}>{T.centreNumberLabel}</Label>
              <Input id="centreNumber" name="centreNumber" value={formState.centreNumber} onChange={handleInputChange} className={CONTROL_CLASS} />
            </div>

            <div className={FIELD_ROW_CLASS}>
              <Label htmlFor="subject" className={LABEL_CLASS}>{T.subjectLabel}</Label>
              <Input id="subject" name="subject" value={formState.subject} onChange={handleInputChange} className={CONTROL_CLASS} />
            </div>

            <div className={FIELD_ROW_CLASS}>
              <Label htmlFor="paper" className={LABEL_CLASS}>{T.paperLabel}</Label>
              <Input id="paper" name="paper" value={formState.paper} onChange={handleInputChange} className={CONTROL_CLASS} />
            </div>

            <div className={FIELD_ROW_CLASS}>
              <Label htmlFor="durationMinutes" className={LABEL_CLASS}>{T.durationLabel}</Label>
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                <Button type="button" variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => adjustDuration(-1)} aria-label={currentAppLanguage === 'zh-hk' ? '減少1分鐘' : 'Decrease 1 minute'}>
                  <Icons.Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="durationMinutes"
                  name="durationMinutes"
                  type="number"
                  value={formState.durationMinutes}
                  onChange={handleInputChange}
                  className={`${CONTROL_CLASS} w-16 text-center`}
                  min="0"
                />
                <span className="text-sm text-muted-foreground">{T.minutesSuffix}</span>
                <Button type="button" variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => adjustDuration(1)} aria-label={currentAppLanguage === 'zh-hk' ? '增加1分鐘' : 'Increase 1 minute'}>
                  <Icons.Plus className="h-4 w-4" />
                </Button>
              </div>

              <div aria-hidden="true" />
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={T.quickDurationLabel}>
                {DURATION_PRESETS.map((minutes) => {
                  const isActive = formState.durationMinutes === minutes;
                  return (
                    <Button
                      key={minutes}
                      type="button"
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      aria-pressed={isActive}
                      onClick={() => applyDuration(minutes)}
                    >
                      {minutes}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className={FIELD_ROW_CLASS}>
              <Label htmlFor="examStartTime" className={LABEL_CLASS}>{T.startTimeLabel}</Label>
              <div className="flex min-w-0 items-center gap-2">
                <Input id="examStartTime" name="examStartTime" type="time" value={formState.examStartTime} onChange={handleInputChange} className={`${CONTROL_CLASS} min-w-0 w-[7.5rem] shrink`} />
                <span className="shrink-0 text-muted-foreground" aria-hidden="true">&#8594;</span>
                <span className="shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums text-foreground/80" aria-label={`${T.endTimeLabel} ${formState.examEndTime}`}>
                  {formState.examEndTime || '--:--'}
                </span>
                <span className="hidden text-xs text-muted-foreground sm:inline">{T.endTimeAutoHint}</span>
              </div>
            </div>

            <div className={FIELD_ROW_CLASS}>
              <span className={LABEL_CLASS} id="exam-language-label">{T.languageLabel}</span>
              <div className="flex flex-wrap gap-2" role="group" aria-labelledby="exam-language-label">
                <Button
                  type="button"
                  variant={formState.examLanguage === 'zh-hk' ? 'default' : 'outline'}
                  onClick={() => handleExamLanguageChange('zh-hk')}
                  size="sm"
                  aria-pressed={formState.examLanguage === 'zh-hk'}
                >
                  {T.langZhHkButton}
                </Button>
                <Button
                  type="button"
                  variant={formState.examLanguage === 'en' ? 'default' : 'outline'}
                  onClick={() => handleExamLanguageChange('en')}
                  size="sm"
                  aria-pressed={formState.examLanguage === 'en'}
                >
                  {T.langEnButton}
                </Button>
              </div>
            </div>

            <div className={FIELD_ROW_CLASS} title={T.examInfoTextSizeHint}>
              <span className={LABEL_CLASS} id="exam-info-text-size-label">{T.examInfoTextSizeLabel}</span>
              <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="exam-info-text-size-label">
                {EXAM_INFO_TEXT_SCALES.map((scale, index) => {
                  const isActive = textSizeStep === index;
                  return (
                    <Button
                      key={scale}
                      type="button"
                      variant={isActive ? 'default' : 'outline'}
                      onClick={() => setTextSizeStep(index)}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      aria-pressed={isActive}
                    >
                      {Math.round(scale * 100)}%
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className={FIELD_ROW_CLASS} title={T.surfacesHint}>
              <span className={LABEL_CLASS} id="surfaces-label">{T.surfacesLabel}</span>
              <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="surfaces-label">
                <Button
                  type="button"
                  variant={solidSurfaces ? 'outline' : 'default'}
                  onClick={() => onSolidSurfacesChange(false)}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  aria-pressed={!solidSurfaces}
                >
                  {T.surfacesGlass}
                </Button>
                <Button
                  type="button"
                  variant={solidSurfaces ? 'default' : 'outline'}
                  onClick={() => onSolidSurfacesChange(true)}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  aria-pressed={solidSurfaces}
                >
                  {T.surfacesSolid}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>{T.cancelButton}</Button>
            <Button type="submit">{T.saveButton}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
