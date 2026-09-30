import { LanguagePage, languagePageMetadata } from "@/components/pages/language-page";

export const metadata = languagePageMetadata("it");

export default function Page() {
  return <LanguagePage code="it" />;
}
