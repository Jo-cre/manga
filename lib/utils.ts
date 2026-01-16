import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFlagByCode = (code: string): string | null => {
  const specialCases: Record<string, string> = {
    en: "gb",
    uk: "ua",
    vi: "vn",
    ru: "ru",
    fr: "fr",
    id: "id",
    es: "es",
    ar: "sa",
    pl: "pl",
    fa: "ir",
    de: "de",
    it: "it",
    tr: "tr",
    hu: "hu",
    nl: "nl",
    cs: "cz",
    sv: "se",
    fi: "fi",
    kk: "kz",
    ro: "ro",
    mn: "mn",
    th: "th",
    bg: "bg",
    ms: "my",
    la: "va",
    hr: "hr",
    tl: "ph",
    el: "gr",
    ur: "pk",
    zh: "cn",
    ja: "jp",
    ko: "kr",
    sa: "sa",
    sr: "sr",
    ta: "tam",
    "pt-pt": "pt",
    "pt-br": "br",
    "es-la": "mx",
    "zh-hk": "hk",
    "ja-ro": "jp",
    "ko-ro": "kr",
  };

  const countryCode = specialCases[code.toLowerCase()];
  return countryCode
    ? `https://mangadex.org/img/flags/${countryCode.toLowerCase()}.svg`
    : null;
};
