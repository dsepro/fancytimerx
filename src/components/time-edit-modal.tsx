
"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from '@/components/icons'; // Import Icons

interface TimeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimeInSeconds: number;
  onSave: (newTimeInSeconds: number) => void;
  language: string;
  maxTimeInSeconds: number;
}

export function TimeEditModal({
  isOpen,
  onClose,
  currentTimeInSeconds,
  onSave,
  language,
  maxTimeInSeconds,
}: TimeEditModalProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setHours(Math.floor(currentTimeInSeconds / 3600));
      setMinutes(Math.floor((currentTimeInSeconds % 3600) / 60));
      setSeconds(currentTimeInSeconds % 60);
    }
  }, [isOpen, currentTimeInSeconds]);

  const handleSave = () => {
    let newTotalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    newTotalSeconds = Math.max(0, newTotalSeconds); // Ensure not negative
    newTotalSeconds = Math.min(newTotalSeconds, maxTimeInSeconds); // Ensure not over max
    onSave(newTotalSeconds);
    onClose();
  };

  const T = {
    modalTitle: language === 'zh-hk' ? '編輯時間' : 'Edit Time',
    modalDescription: language === 'zh-hk' ? '設定新的剩餘時間。' : 'Set the new remaining time.',
    hoursLabel: language === 'zh-hk' ? '小時' : 'Hours',
    minutesLabel: language === 'zh-hk' ? '分鐘' : 'Minutes',
    secondsLabel: language === 'zh-hk' ? '秒' : 'Seconds',
    cancelButton: language === 'zh-hk' ? '取消' : 'Cancel',
    saveButton: language === 'zh-hk' ? '儲存' : 'Save',
  };

  const adjustTime = useCallback((unit: 'h' | 'm' | 's', amount: number) => {
    if (unit === 'h') {
      setHours(prev => Math.max(0, prev + amount));
    } else if (unit === 'm') {
      setMinutes(prev => {
        const newM = prev + amount;
        if (newM > 59) return 59;
        if (newM < 0) return 0;
        return newM;
      });
    } else if (unit === 's') {
      setSeconds(prev => {
        const newS = prev + amount;
        if (newS > 59) return 59;
        if (newS < 0) return 0;
        return newS;
      });
    }
  }, []);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{T.modalTitle}</DialogTitle>
          <DialogDescription>{T.modalDescription}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-x-2 gap-y-4 py-4">
          {/* Hours */}
          <div className="flex flex-col items-center space-y-1">
            <Label htmlFor="hours" className="text-sm">
              {T.hoursLabel}
            </Label>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => adjustTime('h', -1)}>
                <Icons.Minus className="h-4 w-4" />
              </Button>
              <Input
                id="hours"
                type="number"
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="h-10 w-16 text-center px-1"
                min="0"
              />
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => adjustTime('h', 1)}>
                <Icons.Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center space-y-1">
            <Label htmlFor="minutes" className="text-sm">
              {T.minutesLabel}
            </Label>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => adjustTime('m', -1)}>
                <Icons.Minus className="h-4 w-4" />
              </Button>
              <Input
                id="minutes"
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                className="h-10 w-16 text-center px-1"
                min="0"
                max="59"
              />
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => adjustTime('m', 1)}>
                <Icons.Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center space-y-1">
            <Label htmlFor="seconds" className="text-sm">
              {T.secondsLabel}
            </Label>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => adjustTime('s', -1)}>
                <Icons.Minus className="h-4 w-4" />
              </Button>
              <Input
                id="seconds"
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                className="h-10 w-16 text-center px-1"
                min="0"
                max="59"
              />
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => adjustTime('s', 1)}>
                <Icons.Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {T.cancelButton}
          </Button>
          <Button onClick={handleSave}>{T.saveButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
