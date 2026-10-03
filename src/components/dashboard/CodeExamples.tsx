"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";

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

  const tabs = Object.keys(snippets) as TabId[];

  return (
    <section aria-labelledby="examples-title" className="flex flex-col gap-7.5">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-4.5">
          <span className="eyebrow">Integrasi</span>
          <h2 id="examples-title" className="text-heading-sm">
            Alat &amp; SDK
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="target-model" className="label">
            Target model
          </label>
          <select
            id="target-model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="field min-h-[44px] w-auto pr-10 font-mono text-sm"
          >
            <option value="muara-v1-flash-high">muara-v1-flash-high (Coding &amp; Penalaran)</option>
            <option value="muara-v1-flash-medium">muara-v1-flash-medium (Seimbang)</option>
            <option value="muara-v1-flash-low">muara-v1-flash-low (Cepat / Responsif)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 border-b border-line">
        <div role="tablist" aria-label="Contoh integrasi" className="flex flex-wrap gap-x-6 gap-y-1.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`tab-${tab}`}
              aria-selected={activeTab === tab}
              aria-controls="examples-panel"
              onClick={() => setActiveTab(tab)}
              className={`-mb-px min-h-[44px] border-b-2 text-label font-semibold uppercase transition-colors ${
                activeTab === tab ? "border-iris text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {snippets[tab].title}
            </button>
          ))}
        </div>

        <button type="button" onClick={handleCopy} className="btn-quiet ml-auto">
          <span className="material-symbols-rounded" aria-hidden="true">
            {copied ? "check" : "content_copy"}
          </span>
          <span aria-live="polite">{copied ? "Tersalin" : "Salin konfigurasi"}</span>
        </button>
      </div>

      <div id="examples-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        <CodeBlock code={snippets[activeTab].code} />
      </div>
    </section>
  );
}
