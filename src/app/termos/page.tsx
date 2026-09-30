import { LegalPage, legalMetadata } from "@/components/pages/legal-page";

export const metadata = legalMetadata("terms");

export default function Page() {
  return <LegalPage page="terms" />;
}
