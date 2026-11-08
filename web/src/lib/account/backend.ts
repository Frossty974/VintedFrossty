"use client";

// Couche d'accès aux données de l'espace membre.
// - Si NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies : Supabase (auth + base).
// - Sinon : mode démo, tout est stocké dans le navigateur (localStorage). Rien n'est envoyé à un serveur.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CommunityCourse, CourseContent, SubmissionStatus } from "@/lib/community/types";
import { addDays, aggregate, type CourseEvent, type Counts, type EventType } from "@/lib/ranking";

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

  // Formations proposées par la communauté
  submitCourse(content: CourseContent, id?: string): Promise<CommunityCourse>;
  listMySubmissions(): Promise<CommunityCourse[]>;
  listApprovedCommunity(): Promise<CommunityCourse[]>;
  getCommunityCourse(id: string): Promise<CommunityCourse | null>;
  // Modération
  isAdmin(): Promise<boolean>;
  listForReview(status: SubmissionStatus): Promise<CommunityCourse[]>;
  review(id: string, decision: "approved" | "changes" | "rejected", note: string): Promise<void>;
  // Popularité
  track(slug: string, type: EventType): Promise<void>;
  weekCounts(from: Date): Promise<Counts[]>;
}

/** Identifiant anonyme et aléatoire du navigateur, utilisé pour ne compter qu'une vue par jour. */
export function visitorId(): string {
  try {
    let v = localStorage.getItem("nolarp:visitor");
    if (!v) {
      v = (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)).toLowerCase();
      localStorage.setItem("nolarp:visitor", v);
    }
    return v;
  } catch {
    return "anonymous-visitor";
  }
}

/** Ne compte une vue qu'une fois par jour et par formation. */
function shouldCountView(slug: string): boolean {
  try {
    const key = `nolarp:viewed:${slug}`;
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(key) === today) return false;
    localStorage.setItem(key, today);
    return true;
  } catch {
    return false;
  }
}

const shortId = () => Array.from({ length: 10 }, () => "abcdefghijkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 32)]).join("");

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
      if (!list.some((e) => e.courseSlug === slug)) {
        write("enrollments", [...list, { courseSlug: slug, enrolledAt: new Date().toISOString(), status: "preview" }]);
        await this.track(slug, "enroll");
      }
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
      if (done) await this.track(slug, "lesson");
    },
    async submitCourse(content, id) {
      const user = read<AccountUser | null>("user", null);
      if (!user) throw new Error("Connexion requise.");
      const list = read<CommunityCourse[]>("community", []);
      const now = new Date().toISOString();
      const existing = id ? list.find((c) => c.id === id && c.authorId === user.id) : undefined;
      if (existing && !["pending", "changes"].includes(existing.status)) throw new Error("Cette formation ne peut plus être modifiée.");
      const rec: CommunityCourse = existing
        ? { ...existing, content, status: "pending", updatedAt: now, reviewNote: existing.reviewNote }
        : { id: shortId(), status: "pending", authorId: user.id, authorName: user.name, content, createdAt: now, updatedAt: now };
      write("community", existing ? list.map((c) => (c.id === rec.id ? rec : c)) : [rec, ...list]);
      return rec;
    },
    async listMySubmissions() {
      const user = read<AccountUser | null>("user", null);
      return user ? read<CommunityCourse[]>("community", []).filter((c) => c.authorId === user.id) : [];
    },
    async listApprovedCommunity() {
      return read<CommunityCourse[]>("community", []).filter((c) => c.status === "approved");
    },
    async getCommunityCourse(id) {
      return read<CommunityCourse[]>("community", []).find((c) => c.id === id) ?? null;
    },
    async isAdmin() {
      // En mode démo, tout compte connecté peut tester la modération.
      return Boolean(read<AccountUser | null>("user", null));
    },
    async listForReview(status) {
      return read<CommunityCourse[]>("community", []).filter((c) => c.status === status);
    },
    async review(id, decision, note) {
      const now = new Date().toISOString();
      write(
        "community",
        read<CommunityCourse[]>("community", []).map((c) =>
          c.id === id ? { ...c, status: decision, reviewNote: note || undefined, updatedAt: now, certifiedAt: decision === "approved" ? now : undefined } : c,
        ),
      );
    },
    async track(slug, type) {
      if (type === "view" && !shouldCountView(slug)) return;
      const list = read<CourseEvent[]>("events", []);
      write("events", [...list, { slug, type, at: new Date().toISOString() }].slice(-3000));
    },
    async weekCounts(from) {
      return aggregate(read<CourseEvent[]>("events", []), from, addDays(from, 7));
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
      await this.track(slug, "enroll");
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
      if (done) await this.track(slug, "lesson");
    },
    async submitCourse(content, id) {
      const user = await requireUser();
      const name = (user.user_metadata as { name?: string } | undefined)?.name ?? user.email?.split("@")[0] ?? "Auteur";
      const q = id
        ? client.from("community_courses").update({ content, status: "pending", updated_at: new Date().toISOString() }).eq("id", id).select().single()
        : client.from("community_courses").insert({ author_id: user.id, author_name: name, content, status: "pending" }).select().single();
      const { data, error } = await q;
      check(error);
      return fromRow(data);
    },
    async listMySubmissions() {
      const user = await requireUser();
      const { data, error } = await client.from("community_courses").select("*").eq("author_id", user.id).order("created_at", { ascending: false });
      check(error);
      return (data ?? []).map(fromRow);
    },
    async listApprovedCommunity() {
      const { data, error } = await client.from("community_courses").select("*").eq("status", "approved").order("certified_at", { ascending: false });
      check(error);
      return (data ?? []).map(fromRow);
    },
    async getCommunityCourse(id) {
      const { data, error } = await client.from("community_courses").select("*").eq("id", id).maybeSingle();
      check(error);
      return data ? fromRow(data) : null;
    },
    async isAdmin() {
      const { data } = await client.rpc("is_admin");
      return data === true;
    },
    async listForReview(status) {
      const { data, error } = await client.from("community_courses").select("*").eq("status", status).order("updated_at", { ascending: true });
      check(error);
      return (data ?? []).map(fromRow);
    },
    async review(id, decision, note) {
      const now = new Date().toISOString();
      const { error } = await client
        .from("community_courses")
        .update({ status: decision, review_note: note || null, reviewed_at: now, updated_at: now, certified_at: decision === "approved" ? now : null })
        .eq("id", id);
      check(error);
    },
    async track(slug, type) {
      if (type === "view" && !shouldCountView(slug)) return;
      await fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, type, visitor: visitorId() }), keepalive: true }).catch(() => {});
    },
    async weekCounts(from) {
      const { data, error } = await client.rpc("course_popularity", { from_ts: from.toISOString(), to_ts: addDays(from, 7).toISOString() });
      check(error);
      return (data ?? []).map((r: { course_slug: string; views: number; enrollments: number; lessons: number }) => ({ slug: r.course_slug, views: Number(r.views), enrollments: Number(r.enrollments), lessons: Number(r.lessons) }));
    },
  };
}

type Row = { id: string; status: SubmissionStatus; author_id: string; author_name: string; content: CourseContent; created_at: string; updated_at: string; review_note: string | null; certified_at: string | null };
function fromRow(r: Row): CommunityCourse {
  return { id: r.id, status: r.status, authorId: r.author_id, authorName: r.author_name, content: r.content, createdAt: r.created_at, updatedAt: r.updated_at, reviewNote: r.review_note ?? undefined, certifiedAt: r.certified_at ?? undefined };
}

let instance: Backend | null = null;

export function getBackend(): Backend {
  if (instance) return instance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  instance = url && key ? supabaseBackend(createClient(url, key)) : demoBackend();
  return instance;
}
