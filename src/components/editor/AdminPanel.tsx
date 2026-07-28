"use client";

import { useMemo, useState } from "react";

import {
  AUTH_STORAGE_KEY,
  GITHUB_SETTINGS_STORAGE_KEY,
  OVERRIDES_FILE_PATH,
  PASSWORD_STORAGE_KEY,
  resolvePublicPath,
  normalizeOverrides,
  readStoredOverrides,
  writeStoredOverrides,
} from "@/lib/edit-overrides";

type GithubSettings = {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  filePath: string;
};

const DEFAULT_GITHUB_SETTINGS: GithubSettings = {
  owner: "",
  repo: "",
  branch: "main",
  token: "",
  filePath: "public/content-overrides.json",
};

function readGithubSettings(): GithubSettings {
  if (typeof window === "undefined") return DEFAULT_GITHUB_SETTINGS;
  const raw = window.localStorage.getItem(GITHUB_SETTINGS_STORAGE_KEY);
  if (!raw) return DEFAULT_GITHUB_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as Partial<GithubSettings>;
    return {
      owner: parsed.owner ?? "",
      repo: parsed.repo ?? "",
      branch: parsed.branch ?? "main",
      token: parsed.token ?? "",
      filePath: parsed.filePath ?? "public/content-overrides.json",
    };
  } catch {
    return DEFAULT_GITHUB_SETTINGS;
  }
}

function toBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return window.btoa(binary);
}

export function AdminPanel() {
  const initialHasPassword =
    typeof window !== "undefined" &&
    Boolean(window.localStorage.getItem(PASSWORD_STORAGE_KEY));
  const initialAuthed =
    typeof window !== "undefined" &&
    window.localStorage.getItem(AUTH_STORAGE_KEY) === "1";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [status, setStatus] = useState("");
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(readStoredOverrides(), null, 2),
  );
  const [github, setGithub] = useState<GithubSettings>(readGithubSettings);
  const [hasPassword, setHasPassword] = useState(initialHasPassword);
  const [authed, setAuthed] = useState(initialAuthed);

  const parsedJson = useMemo(() => {
    try {
      return normalizeOverrides(JSON.parse(jsonInput));
    } catch {
      return null;
    }
  }, [jsonInput]);

  return (
    <div className="section-gap">
      <div className="container-editorial max-w-3xl">
        <h1 className="font-serif text-display-m font-light text-ink">Back Office</h1>
        <p className="mt-4 text-body text-charcoal/80">
          This editor works on GitHub Pages only. Login is client-side, so treat it as
          convenience access, not strong security.
        </p>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="font-serif text-heading font-light text-ink">Login setup</h2>
          {!hasPassword ? (
            <div className="mt-6 flex flex-col gap-4">
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Set admin password"
                className="min-h-11 border-b border-line bg-transparent px-1"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                className="min-h-11 border-b border-line bg-transparent px-1"
              />
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center bg-ink px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ivory"
                onClick={() => {
                  if (!password || password !== confirmPassword) {
                    setStatus("Password and confirmation must match.");
                    return;
                  }
                  window.localStorage.setItem(PASSWORD_STORAGE_KEY, password);
                  window.localStorage.setItem(AUTH_STORAGE_KEY, "1");
                  setHasPassword(true);
                  setAuthed(true);
                  setStatus("Password set. You are now logged in.");
                }}
              >
                Save password
              </button>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="Enter admin password"
                className="min-h-11 border-b border-line bg-transparent px-1"
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center bg-ink px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ivory"
                  onClick={() => {
                    const stored = window.localStorage.getItem(PASSWORD_STORAGE_KEY);
                    if (!stored || loginPassword !== stored) {
                      setStatus("Invalid password.");
                      return;
                    }
                    window.localStorage.setItem(AUTH_STORAGE_KEY, "1");
                    setAuthed(true);
                    setStatus("Logged in.");
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center border border-line px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ink"
                  onClick={() => {
                    window.localStorage.removeItem(AUTH_STORAGE_KEY);
                    setAuthed(false);
                    setStatus("Logged out.");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </section>

        {authed ? (
          <>
            <section className="mt-10 border-t border-line pt-8">
              <h2 className="font-serif text-heading font-light text-ink">Edit mode</h2>
              <p className="mt-3 text-body-sm text-muted">
                Open your site and add <code>?edit=1</code> to the URL. Click any text or
                image to edit inline.
              </p>
              <a
                href={resolvePublicPath("/?edit=1")}
                className="mt-4 inline-flex min-h-11 items-center justify-center border border-line px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ink"
              >
                Open homepage in edit mode
              </a>
            </section>

            <section className="mt-10 border-t border-line pt-8">
              <h2 className="font-serif text-heading font-light text-ink">Override JSON</h2>
              <textarea
                value={jsonInput}
                onChange={(event) => setJsonInput(event.target.value)}
                spellCheck={false}
                className="mt-4 min-h-72 w-full border border-line bg-white p-4 font-mono text-sm text-ink"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center bg-ink px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ivory"
                  onClick={() => {
                    if (!parsedJson) {
                      setStatus("Invalid JSON.");
                      return;
                    }
                    writeStoredOverrides(parsedJson);
                    setStatus("Saved to browser storage.");
                  }}
                >
                  Save local JSON
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center border border-line px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ink"
                  onClick={() => {
                    navigator.clipboard.writeText(jsonInput).catch(() => {
                      // Clipboard can fail silently in restricted contexts.
                    });
                    setStatus("JSON copied.");
                  }}
                >
                  Copy JSON
                </button>
              </div>
            </section>

            <section className="mt-10 border-t border-line pt-8">
              <h2 className="font-serif text-heading font-light text-ink">
                Publish override file to GitHub
              </h2>
              <p className="mt-3 text-body-sm text-muted">
                This commits <code>{OVERRIDES_FILE_PATH}</code> to your repository. After
                GitHub Pages rebuilds, all viewers will see the updates.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  value={github.owner}
                  onChange={(event) =>
                    setGithub((prev) => ({ ...prev, owner: event.target.value }))
                  }
                  placeholder="GitHub owner"
                  className="min-h-11 border-b border-line bg-transparent px-1"
                />
                <input
                  value={github.repo}
                  onChange={(event) =>
                    setGithub((prev) => ({ ...prev, repo: event.target.value }))
                  }
                  placeholder="Repository name"
                  className="min-h-11 border-b border-line bg-transparent px-1"
                />
                <input
                  value={github.branch}
                  onChange={(event) =>
                    setGithub((prev) => ({ ...prev, branch: event.target.value }))
                  }
                  placeholder="Branch"
                  className="min-h-11 border-b border-line bg-transparent px-1"
                />
                <input
                  value={github.filePath}
                  onChange={(event) =>
                    setGithub((prev) => ({ ...prev, filePath: event.target.value }))
                  }
                  placeholder="File path in repo"
                  className="min-h-11 border-b border-line bg-transparent px-1"
                />
                <input
                  value={github.token}
                  onChange={(event) =>
                    setGithub((prev) => ({ ...prev, token: event.target.value }))
                  }
                  placeholder="GitHub token (repo contents:write)"
                  type="password"
                  className="min-h-11 border-b border-line bg-transparent px-1 md:col-span-2"
                />
              </div>
              <button
                type="button"
                className="mt-5 inline-flex min-h-11 items-center justify-center bg-ink px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ivory"
                onClick={async () => {
                  if (!parsedJson) {
                    setStatus("Invalid JSON. Cannot publish.");
                    return;
                  }
                  if (!github.owner || !github.repo || !github.branch || !github.token) {
                    setStatus("GitHub owner/repo/branch/token are required.");
                    return;
                  }

                  window.localStorage.setItem(
                    GITHUB_SETTINGS_STORAGE_KEY,
                    JSON.stringify(github),
                  );

                  const path = github.filePath || "public/content-overrides.json";
                  const endpoint = `https://api.github.com/repos/${github.owner}/${github.repo}/contents/${path}`;
                  const headers = {
                    Authorization: `Bearer ${github.token}`,
                    Accept: "application/vnd.github+json",
                    "Content-Type": "application/json",
                  };

                  let sha: string | undefined;
                  const existing = await fetch(`${endpoint}?ref=${github.branch}`, {
                    headers,
                  });
                  if (existing.ok) {
                    const data = (await existing.json()) as { sha?: string };
                    sha = data.sha;
                  }

                  const payload = {
                    message: "chore: update content overrides from back office",
                    content: toBase64(JSON.stringify(parsedJson, null, 2)),
                    branch: github.branch,
                    ...(sha ? { sha } : {}),
                  };

                  const publish = await fetch(endpoint, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify(payload),
                  });

                  if (!publish.ok) {
                    const errorText = await publish.text();
                    setStatus(`Publish failed: ${errorText}`);
                    return;
                  }

                  setStatus(
                    "Published to GitHub. Wait for GitHub Pages workflow to finish.",
                  );
                }}
              >
                Publish to GitHub
              </button>
            </section>
          </>
        ) : null}

        {status ? <p className="mt-8 text-body-sm text-ink">{status}</p> : null}
      </div>
    </div>
  );
}
