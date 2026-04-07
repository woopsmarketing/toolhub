"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { type ToolConfig, type InputFieldConfig } from "@/config/types";
import CopyButton from "@/components/tools/CopyButton";

interface FormToResultProps {
  tool: ToolConfig;
  process: (values: Record<string, string | number>) => Record<string, string | number>;
}

export default function FormToResult({ tool, process }: FormToResultProps) {
  const t = useTranslations("common");
  const fields = tool.formFields || [];

  const defaultValues: Record<string, string | number> = {};
  fields.forEach((f) => {
    defaultValues[f.name] = f.defaultValue ?? (f.type === "number" ? 0 : "");
  });

  const [values, setValues] = useState(defaultValues);
  const [result, setResult] = useState<Record<string, string | number> | null>(null);

  const handleChange = (name: string, value: string | number) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(process(values));
  };

  const resultLabels = tool.resultLabels || [];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="h-32 w-full resize-none rounded-xl border border-border bg-muted/30 p-4 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none"
              />
            ) : (
              <div className="relative">
                <input
                  type={field.type}
                  value={values[field.name]}
                  onChange={(e) =>
                    handleChange(
                      field.name,
                      field.type === "number"
                        ? parseFloat(e.target.value) || 0
                        : e.target.value
                    )
                  }
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none"
                />
                {field.suffix && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {field.suffix}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          {t("calculate")}
        </button>
      </form>

      {/* Result */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">{t("result")}</h3>
        {result ? (
          <div className="space-y-3">
            {resultLabels.map(({ key, label, suffix }) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-5 py-4"
              >
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-lg font-bold text-primary">
                  {result[key]}
                  {suffix && (
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      {suffix}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
            {t("calculate")} 버튼을 눌러 결과를 확인하세요
          </div>
        )}
      </div>
    </div>
  );
}
