import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

async function renderNewsletter(endpoint: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_ENDPOINT", endpoint);
  const { Newsletter } = await import("@/components/home/Newsletter");
  render(<Newsletter />);
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("Newsletter without a configured endpoint", () => {
  it("disables submission and explains why, without technical errors", async () => {
    await renderNewsletter("");

    expect(screen.getByLabelText(/email address/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeDisabled();
    expect(
      screen.getByText(/newsletter sign-up opens soon/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("Newsletter with a configured endpoint", () => {
  it("shows an accessible validation error for an invalid email", async () => {
    await renderNewsletter("https://example.com/subscribe");
    const user = userEvent.setup();

    const input = screen.getByLabelText(/email address/i);
    await user.type(input, "not-an-email");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent(/valid email/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", error.id);
  });

  it("submits a valid email and shows the success state", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true } as Response);
    vi.stubGlobal("fetch", fetchMock);

    await renderNewsletter("https://example.com/subscribe");
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/email address/i),
      "reader@almaya.example",
    );
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await waitFor(() =>
      expect(screen.getByText(/thank you/i)).toBeInTheDocument(),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/subscribe",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("shows a friendly message when the endpoint fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );

    await renderNewsletter("https://example.com/subscribe");
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/email address/i),
      "reader@almaya.example",
    );
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent(/didn't go through/i);
    expect(error).not.toHaveTextContent(/network down/i);
  });
});
