export type SubjectId = "physics" | "basic-electrical" | "digital-electronics";

export const subjects: Record<SubjectId, { title: string; shortTitle: string; description: string; number: string }> = {
  physics: {
    title: "Physics",
    shortTitle: "Physics",
    description: "Graduation-level Physics collection. Lab content is being prepared.",
    number: "01",
  },
  "basic-electrical": {
    title: "Basic Electrical & Electronics",
    shortTitle: "Basic Electrical & Electronics",
    description: "Graduation-level Basic Electrical & Electronics collection. Lab content is being prepared.",
    number: "02",
  },
  "digital-electronics": {
    title: "Digital Electronics",
    shortTitle: "Digital Electronics",
    description: "Explore ten core Digital Electronics experiments, from logic families to counters and registers.",
    number: "03",
  },
};
