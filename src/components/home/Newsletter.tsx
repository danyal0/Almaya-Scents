"use client";

import { useId, useState } from "react";

import { almayaContent } from "@/content/almaya-content";
import { siteConfig } from "@/content/site-config";
import { isValidEmail } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Newsletter signup for a static host. Submission posts to the endpoint
 * configured via NEXT_PUBLIC_NEWSLETTER_ENDPOINT (Formspree, Buttondown,
 * etc.). When no endpoint is configured, the form is shown disabled with
 * an honest note — no fake success states, no technical errors.
 */
export function Newsletter() {
  const { newsletter } = almayaContent;
  const endpoint = siteConfig.newsletterEndpoint;
  const configured = endpoint.length > 0;

  const inputId = useId();
  const errorId = useId();

  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || status === "submitting") return;

    if (!isValidEmail(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    setValidationError(null);
    setStatus("submitting");

    try {
      const body = new FormData();
      body.append("email", email);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });

      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="section-gap border-t border-line"
    >
      <div className="container-editorial">
        <Reveal>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <h2
              id="newsletter-heading"
              className="font-serif text-display-m font-light text-ink"
            >
              {newsletter.title}
            </h2>
            <p className="max-w-lg text-body-sm text-muted">
              {newsletter.description}
            </p>

            <div aria-live="polite" className="w-full">
              {status === "success" ? (
                <p className="py-6 font-serif text-heading font-light italic text-ink">
                  Thank you — you are on the list.
                </p>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mx-auto mt-4 w-full max-w-lg"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex flex-1 flex-col items-start gap-2">
                      <label htmlFor={inputId} className="eyebrow">
                        Email address
                      </label>
                      <input
                        id={inputId}
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        disabled={!configured}
                        aria-invalid={validationError ? true : undefined}
                        aria-describedby={validationError ? errorId : undefined}
                        placeholder="you@example.com"
                        className="min-h-11 w-full border-b border-line-strong bg-transparent pb-2 font-sans text-body text-ink outline-none transition-colors duration-[250ms] placeholder:text-muted/60 focus:border-ink disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!configured || status === "submitting"}
                      className="inline-flex min-h-11 items-center justify-center bg-ink px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ivory transition-colors duration-[250ms] hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {status === "submitting" ? "Subscribing…" : "Subscribe"}
                    </button>
                  </div>

                  {validationError ? (
                    <p
                      id={errorId}
                      role="alert"
                      className="mt-3 text-left text-body-sm text-ink"
                    >
                      {validationError}
                    </p>
                  ) : null}

                  {status === "error" ? (
                    <p role="alert" className="mt-3 text-left text-body-sm text-ink">
                      Something didn&apos;t go through. Please try again in a
                      moment, or reach us on Instagram.
                    </p>
                  ) : null}

                  {!configured ? (
                    <p className="mt-4 text-body-sm text-muted">
                      Newsletter sign-up opens soon. Until then, follow{" "}
                      <a
                        href={siteConfig.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 hover:text-ink"
                      >
                        {siteConfig.instagramHandle}
                      </a>{" "}
                      for news from the house.
                    </p>
                  ) : null}
                </form>
              )}
            </div>

            {configured && status !== "success" ? (
              <p className="max-w-md text-meta tracking-[0.02em] text-muted">
                {newsletter.consent}
              </p>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
