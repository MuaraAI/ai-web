"use client";

import { useState } from "react";

type TabId = "hermes" | "cursor" | "claude" | "codex" | "aider" | "python" | "javascript" | "curl";

export function CodeExamples() {
  const [activeTab, setActiveTab] = useState<TabId>("hermes");
  const [selectedModel, setSelectedModel] = useState("muara-v1-flash-high");
  const [copied, setCopied] = useState(false);

  const snippets: Record<TabId, { title: string; category: "agent" | "sdk"; code: string }> = {
    hermes: {
      title: "Hermes Agent",
      category: "agent",
      code: `# Konfigurasi Hermes Agent (~/.hermes/config.yaml)
model: ${selectedModel}
provider: custom
custom_providers:
  custom:
    base_url: https://api.muaraai.com/v1/ai
    api_key: muara_ai_YOUR_KEY

# Jalankan:
# hermes chat`,
    },
    cursor: {
      title: "Cursor IDE",
      category: "agent",
      code: `// Panduan Konfigurasi Cursor IDE
1. Buka Cursor Settings (Ctrl/Cmd + Shift + J) -> Models
2. Tambahkan Model Baru: "${selectedModel}"
3. Nyalakan toggle "Override OpenAI Base URL"
4. Masukkan URL: https://api.muaraai.com/v1/ai
5. Masukkan OpenAI API Key: muara_ai_YOUR_KEY
6. Klik Verify di samping nama model untuk memastikan koneksi hijau.`,
    },
    claude: {
      title: "Claude Code",
      category: "agent",
      code: `# Jalankan Claude Code menggunakan bridge LiteLLM lokal:
# 1. Install & jalankan proxy litellm (di terminal terpisah):
pip install litellm
litellm --model openai/${selectedModel} --api_base https://api.muaraai.com/v1/ai --api_key muara_ai_YOUR_KEY --port 8000

# 2. Arahkan Claude Code ke proxy:
export ANTHROPIC_BASE_URL="http://localhost:8000"
claude`,
    },
    codex: {
      title: "Codex CLI",
      category: "agent",
      code: `# Konfigurasi OpenAI Codex CLI:
export OPENAI_BASE_URL="https://api.muaraai.com/v1/ai"
export OPENAI_API_KEY="muara_ai_YOUR_KEY"

# Jalankan Codex dengan model Muara:
codex --model ${selectedModel}`,
    },
    aider: {
      title: "Aider / CLI",
      category: "agent",
      code: `# Jalankan Aider CLI dengan OpenAI Base URL Muara:
export OPENAI_API_BASE="https://api.muaraai.com/v1/ai"
export OPENAI_API_KEY="muara_ai_YOUR_KEY"

# Jalankan session:
aider --model openai/${selectedModel}`,
    },
    python: {
      title: "Python (OpenAI SDK)",
      category: "sdk",
      code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.muaraai.com/v1/ai",
    api_key="muara_ai_YOUR_KEY"
)

response = client.chat.completions.create(
    model="${selectedModel}",
    messages=[
        {"role": "user", "content": "Jelaskan konsep AI Gateway secara ringkas"}
    ],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content or "", end="", flush=True)
print()`,
    },
    javascript: {
      title: "JavaScript / Node",
      category: "sdk",
      code: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.muaraai.com/v1/ai",
  apiKey: "muara_ai_YOUR_KEY",
});

async function main() {
  const stream = await client.chat.completions.create({
    model: "${selectedModel}",
    messages: [
      { role: "user", content: "Jelaskan konsep AI Gateway secara ringkas" }
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
  console.log();
}

main();`,
    },
    curl: {
      title: "cURL",
      category: "sdk",
      code: `curl -N https://api.muaraai.com/v1/ai/chat/completions \\
  -H "Authorization: Bearer muara_ai_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${selectedModel}",
    "messages": [
      {"role": "user", "content": "Jelaskan konsep AI Gateway secara ringkas"}
    ],
    "stream": true
  }'`,
    },
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippets[activeTab].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-surface-solid/70 p-5 sm:p-6 backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-rounded text-accent text-lg">terminal</span>
          <h3 className="text-sm font-bold text-text">Panduan Integrasi Alat & SDK</h3>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] text-text-muted">Target Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="rounded-lg border border-stroke bg-background px-2.5 py-1 text-xs text-text focus:border-accent focus:outline-none"
          >
            <option value="muara-v1-flash-high">muara-v1-flash-high (Coding & Penalaran)</option>
            <option value="muara-v1-flash-medium">muara-v1-flash-medium (Seimbang)</option>
            <option value="muara-v1-flash-low">muara-v1-flash-low (Cepat / Responsif)</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-1">
        <div className="flex flex-wrap items-center gap-1">
          {(Object.keys(snippets) as TabId[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                activeTab === tab
                  ? "bg-accent/10 border border-accent/30 text-accent font-semibold"
                  : "text-text-muted hover:text-text hover:bg-white/5 border border-transparent"
              }`}
            >
              {snippets[tab].title}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-[11px] text-text-muted hover:text-text py-1 transition-colors ml-auto sm:ml-0"
        >
          <span className="material-symbols-rounded text-xs">
            {copied ? "check" : "content_copy"}
          </span>
          <span>{copied ? "Tersalin" : "Salin Konfigurasi"}</span>
        </button>
      </div>

      {/* Code Display Area */}
      <div className="relative rounded-lg border border-stroke bg-code-bg p-4 font-mono text-xs text-code-text overflow-x-auto">
        <pre className="leading-relaxed">
          <code>{snippets[activeTab].code}</code>
        </pre>
      </div>
    </div>
  );
}
