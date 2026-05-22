import type { TranslationProgress } from "@/hooks/useMenuTranslation";

type TranslationProgressBarProps = {
  progress: TranslationProgress;
};

export function TranslationProgressBar({
  progress,
}: TranslationProgressBarProps) {
  const percent = Math.round((progress.current / progress.total) * 100);

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between gap-2 text-[0.75rem] font-medium text-[#606060]">
        <span>{progress.label}</span>
        <span>
          {progress.current}/{progress.total}
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-[#ececec]"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[#560200] transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
