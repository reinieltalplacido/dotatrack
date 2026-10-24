"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export interface TabOption<T extends string = string> {
  id: T;
  label: string;
  icon?: LucideIcon | React.ReactNode;
  count?: number | string | null;
  badge?: string | null;
  disabled?: boolean;
}

export interface AnimatedTabsProps<T extends string = string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  layoutId?: string;
  size?: "sm" | "md" | "lg";
  variant?: "segmented" | "pills" | "underline";
  className?: string;
}

function renderTabIcon(icon: LucideIcon | React.ReactNode | undefined, className: string) {
  if (!icon) return null;
  if (React.isValidElement(icon)) {
    return icon;
  }
  // Handles LucideIcon (forwardRef object in React 19) and component functions
  const IconComponent = icon as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} />;
}

export function AnimatedTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  layoutId = "animated-tab-pill",
  size = "md",
  variant = "segmented",
  className = "",
}: AnimatedTabsProps<T>) {
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5 min-h-[32px]",
    md: "px-3.5 py-1.5 text-xs sm:text-[13px] gap-2 min-h-[38px]",
    lg: "px-4 py-2 text-sm gap-2.5 min-h-[44px]",
  }[size];

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-4.5 w-4.5",
  }[size];

  if (variant === "underline") {
    return (
      <div className={`flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center ${sizeClasses} font-mono font-medium uppercase tracking-wider transition-colors shrink-0 cursor-pointer outline-none ${
                isActive ? "text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
              } ${tab.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {/* Active Bottom Glow Indicator */}
              {isActive && (
                <motion.div
                  layoutId={`${layoutId}-underline`}
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.85)] pointer-events-none"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 34,
                  }}
                />
              )}

              {/* Inactive subtle bottom line track */}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon && (
                  <span
                    className={`transition-transform duration-200 ${
                      isActive ? "scale-105 text-white" : "text-zinc-400"
                    }`}
                  >
                    {renderTabIcon(tab.icon, iconSizes)}
                  </span>
                )}
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count !== null && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? "bg-rose-500/25 text-rose-300 border border-rose-500/30 font-semibold"
                        : "bg-white/[0.06] text-zinc-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Segmented Capsule Track (Default & Pills)
  const containerStyle =
    variant === "segmented"
      ? "p-1 bg-[#0A0C13]/90 border border-white/[0.08] rounded-xl backdrop-blur-md shadow-inner shadow-black/50 inline-flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full"
      : "inline-flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full py-1";

  return (
    <div className={`${containerStyle} ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center ${sizeClasses} font-mono font-medium uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 ${
              isActive ? "text-white font-bold" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03]"
            } ${tab.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            {/* Fluid Sliding Active Pill */}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-rose-600 via-rose-600 to-rose-700 shadow-[0_2px_12px_rgba(225,29,72,0.4),inset_0_1px_0_rgba(255,255,255,0.22)] border border-rose-400/40 pointer-events-none"
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 32,
                }}
              />
            )}

            {/* Tab Inner Content */}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && (
                <span
                  className={`transition-all duration-200 ${
                    isActive ? "scale-105 text-white" : "text-zinc-400"
                  }`}
                >
                  {renderTabIcon(tab.icon, iconSizes)}
                </span>
              )}

              <span>{tab.label}</span>

              {tab.badge && (
                <span className="rounded bg-rose-950/80 px-1.5 py-0.5 text-[9px] font-mono text-rose-300 border border-rose-500/30">
                  {tab.badge}
                </span>
              )}

              {tab.count !== undefined && tab.count !== null && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-colors ${
                    isActive
                      ? "bg-black/35 text-white shadow-inner border border-white/20 font-semibold"
                      : "bg-white/[0.07] text-zinc-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
