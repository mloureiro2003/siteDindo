export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Removes scripts, event handlers and javascript: URLs from an HTML string. */
export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script, style, iframe, object, embed, link, meta").forEach((el) => el.remove());

  doc.body.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const isScriptUrl = (name === "href" || name === "src") && /^\s*javascript:/i.test(attr.value);
      if (name.startsWith("on") || isScriptUrl) el.removeAttribute(attr.name);
    }
  });

  return doc.body.innerHTML;
}

/** Lowercases and strips accents so "Pão" matches "pao". */
export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
