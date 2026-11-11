import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDurationFromMinutes(totalMinutes: number, language: string): string {
  if (totalMinutes <= 0) return language === 'zh-hk' ? "0 分鐘" : "0 minutes";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let result = "";

  if (language === 'zh-hk') {
    if (hours > 0) {
      result += `${hours} 小時`;
    }
    if (minutes > 0) {
      if (result.length > 0) result += " ";
      result += `${minutes} 分鐘`;
    }
    return result || "0 分鐘";
  } else { // Default to English
    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (result.length > 0) result += " ";
      result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return result || "0 minutes";
  }
}
