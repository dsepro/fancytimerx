
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ExamDetails } from '@/app/page';
import { formatDurationFromMinutes } from "@/lib/utils";

interface ExamInfoCardProps {
  examDetails: ExamDetails;
  language: string;
  textStep?: number;
}

// Exam-info-only text size steps. The value is chosen in "Exam Setup" so the
// card itself carries no visible control on the projector.
export const EXAM_INFO_TEXT_SCALES = [1, 1.15, 1.3, 1.5];

const LABEL_CLASS = "text-[0.95em] font-semibold leading-snug text-foreground";
const VALUE_CLASS = "text-[1.15em] font-medium leading-snug text-foreground";

export function ExamInfoCard({ examDetails, language, textStep = 0 }: ExamInfoCardProps) {
  const parsedStep = Number(textStep);
  const safeStep = Number.isFinite(parsedStep)
    ? Math.min(Math.max(Math.round(parsedStep), 0), EXAM_INFO_TEXT_SCALES.length - 1)
    : 0;
  const textScale = EXAM_INFO_TEXT_SCALES[safeStep];

  const T = {
    cardTitle: language === 'zh-hk' ? '考試資訊' : 'Examination Information',
    centreNameLabel: language === 'zh-hk' ? '試場：' : 'Centre Name:',
    centreNumberLabel: language === 'zh-hk' ? '試場編號：' : 'Centre Number:',
    subjectLabel: language === 'zh-hk' ? '科目：' : 'Subject:',
    paperLabel: language === 'zh-hk' ? '試卷：' : 'Paper:',
    durationLabel: language === 'zh-hk' ? '時長：' : 'Duration:',
    startTimeLabel: language === 'zh-hk' ? '開始時間：' : 'Start Time:',
    endTimeLabel: language === 'zh-hk' ? '結束時間：' : 'End Time:',
    examLanguageLabel: language === 'zh-hk' ? '應考語言：' : 'Exam Language:',
    langEn: language === 'zh-hk' ? '英文' : 'English',
    langZhHk: language === 'zh-hk' ? '中文' : 'Chinese',
  };

  const displayDuration = formatDurationFromMinutes(examDetails.durationMinutes, language);  
  
  let displayExamLanguage = language === 'zh-hk' ? '不適用' : 'N/A';  
  if (examDetails.examLanguage === 'en') {
    displayExamLanguage = T.langEn;
  } else if (examDetails.examLanguage === 'zh-hk') {
    displayExamLanguage = T.langZhHk;
  }

  const displayCentreName = language === 'zh-hk' && examDetails.centreName === "香城中學" ? "香城中學" : (language === 'en' && examDetails.centreName === "香城中學" ? "ABC Secondary School" : (examDetails.centreName || (language === 'zh-hk' ? '不適用' : 'N/A')));
  const displaySubject = language === 'zh-hk' && examDetails.subject === "中國語文" ? "中國語文" : (examDetails.subject || (language === 'zh-hk' ? '不適用' : 'N/A'));  
  const displayPaper = language === 'zh-hk' && examDetails.paper === "試卷一" ? "試卷一" : (language === 'en' && examDetails.paper === "試卷一" ? "Paper 1" : (examDetails.paper || (language === 'zh-hk' ? '不適用' : 'N/A')));

  const fields = [
    { label: T.centreNameLabel, value: displayCentreName },
    { label: T.centreNumberLabel, value: examDetails.centreNumber || (language === 'zh-hk' ? '不適用' : 'N/A') },
    { label: T.subjectLabel, value: displaySubject },
    { label: T.paperLabel, value: displayPaper },
    { label: T.durationLabel, value: displayDuration },
    { label: T.startTimeLabel, value: examDetails.examStartTime || (language === 'zh-hk' ? '不適用' : 'N/A') },
    { label: T.endTimeLabel, value: examDetails.examEndTime || (language === 'zh-hk' ? '不適用' : 'N/A') },
    { label: T.examLanguageLabel, value: displayExamLanguage },
  ];

  return (
    <Card className="glass-panel-strong h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{T.cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0 overflow-y-auto">
        <ScrollArea className="h-full">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 pr-4"
            style={{ fontSize: 'calc(1rem * ' + textScale + ')' }}
          >
            {fields.map((field) => (
              <div key={field.label}>
                <h3 className={LABEL_CLASS}>{field.label}</h3>
                <p className={VALUE_CLASS}>{field.value}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
