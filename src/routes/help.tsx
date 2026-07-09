import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, Mail, FileText, ListChecks, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { AiDisclaimer } from "@/components/app/ai-disclaimer";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help & Support — Workplace AI" }] }),
  component: HelpPage,
});

const faqs = [
  { q: "How do I generate content?", a: "Open any tool from the sidebar, fill in the details, and click generate. The AI produces an editable draft you can refine, copy, download, or save." },
  { q: "Where are my documents stored?", a: "Saved outputs and history are stored locally in your browser so they are available whenever you return. You can clear them anytime from Settings." },
  { q: "Can I edit AI outputs?", a: "Yes — every output is fully editable before you copy, download, or save it. Always review AI content for accuracy before use." },
  { q: "How do I change the default tone or length?", a: "Go to Settings → AI preferences to set your default writing tone and response length across all tools." },
];

const guides = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Craft professional emails fast." },
  { to: "/meeting-notes", icon: FileText, title: "Meeting Notes Summarizer", desc: "Extract decisions and action items." },
  { to: "/task-planner", icon: ListChecks, title: "AI Task Planner", desc: "Turn goals into structured plans." },
] as const;

function HelpPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageHeader icon={LifeBuoy} title="Help & Support" description="Guides, FAQs, and tips to get the most from Workplace AI." />

      <div className="grid gap-4 sm:grid-cols-3">
        {guides.map((g) => (
          <Link key={g.to} to={g.to} className="group">
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-elegant">
              <CardContent className="flex flex-col gap-2 p-5">
                <div className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <g.icon className="size-5" />
                </div>
                <p className="font-semibold">{g.title}</p>
                <p className="text-sm text-muted-foreground">{g.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="size-4 text-primary" /> Frequently asked questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-6">
          <div className="min-w-0">
            <p className="font-semibold">Still need help?</p>
            <p className="text-sm text-muted-foreground">Reach our support team and we'll get back to you.</p>
          </div>
          <Button asChild className="shrink-0">
            <a href="mailto:support@workplace-ai.example">Contact support</a>
          </Button>
        </CardContent>
      </Card>

      <AiDisclaimer />
    </div>
  );
}