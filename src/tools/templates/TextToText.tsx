"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eraser } from "lucide-react";
import CopyButton from "@/components/tools/CopyButton";
import { type ToolConfig } from "@/config/types";

interface TextToTextProps {
  tool: ToolConfig;
  process: (input: string) => string | Record<string, string | number>;
}

export default function TextToText({ tool, process }: TextToTextProps) {
  const t = useTranslations("common");
  const [input, setInput] = useState("");

  const result = input ? process(input) : null;
  const isStats = tool.inputConfig?.outputType === "stats";

  return (
    <div className="space-y-4">
      <div className={`grid gap-4 ${isStats ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
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
            className="h-64 w-full resize-none rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed transition-colors focus:border-primary focus:bg-white focus:outline-none font-mono"
          />
        </div>

        {/* Output */}
        {isStats && result && typeof result === "object" ? (
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
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                {tool.inputConfig?.outputLabel || t("output")}
              </label>
              {result && typeof result === "string" && (
                <CopyButton text={result} />
              )}
            </div>
            <textarea
              readOnly
              value={typeof result === "string" ? result : ""}
              placeholder={t("output")}
              className="h-64 w-full resize-none rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
}
