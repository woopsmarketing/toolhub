"use client";

/**
 * PrimitivesShowcase — `_shared` 4개 프리미티브 시각 디버깅.
 *
 * Input · Select · Textarea · Button (4 variants × 3 sizes + loading)
 */

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Input, Select, Textarea, Button } from "@/tools/templates/_shared";

export default function PrimitivesShowcase() {
  const [text, setText] = useState("");
  const [num, setNum] = useState<number | string>(42);
  const [sel, setSel] = useState("ko");
  const [longText, setLongText] = useState("");

  return (
    <div className="space-y-10">
      {/* Input */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">Input</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="기본 텍스트"
            placeholder="텍스트를 입력하세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
            hint="hint 도 함께 표시됩니다"
          />
          <Input
            label="숫자"
            type="number"
            value={num}
            onChange={(e) => setNum(e.target.value)}
          />
          <Input
            label="비활성화"
            placeholder="disabled"
            disabled
            defaultValue="readonly value"
          />
          <Input
            label="에러 상태"
            defaultValue="invalid@"
            error="이메일 형식이 아닙니다"
          />
        </div>
      </div>

      {/* Select */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">Select</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="언어"
            value={sel}
            onChange={(e) => setSel(e.target.value)}
            options={[
              { label: "한국어", value: "ko" },
              { label: "English", value: "en" },
              { label: "日本語", value: "ja" },
            ]}
          />
          <Select
            label="에러 상태"
            options={[
              { label: "옵션 A", value: "a" },
              { label: "옵션 B", value: "b" },
            ]}
            error="필수 선택입니다"
          />
        </div>
      </div>

      {/* Textarea */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">Textarea</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <Textarea
            label="기본"
            placeholder="여러 줄 입력..."
            value={longText}
            onChange={(e) => setLongText(e.target.value)}
          />
          <Textarea
            label="autoResize"
            placeholder="입력하면 높이가 자동 조절됩니다"
            autoResize
          />
        </div>
      </div>

      {/* Button */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          Button (4 variants × 3 sizes)
        </h3>
        <div className="space-y-4">
          {(["primary", "secondary", "ghost", "destructive"] as const).map(
            (variant) => (
              <div key={variant} className="flex flex-wrap items-end gap-3">
                <span className="w-24 text-xs font-medium uppercase text-muted-foreground">
                  {variant}
                </span>
                <Button variant={variant} size="sm">
                  Small
                </Button>
                <Button variant={variant} size="md">
                  Medium
                </Button>
                <Button variant={variant} size="lg">
                  Large
                </Button>
                <Button
                  variant={variant}
                  size="md"
                  icon={<Sparkles className="h-4 w-4" />}
                >
                  with icon
                </Button>
                <Button variant={variant} size="md" loading>
                  loading
                </Button>
                <Button variant={variant} size="md" disabled>
                  disabled
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
