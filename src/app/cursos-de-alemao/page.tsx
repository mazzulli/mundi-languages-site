import { LanguagePage, languagePageMetadata } from "@/components/pages/language-page";

export const metadata = languagePageMetadata("de");

export default function Page() {
  return <LanguagePage code="de" />;
}
