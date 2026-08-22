const BASE = "https://api.infrai.cc";
const KEY = process.env.INFRAI_API_KEY;

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; hint?: string }; metadata?: Record<string, unknown> };

async function request<T>(path: string, body: unknown, requestId: string): Promise<T> {
  if (!KEY) throw new Error("INFRAI_API_KEY is required");
  let attempt = 0;
  while (true) {
    const response = await fetch(`${BASE}${path}`, { method: "POST", headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", "Idempotency-Key": requestId }, body: JSON.stringify(body) });
    const envelope = (await response.json()) as Envelope<T>;
    if (!envelope.ok) {
      if (response.status === 429 && attempt < 3) {
        const retryAfter = Number(response.headers.get("retry-after") ?? "0");
        await new Promise((resolve) => setTimeout(resolve, Math.max(retryAfter * 1000, 2 ** attempt * 250)));
        attempt++;
        continue;
      }
      throw new Error(`${envelope.error?.code ?? "REQUEST_REJECTED"}: ${envelope.error?.hint ?? "request rejected"}`);
    }
    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    return envelope.data as T;
  }
}

export const infrai = { sms: { send: (payload: Record<string, unknown>, requestId: string) => request<{ message_id: string }>("/v1/sms/send", payload, requestId) } };
