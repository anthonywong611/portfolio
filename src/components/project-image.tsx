import Image from "next/image";
import { cn } from "@/lib/utils";
import { Project } from "@/types";

/**
 * Project screenshot/diagram, or a placeholder when the project has no image.
 * The image is shown whole (`object-contain`) on a white frame so diagrams with
 * an opaque white background read as a deliberate figure in both themes.
 */
export function ProjectImage({
  project,
  sizes,
  className,
  placeholderLabel = "Screenshot",
  preload = false,
}: {
  project: Project;
  /** `sizes` hint for next/image; match the rendered width of the frame. */
  sizes: string;
  /** Frame classes: height, rounding, border, spacing. */
  className?: string;
  placeholderLabel?: string;
  /** Preload when this is the page's largest image (LCP). */
  preload?: boolean;
}) {
  if (!project.image) {
    return (
      <div className={cn("overflow-hidden bg-muted", className)}>
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          {placeholderLabel}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden bg-white p-2", className)}>
      <div className="relative h-full w-full">
        <Image
          src={project.image}
          alt={project.imageAlt ?? `${project.title} screenshot`}
          fill
          sizes={sizes}
          preload={preload}
          className="object-contain"
        />
      </div>
    </div>
  );
}
