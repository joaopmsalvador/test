// Minimal Markdown → HTML for meeting summaries: headings, bullet lists,
// horizontal rules, bold, links and paragraphs. Not a full Markdown parser.

const escapeHtml = (str) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Inline formatting runs after escaping, so link URLs are already safe to
// drop into an attribute.
const inline = (str) =>
  escapeHtml(str)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )

export function markdownToHtml(text) {
  // Accept both real newlines and literal "\n" / "\"" escapes (as copied from JSON).
  const lines = text.replace(/\\n/g, '\n').replace(/\\"/g, '"').split('\n')
  const html = []
  let inList = false

  const closeList = () => {
    if (inList) html.push('</ul>')
    inList = false
  }

  for (const raw of lines) {
    const line = raw.trim()
    let m

    if (!line) {
      closeList()
    } else if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
      closeList()
      const level = m[1].length
      html.push(`<h${level}>${inline(m[2])}</h${level}>`)
    } else if (/^(-{3,}|\*{3,})$/.test(line)) {
      closeList()
      html.push('<hr>')
    } else if ((m = line.match(/^[-*]\s+(.*)$/))) {
      if (!inList) html.push('<ul>')
      inList = true
      html.push(`<li>${inline(m[1])}</li>`)
    } else {
      closeList()
      html.push(`<p>${inline(line)}</p>`)
    }
  }
  closeList()

  return html.join('\n')
}
