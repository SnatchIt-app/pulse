"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import {
  getTomorrowDateString,
  isValidYMD,
  isFutureDate,
  isAfter,
  normalizeDateOrNull,
  validateDateRange,
} from "@/lib/dates";
import {
  trackVehicleRequest,
  trackVehicleLead,
  trackYachtRequest,
  trackYachtLead,
  trackJetRequest,
  trackJetLead,
  trackResidenceRequest,
  trackResidenceLead,
  trackExperienceRequest,
  trackExperienceLead,
  trackConciergeLead,
  trackFormSubmit,
  trackFormSuccess,
} from "@/lib/analytics";

// ─── Service options ──────────────────────────────────────────────────────────

const SERVICE_OPTIONS = [
  { value: "car", label: "Exotic Car" },
  { value: "yacht", label: "Yacht Charter" },
  { value: "jet", label: "Private Jet" },
  { value: "jet_ski", label: "Jet Skis" },
  { value: "chauffeur", label: "Chauffeur" },
  { value: "restaurant", label: "Dining & Reservations" },
  { value: "nightlife", label: "Nightlife" },
  { value: "residence", label: "Residence" },
  { value: "experience", label: "Experience" },
  { value: "concierge", label: "Concierge / Other" },
] as const;

type ServiceValue = (typeof SERVICE_OPTIONS)[number]["value"];

// ─── Zod schema ───────────────────────────────────────────────────────────────
// All service-specific fields are optional; they are serialised into the
// lead's message field on submit — no DB schema changes required.

const FormSchema = z
  .object({
    fullName: z.string().min(2, "Full name required"),
    email: z.string().email("Valid email required"),
    phone: z.string().optional(),
    serviceType: z.enum(SERVICE_OPTIONS.map((o) => o.value) as [ServiceValue, ...ServiceValue[]]),

    // Car / Chauffeur
    pickupLocation: z.string().optional(),
    deliveryLocation: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    driverAge: z.string().optional(),

    // Jet
    departureCity: z.string().optional(),
    arrivalCity: z.string().optional(),
    departureDate: z.string().optional(),
    returnDate: z.string().optional(),
    passengerCount: z.string().optional(),

    // Yacht / Jet Ski
    charterDate: z.string().optional(),
    charterDuration: z.string().optional(),
    yachtGuestCount: z.string().optional(),
    preferredMarina: z.string().optional(),

    // Residence
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    residenceGuestCount: z.string().optional(),
    bedroomsNeeded: z.string().optional(),

    // Concierge / generic
    requestType: z.string().optional(),
    conciergeLocation: z.string().optional(),
    conciergeDate: z.string().optional(),

    // Experience
    occasionType: z.string().optional(),
    experienceDate: z.string().optional(),
    experienceGuestCount: z.string().optional(),
    experienceLocation: z.string().optional(),

    // Always present
    notes: z.string().max(2000, "Max 2,000 characters").optional(),
  })
  .superRefine((data, ctx) => {
    const FUTURE_MSG = "Choose a date from tomorrow onward.";
    const INVALID_MSG = "Enter a valid date.";
    const ORDER_MSG = "Must be after the start date.";

    // Validate a single optional date field for validity + future-only.
    const checkFuture = (field: keyof FormValues) => {
      const raw = data[field];
      if (typeof raw !== "string") return;
      const value = raw.trim();
      if (!value) return;
      if (!isValidYMD(value)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: INVALID_MSG });
      } else if (!isFutureDate(value)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: FUTURE_MSG });
      }
    };

    // Ensure an end date falls strictly after its start date.
    const checkOrder = (startField: keyof FormValues, endField: keyof FormValues) => {
      const start = (data[startField] as string | undefined)?.trim();
      const end = (data[endField] as string | undefined)?.trim();
      if (start && end && isValidYMD(start) && isValidYMD(end) && !isAfter(end, start)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [endField], message: ORDER_MSG });
      }
    };

    switch (data.serviceType) {
      case "car":
      case "chauffeur":
        checkFuture("startDate");
        checkFuture("endDate");
        checkOrder("startDate", "endDate");
        break;
      case "jet":
        checkFuture("departureDate");
        checkFuture("returnDate");
        checkOrder("departureDate", "returnDate");
        break;
      case "yacht":
      case "jet_ski":
        checkFuture("charterDate");
        break;
      case "residence":
        checkFuture("checkIn");
        checkFuture("checkOut");
        checkOrder("checkIn", "checkOut");
        break;
      case "experience":
        checkFuture("experienceDate");
        break;
      case "restaurant":
      case "nightlife":
      case "concierge":
        checkFuture("conciergeDate");
        break;
    }
  });

type FormValues = z.infer<typeof FormSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Formats an experience slug into a human title ("supercar-weekend" → "Supercar Weekend"). */
function formatExperienceSlug(slug?: string): string {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function deriveServiceType(
  vehicleSlug?: string,
  yachtSlug?: string,
  jetSlug?: string,
  residenceSlug?: string,
  experienceSlug?: string,
): ServiceValue {
  if (vehicleSlug) return "car";
  if (yachtSlug) return "yacht";
  if (jetSlug) return "jet";
  if (residenceSlug) return "residence";
  if (experienceSlug) return "experience";
  return "car";
}

/** Serialises service-specific fields into a structured message string. */
function buildServiceDetails(data: FormValues): string {
  const lines: string[] = [];
  const add = (label: string, value?: string) => {
    if (value?.trim()) lines.push(`${label}: ${value.trim()}`);
  };

  switch (data.serviceType) {
    case "car":
    case "chauffeur":
      add("Pickup", data.pickupLocation);
      add("Delivery", data.deliveryLocation);
      add("Start date", data.startDate);
      add("End date", data.endDate);
      add("Driver age", data.driverAge);
      break;
    case "jet":
      add("Departure city", data.departureCity);
      add("Arrival city", data.arrivalCity);
      add("Departure date", data.departureDate);
      add("Return date", data.returnDate);
      add("Passengers", data.passengerCount);
      break;
    case "yacht":
    case "jet_ski":
      add("Charter date", data.charterDate);
      add("Duration", data.charterDuration);
      add("Guests", data.yachtGuestCount);
      add("Preferred marina", data.preferredMarina);
      break;
    case "residence":
      add("Check-in", data.checkIn);
      add("Check-out", data.checkOut);
      add("Guests", data.residenceGuestCount);
      add("Bedrooms needed", data.bedroomsNeeded);
      break;
    case "experience":
      add("Occasion", data.occasionType);
      add("Preferred date", data.experienceDate);
      add("Guest count", data.experienceGuestCount);
      add("Location / area", data.experienceLocation);
      break;
    case "restaurant":
    case "nightlife":
    case "concierge":
      add("Request type", data.requestType);
      add("Location", data.conciergeLocation);
      add("Date", data.conciergeDate);
      break;
  }

  return lines.join("\n");
}

/** Returns the canonical primary date for the lead's start_date field. */
function getPrimaryDate(data: FormValues): string | undefined {
  switch (data.serviceType) {
    case "car":
    case "chauffeur":
      return data.startDate;
    case "jet":
      return data.departureDate;
    case "yacht":
    case "jet_ski":
      return data.charterDate;
    case "residence":
      return data.checkIn;
    case "experience":
      return data.experienceDate;
    case "restaurant":
    case "nightlife":
    case "concierge":
      return data.conciergeDate;
  }
}

/** Returns the canonical secondary (end) date for services that have a range. */
function getSecondaryDate(data: FormValues): string | undefined {
  switch (data.serviceType) {
    case "car":
    case "chauffeur":
      return data.endDate;
    case "jet":
      return data.returnDate;
    case "residence":
      return data.checkOut;
    default:
      return undefined;
  }
}

/** Returns the canonical primary location for the lead record. */
function getPrimaryLocation(data: FormValues): string | undefined {
  switch (data.serviceType) {
    case "car":
    case "chauffeur":
      return data.pickupLocation;
    case "jet":
      return data.departureCity;
    case "yacht":
    case "jet_ski":
      return data.preferredMarina;
    case "experience":
      return data.experienceLocation;
    case "restaurant":
    case "nightlife":
    case "concierge":
      return data.conciergeLocation;
    default:
      return undefined;
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  vehicleSlug?: string;
  yachtSlug?: string;
  jetSlug?: string;
  residenceSlug?: string;
  experienceSlug?: string;
  assetTitle?: string;
};

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  required,
  full,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <p className="text-ink/40 mb-2 text-[9px] uppercase tracking-[0.22em]">
        {label}
        {required && <span className="text-ink/25 ml-1">*</span>}
      </p>
      {children}
      {error && <p className="mt-1.5 text-[10px] text-red-600">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  return (
    <Field label={label} error={error}>
      <div className="relative">
        <select
          className="border-ink/30 w-full appearance-none border-b bg-transparent py-2 text-base outline-none transition-colors focus:border-ink"
          {...props}
        >
          {children}
        </select>
        <span
          aria-hidden
          className="text-ink/35 pointer-events-none absolute inset-y-0 right-0 flex items-center text-[10px]"
        >
          ↓
        </span>
      </div>
    </Field>
  );
}

// ─── Service-specific field blocks ───────────────────────────────────────────

type FieldsProps = {
  register: ReturnType<typeof useForm<FormValues>>["register"];
  errors: ReturnType<typeof useForm<FormValues>>["formState"]["errors"];
  minDate: string;
};

function CarFields({ register, errors, minDate }: FieldsProps) {
  return (
    <>
      <Field label="Pickup Location">
        <Input {...register("pickupLocation")} placeholder="Hotel name or address" />
      </Field>
      <Field label="Delivery Location">
        <Input {...register("deliveryLocation")} placeholder="Delivery address (if different)" />
      </Field>
      <Field label="Start Date" error={errors.startDate?.message}>
        <Input {...register("startDate")} type="date" min={minDate || undefined} />
      </Field>
      <Field label="End Date" error={errors.endDate?.message}>
        <Input {...register("endDate")} type="date" min={minDate || undefined} />
      </Field>
      <Field label="Driver Age">
        <Input {...register("driverAge")} placeholder="e.g. 28" />
      </Field>
    </>
  );
}

function JetFields({ register, errors, minDate }: FieldsProps) {
  return (
    <>
      <Field label="Departure City">
        <Input {...register("departureCity")} placeholder="e.g. Miami" />
      </Field>
      <Field label="Arrival City">
        <Input {...register("arrivalCity")} placeholder="e.g. New York" />
      </Field>
      <Field label="Departure Date" error={errors.departureDate?.message}>
        <Input {...register("departureDate")} type="date" min={minDate || undefined} />
      </Field>
      <Field label="Return Date" error={errors.returnDate?.message}>
        <Input {...register("returnDate")} type="date" min={minDate || undefined} />
      </Field>
      <Field label="Passenger Count">
        <Input {...register("passengerCount")} placeholder="e.g. 6" />
      </Field>
    </>
  );
}

function YachtFields({ register, errors, minDate }: FieldsProps) {
  return (
    <>
      <Field label="Charter Date" error={errors.charterDate?.message}>
        <Input {...register("charterDate")} type="date" min={minDate || undefined} />
      </Field>
      <Field label="Duration">
        <Input {...register("charterDuration")} placeholder="e.g. Half day, Full day, 3 days" />
      </Field>
      <Field label="Guest Count">
        <Input {...register("yachtGuestCount")} placeholder="e.g. 8" />
      </Field>
      <Field label="Preferred Marina">
        <Input {...register("preferredMarina")} placeholder="e.g. Bayside Marina" />
      </Field>
    </>
  );
}

function ResidenceFields({ register, errors, minDate }: FieldsProps) {
  return (
    <>
      <Field label="Check-In" error={errors.checkIn?.message}>
        <Input {...register("checkIn")} type="date" min={minDate || undefined} />
      </Field>
      <Field label="Check-Out" error={errors.checkOut?.message}>
        <Input {...register("checkOut")} type="date" min={minDate || undefined} />
      </Field>
      <Field label="Guest Count">
        <Input {...register("residenceGuestCount")} placeholder="e.g. 4" />
      </Field>
      <Field label="Bedrooms Needed">
        <Input {...register("bedroomsNeeded")} placeholder="e.g. 3" />
      </Field>
    </>
  );
}

function ExperienceFields({ register, errors, minDate }: FieldsProps) {
  return (
    <>
      <Field label="Occasion Type">
        <Input
          {...register("occasionType")}
          placeholder="e.g. Birthday, Art Basel, Supercar Weekend"
        />
      </Field>
      <Field label="Preferred Date" error={errors.experienceDate?.message}>
        <Input {...register("experienceDate")} type="date" min={minDate || undefined} />
      </Field>
      <Field label="Guest Count">
        <Input {...register("experienceGuestCount")} placeholder="e.g. 4" />
      </Field>
      <Field label="Location / Area">
        <Input {...register("experienceLocation")} placeholder="e.g. South Beach, Miami" />
      </Field>
    </>
  );
}

function ConciergeFields({ register, errors, minDate }: FieldsProps) {
  return (
    <>
      <Field label="Request Type">
        <Input
          {...register("requestType")}
          placeholder="e.g. Restaurant, VIP table, Spa, Airport transfer"
        />
      </Field>
      <Field label="Location">
        <Input {...register("conciergeLocation")} placeholder="Hotel or area in Miami" />
      </Field>
      <Field label="Date" error={errors.conciergeDate?.message}>
        <Input {...register("conciergeDate")} type="date" min={minDate || undefined} />
      </Field>
    </>
  );
}

function GenericFields({ register, errors, minDate }: FieldsProps) {
  return (
    <>
      <Field label="Date" error={errors.conciergeDate?.message}>
        <Input {...register("conciergeDate")} type="date" min={minDate || undefined} />
      </Field>
      <Field label="Location">
        <Input {...register("conciergeLocation")} placeholder="Hotel name, area, or marina" />
      </Field>
    </>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export default function RequestForm({
  vehicleSlug,
  yachtSlug,
  jetSlug,
  residenceSlug,
  experienceSlug,
  assetTitle,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Minimum selectable date = tomorrow (business tz). Computed synchronously so the
  // `min` attribute is present on the very first paint, not just after mount.
  const [minDate] = useState(() => getTomorrowDateString());

  const assetSlug = vehicleSlug ?? yachtSlug ?? jetSlug ?? residenceSlug ?? experienceSlug;

  // Fire request_click once on mount — signals the user reached the form
  // from a specific asset or experience CTA.
  useEffect(() => {
    if (vehicleSlug) trackVehicleRequest(vehicleSlug);
    else if (yachtSlug) trackYachtRequest(yachtSlug);
    else if (jetSlug) trackJetRequest(jetSlug);
    else if (residenceSlug) trackResidenceRequest(residenceSlug);
    else if (experienceSlug) trackExperienceRequest(experienceSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      serviceType: deriveServiceType(
        vehicleSlug,
        yachtSlug,
        jetSlug,
        residenceSlug,
        experienceSlug,
      ),
      // Pre-populate occasion from experience slug ("supercar-weekend" → "Supercar Weekend")
      occasionType: formatExperienceSlug(experienceSlug),
    },
  });

  const serviceType = watch("serviceType");

  async function onSubmit(data: FormValues) {
    // Submit-time guard — runs regardless of input `min` support or resolver state.
    const primaryDate = normalizeDateOrNull(getPrimaryDate(data));
    const secondaryDate = normalizeDateOrNull(getSecondaryDate(data));
    const dateError = validateDateRange(primaryDate, secondaryDate);
    if (dateError) {
      setStatus("error");
      setErrorMsg(dateError);
      return;
    }

    setStatus("loading");
    setErrorMsg(null);
    trackFormSubmit(data.serviceType);

    const serviceDetails = buildServiceDetails(data);
    const combinedNotes = [serviceDetails, data.notes?.trim()].filter(Boolean).join("\n\n");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          serviceType: data.serviceType,
          assetSlug,
          assetTitle,
          preferredDate: primaryDate ?? undefined,
          preferredEndDate: secondaryDate ?? undefined,
          location: getPrimaryLocation(data),
          notes: combinedNotes || undefined,
        }),
      });

      if (res.status === 400) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        setStatus("error");
        setErrorMsg(body?.message ?? "Please check your dates and try again.");
        return;
      }
      if (!res.ok) throw new Error("server_error");

      // Conversion events
      trackFormSuccess(data.serviceType);
      if (vehicleSlug) trackVehicleLead(vehicleSlug);
      else if (yachtSlug) trackYachtLead(yachtSlug);
      else if (jetSlug) trackJetLead(jetSlug);
      else if (residenceSlug) trackResidenceLead(residenceSlug);
      else if (experienceSlug) trackExperienceLead(experienceSlug);
      else if (
        data.serviceType === "concierge" ||
        data.serviceType === "restaurant" ||
        data.serviceType === "nightlife"
      )
        trackConciergeLead();

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or reach us directly.");
    }
  }

  // ── Success ─────────────────────────────────────────────────────────────────

  if (status === "success") {
    return (
      <div className="border-ink/10 mt-12 border-t pt-10">
        <p className="text-ink/35 text-[9px] uppercase tracking-[0.24em]">Request received</p>
        <p className="mt-5 max-w-lg font-display text-3xl leading-tight sm:text-4xl">
          A Pulse specialist will be in touch within 15 minutes.
        </p>
        <p className="text-ink/55 mt-5 max-w-sm text-sm leading-relaxed">
          Keep your phone nearby. We&apos;ll confirm availability and send your quote directly.
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
        {/* Always-present contact fields */}
        <Field label="Full Name" error={errors.fullName?.message} required>
          <Input {...register("fullName")} placeholder="First & last name" autoComplete="name" />
        </Field>

        <Field label="Email" error={errors.email?.message} required>
          <Input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Phone" error={errors.phone?.message}>
          <Input
            {...register("phone")}
            type="tel"
            placeholder="+1 (305) 000-0000"
            autoComplete="tel"
          />
        </Field>

        <SelectField
          label="Service"
          error={errors.serviceType?.message}
          {...register("serviceType")}
        >
          {SERVICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectField>

        {/* Service-specific fields */}
        {(serviceType === "car" || serviceType === "chauffeur") && (
          <CarFields register={register} errors={errors} minDate={minDate} />
        )}
        {serviceType === "jet" && (
          <JetFields register={register} errors={errors} minDate={minDate} />
        )}
        {(serviceType === "yacht" || serviceType === "jet_ski") && (
          <YachtFields register={register} errors={errors} minDate={minDate} />
        )}
        {serviceType === "residence" && (
          <ResidenceFields register={register} errors={errors} minDate={minDate} />
        )}
        {serviceType === "experience" && (
          <ExperienceFields register={register} errors={errors} minDate={minDate} />
        )}
        {(serviceType === "concierge" ||
          serviceType === "restaurant" ||
          serviceType === "nightlife") && (
          <ConciergeFields register={register} errors={errors} minDate={minDate} />
        )}
        {/* Fallback for any unrecognised value */}
        {serviceType !== "car" &&
          serviceType !== "chauffeur" &&
          serviceType !== "jet" &&
          serviceType !== "yacht" &&
          serviceType !== "jet_ski" &&
          serviceType !== "residence" &&
          serviceType !== "experience" &&
          serviceType !== "concierge" &&
          serviceType !== "restaurant" &&
          serviceType !== "nightlife" && (
            <GenericFields register={register} errors={errors} minDate={minDate} />
          )}

        {/* Notes — always last, always full width */}
        <Field label="Additional Notes" error={errors.notes?.message} full>
          <Textarea
            {...register("notes")}
            rows={4}
            placeholder="Anything else we should know: special requests, add-ons, preferences."
          />
        </Field>
      </div>

      {status === "error" && errorMsg && <p className="mt-6 text-sm text-red-600">{errorMsg}</p>}

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
