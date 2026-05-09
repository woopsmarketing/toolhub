"use client";

/**
 * TemplatesShowcase — 9개 템플릿 시각 디버깅.
 *
 * 실 구현 5개:
 *  - TextToText, FormToResult, LivePreview, MultiInput, FormToVisual
 *
 * 스켈레톤 4개 (placeholder UI 그대로 렌더):
 *  - Realtime, Workspace, FileProcessor, ImageEditor
 */

import TextToText from "@/tools/templates/TextToText";
import FormToResult from "@/tools/templates/FormToResult";
import LivePreview from "@/tools/templates/LivePreview";
import MultiInput from "@/tools/templates/MultiInput";
import FormToVisual from "@/tools/templates/FormToVisual";
import Realtime from "@/tools/templates/Realtime";
import Workspace from "@/tools/templates/Workspace";
import FileProcessor from "@/tools/templates/FileProcessor";
import ImageEditor from "@/tools/templates/ImageEditor";
import type { ToolConfig } from "@/config/types";

// ---- Mock helpers ----

function makeMockTool(overrides: Partial<ToolConfig> = {}): ToolConfig {
  return {
    slug: "demo-tool",
    category: "text",
    seo: {
      ko: {
        title: "Demo Tool",
        description: "쇼케이스용 가짜 툴",
        keywords: ["demo", "mock", "showcase", "preview", "dev"],
      },
      en: {
        title: "Demo Tool",
        description: "Mock tool for showcase",
        keywords: ["demo", "mock", "showcase", "preview", "dev"],
      },
    },
    howToUse: {
      ko: ["1단계", "2단계", "3단계"],
      en: ["Step 1", "Step 2", "Step 3"],
    },
    features: {
      ko: ["기능 A", "기능 B", "기능 C", "기능 D"],
      en: ["Feature A", "Feature B", "Feature C", "Feature D"],
    },
    faq: {
      ko: [
        { q: "질문 1?", a: "답변 1" },
        { q: "질문 2?", a: "답변 2" },
        { q: "질문 3?", a: "답변 3" },
      ],
      en: [
        { q: "Q1?", a: "A1" },
        { q: "Q2?", a: "A2" },
        { q: "Q3?", a: "A3" },
      ],
    },
    relatedTools: [],
    ...overrides,
  };
}

interface TemplateCardProps {
  name: string;
  status: "real" | "skeleton";
  description: string;
  children: React.ReactNode;
}

function TemplateCard({
  name,
  status,
  description,
  children,
}: TemplateCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{name}</h3>
        <span
          className={
            status === "real"
              ? "rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
              : "rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
          }
        >
          {status === "real" ? "live" : "skeleton"}
        </span>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        {children}
      </div>
    </div>
  );
}

// ---- Showcase ----

export default function TemplatesShowcase() {
  // TextToText: uppercase
  const textToTextTool = makeMockTool({
    template: "text-to-text",
    inputConfig: {
      placeholder: "텍스트를 입력하세요…",
      inputLabel: "Input",
      outputLabel: "UPPERCASE",
    },
  });

  // FormToResult: BMI-style
  const formToResultTool = makeMockTool({
    template: "form-to-result",
    formFields: [
      {
        name: "weight",
        label: "체중 (kg)",
        type: "number",
        defaultValue: 70,
        suffix: "kg",
      },
      {
        name: "height",
        label: "키 (cm)",
        type: "number",
        defaultValue: 175,
        suffix: "cm",
      },
    ],
    resultLabels: [
      { key: "bmi", label: "BMI" },
      { key: "status", label: "상태" },
    ],
  });

  // LivePreview: echo as-is
  const livePreviewTool = makeMockTool({
    template: "live-preview",
    inputConfig: {
      placeholder: "Markdown 등 입력…",
      inputLabel: "Source",
      outputLabel: "Preview",
    },
  });

  // MultiInput: join two textareas
  const multiInputTool = makeMockTool({
    template: "multi-input",
    formFields: [
      { name: "a", label: "Text A", type: "textarea", placeholder: "첫 번째" },
      { name: "b", label: "Text B", type: "textarea", placeholder: "두 번째" },
    ],
    inputConfig: { outputLabel: "Joined" },
  });

  // FormToVisual: returns a colored SVG
  const formToVisualTool = makeMockTool({
    template: "form-to-visual",
    formFields: [
      {
        name: "color",
        label: "색상",
        type: "select",
        defaultValue: "#3b82f6",
        options: [
          { label: "Blue", value: "#3b82f6" },
          { label: "Green", value: "#10b981" },
          { label: "Rose", value: "#f43f5e" },
        ],
      },
      {
        name: "size",
        label: "크기",
        type: "number",
        defaultValue: 120,
        min: 40,
        max: 240,
      },
    ],
  });

  return (
    <div className="space-y-6">
      {/* Real templates */}
      <TemplateCard
        name="TextToText (live)"
        status="real"
        description="입력 → 단순 변환. 여기서는 toUpperCase()."
      >
        <TextToText
          tool={textToTextTool}
          process={(input) => input.toUpperCase()}
        />
      </TemplateCard>

      <TemplateCard
        name="FormToResult (live)"
        status="real"
        description="폼 입력 → 결과 카드. 여기서는 간이 BMI."
      >
        <FormToResult
          tool={formToResultTool}
          process={(values) => {
            const w = Number(values.weight) || 0;
            const h = (Number(values.height) || 0) / 100;
            const bmi = h > 0 ? +(w / (h * h)).toFixed(1) : 0;
            const status =
              bmi === 0
                ? "-"
                : bmi < 18.5
                  ? "저체중"
                  : bmi < 25
                    ? "정상"
                    : bmi < 30
                      ? "과체중"
                      : "비만";
            return { bmi, status };
          }}
        />
      </TemplateCard>

      <TemplateCard
        name="LivePreview (live)"
        status="real"
        description="실시간 변환 미리보기. 여기서는 echo (입력=출력)."
      >
        <LivePreview
          tool={livePreviewTool}
          process={(input) => input}
        />
      </TemplateCard>

      <TemplateCard
        name="MultiInput (live)"
        status="real"
        description="2개의 텍스트 영역을 받아 join. 구분선 ---."
      >
        <MultiInput
          tool={multiInputTool}
          process={(arr) => arr.join("\n---\n")}
        />
      </TemplateCard>

      <TemplateCard
        name="FormToVisual (live)"
        status="real"
        description="폼 → SVG. 여기서는 색상/크기 입력에 따라 원을 그려 반환."
      >
        <FormToVisual
          tool={formToVisualTool}
          process={(fields) => {
            const color = String(fields.color ?? "#3b82f6");
            const size = Math.max(40, Math.min(240, Number(fields.size) || 120));
            const half = size / 2;
            return {
              svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${half}" cy="${half}" r="${half - 4}" fill="${color}" /></svg>`,
            };
          }}
        />
      </TemplateCard>

      {/* Skeleton templates */}
      <TemplateCard
        name="Realtime (skeleton)"
        status="skeleton"
        description="시간 기반 자동 갱신. 첫 timer/clock 툴 도입 시 실 구현."
      >
        <Realtime
          tool={makeMockTool({ template: "realtime" })}
          tick={(s: number) => s}
          render={(s: number) => <div>{s}</div>}
          initialState={0}
        />
      </TemplateCard>

      <TemplateCard
        name="Workspace (skeleton)"
        status="skeleton"
        description="LocalStorage CRUD. 첫 productivity 툴 도입 시 실 구현."
      >
        <Workspace
          tool={makeMockTool({ template: "workspace" })}
          storageKey="toolhub:demo:items"
          defaultItems={[]}
        />
      </TemplateCard>

      <TemplateCard
        name="FileProcessor (skeleton)"
        status="skeleton"
        description="파일 업로드 → 변환 → 다운로드. Phase 2 시작 시 실 구현."
      >
        <FileProcessor
          tool={makeMockTool({ template: "file-processor" })}
          accept="image/*,application/pdf"
          process={async () => []}
        />
      </TemplateCard>

      <TemplateCard
        name="ImageEditor (skeleton)"
        status="skeleton"
        description="캔버스 기반 이미지 편집. Phase 2 시작 시 실 구현."
      >
        <ImageEditor
          tool={makeMockTool({ template: "image-editor" })}
          tools={[]}
        />
      </TemplateCard>
    </div>
  );
}
