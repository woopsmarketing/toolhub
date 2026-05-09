"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  /**
   * true 시 내용에 맞춰 height를 자동 조정한다.
   * 활성화하면 resize-none이 강제 적용되고 useEffect로 scrollHeight를 따라간다.
   */
  autoResize?: boolean;
}

/**
 * Textarea — TextToText.tsx의 textarea 스타일 (h-64 ... resize-none rounded-xl border border-border bg-muted/30) 기반.
 * - autoResize 옵션은 클라이언트 hook 사용 → "use client" 필요.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      error,
      hint,
      autoResize = false,
      id,
      className,
      disabled,
      value,
      defaultValue,
      ...props
    },
    forwardedRef
  ) {
    const reactId = useId();
    const textareaId = id ?? reactId;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      forwardedRef,
      () => innerRef.current
    );

    useEffect(() => {
      if (!autoResize) return;
      const el = innerRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize, value, defaultValue]);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          ref={innerRef}
          id={textareaId}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-xl border bg-muted/30 p-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground font-mono",
            "transition-colors outline-none",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-60",
            autoResize ? "resize-none overflow-hidden" : "resize-y",
            !autoResize && "h-64",
            error ? "border-destructive" : "border-border",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="mt-1 text-xs text-muted-foreground">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="mt-1 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);
