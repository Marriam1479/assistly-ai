import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
  Lightbulb,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiDisclaimer } from "@/components/app/ai-disclaimer";
import { useApp, TOOL_META, type ToolType } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const quickActions = [
  { to: "/email", icon: Mail, title: "Write an Email", desc: "Draft professional emails in seconds" },
  { to: "/meeting-notes", icon: FileText, title: "Summarize Notes", desc: "Turn transcripts into action items" },
  { to: "/task-planner", icon: ListChecks, title: "Plan Tasks", desc: "Build prioritized project plans" },
] as const;

const tips = [
  "Be specific about your objective and audience to get sharper AI outputs.",
  "Save your best generations so you can reuse and adapt them later.",
  "Review action items and deadlines before sharing summaries with your team.",
];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Dashboard() {
  const { docs, hydrated } = useApp();
  const active = docs.filter((d) => !d.deleted);
  const recent = active.slice(0, 5);
  const saved = active.filter((d) => d.saved).length;
  const favorites = active.filter((d) => d.favorite).length;

  const byDay = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - (6 - i));
    const next = day.getTime() + 86400000;
    const count = active.filter((d) => d.createdAt >= day.getTime() && d.createdAt < next).length;
    return { day: day.toLocaleDateString(undefined, { weekday: "short" }), count };
  });

  const stats = [
    { label: "Total generations", value: active.length, icon: Zap, tint: "text-chart-1" },
    { label: "Saved documents", value: saved, icon: FileText, tint: "text-chart-3" },
    { label: "Favorites", value: favorites, icon: TrendingUp, tint: "text-chart-4" },
    { label: "Est. hours saved", value: Math.round(active.length * 0.4 * 10) / 10, icon: Clock, tint: "text-chart-2" },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Card className="overflow-hidden border-0 gradient-primary text-primary-foreground shadow-elegant-lg">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-xl">
            <Badge className="mb-3 border-0 bg-white/20 text-primary-foreground hover:bg-white/25">
              <Sparkles className="size-3.5" /> AI Productivity Suite
            </Badge>
            <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, Alex</h1>
            <p className="mt-1.5 text-sm text-primary-foreground/85">
              Automate your workday with AI. Draft emails, summarize meetings, and plan projects — all in one place.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="shrink-0 shadow-elegant">
            <Link to="/email">
              Start creating <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map((a) => (
            <Link key={a.to} to={a.to} className="group">
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-elegant">
                <CardContent className="flex items-start gap-3 p-5">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <a.icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 font-semibold">
                      {a.title}
                      <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </p>
                    <p className="text-sm text-muted-foreground">{a.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-2xl font-bold">{hydrated ? s.value : "—"}</p>
              </div>
              <s.icon className={`size-8 ${s.tint}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Productivity this week</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={byDay} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" width={28} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    color: "var(--popover-foreground)",
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#fill)" name="Generations" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="size-4 text-chart-4" /> AI tips
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {tips.map((t) => (
              <div key={t} className="rounded-xl border bg-muted/40 p-3 text-sm text-muted-foreground">
                {t}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <CardTitle className="text-base">Recently generated</CardTitle>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link to="/history">
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No outputs yet. Use a tool above to get started.
            </p>
          ) : (
            <ul className="divide-y">
              {recent.map((d) => (
                <li key={d.id} className="flex items-center gap-3 py-3">
                  <Badge variant="secondary" className="shrink-0">
                    {TOOL_META[d.type as ToolType].short}
                  </Badge>
                  <span className="min-w-0 flex-1 truncate text-sm">{d.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(d.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <AiDisclaimer />
    </div>
  );
}
