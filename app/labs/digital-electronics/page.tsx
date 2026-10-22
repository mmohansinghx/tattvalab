import type { Metadata } from "next";
import { SubjectLanding } from "@/components/subject-landing";

export const metadata: Metadata = { title: "Digital Electronics" };
export default function DigitalElectronicsPage() { return <SubjectLanding subject="digital-electronics" />; }
