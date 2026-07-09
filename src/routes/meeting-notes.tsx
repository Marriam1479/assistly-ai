import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/page-header";
import { OutputPanel } from "@/components/app/output-panel";
import { summarizeNotes } from "@/lib/ai.functions";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      { name: "description", content: "Turn raw meeting notes into summaries, action items, and decisions." },
    ],
  }),
  component: MeetingPage,
});

function MeetingPage() {
  const { settings } = useApp();
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!notes.trim()) {
      toast.error("Please paste your meeting notes or transcript.");
      return;
    }
    setLoading(true);
    try {
      const { text } = await run({ data: { notes, length: settings.responseLength } });
      setOutput(text);
    } catch {
      toast.error("Something went wrong summarizing the notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Extract summaries, decisions, action items, and follow-ups."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meeting notes or transcript</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Paste your content</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste raw meeting notes, bullet points, or a full transcript here…"
                className="min-h-[360px]"
              />
            </div>
            <Button onClick={generate} disabled={loading} size="lg">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              Summarize notes
            </Button>
          </CardContent>
        </Card>
        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          onRegenerate={generate}
          type="meeting"
          title="Structured summary"
          emptyHint="Paste your meeting notes and generate a structured summary with action items and decisions."
        />
      </div>
    </div>
  );
}