"use client";

// Couche d'accès aux données de l'espace membre.
// - Si NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies : Supabase (auth + base).
// - Sinon : mode démo, tout est stocké dans le navigateur (localStorage). Rien n'est envoyé à un serveur.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface AccountUser {
  id: string;
  email: string;
  name: string;
}

export interface QuizRecord {
  id: string;
  code: string;
  createdAt: string;
  top: { trackId: string; score: number }[];
}

export interface Enrollment {
  courseSlug: string;
  enrolledAt: string;
  status: "preview" | "paid";
}

export type ProgressMap = Record<string, string[]>;

export interface Backend {
  mode: "supabase" | "demo";
  getUser(): Promise<AccountUser | null>;
  getAccessToken(): Promise<string | null>;
  onAuthChange(cb: (u: AccountUser | null) => void): () => void;
  signUp(email: string, password: string, name: string): Promise<{ needsConfirmation: boolean }>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  listQuiz(): Promise<QuizRecord[]>;
  saveQuiz(rec: Omit<QuizRecord, "id" | "createdAt">): Promise<void>;
  listEnrollments(): Promise<Enrollment[]>;
  enroll(slug: string): Promise<void>;
  getProgress(): Promise<ProgressMap>;
  setLesson(slug: string, key: string, done: boolean): Promise<void>;
}

// ---------- Stockage local (mode démo, et historique hors connexion) ----------

const K = (k: string) => `kairos:v1:${k}`;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(K(key));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(K(key), JSON.stringify(value));
  } catch {
    /* stockage indisponible (navigation privée) : on ignore */
  }
}

const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

export const localQuiz = {
  list: () => read<QuizRecord[]>("quiz", []),
  save(rec: Omit<QuizRecord, "id" | "createdAt">) {
    const list = read<QuizRecord[]>("quiz", []);
    if (list[0]?.code === rec.code) return; // évite les doublons au rechargement
    write("quiz", [{ ...rec, id: uid(), createdAt: new Date().toISOString() }, ...list].slice(0, 20));
  },
};

function demoBackend(): Backend {
  const listeners = new Set<(u: AccountUser | null) => void>();
  const emit = () => listeners.forEach((l) => l(read<AccountUser | null>("user", null)));
  return {
    mode: "demo",
    async getUser() {
      return read<AccountUser | null>("user", null);
    },
    async getAccessToken() {
      return null;
    },
    onAuthChange(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    async signUp(email, _password, name) {
      write("user", { id: uid(), email, name });
      emit();
      return { needsConfirmation: false };
    },
    async signIn(email) {
      const existing = read<AccountUser | null>("account", null);
      write("user", existing && existing.email === email ? existing : { id: uid(), email, name: email.split("@")[0] });
      emit();
    },
    async signOut() {
      const u = read<AccountUser | null>("user", null);
      if (u) write("account", u);
      try {
        localStorage.removeItem(K("user"));
      } catch {}
      emit();
    },
    async resetPassword() {},
    async listQuiz() {
      return localQuiz.list();
    },
    async saveQuiz(rec) {
      localQuiz.save(rec);
    },
    async listEnrollments() {
      return read<Enrollment[]>("enrollments", []);
    },
    async enroll(slug) {
      const list = read<Enrollment[]>("enrollments", []);
      if (!list.some((e) => e.courseSlug === slug)) write("enrollments", [...list, { courseSlug: slug, enrolledAt: new Date().toISOString(), status: "preview" }]);
    },
    async getProgress() {
      return read<ProgressMap>("progress", {});
    },
    async setLesson(slug, key, done) {
      const p = read<ProgressMap>("progress", {});
      const set = new Set(p[slug] ?? []);
      if (done) set.add(key);
      else set.delete(key);
      write("progress", { ...p, [slug]: [...set] });
    },
  };
}

// ---------- Supabase ----------

function supabaseBackend(client: SupabaseClient): Backend {
  const toUser = (u: { id: string; email?: string; user_metadata?: { name?: string } } | null | undefined): AccountUser | null =>
    u ? { id: u.id, email: u.email ?? "", name: u.user_metadata?.name ?? u.email?.split("@")[0] ?? "" } : null;
  const requireUser = async () => {
    const { data } = await client.auth.getUser();
    if (!data.user) throw new Error("Connexion requise.");
    return data.user;
  };
  const check = (error: { message: string } | null) => {
    if (error) throw new Error(error.message);
  };

  return {
    mode: "supabase",
    async getUser() {
      const { data } = await client.auth.getUser();
      return toUser(data.user);
    },
    async getAccessToken() {
      const { data } = await client.auth.getSession();
      return data.session?.access_token ?? null;
    },
    onAuthChange(cb) {
      const { data } = client.auth.onAuthStateChange((_e, session) => cb(toUser(session?.user)));
      return () => data.subscription.unsubscribe();
    },
    async signUp(email, password, name) {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { name }, emailRedirectTo: `${window.location.origin}/espace` },
      });
      check(error);
      return { needsConfirmation: !data.session };
    },
    async signIn(email, password) {
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message === "Invalid login credentials" ? "Adresse e-mail ou mot de passe incorrect." : error.message);
    },
    async signOut() {
      await client.auth.signOut();
    },
    async resetPassword(email) {
      const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/connexion` });
      check(error);
    },
    async listQuiz() {
      const { data, error } = await client.from("quiz_results").select("id, code, top, created_at").order("created_at", { ascending: false }).limit(20);
      check(error);
      return (data ?? []).map((r) => ({ id: r.id, code: r.code, top: r.top, createdAt: r.created_at }));
    },
    async saveQuiz(rec) {
      const user = await requireUser();
      const { error } = await client.from("quiz_results").insert({ user_id: user.id, code: rec.code, top: rec.top });
      check(error);
    },
    async listEnrollments() {
      const { data, error } = await client.from("enrollments").select("course_slug, status, created_at");
      check(error);
      return (data ?? []).map((r) => ({ courseSlug: r.course_slug, status: r.status, enrolledAt: r.created_at }));
    },
    async enroll(slug) {
      const user = await requireUser();
      const { error } = await client.from("enrollments").upsert({ user_id: user.id, course_slug: slug, status: "preview" }, { onConflict: "user_id,course_slug", ignoreDuplicates: true });
      check(error);
    },
    async getProgress() {
      const { data, error } = await client.from("lesson_progress").select("course_slug, lesson_key");
      check(error);
      const map: ProgressMap = {};
      for (const r of data ?? []) (map[r.course_slug] ??= []).push(r.lesson_key);
      return map;
    },
    async setLesson(slug, key, done) {
      const user = await requireUser();
      const q = done
        ? client.from("lesson_progress").upsert({ user_id: user.id, course_slug: slug, lesson_key: key }, { onConflict: "user_id,course_slug,lesson_key" })
        : client.from("lesson_progress").delete().match({ user_id: user.id, course_slug: slug, lesson_key: key });
      const { error } = await q;
      check(error);
    },
  };
}

let instance: Backend | null = null;

export function getBackend(): Backend {
  if (instance) return instance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  instance = url && key ? supabaseBackend(createClient(url, key)) : demoBackend();
  return instance;
}
