import { LegalPage, legalMetadata } from "@/components/pages/legal-page";

export const metadata = legalMetadata("privacy");

export default function Page() {
  return <LegalPage page="privacy" />;
}
