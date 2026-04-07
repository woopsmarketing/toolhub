"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className }: CopyButtonProps) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-all",
        copied
          ? "border-green-300 bg-green-50 text-green-700"
          : "bg-white text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          {t("copied")}
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {t("copy")}
        </>
      )}
    </button>
  );
}
