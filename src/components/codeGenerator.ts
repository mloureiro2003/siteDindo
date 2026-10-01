const STOPWORDS = new Set(["e", "de", "do", "da", "dos", "das", "d", "com", "sem"]);

function stripAccents(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeKey(text: string): string {
  return stripAccents(text.toLowerCase())
    .replace(/[/=.,;:()"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The codes already in use for this catalog (from the original spreadsheets), so recreating
 * the same recipe types, food groups and measuring units reproduces the same codes exactly.
 * Keyed by the normalized description; add more entries here as needed.
 */
const KNOWN_CODES: ReadonlyArray<readonly [string, string]> = [
  // Tipos de receita
  ["acompanhamentos", "AC"], ["antepastos", "AP"], ["arroz", "AZ"], ["bolachas", "BO"],
  ["carne ave", "CA"], ["carne bovina", "CB"], ["compotas", "CO"], ["carne suina", "CS"],
  ["fundos", "FU"], ["massas", "MA"], ["molhos doces", "MD"], ["molhos salgados", "MS"],
  ["pães", "PA"], ["peixes", "PE"], ["preparações intermediárias", "PI"],
  ["crepes / panquecas", "PQ"], ["pizza", "PZ"], ["sobremesas", "SB"], ["sanduiches", "SD"],
  ["saladas", "SL"], ["sopas", "SO"], ["tortas", "TO"],
  // Grupos alimentares
  ["açucar", "AÇ"], ["cereais", "CE"], ["cogumelos", "CG"], ["féculas", "FC"],
  ["farinhas", "FR"], ["frutas", "FT"], ["hortaliças verdes", "HV"],
  ["leite = laticineos", "LT"], ["molhos prontos", "MP"], ["óleos e gorduras", "OG"],
  ["ovos", "OV"], ["peixe", "PX"], ["raizes", "RZ"], ["temperos liquidos", "TL"],
  ["temperos secos", "TS"], ["vinhos", "VN"],
  // Unidades de medida
  ["ad libitum", "AL"], ["colher d/ chá", "CC"], ["colher d/ sopa", "CS"], ["gramas", "GR"],
  ["kilos", "KG"], ["litro", "LT"], ["miligramas", "MG"], ["mililitros", "ML"],
  ["pitada", "PT"], ["quanto satis", "QS"], ["unidade", "UN"],
];

const EXCEPTIONS = new Map(KNOWN_CODES.map(([desc, code]) => [normalizeKey(desc), code]));

function significantWords(text: string): string[] {
  const cleaned = text.trim().toLowerCase().replace(/[/=]/g, " ");
  return cleaned.split(/\s+/).filter((word) => word.length > 0 && !STOPWORDS.has(word));
}

/** Every pair of consecutive letters in `text` (accents stripped, other characters dropped). */
function letterPairs(text: string): string[] {
  const upper = stripAccents(text).toUpperCase().replace(/[^A-Z]/g, "");
  const pairs: string[] = [];
  for (let i = 0; i < upper.length - 1; i++) pairs.push(upper.slice(i, i + 2));
  return pairs;
}

/** 2+ words -> initials of the first two; 1 word -> its first two letters; each with fallbacks. */
function genericCandidates(text: string): string[] {
  const words = significantWords(text);

  if (words.length >= 2) {
    const initials = stripAccents(words[0]!.charAt(0) + words[1]!.charAt(0)).toUpperCase();
    return [initials, ...letterPairs(words.join(""))];
  }
  if (words.length === 1) {
    const word = stripAccents(words[0]!).toUpperCase().replace(/[^A-Z]/g, "");
    if (word.length === 1) return [word + "X"];
    return [word.slice(0, 2), ...letterPairs(words[0]!)];
  }
  return letterPairs(text);
}

/** AA, AB, ..., AZ, BA, ... ZZ - starting near the seed's first letter. Last-resort only. */
function* alphabetPairs(seedLetter: string): Generator<string> {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const ordered = [seedLetter, ...letters.split("").filter((letter) => letter !== seedLetter)];
  for (const a of ordered) {
    for (const b of letters) yield a + b;
  }
}

/**
 * Suggests a short, human-recognizable code for `text` (a description or name), unique among
 * `existingCodes`. Known catalog entries return their original code; anything else falls back
 * to a generic rule (initials of the first two words, or the first two letters of one word),
 * with collision-avoidance so two different entries never end up with the same code. Two
 * letters can't capture every hand-picked abbreviation, so this is a starting suggestion -
 * callers that show it to people should let them type over it.
 */
export function generateCode(text: string, existingCodes: Iterable<string>): string {
  const used = new Set([...existingCodes].map((code) => code.toUpperCase()));

  const known = EXCEPTIONS.get(normalizeKey(text));
  if (known && !used.has(known.toUpperCase())) return known;

  for (const candidate of genericCandidates(text)) {
    if (candidate.length === 2 && !used.has(candidate)) return candidate;
  }

  const seed = stripAccents(text).trim().charAt(0).toUpperCase() || "A";
  for (const candidate of alphabetPairs(seed)) {
    if (!used.has(candidate)) return candidate;
  }

  // Every 2-letter code (676) is taken - fall back to a numbered code.
  const base = stripAccents(text).replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "XX";
  let n = 1;
  while (used.has(`${base}${n}`)) n++;
  return `${base}${n}`;
}
