import { LanguagePage, languagePageMetadata } from "@/components/pages/language-page";

export const metadata = languagePageMetadata("fr");

export default function Page() {
  return <LanguagePage code="fr" />;
}
