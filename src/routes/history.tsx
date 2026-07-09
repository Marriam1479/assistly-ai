import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { DocList } from "@/components/app/doc-list";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — Workplace AI" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader icon={History} title="History" description="Browse, search, and restore your AI outputs." />
      <DocList mode="history" />
    </div>
  );
}