const TOKEN =
  /((?:^|(?<=\s))(?:#|\/\/)[^\n]*|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|\b(?:from|import|for|in|or|True|False|None|const|async|await|function|new|export|curl|pip)\b)/m;

function tokenClass(token: string): string {
  if (token.startsWith("#") || token.startsWith("//")) return "text-ash";
  if (token.startsWith('"') || token.startsWith("'")) return "text-saffron";
  return "text-bone";
}

/** Monochrome code with amber strings, white keywords and gray comments. */
export function CodeBlock({ code, className = "" }: { code: string; className?: string }) {
  const parts = code.split(new RegExp(TOKEN.source, "gm"));

  return (
    <pre className={`code-block ${className}`}>
      <code>
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <span key={i} className={tokenClass(part)}>
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </code>
    </pre>
  );
}
