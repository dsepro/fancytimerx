
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export function UserManualModal({ isOpen, onClose, language }: UserManualModalProps) {
  if (!isOpen) return null;

  const T = {
    modalTitle: language === 'zh-hk' ? '用戶手冊' : 'User Manual',
    modalDescription: language === 'zh-hk' ? '歡迎使用考試資訊板。這是一個快速指南：' : "Welcome to the Exam Info Board. Here's a quick guide:",
    overviewTitle: language === 'zh-hk' ? '概覽' : 'Overview',
    overviewText: language === 'zh-hk' ? '此應用程式可幫助您記錄考試詳細資訊並在考試期間有效管理時間。' : 'This application helps you keep track of exam details and manage your time effectively during an exam.',
    headerBarTitle: language === 'zh-hk' ? '頂部導覽列' : 'Header Bar',
    headerBarItems: [
      language === 'zh-hk' ? '<strong>時鐘:</strong> 顯示目前系統時間。' : '<strong>Clock:</strong> Displays the current system time.',
      language === 'zh-hk' ? '<strong>字型大小調整 (+/- 圖示):</strong> 點擊增大或減小按鈕來調整應用的基礎字型大小。' : '<strong>Font Size (+/- icons):</strong> Click the increase or decrease buttons to adjust the application\'s base font size.',
      language === 'zh-hk' ? '<strong>主題切換 (太陽/月亮圖示):</strong> 在淺色和深色主題之間切換。' : '<strong>Theme Toggle (Sun/Moon icon):</strong> Toggles between light and dark themes.',
      language === 'zh-hk' ? '<strong>考試設定 (設定圖示):</strong> 一屏填完考場名稱、考場編號、科目、試卷、時長、開始時間及試卷語言（結束時間自動計算），並可調整考試資訊字型。時長可按 30 / 45 / 60 / 90 / 120 快捷掣一按設定；按「儲存」套用，按「取消」不作任何變更。' : '<strong>Exam Setup (Settings icon):</strong> One screen holds centre name, centre number, subject, paper, duration, start time and exam language (the end time is calculated for you, and 30 / 45 / 60 / 90 / 120 shortcut buttons set the duration in one tap), plus the exam-info text size. Press "Save" to apply or "Cancel" to leave everything unchanged.',
      language === 'zh-hk' ? '<strong>語言切換 (繁/EN 圖示):</strong> 切換顯示語言 (繁體中文（香港）/英文)。' : '<strong>Language Toggle (繁/EN icon):</strong> Toggle display language (Traditional Chinese (Hong Kong)/English).',
      language === 'zh-hk' ? '<strong>全螢幕切換 (展開/收縮圖示):</strong> 進入或退出全螢幕模式。' : '<strong>Fullscreen Toggle (Expand/Shrink icon):</strong> Enter or exit fullscreen mode.',
      language === 'zh-hk' ? '<strong>用戶手冊 (書本圖示):</strong> 開啟此指南。' : '<strong>User Manual (Book icon):</strong> Opens this guide.',
      language === 'zh-hk' ? '<strong>隱藏頂部工具列 (↑ 圖示):</strong> 收起整個頂部工具列，讓計時器佔用更大畫面。按右上角的 ⌄ 或按鍵盤 H 可還原。' : '<strong>Hide Top Bar (up-chevron icon):</strong> Collapses the whole top bar so the timer gets more room. Tap the ⌄ button at the top-right corner or press H to bring it back.',
    ],
    examInfoCardTitle: language === 'zh-hk' ? '考試資訊卡片' : 'Exam Information Card',
    examInfoCardText: language === 'zh-hk' ? '顯示目前配置的考試詳細資訊，例如考試名稱、中心、科目、試卷、時長等。這些資訊可以透過「考試設定」進行配置。如學生覺得字太小或看不清，可在「考試設定」的「考試資訊字型」把這張卡片的文字放大至 150%（可選 100%/115%/130%/150%）；此設定只影響這張卡片，不影響計時器。卡片本身不設按鈕，投影時不會有多餘的控制項。' : 'Displays details about the current configured exam, such as title, centre, subject, paper, duration, etc. These can be configured via "Exam Setup". If students find the text too small, go to "Exam Setup" > "Exam Info Text Size" and enlarge this card\'s text up to 150% (100%/115%/130%/150%). The setting affects this card only, not the timer. The card itself has no buttons, so nothing extra shows on the projector.',
    timerCardTitle: language === 'zh-hk' ? '考試計時器卡片' : 'Exam Timer Card',
    timerCardItems: [
      language === 'zh-hk' ? '<strong>計時器顯示:</strong> 以 HH:MM:SS 格式顯示剩餘時間。剩餘時間少於或等於5分鐘時變為紅色。如果計時器未運行，您可以點擊時間顯示打開編輯彈窗來修改剩餘時間。' : '<strong>Timer Display:</strong> Shows remaining time in HH:MM:SS format. Turns red when 5 minutes or less remain. If the timer is not running, you can click the time display to open an edit modal to modify the time.',
      language === 'zh-hk' ? '<strong> +/- 按鈕:</strong> 在時間顯示旁邊，用於快速增加或減少1分鐘。這些按鈕在計時器停止時可用。' : '<strong> +/- Buttons:</strong> Next to the time display for quick +/- 1 minute adjustments. These are available when the timer is stopped.',
      language === 'zh-hk' ? '<strong>開始/停止/重設:</strong> 控制計時器。重設操作是即時的。' : '<strong>Start/Stop/Reset:</strong> Control the timer. Reset is immediate.',
    ],
    appearanceTitle: language === 'zh-hk' ? '介面與外觀' : 'Look & Feel',
    appearanceItems: [
      language === 'zh-hk'
        ? '<strong>日夜開關（頁尾小農莊）:</strong> 點一下或左右拖曳，會在白天與夜晚之間切換，同時切換全站主題。場景顏色會跟隨全站配色。倒數進行中場景會停下來，節省電力，也不讓動態畫面分散考生注意。'
        : '<strong>Day/night switch (the little farm in the footer):</strong> Click it or drag it left/right to move between day and night, which also switches the whole app theme. Its colours follow the app palette. The scene freezes while the countdown runs, to save power and keep motion out of the way.',
      language === 'zh-hk'
        ? '<strong>介面效果（玻璃／實色）:</strong> 在「考試設定」>「介面效果」選擇。玻璃是預設的半透明磨砂外殼；如果裝置較慢、投影機對比不足，或你偏好清爽實色，選「實色」即會關閉透明度與流動色底。系統若開啟「減少透明度」，應用程式也會自動使用實色。'
        : '<strong>Surface style (Glass / Solid):</strong> Set it under "Exam Setup" > "Surface style". Glass is the default frosted shell; pick "Solid" if the device is slow, the projector lacks contrast, or you just prefer flat colours, which also turns off the moving background. If the system asks for reduced transparency, the app switches to solid on its own.',
      language === 'zh-hk'
        ? '<strong>減少動態:</strong> 若系統設定為「減少動態」，頁尾場景會靜止，背景色斑亦不會移動。'
        : '<strong>Reduced motion:</strong> If the system asks for reduced motion, the footer scene stays still and the background blobs stop drifting.',
    ],
    creditsText: language === 'zh-hk'
      ? '頁尾的日夜開關改編自 <a href="https://ludion.ai/p/toggle-daylight" target="_blank" rel="noreferrer noopener">toggle-daylight</a>，作者 @Lattice_Node，MIT 授權。'
      : 'The footer day/night switch is adapted from <a href="https://ludion.ai/p/toggle-daylight" target="_blank" rel="noreferrer noopener">toggle-daylight</a> by @Lattice_Node, MIT licensed.',
    dataPersistenceTitle: language === 'zh-hk' ? '資料持久化' : 'Data Persistence',
    dataPersistenceText: language === 'zh-hk' ? '計時器設定（初始時長、目前剩餘時間、運行狀態）、考試詳細資訊、考試資訊字型大小和應用程式語言偏好都儲存在瀏覽器的本機儲存空間中。這表示即使您關閉瀏覽器分頁或重新整理頁面，您的設定也將保留。' : 'Timer settings (initial duration, current time left, running state), exam details, the exam-info text size, and app language preference are saved in your browser\'s local storage. This means your settings will persist even if you close the browser tab or refresh the page.',
    tipsTitle: language === 'zh-hk' ? '提示' : 'Tips',
    tipsItems: [
      language === 'zh-hk' ? '使用全螢幕模式以獲得無干擾的環境。' : 'Use fullscreen mode for a distraction-free environment.',
      language === 'zh-hk' ? '使用 +/- 按鈕調整字型大小以獲得舒適的閱讀體驗。' : 'Use the +/- buttons to adjust font size for comfort.',
      language === 'zh-hk' ? '學生說考試資訊看不清時，到「考試設定」把「考試資訊字型」設為 150%。' : 'If students cannot read the exam information, set "Exam Info Text Size" to 150% under "Exam Setup".',
      language === 'zh-hk' ? '在開始前透過「考試設定」設定好考試詳細資訊。' : 'Set up exam details via "Exam Setup" before starting.',
      language === 'zh-hk' ? '趕時間時，在「考試設定」直接按 30 / 45 / 60 / 90 / 120 設定時長，再按「儲存」。' : 'In a hurry, tap 30 / 45 / 60 / 90 / 120 in "Exam Setup" to set the duration, then press "Save".',
      language === 'zh-hk' ? '如果計時器未運行，可以點擊時間顯示（打開編輯彈窗）或使用 +/- 按鈕來修改剩餘時間。' : 'Modify the remaining time by clicking on the time display (to open a modal) or using the +/- buttons if the timer isn\'t running.',
    ],
    closeButton: language === 'zh-hk' ? '關閉' : 'Close',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{T.modalTitle}</DialogTitle>
          <DialogDescription>
            {T.modalDescription}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] p-1 pr-4">
          <div className="space-y-4 text-sm text-muted-foreground pr-2">
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.overviewTitle}</h3>
              <p dangerouslySetInnerHTML={{ __html: T.overviewText }} />
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.headerBarTitle}</h3>
              <ul className="list-disc list-inside space-y-1">
                {T.headerBarItems.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item }} />)}
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.examInfoCardTitle}</h3>
              <p dangerouslySetInnerHTML={{ __html: T.examInfoCardText }} />
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.timerCardTitle}</h3>
              <ul className="list-disc list-inside space-y-1">
                 {T.timerCardItems.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item }} />)}
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.appearanceTitle}</h3>
              <ul className="list-disc list-inside space-y-1">
                {T.appearanceItems.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item }} />)}
              </ul>
              <p className="mt-2 text-xs" dangerouslySetInnerHTML={{ __html: T.creditsText }} />
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.dataPersistenceTitle}</h3>
              <p dangerouslySetInnerHTML={{ __html: T.dataPersistenceText }} />
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.tipsTitle}</h3>
              <ul className="list-disc list-inside space-y-1">
                {T.tipsItems.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item }} />)}
              </ul>
            </section>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose}>{T.closeButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
