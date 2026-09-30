/**
 * Animated counters (spec §4.4) — ONLY numbers computed from the content itself.
 * TODO(cliente): real business numbers (students, companies, years) are pending (spec §11.5)
 * and must not be added until confirmed.
 */
import { cities, countries } from "./cities";
import { languageList } from "./languages";
import { teachersPage } from "./teachers";

export const stats = [
  { value: languageList.length, label: "idiomas" },
  { value: teachersPage.programs.length, label: "programas para professores" },
  { value: cities.length, label: `cidades em ${countries.length} países` },
] as const;
