import { Copy, Download, RefreshCw, Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp, type ToolType } from "@/lib/store";
import { AiDisclaimer } from "./ai-disclaimer";

export function OutputPanel({
  value,
  onChange,
  loading,
  onRegenerate,
  type,
  title,
  emptyHint,
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  onRegenerate: () => void;
  type: ToolType;
  title: string;
  emptyHint: string;
}) {
  const { addDoc } = useApp();

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  const save = () => {
    const heading = value.split("\n").find((l) => l.trim())?.slice(0, 60) || title;
    addDoc({ type, title: heading.replace(/^subject:\s*/i, ""), content: value, saved: true });
    toast.success("Saved to your documents");
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <CardTitle className="truncate text-base">{title}</CardTitle>
        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={loading || !value}>
            <RefreshCw className="size-4" /> <span className="hidden sm:inline">Regenerate</span>
          </Button>
          <Button variant="outline" size="sm" onClick={copy} disabled={!value}>
            <Copy className="size-4" /> <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button variant="outline" size="sm" onClick={download} disabled={!value}>
            <Download className="size-4" /> <span className="hidden sm:inline">Download</span>
          </Button>
          <Button variant="default" size="sm" onClick={save} disabled={!value}>
            <Bookmark className="size-4" /> <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {loading && !value ? (
          <div className="grid flex-1 place-items-center rounded-xl border border-dashed py-16 text-muted-foreground">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-7 animate-spin text-primary" />
              <p className="text-sm">Generating your content…</p>
            </div>
          </div>
        ) : value ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[360px] flex-1 resize-none font-mono text-sm leading-relaxed"
          />
        ) : (
          <div className="grid flex-1 place-items-center rounded-xl border border-dashed py-16 text-center text-muted-foreground">
            <p className="max-w-xs px-4 text-sm">{emptyHint}</p>
          </div>
        )}
        <AiDisclaimer />
      </CardContent>
    </Card>
  );
}