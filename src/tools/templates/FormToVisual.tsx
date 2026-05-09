"use client";

/**
 * FormToVisual — 폼 입력 → 시각 결과(SVG/HTML) 출력 + 다운로드.
 *
 * Phase 1 PR-4 신규 (실 구현).
 *
 * 사용 예: QR code generator, color palette, gradient generator, chart generator.
 *
 * process() 반환:
 *  - svg: SVG 문자열 (sanitize 후 dangerouslySetInnerHTML 로 삽입)
 *  - html: HTML 문자열 (sanitize 후 삽입). svg 와 둘 중 하나만 사용 권장.
 *  - downloadable: { mime, data, filename } — Blob 또는 string 모두 허용,
 *    string + image/svg+xml 처럼 텍스트 다운로드 가능.
 *
 * 보안: sanitizeMarkup() 으로 allowlist 적용 (svg/g/path/rect/circle/text/line +
 * 하위 div/span/p/br/strong/em/style/code 등 안전한 태그). <script>, on* 핸들러,
 * javascript: URL 은 모두 제거.
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { type ToolConfig, type InputFieldConfig } from "@/config/types";
import { Input, Select, Button } from "./_shared";

export interface FormToVisualResult {
  svg?: string;
  html?: string;
  downloadable?: {
    mime: string;
    data: Blob | string;
    filename: string;
  };
}

interface FormToVisualProps {
  tool: ToolConfig;
  process: (
    fields: Record<string, string | number>
  ) => FormToVisualResult;
}

// ---- Sanitization ----

const ALLOWED_TAGS = new Set<string>([
  // SVG
  "svg",
  "g",
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
  "defs",
  "linearGradient",
  "radialGradient",
  "stop",
  "title",
  "desc",
  // Safe HTML for previews
  "div",
  "span",
  "p",
  "br",
  "strong",
  "em",
  "code",
  "pre",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "img",
  "a",
]);

const URL_ATTRS = new Set<string>(["href", "xlink:href", "src"]);

/**
 * Simple allowlist sanitizer.
 * - Removes <script>, <style>, <iframe>, <object>, <embed>, <link>, <meta> entirely.
 * - Strips any attribute starting with "on" (onclick, onerror, …).
 * - For URL-bearing attributes (href/src), rejects javascript:, data: (except image/), vbscript:.
 * - Removes any tag not in ALLOWED_TAGS (keeps inner text).
 *
 * Implementation note: parses via DOMParser when available (browser only — this file is "use client").
 * Falls back to regex stripping if DOMParser is unavailable (SSR safety).
 */
function sanitizeMarkup(input: string): string {
  if (!input) return "";

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    // SSR fallback: aggressive strip of dangerous patterns
    return input
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
      .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
      .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
      .replace(/javascript:/gi, "");
  }

  // Wrap so DOMParser doesn't auto-add html/body for SVG fragments
  const wrapper = `<div id="__sanitize_root__">${input}</div>`;
  let doc: Document;
  try {
    doc = new DOMParser().parseFromString(wrapper, "text/html");
  } catch {
    return "";
  }
  const root = doc.getElementById("__sanitize_root__");
  if (!root) return "";

  const walk = (node: Element) => {
    // Iterate children copy because we mutate in-place
    const children = Array.from(node.children);
    for (const child of children) {
      const tag = child.tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) {
        // Drop the element entirely (including subtree)
        child.remove();
        continue;
      }

      // Strip dangerous attributes
      const attrs = Array.from(child.attributes);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        const value = attr.value;

        if (name.startsWith("on")) {
          child.removeAttribute(attr.name);
          continue;
        }

        if (URL_ATTRS.has(name)) {
          const trimmed = value.trim().toLowerCase();
          const safe =
            trimmed.startsWith("http://") ||
            trimmed.startsWith("https://") ||
            trimmed.startsWith("mailto:") ||
            trimmed.startsWith("#") ||
            trimmed.startsWith("/") ||
            trimmed.startsWith("data:image/");
          if (!safe) {
            child.removeAttribute(attr.name);
            continue;
          }
        }

        // Reject any attribute value containing inline JS pseudo-protocol
        if (/javascript\s*:/i.test(value) || /vbscript\s*:/i.test(value)) {
          child.removeAttribute(attr.name);
        }
      }

      walk(child);
    }
  };

  walk(root);
  return root.innerHTML;
}

// ---- Component ----

export default function FormToVisual({ tool, process }: FormToVisualProps) {
  const t = useTranslations("common");
  const fields: InputFieldConfig[] = tool.formFields || [];

  const defaultValues: Record<string, string | number> = useMemo(() => {
    const out: Record<string, string | number> = {};
    fields.forEach((f) => {
      out[f.name] = f.defaultValue ?? (f.type === "number" ? 0 : "");
    });
    return out;
  }, [fields]);

  const [values, setValues] =
    useState<Record<string, string | number>>(defaultValues);
  const [result, setResult] = useState<FormToVisualResult | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleChange = (name: string, value: string | number) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = process(values);
    setResult(next);
  };

  // Manage object URL lifecycle for Blob downloads
  useEffect(() => {
    if (!result?.downloadable) {
      setDownloadUrl(null);
      return;
    }
    const { data, mime } = result.downloadable;
    const blob =
      data instanceof Blob ? data : new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [result]);

  const sanitizedSvg = useMemo(
    () => (result?.svg ? sanitizeMarkup(result.svg) : ""),
    [result?.svg]
  );
  const sanitizedHtml = useMemo(
    () => (result?.html ? sanitizeMarkup(result.html) : ""),
    [result?.html]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => {
          if (field.type === "select") {
            return (
              <Select
                key={field.name}
                label={field.label}
                value={String(values[field.name] ?? "")}
                onChange={(e) => handleChange(field.name, e.target.value)}
                options={field.options ?? []}
              />
            );
          }
          return (
            <Input
              key={field.name}
              label={field.label}
              type={field.type === "textarea" ? "text" : field.type}
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
            />
          );
        })}

        <Button type="submit" variant="primary" size="md" className="w-full">
          {t("calculate")}
        </Button>
      </form>

      {/* Visual preview */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">{t("result")}</h3>
          {result?.downloadable && downloadUrl && (
            <a
              href={downloadUrl}
              download={result.downloadable.filename}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" />
              {t("download") /* falls back to key if missing */}
            </a>
          )}
        </div>

        <div className="flex min-h-[20rem] items-center justify-center rounded-xl border border-border bg-white p-4">
          {result?.svg ? (
            <div
              className="flex h-full w-full items-center justify-center"
              dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
            />
          ) : result?.html ? (
            <div
              className="h-full w-full"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          ) : (
            <span className="text-sm text-muted-foreground">
              {t("calculate")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
