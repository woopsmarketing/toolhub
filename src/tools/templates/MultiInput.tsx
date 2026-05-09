"use client";

/**
 * MultiInput — 2~3개의 텍스트 입력을 받아 비교/병합 결과를 출력하는 템플릿.
 *
 * Phase 1 PR-4 신규 (실 구현).
 *
 * 사용 예: text-diff, side-by-side compare, merge two lists, etc.
 *
 * 입력 개수는 `tool.formFields?.length` 로 결정 (없으면 2, 최대 3).
 * formFields[i].label 가 있으면 입력 라벨로 사용, 없으면 fallback "Input A/B/C".
 *
 * 출력:
 *  - process() 가 string 반환 → 단일 출력 textarea + CopyButton
 *  - process() 가 Record<string, string|number> 반환 → 통계 카드 grid (TextToText 와 동일 스타일)
 */

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Eraser } from "lucide-react";
import CopyButton from "@/components/tools/CopyButton";
import { type ToolConfig } from "@/config/types";
import { Textarea, Button } from "./_shared";

interface MultiInputProps {
  tool: ToolConfig;
  process: (inputs: string[]) => string | Record<string, string | number>;
}

const FALLBACK_LABELS = ["Input A", "Input B", "Input C"] as const;

export default function MultiInput({ tool, process }: MultiInputProps) {
  const t = useTranslations("common");

  const requested = tool.formFields?.length ?? 2;
  const count = Math.min(Math.max(requested, 2), 3);

  const labels: string[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const fromConfig = tool.formFields?.[i]?.label;
      return fromConfig && fromConfig.trim().length > 0
        ? fromConfig
        : FALLBACK_LABELS[i];
    });
  }, [tool.formFields, count]);

  const placeholders: string[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      return tool.formFields?.[i]?.placeholder ?? "";
    });
  }, [tool.formFields, count]);

  const [inputs, setInputs] = useState<string[]>(() =>
    Array.from({ length: count }, () => "")
  );

  const allEmpty = inputs.every((v) => v.length === 0);
  const result = allEmpty ? null : process(inputs);
  const isStringResult = typeof result === "string";

  const updateInput = (i: number, value: string) => {
    setInputs((prev) => {
      const next = prev.slice();
      next[i] = value;
      return next;
    });
  };

  const clearAll = () => {
    setInputs(Array.from({ length: count }, () => ""));
  };

  // grid columns: 2 → lg:grid-cols-2, 3 → lg:grid-cols-3
  const gridColsClass =
    count === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {tool.inputConfig?.inputLabel || t("input")}
        </span>
        {!allEmpty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            icon={<Eraser className="h-3.5 w-3.5" />}
          >
            {t("clear")}
          </Button>
        )}
      </div>

      <div className={`grid grid-cols-1 gap-4 ${gridColsClass}`}>
        {Array.from({ length: count }, (_, i) => (
          <Textarea
            key={i}
            label={labels[i]}
            value={inputs[i]}
            onChange={(e) => updateInput(i, e.target.value)}
            placeholder={placeholders[i]}
            className="h-64"
          />
        ))}
      </div>

      {/* Output */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {tool.inputConfig?.outputLabel || t("output")}
          </label>
          {result && isStringResult && result.length > 0 && (
            <CopyButton text={result} />
          )}
        </div>

        {result && !isStringResult ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(result).map(([key, value]) => (
              <div
                key={key}
                className="rounded-xl border border-border bg-muted/30 p-4 text-center"
              >
                <div className="text-2xl font-bold text-primary">{value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{key}</div>
              </div>
            ))}
          </div>
        ) : (
          <textarea
            readOnly
            value={isStringResult ? result : ""}
            placeholder={t("output")}
            className="h-64 w-full resize-none rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed font-mono"
          />
        )}
      </div>
    </div>
  );
}
