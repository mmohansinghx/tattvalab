import type { Metadata } from "next";
import { SubjectLanding } from "@/components/subject-landing";

export const metadata: Metadata = { title: "Physics · Graduation" };

export default function PhysicsPage() { return <SubjectLanding subject="physics" />; }
