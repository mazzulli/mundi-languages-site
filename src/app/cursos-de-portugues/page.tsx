import { LanguagePage, languagePageMetadata } from "@/components/pages/language-page";

export const metadata = languagePageMetadata("pt");

export default function Page() {
  return <LanguagePage code="pt" />;
}
