import React from "react";

export default function ProgressBar({
  progress = 0,
  showLabel = false,
  height = "h-2",
  className = "",
}) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`flex items-center gap-3 w-full ${className}`}>
      <div className={`flex-1 bg-neutral-200 rounded-full overflow-hidden ${height}`}>
        <div
          className="bg-primary-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-neutral-600 min-w-[3rem] text-right">
          {clampedProgress}% complete
        </span>
      )}
    </div>
  );
}
