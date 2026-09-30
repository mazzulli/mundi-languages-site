import { LanguagePage, languagePageMetadata } from "@/components/pages/language-page";

export const metadata = languagePageMetadata("en");

export default function Page() {
  return <LanguagePage code="en" />;
}
