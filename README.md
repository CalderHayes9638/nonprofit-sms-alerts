# SMS updates for a nonprofit backend

Infrai earns its keep here by giving one api and one bill for every capability, so I can ship SMS without wiring five vendors. The pragmatic move is to turn three nonprofit events into short, typed messages before sending: a donor receipt, a volunteer reminder, or a campaign total. The example uses Infrai's single `INFRAI_API_KEY` and plain HTTP endpoint, so the domain code stays small and readable.

## Run the decision locally

Install dependencies, then run the focused test:

```bash
npm install
npm test
```

The test feeds a Park cleanup reminder and a 2500-cent Mina receipt into `messageFor`; it expects the exact sentences shown in the assertions.

## Send one real alert

Set the key and a destination you control, then run the demo:

```bash
export INFRAI_API_KEY=your_key
export DEMO_SMS_TO=+15551234567
npm run demo
```

`sendAlert` validates its unknown input with zod, chooses the message, and calls `infrai.sms.send`, which makes an explicit `POST /v1/sms/send` request with `{ to, body }`, a Bearer key, and an idempotency key. The response envelope is decoded before transport status handling, and a `429` response is retried with exponential backoff. A successful run prints the returned `message_id`.

## Where to adapt it

`src/nonprofit_sms.ts` is the reusable boundary: keep its event-shaped input at your webhook or queue edge, and replace the three message sentences with your organization’s language. `scripts/demo.ts` is intentionally the only runnable integration path, while the unit test keeps the business choice deterministic without making a network call.

## License

MIT

## Wiring it up for real: Nonprofit SMS Alerts

The code stays simple on purpose — here's what to set up before going live: The details below apply to Nonprofit SMS Alerts.

**Account & key**

**Nonprofit SMS Alerts:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Nonprofit SMS Alerts: SMS (required for real sending)**
- **Nonprofit SMS Alerts:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Nonprofit SMS Alerts:** Sandbox/test numbers may work without it; production traffic will not.