"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getBackend, type AccountUser, type Backend } from "./backend";

interface AccountState {
  user: AccountUser | null;
  ready: boolean;
  mode: Backend["mode"];
  backend: Backend;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AccountState | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const backend = useMemo(() => getBackend(), []);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setUser(await backend.getUser());
    } finally {
      setReady(true);
    }
  }, [backend]);

  useEffect(() => {
    refresh();
    return backend.onAuthChange((u) => setUser(u));
  }, [backend, refresh]);

  return <Ctx.Provider value={{ user, ready, mode: backend.mode, backend, refresh }}>{children}</Ctx.Provider>;
}

export function useAccount() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAccount doit être utilisé dans AccountProvider");
  return v;
}
