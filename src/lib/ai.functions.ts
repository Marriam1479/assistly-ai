import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const lengthGuide: Record<string, string> = {
  short: "Keep it concise and to the point.",
  medium: "Use a balanced, moderate length.",
  long: "Be thorough and detailed.",
};

const EmailInput = z.object({
  recipientType: z.string().default("Colleague"),
  purpose: z.string().min(1),
  tone: z.string().default("Professional"),
  keyPoints: z.string().default(""),
  wordCount: z.number().optional(),
  length: z.string().default("medium"),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const { getGatewayModel } = await import("./ai-gateway.server");
    const wc = data.wordCount ? `Target roughly ${data.wordCount} words.` : lengthGuide[data.length] ?? "";
    const prompt = [
      "# Objective",
      `Write a complete, ready-to-send professional email.`,
      "# Context",
      `Recipient type: ${data.recipientType}`,
      `Purpose: ${data.purpose}`,
      `Key points to include: ${data.keyPoints || "(none provided — infer sensible content from the purpose)"}`,
      "# Style & Tone",
      `Tone: ${data.tone}. ${wc}`,
      "# Output format",
      "Return ONLY the email. Start with a 'Subject:' line, then the greeting, body paragraphs, and a professional sign-off. Use placeholders like [Your Name] where personal details are unknown.",
      "# Quality checks",
      "Ensure clarity, correct grammar, appropriate tone, and that all key points are covered.",
    ].join("\n");
    const { text } = await generateText({
      model: getGatewayModel(),
      instructions: "You are an expert executive communications assistant.",
      prompt,
    });
    return { text };
  });

const NotesInput = z.object({
  notes: z.string().min(1),
  length: z.string().default("medium"),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesInput.parse(d))
  .handler(async ({ data }) => {
    const { getGatewayModel } = await import("./ai-gateway.server");
    const prompt = [
      "# Objective",
      "Transform the raw meeting notes/transcript below into a structured, professional summary.",
      "# Output format (use Markdown headings exactly)",
      "## Executive Summary",
      "## Key Discussion Points",
      "## Decisions Made",
      "## Action Items (owner — task — deadline)",
      "## Assigned Responsibilities",
      "## Deadlines",
      "## Follow-up Recommendations",
      "# Style",
      `Clear, concise, business tone. ${lengthGuide[data.length] ?? ""}`,
      "# Quality checks",
      "Only include information supported by the notes. If a section has no content, write 'None noted.'",
      "# Meeting notes",
      data.notes,
    ].join("\n");
    const { text } = await generateText({
      model: getGatewayModel(),
      instructions: "You are a meticulous meeting-notes analyst.",
      prompt,
    });
    return { text };
  });

const PlanInput = z.object({
  goal: z.string().min(1),
  timeframe: z.string().default(""),
  length: z.string().default("medium"),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlanInput.parse(d))
  .handler(async ({ data }) => {
    const { getGatewayModel } = await import("./ai-gateway.server");
    const prompt = [
      "# Objective",
      "Create an actionable project/task plan from the description below.",
      "# Context",
      `Project/goal: ${data.goal}`,
      data.timeframe ? `Timeframe/constraints: ${data.timeframe}` : "",
      "# Output format (use Markdown headings exactly)",
      "## Prioritized Task List",
      "## Suggested Timeline",
      "## Daily Schedule",
      "## Weekly Milestones",
      "## Estimated Completion Dates",
      "## Productivity Recommendations",
      "## Potential Risks & Blockers",
      "# Style",
      `Practical and specific. ${lengthGuide[data.length] ?? ""}`,
      "# Quality checks",
      "Ensure tasks are concrete, prioritized, and realistically sequenced.",
    ].filter(Boolean).join("\n");
    const { text } = await generateText({
      model: getGatewayModel(),
      instructions: "You are a senior project planning and productivity coach.",
      prompt,
    });
    return { text };
  });