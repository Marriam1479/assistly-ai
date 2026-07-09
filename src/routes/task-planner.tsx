import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/page-header";
import { OutputPanel } from "@/components/app/output-panel";
import { generatePlan } from "@/lib/ai.functions";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      { name: "description", content: "Turn goals into prioritized task lists, timelines, and milestones." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const { settings } = useApp();
  const run = useServerFn(generatePlan);
  const [goal, setGoal] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!goal.trim()) {
      toast.error("Please describe your project, goal, or workload.");
      return;
    }
    setLoading(true);
    try {
      const { text } = await run({ data: { goal, timeframe, length: settings.responseLength } });
      setOutput(text);
    } catch {
      toast.error("Something went wrong building the plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Break down projects into prioritized tasks, timelines, and milestones."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Describe your work</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="goal">Project, goal, or workload</Label>
              <Textarea
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Launch a company newsletter: design, content plan, tooling, and first three issues"
                className="min-h-[220px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tf">Timeframe / constraints (optional)</Label>
              <Input id="tf" value={timeframe} onChange={(e) => setTimeframe(e.target.value)} placeholder="e.g. 4 weeks, ~5 hours per week" />
            </div>
            <Button onClick={generate} disabled={loading} size="lg">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              Generate plan
            </Button>
          </CardContent>
        </Card>
        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          onRegenerate={generate}
          type="task"
          title="Your task plan"
          emptyHint="Describe your goal and generate a prioritized plan with timelines, milestones, and risks."
        />
      </div>
    </div>
  );
}