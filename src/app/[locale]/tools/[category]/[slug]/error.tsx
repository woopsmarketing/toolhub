"use client";

export default function ToolError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1 style={{ color: "red" }}>Tool Page Error</h1>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
        {error.message}
      </pre>
      <p>Digest: {error.digest}</p>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", fontSize: "12px", color: "#666" }}>
        {error.stack}
      </pre>
    </div>
  );
}
