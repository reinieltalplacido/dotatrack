"use client";

import { LucideIcon } from "lucide-react";
import { AnimatedTabs, TabOption } from "@/components/ui/AnimatedTabs";

export type PlayerTabType = "overview" | "matches" | "heroes" | "performance" | "matchups" | "teammates";

export interface TabItem extends TabOption<PlayerTabType> {
  id: PlayerTabType;
  label: string;
  icon: LucideIcon;
  count?: number;
}

interface PlayerTabsProps {
  tabs: TabItem[];
  activeTab: PlayerTabType;
  onTabChange: (tabId: PlayerTabType) => void;
}

export function PlayerTabs({ tabs, activeTab, onTabChange }: PlayerTabsProps) {
  return (
    <div className="sticky top-14 z-30 border-b border-white/[0.08] bg-[#080A10]/95 backdrop-blur-md py-2.5">
      <div className="mx-auto max-w-7xl 2xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <AnimatedTabs<PlayerTabType>
          tabs={tabs}
          activeTab={activeTab}
          onChange={onTabChange}
          layoutId="playerActiveTabPill"
          variant="segmented"
          size="md"
        />
      </div>
    </div>
  );
}

