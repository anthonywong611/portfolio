import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    title: "Agentic Data Engineer",
    company: "Unilever Canada",
    period: "Jan 2025 — Present",
    summary:
      "Leading AI-powered data solutions at Horizon3 AI Labs, building RAG systems, event-driven pipelines, and text-to-SQL agents for internal business use cases across procurement, logistics, and forecasting.",
    skills: ["Python", "Vertex AI", "BigQuery", "PySpark", "GCP"],
    milestones: [
      "Automated scraping and vectorization of unstructured reports for RAG-powered semantic search",
      "Designed event-driven data ingestion with Cloud Run and Pub/Sub, optimizing 65% of source updates",
      "Built SQL query templates for 20+ logistics KPIs, boosting text-to-SQL accuracy by 90%",
      "Modelled Medallion Architecture for quality-assured GQL data with Dataflow and Cloud Spanner",
    ],
    current: true,
  },
  {
    title: "Data Engineer",
    company: "Export Development Canada",
    period: "Jan 2023 — Jun 2024",
    summary:
      "Spearheaded migration of the Centralized Insurance Data Mart to Azure Databricks, automating data governance practices and optimizing pipeline performance using Python, SQL, and Apache Spark.",
    skills: ["Python", "SQL", "Apache Spark", "Scala", "Azure"],
    milestones: [
      "Migrated CIDM to Enterprise Data Platform, eliminating $600K+ in technical debt",
      "Automated data quality processes with Scala, slashing annual DQ cost by 58%",
      "Optimized DLT pipelines with Unity Catalog, reducing workflow runtime by 40%",
      "Led data source switching project achieving 99.4% consistency across sources",
    ],
    current: false,
  },
];
