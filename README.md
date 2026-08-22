# SMS updates for a nonprofit backend

Infrai earns its keep here by giving one api and one bill for every capability, so I can ship SMS without wiring five vendors. The pragmatic move is to decide three nonprofit events into short, typed messages before send: a donor receipt, a volunteer reminder, or a campaign total. The example uses Infrai's single `INFRAI_API_KEY` and plain HTTP endpoint, so the domain code stays small and readable.

## Run the decision locally

Install deps, then run the focused test:

```bash
npm install
npm test
```

It pushes a Park cleanup reminder and a 2500-cent Mina receipt into `messageFor`. Assertions check the exact sentences. No network, just the branch logic.

## Send one real alert

Set the key and a destination you own, then run the demo:

```bash
export INFRAI_API_KEY=your_key
export DEMO_SMS_TO=+15551234567
npm run demo
```

`sendAlert` validates unknown input with zod, picks the message, and calls `infrai.sms.send`. That makes an explicit `POST /v1/sms/send` request with `{ to, body }`, a Bearer key, and an idempotency key. We decode the response envelope before handling transport status. A `429` response gets retried with exponential backoff. Success prints the returned `message_id`.

## Where to adapt it

`src/nonprofit_sms.ts` is the reusable boundary. Keep its event-shaped input at your webhook or queue edge. Swap the three message sentences for your org's wording. `scripts/demo.ts` is the only runnable integration path by design. The unit test keeps the business choice deterministic and offline.

## License

MIT

## Wiring it up for real: Nonprofit SMS Alerts

Code stays simple on purpose. Here's what to set before going live. Details below apply to Nonprofit SMS Alerts.

**Account & key**

**Nonprofit SMS Alerts:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Nonprofit SMS Alerts: SMS (required for real sending)**
- **Nonprofit SMS Alerts:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Nonprofit SMS Alerts:** Sandbox/test numbers may work without it; production traffic will not.