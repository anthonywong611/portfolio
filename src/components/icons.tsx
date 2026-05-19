import { type ComponentType } from "react";
import { Database } from "lucide-react";
import { Building2 } from "lucide-react";
import { GraduationCap } from "lucide-react";
import { FaMicrosoft } from "react-icons/fa";
import {
  SiPython,
  SiApachespark,
  SiDatabricks,
  SiGooglecloud,
  SiGooglebigquery,
  SiScala,
  SiUnilever,
} from "react-icons/si";

type IconProps = { className?: string };

const iconMap: Record<string, ComponentType<IconProps>> = {
  // Skills
  Python: SiPython,
  SQL: Database,
  "Apache Spark": SiApachespark,
  Databricks: SiDatabricks,
  GCP: SiGooglecloud,
  Azure: FaMicrosoft,
  "Vertex AI": SiGooglecloud,
  BigQuery: SiGooglebigquery,
  PySpark: SiApachespark,
  Scala: SiScala,

  // Companies
  "Unilever Canada": SiUnilever,
  "Export Development Canada": Building2,

  // Institutions
  "University of Toronto (St. George)": GraduationCap,
};

export function BrandIcon({
  name,
  className = "h-4 w-4",
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}
