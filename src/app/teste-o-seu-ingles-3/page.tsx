import { LevelTestPage, levelTestMetadata } from "@/components/pages/level-test-page";

export const metadata = levelTestMetadata("en");

export default function Page() {
  return <LevelTestPage language="en" />;
}
