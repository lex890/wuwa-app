
const isTitle = (str) => {
  return /font-bold.*text-3xl|whitney/i.test(str);
};

function strip(html) {
  return html.replace(/<[^>]+>/g, "").trim();
}

function processText(text) {
  const sections = text
    .replace(/<br\s*\/?>/gi, "\n")
    .split(/\n{2,}/)
    .map(s => s.trim())
    .filter(Boolean);

  const result = [];
  let current = null;

  for (const section of sections) {

    if (isTitle(section)) {
      current = {
        title: strip(section),
        description: ""
      };
      result.push(current);
    } else {
      if (!current) {
        current = { title: "", description: "" };
        result.push(current);
      }

      current.description += (current.description ? "\n" : "") + strip(section);
    }
  }

  return result;
}

export default processText