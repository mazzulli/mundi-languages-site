import { LanguagePage, languagePageMetadata } from "@/components/pages/language-page";

export const metadata = languagePageMetadata("es");

export default function Page() {
  return <LanguagePage code="es" />;
}
