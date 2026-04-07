"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  detectDefaultCountryIso2,
  findCountryByIso2,
  getCountryCallingCodes,
} from "@/lib/phone/country-calling-codes";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  inputId?: string;
  placeholder?: string;
  className?: string;
};

function splitE164(value: string, callingCodes: string[]) {
  const raw = value.trim();
  if (!raw.startsWith("+")) return null;
  const digits = raw.replace(/[^\d]/g, "");
  // Remove the `digits.length < 8` check — it was wiping partial input

  const candidates = [...callingCodes].sort((a, b) => b.length - a.length);

  for (const cc of candidates) {
    if (digits.startsWith(cc)) {
      return { callingCode: cc, national: digits.slice(cc.length) };
    }
  }

  return { callingCode: digits.slice(0, 3), national: digits.slice(3) };
}

export function PhoneNumberInput({
  value,
  onChange,
  disabled,
  inputId,
  placeholder,
  className,
}: Props) {
  const [iso2State, setIso2State] = useState<string>(() =>
    detectDefaultCountryIso2(),
  );

  const countries = useMemo(() => getCountryCallingCodes(), []);
  const callingCodes = useMemo(
    () => Array.from(new Set(countries.map((c) => c.calling_code))),
    [countries],
  );

  const parsed = useMemo(
    () => splitE164(value, callingCodes),
    [callingCodes, value],
  );

  const iso2 = useMemo(() => {
    if (!parsed) return iso2State;
    const match =
      countries.find((c) => c.calling_code === parsed.callingCode) || null;
    return match?.iso2 || iso2State;
  }, [countries, iso2State, parsed]);

  const callingCode = useMemo(() => {
    const selected = findCountryByIso2(iso2);
    if (selected) return selected.calling_code;
    return findCountryByIso2("NG")?.calling_code || "234";
  }, [iso2]);

  const national = useMemo(() => parsed?.national || "", [parsed]);

  return (
    <div className={cn("flex gap-3", className)}>
      <div className="flex flex-col gap-2">
        <select
          value={iso2}
          onChange={(e) => {
            const nextIso2 = e.target.value;
            const nextSelected = findCountryByIso2(nextIso2);
            const nextCallingCode = nextSelected?.calling_code || callingCode;
            setIso2State(nextIso2);
            const e164 = `+${nextCallingCode}${national}`.replace(
              /[^\d+]/g,
              "",
            );
            onChange(e164);
          }}
          disabled={disabled}
          className={cn(
            "h-11 rounded-xl border border-border bg-background px-3 text-sm w-[160px]",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {countries.map((c) => (
            <option key={c.iso2} value={c.iso2}>
              {c.name} (+{c.calling_code})
            </option>
          ))}
        </select>
      </div>

      <Input
        id={inputId}
        type="tel"
        value={national}
        onChange={(e) => {
          const next = e.target.value.replace(/[^\d]/g, "");
          const e164 = `+${callingCode}${next}`.replace(/[^\d+]/g, "");
          onChange(e164);
        }}
        placeholder={placeholder || "Phone number"}
        className="rounded-xl h-11"
        disabled={disabled}
      />
    </div>
  );
}
