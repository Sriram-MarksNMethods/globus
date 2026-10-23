"use server";

/*
  Receives the Contact, Partner and Career forms (runs on the server only).

  Where do the leads go?
  Set LEAD_WEBHOOK_URL in the server environment (.env.local, or the hosting dashboard)
  to the CRM / email webhook. Every submission is sent there as JSON:
    { form: "contact", name: "...", phone: "...", ..., sentAt: "..." }
  The URL stays on the server, so it never shows up in the browser.

  Until it is set, the form tells the visitor to call instead, so no lead is silently lost.
*/

export type LeadState = { status: "idle" | "sent" | "error"; message: string };

// The fields each form must fill in. Anything else in the form is sent along as optional.
const REQUIRED: Record<string, string[]> = {
  contact: ["name", "email", "phone", "project", "consent"],
  partner: ["name", "email", "phone", "consent"],
  career: ["name", "email", "phone", "role", "consent"],
};

const FALLBACK = "Something went wrong. Please call us on +91 95 1978 1978 or email info@globusdevelopers.com.";

export async function sendLead(_previous: LeadState, formData: FormData): Promise<LeadState> {
  const form = String(formData.get("form") ?? "");
  const required = REQUIRED[form];
  if (!required) return { status: "error", message: FALLBACK };

  // Spam trap: real visitors never see or fill the "website" field.
  if (formData.get("website")) return { status: "sent", message: "Thank you. We'll be in touch shortly." };

  // Collect every text field, trimmed.
  const lead: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && key !== "website" && !key.startsWith("$")) lead[key] = value.trim();
  }

  const missing = required.filter((field) => !lead[field]);
  if (missing.length > 0) return { status: "error", message: "Please fill in all the fields marked *." };

  if (!/^\S+@\S+\.\S+$/.test(lead.email)) return { status: "error", message: "Please enter a valid email address." };

  // Indian mobile: 10 digits, optionally written with +91 / spaces / dashes.
  const digits = lead.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  if (!/^[6-9]\d{9}$/.test(digits)) return { status: "error", message: "Please enter a valid 10-digit mobile number." };
  lead.phone = `+91${digits}`;

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    console.warn(`[send-lead] LEAD_WEBHOOK_URL is not set, a "${form}" lead was not delivered.`);
    return { status: "error", message: FALLBACK };
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, sentAt: new Date().toISOString() }),
    });
    if (!response.ok) throw new Error(`Webhook answered ${response.status}`);
  } catch (error) {
    console.error("[send-lead] delivery failed:", error);
    return { status: "error", message: FALLBACK };
  }

  return { status: "sent", message: "Thank you. We'll be in touch shortly." };
}
