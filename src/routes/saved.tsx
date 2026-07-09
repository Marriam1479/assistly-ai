import { createFileRoute } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { DocList } from "@/components/app/doc-list";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved Documents — Workplace AI" }] }),
  component: SavedPage,
});

function SavedPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader icon={Bookmark} title="Saved Documents" description="Your favorited and saved AI outputs." />
      <DocList mode="saved" />
    </div>
  );
}