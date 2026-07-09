import { useMemo, useState } from "react";
import { Search, Star, Trash2, RotateCcw, Copy, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp, TOOL_META, type ToolType, type DocItem } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DocList({ mode }: { mode: "history" | "saved" }) {
  const { docs, updateDoc, removeDoc, restoreDoc, hydrated } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | ToolType>("all");

  const list = useMemo(() => {
    return docs.filter((d) => {
      if (mode === "saved" && !d.saved) return false;
      if (cat !== "all" && d.type !== cat) return false;
      if (q && !(`${d.title} ${d.content}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [docs, mode, cat, q]);

  const copy = async (d: DocItem) => {
    await navigator.clipboard.writeText(d.content);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 sm:flex">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents…" className="pl-9" />
        </div>
        <Select value={cat} onValueChange={(v) => setCat(v as typeof cat)}>
          <SelectTrigger className="w-40 shrink-0"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="email">Emails</SelectItem>
            <SelectItem value="meeting">Meeting summaries</SelectItem>
            <SelectItem value="task">Task plans</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!hydrated ? null : list.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed py-20 text-center text-muted-foreground">
          <div className="flex flex-col items-center gap-3">
            <Inbox className="size-8" />
            <p className="text-sm">{mode === "saved" ? "No saved documents yet." : "No history yet."}</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((d) => (
            <Card key={d.id} className={cn(d.deleted && "opacity-60")}>
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{TOOL_META[d.type].label}</Badge>
                  {d.favorite && <Star className="size-4 fill-chart-4 text-chart-4" />}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="line-clamp-1 font-semibold">{d.title}</p>
                <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">{d.content}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Button variant="ghost" size="sm" onClick={() => updateDoc(d.id, { favorite: !d.favorite })}>
                    <Star className={cn("size-4", d.favorite && "fill-chart-4 text-chart-4")} />
                    {d.favorite ? "Favorited" : "Favorite"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => copy(d)}>
                    <Copy className="size-4" /> Copy
                  </Button>
                  {mode === "history" &&
                    (d.saved ? null : (
                      <Button variant="ghost" size="sm" onClick={() => updateDoc(d.id, { saved: true })}>
                        Save
                      </Button>
                    ))}
                  {d.deleted ? (
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => restoreDoc(d.id)}>
                      <RotateCcw className="size-4" /> Restore
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="ml-auto text-destructive hover:text-destructive" onClick={() => removeDoc(d.id)}>
                      <Trash2 className="size-4" /> Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}