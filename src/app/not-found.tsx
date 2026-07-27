import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="section-gap">
      <div className="container-editorial">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 py-20 text-center md:py-32">
          <p className="eyebrow">404</p>
          <h1 className="font-serif text-display-m font-light text-ink">
            This page has drifted away.
          </h1>
          <p className="max-w-md text-body-sm text-muted">
            The page you are looking for doesn&apos;t exist or has moved.
            Return to the collection and continue exploring.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/">Back to Home</Button>
            <Button href="/products/" variant="outline">
              View the Collection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
