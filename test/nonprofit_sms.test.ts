import assert from "node:assert/strict";
import { messageFor } from "../src/nonprofit_sms.js";

const reminder = messageFor({ kind: "reminder", to: "+15551234567", eventName: "Park cleanup" });
assert.equal(reminder, "Reminder: Park cleanup is coming up.");
const receipt = messageFor({ kind: "receipt", to: "+15551234567", donorName: "Mina", amountCents: 2500 });
assert.equal(receipt, "Thank you Mina! Your receipt is $25.00.");
console.log("business message decisions pass");
