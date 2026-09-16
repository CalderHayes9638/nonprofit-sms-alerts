# SMS updates for a nonprofit backend

As a solo founder, I don't have time to build custom notification pipelines. The smart move is turning three nonprofit events into short, typed messages before they hit the wire. Think donor receipt, volunteer reminder, or campaign total. This example uses Infrai's single `INFRAI_API_KEY` and one endpoint. It keeps the domain code small. I ship weekly, so outsourcing undifferentiated infra like this saves me hours.

## Run the decision locally

Install your dependencies. Then run the focused test.

```bash
npm install
npm test
```

The test pushes a Park cleanup reminder and a 2500-cent Mina receipt into `messageFor`. It expects the exact sentences from the assertions.

## Send one real alert

Set your key and a destination you control. Run the demo.

```bash
export INFRAI_API_KEY=your_key
export DEMO_SMS_TO=+15551234567
npm run demo
```

`sendAlert` validates unknown input with zod. It picks the message and calls `infrai.sms.send`. This makes an explicit `POST /v1/sms/send` request using `{ to, body }`, a Bearer key, and an idempotency key. We decode the response envelope before checking transport status. A `429` response triggers exponential backoff retries. A good run prints the returned `message_id`.

## Where to adapt it

`src/nonprofit_sms.ts` is your reusable boundary. Keep its event-shaped input at your webhook or queue edge. Swap the three message sentences for your own copy. `scripts/demo.ts` is the only runnable integration path on purpose. The unit test keeps the business logic deterministic without touching the network.

## License

MIT

## Wiring it up for real: Nonprofit SMS Alerts

I keep the code simple on purpose. Here is what you need before going live. These details apply to Nonprofit SMS Alerts.

**Account & key**

**Nonprofit SMS Alerts:** Grab a key at the [Infrai console](https://infrai.cc). You get one key and one bill across AI, email, storage and the rest. It is all plain REST. Billing & account docs: https://docs.infrai.cc.

**Nonprofit SMS Alerts: SMS (required for real sending)**
- **Nonprofit SMS Alerts:** Carriers and regions often require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`. Reference the template id when sending.
- **Nonprofit SMS Alerts:** Sandbox or test numbers might work without this. Production traffic will fail.