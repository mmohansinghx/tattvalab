import type { Metadata } from "next";
import { SubjectLanding } from "@/components/subject-landing";

export const metadata: Metadata = { title: "Basic Electrical & Electronics · Graduation" };

export default function BasicElectricalPage() { return <SubjectLanding subject="basic-electrical" />; }
