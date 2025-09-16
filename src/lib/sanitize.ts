import sanitizeHtml from "sanitize-html";

export function sanitize(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "span",
      "br",
      "p",
      "blockquote",
      "pre",
      "code",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt"],
      "*": ["style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      "a": sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true)
    }
  });
}

export function toHtmlFromPlainText(text: string) {
  const esc = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc.split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("\n");
}
