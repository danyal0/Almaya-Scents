import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  className?: string;
};

/** Quiet shimmer block shown while media resolves (e.g. in the lightbox). */
export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton h-full w-full", className)}
    />
  );
}
