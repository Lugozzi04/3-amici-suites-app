"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/button";
import { contactHoneypotField, emptyContactFormValues, validateContactForm, type ContactFormErrors, type ContactFormValues } from "@/lib/contact-form";
import { basePath } from "@/lib/base-path";

type SubmissionState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const initialState: ContactFormValues = emptyContactFormValues;
const publicContactProvider = process.env.NEXT_PUBLIC_CONTACT_PROVIDER?.toLowerCase() ?? "resend";
const publicFormspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

export function ContactForm({
  initialMessage = "",
  prefillVersion = 0,
}: {
  initialMessage?: string;
  prefillVersion?: number;
}) {
  const t = useTranslations("contatti");
  const [form, setForm] = useState<ContactFormValues>(() => ({
    ...initialState,
    message: initialMessage,
  }));
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submission, setSubmission] = useState<SubmissionState>({ kind: "idle" });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      message: initialMessage,
    }));
  }, [initialMessage, prefillVersion]);

  useEffect(() => {
    if (initialMessage) {
      return;
    }

    const urlMessage = new URLSearchParams(window.location.search).get("message") ?? "";

    if (urlMessage) {
      setForm((current) => ({
        ...current,
        message: urlMessage,
      }));
    }
  }, [initialMessage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateContactForm(form);
    setErrors(validation.errors);

    if (!validation.valid) {
      setSubmission({ kind: "error", message: t("form.checkFields") });
      return;
    }

    setSubmission({ kind: "submitting" });

    try {
      const timestamp = new Date().toISOString();
      const useFormspree = publicContactProvider === "formspree" && Boolean(publicFormspreeEndpoint);
      const endpoint = useFormspree ? publicFormspreeEndpoint : `${basePath}/api/contact`;

      const response = await fetch(endpoint ?? `${basePath}/api/contact`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...validation.values,
          subject: `Nuova richiesta dal sito - ${validation.values.name}`,
          timestamp,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; errors?: ContactFormErrors }
        | null;

      if (!response.ok) {
        if (payload?.errors) {
          setErrors((current) => ({ ...current, ...payload.errors }));
        }

        setSubmission({
          kind: "error",
          message:
            payload?.message ||
            t("form.sendFailed"),
        });
        return;
      }

      setForm(initialState);
      setErrors({});
      setSubmission({
        kind: "success",
        message: payload?.message || t("form.sendSuccess"),
      });
    } catch {
      setSubmission({
        kind: "error",
        message: t("form.sendFailed"),
      });
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-5 rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-soft backdrop-blur"
      >
        <div className="rounded-[1.4rem] bg-[#efe4d6]/70 px-4 py-3 text-sm text-ink/72">
          {initialMessage
            ? t("form.prefillMessage")
            : t("form.directMessage")}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label={t("form.name")}
            value={form.name}
            error={errors.name}
            onChange={(value) => setForm((current) => ({ ...current, name: value }))}
          />
          <Field
            label={t("form.email")}
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(value) => setForm((current) => ({ ...current, email: value }))}
          />
        </div>

        <Field
          label={t("form.phone")}
          value={form.phone}
          error={errors.phone}
          onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
          optional
          optionalLabel={t("form.optional")}
        />

        <div className="grid gap-2">
          <label className="text-sm font-medium text-ink" htmlFor="message">
            {t("form.message")}
          </label>
          <textarea
            id="message"
            rows={7}
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className="rounded-2xl border border-stone/25 bg-paper/60 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-olive focus:bg-white"
            placeholder={t("form.placeholder")}
          />
          {errors.message ? (
            <p id="message-error" className="text-sm text-[#9b463d]" role="alert">
              {errors.message}
            </p>
          ) : null}
        </div>

        <input
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
          type="text"
          name={contactHoneypotField}
          value={form.website}
          onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={submission.kind === "submitting"}>
            {submission.kind === "submitting" ? t("form.sending") : t("form.submit")}
          </Button>
          <a className="text-sm text-olive hover:text-[#556146]" href="mailto:treamici.cadapi@gmail.com">
            {t("form.orWriteUs")}
          </a>
        </div>

        {submission.kind === "success" ? (
          <p className="text-sm text-[#556146]" role="status" aria-live="polite">
            {submission.message}
          </p>
        ) : null}

        {submission.kind === "error" ? (
          <p className="text-sm text-[#9b463d]" role="alert" aria-live="assertive">
            {submission.message}
          </p>
        ) : null}
      </form>

      <div className="grid gap-4 rounded-[1.8rem] border border-stone/20 bg-[#f8f3eb] p-5 text-sm text-ink/72 shadow-soft">
        <p className="text-xs uppercase tracking-[0.28em] text-earth">{t("form.directContact")}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <a className="hover:text-ink" href="mailto:treamici.cadapi@gmail.com">
            treamici.cadapi@gmail.com
          </a>
          <a className="hover:text-ink" href="tel:+393474848767">
            +39 347 484 8767
          </a>
        </div>
        <p className="leading-7">
          {t("form.directContactNote")}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  optional = false,
  optionalLabel = "(facoltativo)",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  optional?: boolean;
  optionalLabel?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="grid gap-2">
      <label className="text-[12px] uppercase tracking-[0.22em] text-earth" htmlFor={id}>
        {label}
        {optional ? ` ${optionalLabel}` : ""}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="rounded-2xl border border-stone/20 bg-paper/70 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-olive focus:bg-white"
        placeholder={label}
        autoComplete={label === "Email" ? "email" : label === "Telefono" ? "tel" : "name"}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-[#9b463d]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
