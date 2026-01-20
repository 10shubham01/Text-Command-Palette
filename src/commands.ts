export interface Command {
  id: string;
  label: string;
  icon: string;
  run: (text: string) => string;
}

export const commands: Command[] = [
  { id: "upper", label: "toUpperCase", icon: "Type", run: (t: string) => t.toUpperCase() },
  { id: "lower", label: "toLowerCase", icon: "Type", run: (t: string) => t.toLowerCase() },
  {
    id: "title",
    label: "toTitleCase",
    icon: "FileText",
    run: (t: string) =>
      t.replace(
        /\w\S*/g,
        (w) => w[0].toUpperCase() + w.slice(1).toLowerCase(),
      ),
  },
  {
    id: "sentence",
    label: "toSentenceCase",
    icon: "BookOpen",
    run: (t: string) => t.replace(/(^\w|\.\s*\w)/g, (c) => c.toUpperCase()),
  },
  {
    id: "camel",
    label: "toCamelCase",
    icon: "Code",
    run: (t: string) =>
      t
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
          index === 0 ? word.toLowerCase() : word.toUpperCase(),
        )
        .replace(/\s+/g, ""),
  },
  {
    id: "kebab",
    label: "toKebabCase",
    icon: "Minus",
    run: (t: string) =>
      t
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, ""),
  },
  {
    id: "reverse",
    label: "Reverse Text",
    icon: "RotateCcw",
    run: (t: string) => t.split("").reverse().join(""),
  },
  { id: "trim", label: "Trim Whitespace", icon: "Scissors", run: (t: string) => t.trim() },
  {
    id: "remove-punct",
    label: "Remove Punctuation",
    icon: "X",
    run: (t: string) => t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""),
  },
  {
    id: "count-words",
    label: "Count Words",
    icon: "BarChart3",
    run: (t: string) =>
      `Words: ${t.trim().split(/\s+/).length}, Characters: ${t.length}`,
  },
  {
    id: "copy",
    label: "Copy to Clipboard",
    icon: "Clipboard",
    run: (t: string) => {
      navigator.clipboard.writeText(t);
      return t;
    },
  },
  {
    id: "format-date-ist",
    label: "Format Date to IST",
    icon: "Calendar",
    run: (t: string) => {
      t = t.trim();
      let date: Date;
      if (!isNaN(Number(t))) {
        // Assume milliseconds timestamp
        date = new Date(parseInt(t));
      } else {
        // Try parsing as date string
        date = new Date(t);
      }
      if (isNaN(date.getTime())) return t; // Invalid date
      return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    },
  },
];