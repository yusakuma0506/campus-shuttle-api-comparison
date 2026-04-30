"use client";

import { useEffect, useState } from "react";

import { api, getErrorMessage } from "@/lib/api";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth";
import { requireEmail, requireMinimumLength, requireText } from "@/lib/validators";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [role, setRole] = useState("operator");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    api
      .me(token)
      .then(setProfile)
      .catch(() => {
        clearAccessToken();
        setProfile(null);
      });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      requireEmail(email);
      requireMinimumLength(password, 8, "Password");

      if (mode === "register") {
        requireText(name, "Name");
      }

      setIsSubmitting(true);

      if (mode === "register") {
        await api.register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        });
        setMessage("Registration complete. You can log in now.");
        setMode("login");
      } else {
        const session = await api.login({ email: email.trim(), password });
        setAccessToken(session.access_token);
        const nextProfile = await api.me(session.access_token);
        setProfile(nextProfile);
        setMessage(`Signed in as ${nextProfile.name}.`);
      }
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSignOut() {
    clearAccessToken();
    setProfile(null);
    setMessage("Signed out.");
  }

  return (
    <main className="grid-2">
      <section className="surface stack">
        <div className="row between">
          <div>
            <p className="eyebrow">Authentication</p>
            <h1>{mode === "login" ? "Sign in" : "Create an operator account"}</h1>
          </div>
          <button className="ghost-button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            Switch to {mode === "login" ? "register" : "login"}
          </button>
        </div>
        <form className="stack" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <>
              <label>
                <span>Name</span>
                <input value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label>
                <span>Role</span>
                <select value={role} onChange={(event) => setRole(event.target.value)}>
                  <option value="operator">operator</option>
                  <option value="admin">admin</option>
                </select>
              </label>
            </>
          ) : null}
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {message ? <p className="success-text">{message}</p> : null}
          {error ? <p className="error-text">{error}</p> : null}
          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Submitting..." : mode === "login" ? "Sign in" : "Register"}
          </button>
        </form>
      </section>
      <section className="surface stack">
        <p className="eyebrow">Session</p>
        <h2>Current user</h2>
        {profile ? (
          <>
            <div className="line-item">
              <strong>{profile.name}</strong>
              <span className="muted">{profile.role}</span>
            </div>
            <p className="muted">{profile.email}</p>
            <button className="ghost-button" onClick={handleSignOut}>
              Sign out
            </button>
          </>
        ) : (
          <p className="muted">No active token yet. Register or log in to unlock protected flows.</p>
        )}
      </section>
    </main>
  );
}
