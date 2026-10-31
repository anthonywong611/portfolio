import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "complaint-canary",
    title: "Complaint Canary",
    summary: 
      "Memoryless CFPB complaint data captured into SCD2 history with weekly fraud signals.",
    description:
      "A daily ELT pipeline on GCP that turns the CFPB complaint database, which ships with no change history, into SCD2 history and weekly fraud signals, promoted through DEV, QA and PROD as one tested image.",
    image: "/images/projects/complaint-canary.png",
    imageAlt:
      "Complaint Canary architecture: CFPB, FDIC and Census sources feed a Dagster and dbt pipeline on a Compute Engine VM, which loads Cloud Storage and BigQuery, with Cloud Logging and Monitoring sending on-call alerts.",
    techStack: ["Python", "BigQuery", "dbt", "Dagster", "Terraform", "Docker", "DuckDB"],
    githubUrl: "https://github.com/anthonywong611/complaint-canary",
    liveUrl: undefined,
  },
];
