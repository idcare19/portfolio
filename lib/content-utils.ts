export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `item-${Date.now()}`;
}

export function normalizeSlug(value: string) {
  return slugify(String(value || "").trim());
}

export function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateReadingTimeMinutes(content: string) {
  const words = stripMarkdown(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function extractToc(markdown: string) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{2,4})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => {
      const [, hashes, title] = match as RegExpMatchArray;
      return {
        level: hashes.length,
        title: title.trim(),
        slug: slugify(title.trim()),
      };
    });
}

export function scoreFuzzy(query: string, source: string) {
  const q = query.toLowerCase().trim();
  const s = source.toLowerCase();
  if (!q) return 0;
  if (s.includes(q)) return 100 - Math.max(0, s.indexOf(q));

  let qi = 0;
  let score = 0;
  for (let i = 0; i < s.length && qi < q.length; i += 1) {
    if (s[i] === q[qi]) {
      qi += 1;
      score += 4;
    }
  }
  return qi === q.length ? score : 0;
}
