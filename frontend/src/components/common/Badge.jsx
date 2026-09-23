import React from "react";
import { Play, Sparkles, Flame } from "lucide-react";

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
}) {
  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 tracking-wider",
    md: "text-xs px-2.5 py-0.5 font-semibold",
    lg: "text-sm px-3.5 py-1 font-semibold",
  };

  const variantClasses = {
    primary: "bg-primary-100 text-primary-600 border border-primary-200",
    video: "bg-primary-100 text-primary-600 border border-primary-200",
    lesson: "bg-primary-100 text-primary-600 border border-primary-200",
    popular: "bg-primary-100 text-primary-600 border border-primary-200",
    trending: "bg-sky-100 text-sky-700 border border-sky-200",
    neutral: "bg-neutral-100 text-neutral-700 border border-neutral-200",
    subtle: "bg-primary-500/10 text-primary-600 border border-primary-500/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full uppercase transition-colors ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
    >
      {icon === "play" && <Play className="w-2.5 h-2.5 fill-current" />}
      {icon === "sparkle" && <Sparkles className="w-3 h-3 text-primary-500" />}
      {icon === "flame" && <Flame className="w-3 h-3 text-primary-500 fill-current" />}
      <span>{children}</span>
    </span>
  );
}
