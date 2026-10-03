import { CopyButton } from "@/components/CopyButton";

export function CopyEndpoint({
  url = "https://api.muaraai.com/v1/ai",
}: {
  url?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4.5 gap-y-1">
      <span className="label">Base URL</span>
      <code className="select-all break-all font-mono text-[15px] text-bone">{url}</code>
      <CopyButton text={url} label="Salin Base URL" showText />
    </div>
  );
}
