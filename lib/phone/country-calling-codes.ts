import { getCountries, getCountryCallingCode } from "libphonenumber-js";

export type CountryCallingCode = {
  iso2: string;
  name: string;
  calling_code: string;
};

let cached: CountryCallingCode[] | null = null;

export function getCountryCallingCodes(): CountryCallingCode[] {
  if (cached) return cached;

  const displayNames =
    typeof Intl !== "undefined" && typeof Intl.DisplayNames !== "undefined"
      ? new Intl.DisplayNames(["en"], { type: "region" })
      : null;

  const list = getCountries()
    .map((iso2) => {
      const callingCode = getCountryCallingCode(iso2);
      const name = (displayNames ? displayNames.of(iso2) : iso2) || iso2;
      return {
        iso2,
        name,
        calling_code: callingCode,
      };
    })
    .sort((a, b) => {
      if (a.name !== b.name) return a.name.localeCompare(b.name);
      return a.iso2.localeCompare(b.iso2);
    });

  cached = list;
  return list;
}

export function findCountryByIso2(iso2: string) {
  const key = iso2.trim().toUpperCase();
  return getCountryCallingCodes().find((c) => c.iso2 === key) || null;
}

export function detectDefaultCountryIso2() {
  if (typeof navigator === "undefined") return "NG";
  const locales = [navigator.language, ...(navigator.languages || [])]
    .filter(Boolean)
    .map((l) => l.trim());
  for (const loc of locales) {
    const parts = loc.split("-");
    const region = parts[1]?.toUpperCase();
    if (region && findCountryByIso2(region)) return region;
  }
  return "NG";
}
