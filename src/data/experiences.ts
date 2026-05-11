import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    title: "Senior Data Engineer",
    period: "Jan 2025 — Present",
    summary:
      "Led migration of legacy ETL pipelines to a modern streaming architecture, reducing data latency from hours to minutes and improving reliability across 12 downstream services.",
    skills: ["Python", "Apache Kafka", "dbt", "Snowflake"],
    milestones: [
      "Reduced pipeline failure rate by 73%",
      "Migrated 40+ batch jobs to real-time streaming",
      "Built internal monitoring dashboard used by 3 teams",
    ],
    current: true,
  },
  {
    title: "Full Stack Developer",
    period: "Jun 2023 — Dec 2024",
    summary:
      "Built and maintained customer-facing React applications and Node.js microservices, collaborating with design and product teams to ship features on a two-week sprint cycle.",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    milestones: [
      "Shipped checkout redesign that increased conversion by 12%",
      "Introduced end-to-end testing, catching 30+ bugs pre-release",
      "Mentored 2 junior developers through onboarding",
    ],
    current: false,
  },
  {
    title: "Data Analyst Intern",
    period: "Jan 2023 — May 2023",
    summary:
      "Analyzed customer behavior data to identify churn patterns and built dashboards that informed the retention team's quarterly strategy.",
    skills: ["Python", "SQL", "Tableau", "Pandas"],
    milestones: [
      "Built churn prediction model with 84% accuracy",
      "Created 5 executive dashboards adopted company-wide",
      "Presented findings to C-suite, leading to new retention program",
    ],
    current: false,
  },
];
