"use client";

import { useEffect, useMemo, useState } from "react";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import {
  GITHUB_SETTINGS_STORAGE_KEY,
  OVERRIDES_FILE_PATH,
  resolvePublicPath,
  normalizeOverrides,
  readStoredOverrides,
  writeStoredOverrides,
} from "@/lib/edit-overrides";
import { siteConfig } from "@/content/site-config";
import { firebaseAuth } from "@/lib/firebase";
import { loadFirebaseOverrides, saveFirebaseOverrides } from "@/lib/firebase-overrides";

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

function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error ? error.message : "Unexpected authentication error.";
  }

  switch (error.code) {
    case "auth/configuration-not-found":
    case "auth/operation-not-allowed":
      return "Firebase Email/Password auth is not enabled. In Firebase Console: Authentication -> Sign-in method -> enable Email/Password.";
    case "auth/unauthorized-domain":
      return "Current domain is not authorized in Firebase Auth. Add your site domain under Authentication -> Settings -> Authorized domains.";
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "Account already exists for this email. Use Login instead of Create account.";
    default:
      return `${error.code}: ${error.message}`;
  }
}

export function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(readStoredOverrides(), null, 2),
  );
  const [github, setGithub] = useState<GithubSettings>(readGithubSettings);
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isAllowedAdmin =
    currentUser?.email?.toLowerCase() === siteConfig.adminEmail.toLowerCase();

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user);
      setAuthed(Boolean(user));
    });
  }, []);

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
          Firebase powers login and shared content, while the site itself stays on
          GitHub Pages.
        </p>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="font-serif text-heading font-light text-ink">Admin login</h2>
          {!authed ? (
            <div className="mt-6 flex flex-col gap-4">
              <p className="text-body-sm text-muted">
                If you see <code>auth/configuration-not-found</code>, enable Email/Password
                in Firebase Authentication first.
              </p>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={siteConfig.adminEmail}
                className="min-h-11 border-b border-line bg-transparent px-1"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="min-h-11 border-b border-line bg-transparent px-1"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password (for sign up only)"
                className="min-h-11 border-b border-line bg-transparent px-1"
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center bg-ink px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ivory"
                  onClick={async () => {
                    try {
                      await signInWithEmailAndPassword(firebaseAuth, email, password);
                      setStatus("Logged in.");
                    } catch (error) {
                      setStatus(getAuthErrorMessage(error));
                    }
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center border border-line px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ink"
                  onClick={async () => {
                    if (email.trim().toLowerCase() !== siteConfig.adminEmail.toLowerCase()) {
                      setStatus(`Only ${siteConfig.adminEmail} can create the admin account.`);
                      return;
                    }
                    if (!email || !password || password !== confirmPassword) {
                      setStatus("Passwords must match for the initial admin sign-up.");
                      return;
                    }
                    try {
                      const credentials = await createUserWithEmailAndPassword(
                        firebaseAuth,
                        email,
                        password,
                      );
                      await sendEmailVerification(credentials.user);
                      setStatus(
                        `Admin account created. Verification email sent to ${siteConfig.adminEmail}, but admin access is enabled immediately for this email.`,
                      );
                    } catch (error) {
                      setStatus(getAuthErrorMessage(error));
                    }
                  }}
                >
                  Create account
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              <p className="text-body-sm text-muted">
                Logged in as <span className="text-ink">{currentUser?.email}</span>
              </p>
              {!isAllowedAdmin ? (
                <p className="text-body-sm text-muted">
                  Admin access is restricted to <span className="text-ink">{siteConfig.adminEmail}</span>
                  .
                </p>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center border border-line px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ink"
                  onClick={async () => {
                    await signOut(firebaseAuth);
                    setStatus("Logged out.");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </section>

        {authed && isAllowedAdmin ? (
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
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center border border-line px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ink"
                  onClick={async () => {
                    try {
                      const remote = await loadFirebaseOverrides();
                      if (!remote) {
                        setStatus("No Firebase overrides saved yet.");
                        return;
                      }
                      const pretty = JSON.stringify(remote, null, 2);
                      setJsonInput(pretty);
                      writeStoredOverrides(remote);
                      setStatus("Loaded current Firebase content.");
                    } catch (error) {
                      const message =
                        error instanceof Error ? error.message : "Unable to load Firebase data.";
                      setStatus(message);
                    }
                  }}
                >
                  Load from Firebase
                </button>
              </div>
            </section>

            <section className="mt-10 border-t border-line pt-8">
              <h2 className="font-serif text-heading font-light text-ink">
                Publish live content to Firebase
              </h2>
              <p className="mt-3 text-body-sm text-muted">
                Saving here updates the shared content document. All viewers will see the
                changes as soon as the site reloads.
              </p>
              <button
                type="button"
                className="mt-5 inline-flex min-h-11 items-center justify-center bg-ink px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ivory"
                onClick={async () => {
                  if (!parsedJson) {
                    setStatus("Invalid JSON. Cannot publish.");
                    return;
                  }
                  if (!currentUser?.email) {
                    setStatus("You must be logged in to publish.");
                    return;
                  }
                  try {
                    await saveFirebaseOverrides(parsedJson, currentUser.email);
                    writeStoredOverrides(parsedJson);
                    setStatus("Published to Firebase. This is now live for all viewers.");
                  } catch (error) {
                    const message =
                      error instanceof Error ? error.message : "Unable to publish to Firebase.";
                    setStatus(message);
                  }
                }}
              >
                Publish to Firebase
              </button>
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
