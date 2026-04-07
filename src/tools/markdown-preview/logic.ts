export function process(input: string): string {
  if (!input.trim()) {
    return "";
  }

  let html = input;

  // Code blocks (must come before inline code)
  html = html.replace(/```[\w]*\n?([\s\S]*?)```/g, (_, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre><code>${escaped}</code></pre>`;
  });

  // Split into lines for block-level processing
  const lines = html.split("\n");
  const result: string[] = [];
  let i = 0;
  let inList = false;

  while (i < lines.length) {
    const line = lines[i];

    // Pre blocks (already processed) — pass through
    if (line.startsWith("<pre>")) {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }
      result.push(line);
      i++;
      continue;
    }

    // Headings
    const h3 = line.match(/^### (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h1 = line.match(/^# (.+)/);

    if (h3) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<h3>${inlineProcess(h3[1])}</h3>`);
      i++;
      continue;
    }
    if (h2) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<h2>${inlineProcess(h2[1])}</h2>`);
      i++;
      continue;
    }
    if (h1) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<h1>${inlineProcess(h1[1])}</h1>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push("<hr>");
      i++;
      continue;
    }

    // Blockquote
    const bq = line.match(/^> (.+)/);
    if (bq) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<blockquote>${inlineProcess(bq[1])}</blockquote>`);
      i++;
      continue;
    }

    // Unordered list item
    const li = line.match(/^[-*] (.+)/);
    if (li) {
      if (!inList) {
        result.push("<ul>");
        inList = true;
      }
      result.push(`<li>${inlineProcess(li[1])}</li>`);
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      if (inList) {
        result.push("</ul>");
        inList = false;
      } else {
        result.push("");
      }
      i++;
      continue;
    }

    // Regular paragraph
    if (inList) { result.push("</ul>"); inList = false; }
    result.push(`<p>${inlineProcess(line)}</p>`);
    i++;
  }

  if (inList) {
    result.push("</ul>");
  }

  return result.filter((l) => l !== "").join("\n");
}

function inlineProcess(text: string): string {
  let t = text;

  // Inline code (before bold/italic)
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Bold
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/__([^_]+)__/g, "<strong>$1</strong>");

  // Italic
  t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  t = t.replace(/_([^_]+)_/g, "<em>$1</em>");

  // Links
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  return t;
}
