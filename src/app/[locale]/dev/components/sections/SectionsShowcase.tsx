"use client";

/**
 * SectionsShowcase — 본문 컨텐츠 섹션 6개 시각 디버깅.
 *
 * ToolHowTo · ToolUseCases · ToolFeatures · ToolGuide · ToolFAQ · RelatedTools
 * (각각 빈 상태 + 채워진 상태)
 */

import ToolHowTo from "@/components/tools/ToolHowTo";
import ToolUseCases from "@/components/tools/ToolUseCases";
import ToolFeatures from "@/components/tools/ToolFeatures";
import ToolGuide from "@/components/tools/ToolGuide";
import ToolFAQ from "@/components/tools/ToolFAQ";
import RelatedTools from "@/components/tools/RelatedTools";

export default function SectionsShowcase() {
  return (
    <div className="space-y-10">
      {/* HowTo */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          ToolHowTo
        </h3>
        <ToolHowTo
          title="사용 방법"
          steps={[
            "왼쪽 입력 영역에 텍스트를 붙여넣습니다.",
            "오른쪽에 결과가 실시간으로 표시됩니다.",
            "복사 버튼으로 결과를 클립보드에 복사합니다.",
          ]}
        />
        <p className="text-xs text-muted-foreground">
          빈 steps[] 일 때는 섹션이 렌더되지 않음 (null).
        </p>
      </div>

      {/* UseCases */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          ToolUseCases
        </h3>
        <ToolUseCases
          title="사용 예"
          useCases={[
            {
              title: "블로그 글자 수 확인",
              description: "게시 전 본문 길이를 확인합니다.",
              example: { input: "안녕하세요", output: "5자" },
            },
            {
              title: "트위터 280자 제한",
              description: "트윗 작성 시 글자 수를 체크합니다.",
            },
          ]}
        />
        <p className="text-xs text-muted-foreground">
          undefined 또는 빈 배열일 때는 렌더되지 않음.
        </p>
      </div>

      {/* Features */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          ToolFeatures
        </h3>
        <ToolFeatures
          title="주요 기능"
          features={[
            "실시간 처리, 서버 전송 없음",
            "글자/단어/문장/문단 카운트",
            "공백 포함/제외 옵션",
            "Markdown 지원",
          ]}
        />
      </div>

      {/* Guide */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          ToolGuide
        </h3>
        <ToolGuide
          guide={{
            title: "글자 수 세기 가이드",
            content:
              "이 도구는 입력한 텍스트의 글자 수를 실시간으로 카운트합니다.\n공백을 포함하거나 제외할 수 있으며, 단어와 문장의 개수도 함께 표시됩니다.\n모든 처리는 브라우저 내부에서 이루어지므로 입력한 내용은 외부로 전송되지 않습니다.",
          }}
        />
        <p className="text-xs text-muted-foreground">
          guide=undefined 일 때는 렌더되지 않음.
        </p>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          ToolFAQ
        </h3>
        <ToolFAQ
          title="자주 묻는 질문"
          items={[
            {
              q: "입력한 텍스트가 외부로 전송되나요?",
              a: "아니요. 모든 처리는 브라우저 안에서 이루어집니다.",
            },
            {
              q: "최대 글자 수 제한이 있나요?",
              a: "기술적인 제한은 없지만, 매우 긴 텍스트는 브라우저 성능에 영향을 줄 수 있습니다.",
            },
            {
              q: "한글과 영문 카운트가 다르게 적용되나요?",
              a: "둘 다 동일하게 1글자로 카운트됩니다.",
            },
          ]}
        />
      </div>

      {/* RelatedTools */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          RelatedTools (populated)
        </h3>
        <RelatedTools
          title="관련 도구"
          items={[
            {
              slug: "word-counter",
              category: "text",
              title: "글자 수 세기",
              description: "텍스트 글자/단어/문장 카운트",
            },
            {
              slug: "text-cleaner",
              category: "text",
              title: "텍스트 정리",
              description: "불필요한 공백/줄바꿈 제거",
            },
            {
              slug: "case-converter",
              category: "text",
              title: "대소문자 변환",
              description: "텍스트 대소문자 일괄 변환",
            },
          ]}
        />

        <h3 className="mb-3 mt-6 text-base font-semibold text-foreground">
          RelatedTools (empty → 미렌더)
        </h3>
        <div className="rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
          items=[] 이면 섹션 자체가 null 을 반환합니다 (위 영역은 빈 placeholder).
        </div>
        <RelatedTools title="관련 도구" items={[]} />
      </div>
    </div>
  );
}
