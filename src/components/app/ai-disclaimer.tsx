import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-border/70 bg-muted/50 px-3.5 py-2.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        AI-generated content is intended to assist users and should always be reviewed for accuracy,
        completeness, and suitability before use in professional or business settings.
      </p>
    </div>
  );
}