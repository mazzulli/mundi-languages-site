"use client";

import type { ReactNode } from "react";
import { Controller, useFormContext, type FieldError } from "react-hook-form";

import { cx } from "@/lib/utils";
import { otherKey } from "@/lib/needs-analysis/schema";
import type { NeedsAnalysisField } from "@content/needs-analysis";

const errorId = (id: string) => `${id}-error`;

/** Reads a (possibly nested) error message for a field. */
function useFieldError(name: string): string | undefined {
  const {
    formState: { errors },
  } = useFormContext();
  const error = errors[name] as (FieldError & Record<string, FieldError>) | undefined;
  if (!error) return undefined;
  if (error.message) return error.message;
  // Grid: nested row errors → one message for the whole question.
  const nested = Object.values(error).find(
    (item) => item && typeof item === "object" && "message" in item,
  );
  return (nested as FieldError | undefined)?.message;
}

export function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={errorId(id)} role="alert" className="text-lang-es mt-2 text-sm font-medium">
      {message}
    </p>
  );
}

const inputClass =
  "mt-2 w-full rounded-2xl border border-ink-900/15 bg-paper px-4 py-3 text-base text-ink-950 outline-none transition-colors placeholder:text-muted/70 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 aria-invalid:border-lang-es";

const chipClass = cx(
  "relative inline-flex cursor-pointer items-center rounded-full border border-ink-900/15 bg-paper px-4 py-2 text-sm font-medium text-ink-900 transition-colors select-none",
  "hover:border-brand-primary has-checked:border-ink-950 has-checked:bg-ink-950 has-checked:text-paper",
  "has-focus-visible:ring-2 has-focus-visible:ring-sunrise-deep has-focus-visible:ring-offset-2",
);

function Legend({ field, children }: { field: NeedsAnalysisField; children?: ReactNode }) {
  return (
    <legend className="font-display text-ink-950 text-lg">
      {field.label}
      {field.required ? (
        <span aria-hidden className="text-sunrise-deep">
          {" "}
          *
        </span>
      ) : (
        <span className="text-muted ml-2 font-sans text-sm">(opcional)</span>
      )}
      {children}
    </legend>
  );
}

function TextInputField({
  field,
}: {
  field: Extract<NeedsAnalysisField, { type: "email" | "text" | "date" | "tel" | "textarea" }>;
}) {
  const { register } = useFormContext();
  const message = useFieldError(field.id);
  const common = {
    id: field.id,
    "aria-invalid": message ? true : undefined,
    "aria-describedby": message ? errorId(field.id) : undefined,
    "aria-required": field.required || undefined,
    className: inputClass,
    ...register(field.id),
  };
  const autoComplete = {
    email: "email",
    name: "name",
    country: "country-name",
    whatsapp: "tel",
    company: "organization",
  }[field.id];
  return (
    <div>
      <label htmlFor={field.id} className="font-display text-ink-950 text-lg">
        {field.label}
        {field.required ? (
          <span aria-hidden className="text-sunrise-deep">
            {" "}
            *
          </span>
        ) : (
          <span className="text-muted ml-2 font-sans text-sm">(opcional)</span>
        )}
      </label>
      {field.type === "textarea" ? (
        <textarea rows={4} {...common} />
      ) : (
        <input
          type={field.type === "tel" ? "tel" : field.type}
          autoComplete={autoComplete}
          inputMode={field.type === "tel" ? "tel" : undefined}
          {...common}
        />
      )}
      <ErrorText id={field.id} message={message} />
    </div>
  );
}

function OtherInput({ fieldId, visible }: { fieldId: string; visible: boolean }) {
  const { register } = useFormContext();
  const name = otherKey(fieldId);
  const message = useFieldError(name);
  if (!visible) return null;
  return (
    <div className="mt-3 max-w-md">
      <label htmlFor={name} className="text-ink-900 text-sm font-medium">
        Qual?
      </label>
      <input
        id={name}
        className={inputClass}
        aria-invalid={message ? true : undefined}
        aria-describedby={message ? errorId(name) : undefined}
        {...register(name)}
      />
      <ErrorText id={name} message={message} />
    </div>
  );
}

function ChoiceField({
  field,
}: {
  field: Extract<NeedsAnalysisField, { type: "single" | "multiple" | "yes-no" }>;
}) {
  const { register, watch } = useFormContext();
  const message = useFieldError(field.id);
  const options = field.type === "yes-no" ? ["Sim", "Não"] : field.options;
  const multiple = field.type === "multiple";
  const value = watch(field.id) as string | string[];
  const otherSelected = multiple ? (value as string[])?.includes("Outro") : value === "Outro";

  return (
    <fieldset
      aria-describedby={message ? errorId(field.id) : undefined}
      aria-invalid={message ? true : undefined}
    >
      <Legend field={field}>
        {multiple && (
          <span className="text-muted mt-1 block font-sans text-sm">
            Marque todas as que se aplicam.
          </span>
        )}
      </Legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className={chipClass}>
            <input
              type={multiple ? "checkbox" : "radio"}
              value={option}
              className="sr-only"
              {...register(field.id)}
            />
            {option}
          </label>
        ))}
      </div>
      <ErrorText id={field.id} message={message} />
      <OtherInput
        fieldId={field.id}
        visible={otherSelected && "options" in field && field.options.includes("Outro")}
      />
    </fieldset>
  );
}

function GridField({ field }: { field: Extract<NeedsAnalysisField, { type: "grid" }> }) {
  const { control } = useFormContext();
  const message = useFieldError(field.id);
  const scale = field.columns.every((column) => typeof column === "number");

  return (
    <fieldset aria-describedby={message ? errorId(field.id) : undefined}>
      <Legend field={field} />
      <Controller
        control={control}
        name={field.id}
        render={({ field: { value, onChange } }) => {
          const answers = (value as Record<string, string>) ?? {};
          return (
            <div className="mt-4 grid gap-3">
              {field.rows.map((row) => (
                <div
                  key={row}
                  role="radiogroup"
                  aria-label={row}
                  className="bg-paper ring-ink-900/10 flex flex-col gap-2 rounded-2xl p-4 ring-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-ink-950 text-sm font-semibold sm:w-44">{row}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {field.columns.map((column) => {
                      const option = String(column);
                      return (
                        <label
                          key={option}
                          className={cx(chipClass, scale && "min-w-11 justify-center")}
                        >
                          <input
                            type="radio"
                            name={`${field.id}-${row}`}
                            value={option}
                            checked={answers[row] === option}
                            onChange={() => onChange({ ...answers, [row]: option })}
                            className="sr-only"
                          />
                          {option}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        }}
      />
      <ErrorText id={field.id} message={message} />
    </fieldset>
  );
}

function ScheduleField({ field }: { field: Extract<NeedsAnalysisField, { type: "schedule" }> }) {
  const { control } = useFormContext();
  return (
    <fieldset>
      <Legend field={field}>
        <span className="text-muted mt-1 block font-sans text-sm">
          Toque nos horários em que prefere ser contactado(a).
        </span>
      </Legend>
      <Controller
        control={control}
        name={field.id}
        render={({ field: { value, onChange } }) => {
          const selected = new Set((value as string[]) ?? []);
          const toggle = (slot: string) => {
            const next = new Set(selected);
            if (next.has(slot)) next.delete(slot);
            else next.add(slot);
            onChange([...next]);
          };
          return (
            <div className="mt-4 grid gap-3">
              {field.days.map((day) => (
                <div key={day} className="bg-paper ring-ink-900/10 rounded-2xl p-4 ring-1">
                  <p className="text-ink-950 text-sm font-semibold">{day}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {field.times.map((time) => {
                      const slot = `${day} ${time}`;
                      const on = selected.has(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          aria-pressed={on}
                          aria-label={`${day} às ${time}`}
                          onClick={() => toggle(slot)}
                          className={cx(
                            "rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums transition-colors",
                            on
                              ? "border-ink-950 bg-ink-950 text-paper"
                              : "border-ink-900/15 text-ink-900 hover:border-brand-primary",
                          )}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        }}
      />
    </fieldset>
  );
}

/** Renders any field of the needs analysis form from its content definition. */
export function FormField({ field }: { field: NeedsAnalysisField }) {
  switch (field.type) {
    case "yes-no":
    case "single":
    case "multiple":
      return <ChoiceField field={field} />;
    case "grid":
      return <GridField field={field} />;
    case "schedule":
      return <ScheduleField field={field} />;
    default:
      return <TextInputField field={field} />;
  }
}
