import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  HeartPulse,
  Droplets,
  Footprints,
  Apple,
  Moon,
  Brain,
  Target,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/health-planner")({
  head: () => ({
    meta: [
      { title: "Weekly Health Task Planner — Workplace AI" },
      {
        name: "description",
        content:
          "Track five core health pillars with a simple daily checklist, weekly goal, and expert insight.",
      },
      { property: "og:title", content: "Weekly Health Task Planner — Workplace AI" },
      {
        property: "og:description",
        content:
          "Track five core health pillars with a simple daily checklist, weekly goal, and expert insight.",
      },
    ],
  }),
  component: HealthPlannerPage,
});

const PILLARS = [
  { id: "hydration", label: "Hydration", habit: "Drink 2L water", icon: Droplets },
  { id: "movement", label: "Movement", habit: "Walk 10k steps", icon: Footprints },
  { id: "nutrition", label: "Nutrition", habit: "Eat 5 servings veg/fruit", icon: Apple },
  { id: "sleep", label: "Sleep", habit: "Sleep 7 hours", icon: Moon },
  { id: "mental", label: "Mental Health", habit: "Meditate 10 minutes", icon: Brain },
] as const;

const TIPS = [
  "Sip water before you feel thirsty — thirst signals mild dehydration.",
  "Short walks after meals steady blood sugar and boost mood.",
  "Colorful plates usually mean more fiber and micronutrients.",
  "A cool, dark room deepens sleep more than extra hours.",
  "Two slow minutes of breathing lowers stress hormones fast.",
];

const STORAGE_KEY = "awpa.health.checklist";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function HealthPlannerPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { date: string; done: Record<string, boolean> };
        if (parsed.date === todayKey()) setDone(parsed.done);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), done }));
    }
  }, [done, hydrated]);

  const completed = PILLARS.filter((p) => done[p.id]).length;
  const progress = Math.round((completed / PILLARS.length) * 100);

  const tip = useMemo(() => {
    const day = new Date().getDay();
    return TIPS[day % TIPS.length];
  }, []);

  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const reset = () => setDone({});

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        icon={HeartPulse}
        title="Weekly Health Task Planner"
        description="Build healthy habits systematically — five focused pillars, one simple daily checklist."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {PILLARS.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="grid size-10 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-elegant">
                <p.icon className="size-5" />
              </div>
              <div>
                <p className="font-semibold">{p.label}</p>
                <p className="text-sm text-muted-foreground">{p.habit}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <CardTitle className="text-base">Today's checklist</CardTitle>
            <Button variant="ghost" size="sm" onClick={reset} disabled={completed === 0}>
              <RotateCcw className="size-4" /> Reset
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Progress value={progress} className="flex-1" />
              <Badge variant="secondary">
                {completed}/{PILLARS.length}
              </Badge>
            </div>
            <ul className="flex flex-col gap-2">
              {PILLARS.map((p) => (
                <li key={p.id}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50",
                      done[p.id] && "bg-muted/40",
                    )}
                  >
                    <Checkbox checked={!!done[p.id]} onCheckedChange={() => toggle(p.id)} />
                    <p.icon className="size-4 text-muted-foreground" />
                    <span className={cn("text-sm", done[p.id] && "text-muted-foreground line-through")}>
                      {p.habit}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">{p.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="size-4 text-primary" /> This week's goal
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Stay consistent on all five pillars for at least 5 of 7 days. Progress beats perfection — aim for
              challenging but doable.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="size-4 text-primary" /> Expert insight
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{tip}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}