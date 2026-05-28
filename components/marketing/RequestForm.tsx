"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

// ─── Service options ─────────────────────────────────────────────────────────

const SERVICE_OPTIONS = [
  { value: "car", label: "Exotic Car" },
  { value: "yacht", label: "Yacht Charter" },
  { value: "jet", label: "Private Jet" },
  { value: "jet_ski", label: "Jet Skis" },
  { value: "chauffeur", label: "Chauffeur" },
  { value: "restaurant", label: "Dining & Reservations" },
  { value: "nightlife", label: "Nightlife" },
  { value: "concierge", label: "Concierge / Other" },
] as const;

type ServiceValue = (typeof SERVICE_OPTIONS)[number]["value"];

// ─── Zod schema ───────────────────────────────────────────────────────────────

const FormSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  serviceType: z.enum(SERVICE_OPTIONS.map((o) => o.value) as [ServiceValue, ...ServiceValue[]]),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().max(2000, "Max 2,000 characters").optional(),
});

type FormValues = z.infer<typeof FormSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  vehicleSlug?: string;
  yachtSlug?: string;
  jetSlug?: string;
  assetTitle?: string;
};

function deriveServiceType(
  vehicleSlug?: string,
  yachtSlug?: string,
  jetSlug?: string,
): ServiceValue {
  if (vehicleSlug) return "car";
  if (yachtSlug) return "yacht";
  if (jetSlug) return "jet";
  return "car";
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-ink/40 mb-2 text-[9px] uppercase tracking-[0.22em]">
        {label}
        {required && <span className="text-ink/25 ml-1">*</span>}
      </p>
      {children}
      {error && <p className="mt-1.5 text-[10px] text-red-600">{error}</p>}
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export default function RequestForm({ vehicleSlug, yachtSlug, jetSlug, assetTitle }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const assetSlug = vehicleSlug ?? yachtSlug ?? jetSlug;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      serviceType: deriveServiceType(vehicleSlug, yachtSlug, jetSlug),
    },
  });

  async function onSubmit(data: FormValues) {
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, assetSlug, assetTitle }),
      });
      if (!res.ok) throw new Error("server_error");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or reach us directly.");
    }
  }

  // ── Success state ───────────────────────────────────────────────────────────

  if (status === "success") {
    return (
      <div className="border-ink/10 mt-12 border-t pt-10">
        <p className="text-ink/35 text-[9px] uppercase tracking-[0.24em]">Request received</p>
        <p className="mt-5 max-w-lg font-display text-3xl leading-tight sm:text-4xl">
          A Pulse specialist will be in touch within 15 minutes.
        </p>
        <p className="text-ink/55 mt-5 max-w-sm text-sm leading-relaxed">
          Keep your phone nearby. We&apos;ll confirm availability and send a tailored quote
          directly.
        </p>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="border-ink/10 mt-12 border-t pt-10"
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
        {/* Full Name */}
        <Field label="Full Name" error={errors.fullName?.message} required>
          <Input {...register("fullName")} placeholder="First & last name" autoComplete="name" />
        </Field>

        {/* Email */}
        <Field label="Email" error={errors.email?.message} required>
          <Input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>

        {/* Phone */}
        <Field label="Phone" error={errors.phone?.message}>
          <Input
            {...register("phone")}
            type="tel"
            placeholder="+1 (305) 000-0000"
            autoComplete="tel"
          />
        </Field>

        {/* Service Type */}
        <Field label="Service" error={errors.serviceType?.message} required>
          <div className="relative">
            <select
              {...register("serviceType")}
              className="border-ink/30 w-full appearance-none border-b bg-transparent py-2 text-base outline-none transition-colors focus:border-ink"
            >
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="text-ink/35 pointer-events-none absolute inset-y-0 right-0 flex items-center text-[10px]"
            >
              ↓
            </span>
          </div>
        </Field>

        {/* Preferred Date */}
        <Field label="Preferred Date" error={errors.preferredDate?.message}>
          <Input {...register("preferredDate")} type="date" />
        </Field>

        {/* Preferred Time */}
        <Field label="Preferred Time" error={errors.preferredTime?.message}>
          <Input {...register("preferredTime")} placeholder="e.g. Morning, 2 pm" />
        </Field>

        {/* Location — full width */}
        <div className="sm:col-span-2">
          <Field label="Pickup / Marina Location" error={errors.location?.message}>
            <Input {...register("location")} placeholder="Hotel name, address, or marina" />
          </Field>
        </div>

        {/* Notes — full width */}
        <div className="sm:col-span-2">
          <Field label="Notes" error={errors.notes?.message}>
            <Textarea
              {...register("notes")}
              rows={4}
              placeholder="Group size, add-ons, special requirements — anything useful."
            />
          </Field>
        </div>
      </div>

      {/* Submit error */}
      {status === "error" && errorMsg && <p className="mt-6 text-sm text-red-600">{errorMsg}</p>}

      {/* Submit row */}
      <div className="mt-10">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-3 bg-ink px-10 py-4 text-[11px] uppercase tracking-[0.22em] text-paper transition-colors duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-graphite disabled:opacity-50"
        >
          {status === "loading" ? (
            <>
              <span className="border-paper/40 h-3.5 w-3.5 animate-spin rounded-full border border-t-paper" />
              Sending…
            </>
          ) : (
            "Send Request"
          )}
        </button>
        <p className="text-ink/35 mt-4 text-[10px] uppercase tracking-[0.18em]">
          A specialist responds within 15 minutes
        </p>
      </div>
    </form>
  );
}
