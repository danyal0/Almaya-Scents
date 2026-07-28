"use client";

import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { resolvePublicPath } from "@/lib/edit-overrides";
import { siteConfig } from "@/content/site-config";
import { firebaseAuth } from "@/lib/firebase";

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

  return (
    <div className="section-gap">
      <div className="container-editorial max-w-3xl">
        <h1 className="font-serif text-display-m font-light text-ink">Back Office</h1>
        <p className="mt-4 text-body text-charcoal/80">
          Log in, then open any page with <code>?edit=1</code>. From the floating toolbar you
          can edit text/images, upload images, drag to reposition, add sections, and create
          pages. Use Save or Reset to original when finished.
        </p>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="font-serif text-heading font-light text-ink">Admin login</h2>
          {!authed ? (
            <div className="mt-6 flex flex-col gap-4">
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
                      setStatus("Admin account created. You can log in and start editing.");
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
                  Admin access is restricted to{" "}
                  <span className="text-ink">{siteConfig.adminEmail}</span>.
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
          <section className="mt-10 border-t border-line pt-8">
            <h2 className="font-serif text-heading font-light text-ink">Start editing</h2>
            <p className="mt-3 text-body-sm text-muted">
              Open a page with <code>?edit=1</code>. From the toolbar you can:
              edit text, replace images via URL/upload, drag to reposition, add
              text/image sections, create pages, then <strong>Save</strong> or{" "}
              <strong>Reset to original</strong>.
            </p>
            <a
              href={resolvePublicPath("/?edit=1")}
              className="mt-4 inline-flex min-h-11 items-center justify-center bg-ink px-8 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ivory"
            >
              Open homepage in edit mode
            </a>
          </section>
        ) : null}

        {status ? <p className="mt-8 text-body-sm text-ink">{status}</p> : null}
      </div>
    </div>
  );
}
