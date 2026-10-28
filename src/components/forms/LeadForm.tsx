"use client";

import { startTransition, useActionState } from "react";
import { sendLead, type LeadState } from "@/app/actions/send-lead";
import { PlusIcon } from "@/components/ui/Button";

/*
  Wraps a form's fields: sends them with the `sendLead` server action,
  shows errors under the fields, and swaps the form for a thank-you note once sent.

  Usage:
    <LeadForm form="contact" submitLabel="Submit enquiry">
      <Field name="name" label="Full name" />
      ...
    </LeadForm>
*/
const START: LeadState = { status: "idle", message: "" };

export function LeadForm({ form, submitLabel, children }: { form: string; submitLabel: string; children: React.ReactNode }) {
  const [state, action, pending] = useActionState(sendLead, START);

  // Sent by hand (not <form action>), because React empties a form after an action runs:
  // if the server answers "please fix your phone number", everything typed would be lost.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  }

  if (state.status === "sent") {
    return (
      <p role="status" className="text-h2 py-10">
        {state.message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
      <input type="hidden" name="form" value={form} />
      {/* Spam trap: hidden from people, bots fill it in */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {children}

      {state.status === "error" && (
        <p role="alert" className="text-small text-orange md:col-span-2">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group text-small mt-[10px] flex h-[50px] flex-col justify-between rounded-[5px] bg-black p-[10px] text-left text-white transition-colors duration-[600ms] hover:bg-[#333] disabled:opacity-60 md:col-span-2 md:w-[217px]"
      >
        <span className="leading-none">{pending ? "Sending…" : submitLabel}</span>
        <PlusIcon className="self-end" />
      </button>
    </form>
  );
}

// Touch screens get 16px text: iOS Safari zooms the page into any smaller field when it is tapped.
const INPUT = "text-body normal-case pointer-coarse:text-[16px] h-[50px] w-full rounded-[5px] bg-white px-[10px] outline-none focus:ring-1 focus:ring-black";

/* One text input with its label. `wide` makes it span both columns. */
export function Field({
  name, label, type = "text", autoComplete, required = true, wide = false,
}: {
  name: string; label: string; type?: string; autoComplete?: string; required?: boolean; wide?: boolean;
}) {
  return (
    <label className={`text-small block text-grey ${wide ? "md:col-span-2" : ""}`}>
      {label}
      {required && " *"}
      <input name={name} type={type} autoComplete={autoComplete} required={required} className={`${INPUT} mt-[6px] text-black`} />
    </label>
  );
}

/* A dropdown with its label. */
export function SelectField({ name, label, options, wide = false }: { name: string; label: string; options: string[]; wide?: boolean }) {
  return (
    <label className={`text-small block text-grey ${wide ? "md:col-span-2" : ""}`}>
      {label} *
      <select name={name} required defaultValue="" className={`${INPUT} mt-[6px] text-black`}>
        <option value="" disabled>
          Select
        </option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

/* A longer text box (optional by default). */
export function MessageField({ name, label }: { name: string; label: string }) {
  return (
    <label className="text-small block text-grey md:col-span-2">
      {label}
      <textarea name={name} rows={4} className="text-body normal-case pointer-coarse:text-[16px] pointer-coarse:leading-[20px] mt-[6px] w-full rounded-[5px] bg-white p-[10px] text-black outline-none focus:ring-1 focus:ring-black" />
    </label>
  );
}

/* The consent tick-box every form needs before it can be sent. */
export function Consent({ text }: { text: string }) {
  return (
    <label className="text-small flex items-start gap-3 text-grey md:col-span-2">
      <input type="checkbox" name="consent" value="yes" required className="mt-[2px] size-4 shrink-0 accent-black" />
      <span>{text} *</span>
    </label>
  );
}
