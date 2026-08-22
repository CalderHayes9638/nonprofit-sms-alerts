import { sendAlert } from "../src/nonprofit_sms.js";

const to = process.env.DEMO_SMS_TO;
if (!to) throw new Error("DEMO_SMS_TO is required");
const result = await sendAlert({ kind: "reminder", to, eventName: "Saturday food-bank shift" });
console.log(`sent ${result.kind}: ${result.message} (${result.message_id})`);
