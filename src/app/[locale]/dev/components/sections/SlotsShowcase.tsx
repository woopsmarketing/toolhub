"use client";

/**
 * SlotsShowcase — 5개 monetization/feedback 슬롯 디버깅.
 *
 * 모든 슬롯은 NEXT_PUBLIC_FEATURE_* env 가 "1" 일 때만 렌더된다 (PR-3 정책).
 * 따라서 본 쇼케이스는 슬롯의 실제 출력 대신 "환경 변수 + 책임" placeholder
 * 카드를 표시하고, 동시에 실제 컴포넌트도 함께 렌더한다 (env 가 켜져 있을 경우
 * 실제 출력을 그대로 보여주기 위함).
 */

import ToolFeedback from "@/components/tools/ToolFeedback";
import ToolAdSlot from "@/components/tools/ToolAdSlot";
import ToolAffiliateCTA from "@/components/tools/ToolAffiliateCTA";
import ToolProCTA from "@/components/tools/ToolProCTA";
import ToolAiUpgradeSlot from "@/components/tools/ToolAiUpgradeSlot";

interface SlotCardProps {
  name: string;
  envFlag: string;
  description: string;
  children: React.ReactNode;
}

function SlotCard({ name, envFlag, description, children }: SlotCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{name}</h3>
        <code className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
          {envFlag}=&quot;1&quot;
        </code>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          실제 컴포넌트 출력 (env 가 꺼져 있으면 빈 결과):
        </p>
        <div className="rounded bg-white p-3 ring-1 ring-border">
          {children}
          <div className="text-center text-xs text-muted-foreground">
            (위 영역이 비어 있으면 env flag 가 꺼져 있다는 뜻 — 정상 동작)
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SlotsShowcase() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <SlotCard
        name="ToolFeedback"
        envFlag="NEXT_PUBLIC_FEATURE_FEEDBACK"
        description="별점 + 코멘트 위젯 (Phase 4.5+ 실 구현 예정). 현재는 stub."
      >
        <ToolFeedback toolSlug="demo-tool" />
      </SlotCard>

      <SlotCard
        name="ToolAdSlot"
        envFlag="NEXT_PUBLIC_FEATURE_ADS"
        description="인라인 광고 자리 (AdSense 등). monetization.ads=true + env=1 시 활성."
      >
        <ToolAdSlot enabled placement="in-content" />
      </SlotCard>

      <SlotCard
        name="ToolAffiliateCTA"
        envFlag="NEXT_PUBLIC_FEATURE_AFFILIATE"
        description="문맥 기반 어필리에이트 카드 (개발자 툴 → 추천 IDE 등)."
      >
        <ToolAffiliateCTA toolSlug="demo-tool" enabled />
      </SlotCard>

      <SlotCard
        name="ToolProCTA"
        envFlag="NEXT_PUBLIC_FEATURE_PRO"
        description="Pro 업셀 카드 (히스토리 무제한/큰 파일 등). Phase 5+ 에서 활성화."
      >
        <ToolProCTA toolSlug="demo-tool" enabled />
      </SlotCard>

      <SlotCard
        name="ToolAiUpgradeSlot"
        envFlag="NEXT_PUBLIC_FEATURE_AI_UPGRADE"
        description="AI 강화 버전 추천 카드 (요약/번역 등). Phase 3+ 에서 활성화."
      >
        <ToolAiUpgradeSlot toolSlug="demo-tool" enabled />
      </SlotCard>
    </div>
  );
}
