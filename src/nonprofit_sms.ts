import { z } from "zod";
import { infrai } from "./infrai.js";

export const alertRequest = z.object({ kind: z.enum(["receipt", "reminder", "report"]), to: z.string().min(7), donorName: z.string().optional(), amountCents: z.number().int().positive().optional(), eventName: z.string().optional(), totalCents: z.number().int().nonnegative().optional() });
export type AlertRequest = z.infer<typeof alertRequest>;

export function messageFor(input: AlertRequest): string {
  if (input.kind === "receipt") return `Thank you ${input.donorName ?? "supporter"}! Your receipt is $${((input.amountCents ?? 0) / 100).toFixed(2)}.`;
  if (input.kind === "reminder") return `Reminder: ${input.eventName ?? "your volunteer shift"} is coming up.`;
  return `Campaign update: ${((input.totalCents ?? 0) / 100).toFixed(2)} raised so far.`;
}

export async function sendAlert(raw: unknown) {
  const input = alertRequest.parse(raw);
  const message = messageFor(input);
  const data = await infrai.sms.send({ to: input.to, body: message }, `${input.kind}:${input.to}:${message}`);
  return { ...data, kind: input.kind, message };
}
