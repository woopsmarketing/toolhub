"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eraser } from "lucide-react";
import CopyButton from "@/components/tools/CopyButton";
import { type ToolConfig } from "@/config/types";

interface LivePreviewProps {
  tool: ToolConfig;
  process: (input: string) => string;
  renderPreview?: (input: string) => React.ReactNode;
}

export default function LivePreview({
  tool,
  process,
  renderPreview,
}: LivePreviewProps) {
  const t = useTranslations("common");
  const [input, setInput] = useState("");

  const result = input ? process(input) : "";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Input */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {tool.inputConfig?.inputLabel || t("input")}
            </label>
            {input && (
              <button
                onClick={() => setInput("")}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Eraser className="h-3 w-3" />
                {t("clear")}
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tool.inputConfig?.placeholder || ""}
            className="h-80 w-full resize-none rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed transition-colors focus:border-primary focus:bg-white focus:outline-none font-mono"
          />
        </div>

        {/* Preview */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {tool.inputConfig?.outputLabel || t("output")}
            </label>
            {result && <CopyButton text={result} />}
          </div>
          {renderPreview ? (
            <div className="h-80 overflow-auto rounded-xl border border-border bg-white p-4">
              {renderPreview(input)}
            </div>
          ) : (
            <textarea
              readOnly
              value={result}
              placeholder={t("output")}
              className="h-80 w-full resize-none rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed font-mono"
            />
          )}
        </div>
      </div>
    </div>
  );
}
