import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { AiDisclaimer } from "@/components/app/ai-disclaimer";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Workplace AI" }] }),
  component: SettingsPage,
});

const tones = ["Professional", "Friendly", "Formal", "Persuasive", "Apologetic", "Concise", "Enthusiastic"];
const languages = ["English", "Spanish", "French", "German", "Portuguese", "Japanese"];

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
      <div className="min-w-0">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const { settings, setSettings } = useApp();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader icon={SettingsIcon} title="Settings" description="Personalize your workspace and AI defaults." />

      <Card>
        <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
        <CardContent>
          <Row label="Theme" desc="Switch between light and dark mode.">
            <div className="flex gap-2">
              {(["light", "dark"] as const).map((t) => (
                <Button
                  key={t}
                  variant={settings.theme === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSettings({ theme: t })}
                  className={cn("capitalize")}
                >
                  {t === "light" ? <Sun className="size-4" /> : <Moon className="size-4" />} {t}
                </Button>
              ))}
            </div>
          </Row>
          <Row label="Language" desc="Preferred interface and content language.">
            <Select value={settings.language} onValueChange={(v) => setSettings({ language: v })}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {languages.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">AI preferences</CardTitle></CardHeader>
        <CardContent>
          <Row label="Response length" desc="Default level of detail for generated content.">
            <Select value={settings.responseLength} onValueChange={(v) => setSettings({ responseLength: v as never })}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row label="Default writing tone" desc="Used to pre-select the tone in generators.">
            <Select value={settings.defaultTone} onValueChange={(v) => setSettings({ defaultTone: v })}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notifications & privacy</CardTitle></CardHeader>
        <CardContent>
          <Row label="Notifications" desc="Receive tips and product updates.">
            <Switch checked={settings.notifications} onCheckedChange={(v) => setSettings({ notifications: v })} />
          </Row>
          <Row label="Store history locally" desc="Keep generated outputs in your browser for history & saved docs.">
            <Switch checked={settings.privacyStoreHistory} onCheckedChange={(v) => setSettings({ privacyStoreHistory: v })} />
          </Row>
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("awpa.docs");
                toast.success("Local history cleared. Refresh to see changes.");
              }}
            >
              Clear local history
            </Button>
          </div>
        </CardContent>
      </Card>

      <AiDisclaimer />
    </div>
  );
}