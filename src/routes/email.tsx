import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/app/page-header";
import { OutputPanel } from "@/components/app/output-panel";
import { generateEmail } from "@/lib/ai.functions";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      { name: "description", content: "Generate clear, professional, context-aware emails with AI." },
    ],
  }),
  component: EmailPage,
});

const tones = ["Professional", "Friendly", "Formal", "Persuasive", "Apologetic", "Concise", "Enthusiastic"];

function EmailPage() {
  const { settings } = useApp();
  const run = useServerFn(generateEmail);
  const [recipientType, setRecipientType] = useState("Colleague");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState(settings.defaultTone);
  const [keyPoints, setKeyPoints] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!purpose.trim()) {
      toast.error("Please describe the purpose of the email.");
      return;
    }
    setLoading(true);
    try {
      const { text } = await run({
        data: {
          recipientType,
          purpose,
          tone,
          keyPoints,
          wordCount: wordCount ? Number(wordCount) : undefined,
          length: settings.responseLength,
        },
      });
      setOutput(text);
    } catch {
      toast.error("Something went wrong generating the email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Draft polished, context-aware emails in seconds."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="recipient">Recipient type</Label>
                <Input id="recipient" value={recipientType} onChange={(e) => setRecipientType(e.target.value)} placeholder="e.g. Client, Manager" />
              </div>
              <div className="grid gap-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purpose">Purpose of the email</Label>
              <Textarea id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Follow up on the Q3 proposal and request a meeting next week" className="min-h-24" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="points">Key points to include</Label>
              <Textarea id="points" value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} placeholder="One point per line (optional)" className="min-h-24" />
            </div>
            <div className="grid gap-2 sm:max-w-40">
              <Label htmlFor="wc">Word count (optional)</Label>
              <Input id="wc" type="number" min={30} value={wordCount} onChange={(e) => setWordCount(e.target.value)} placeholder="e.g. 150" />
            </div>
            <Button onClick={generate} disabled={loading} size="lg">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              Generate email
            </Button>
          </CardContent>
        </Card>
        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          onRegenerate={generate}
          type="email"
          title="Generated email"
          emptyHint="Fill in the details and generate your email. The result will appear here, ready to edit."
        />
      </div>
    </div>
  );
}