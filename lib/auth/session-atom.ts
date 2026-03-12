import { atom } from "jotai";
import type { AuthSession } from "@/api/clients/session";

export const authSessionAtom = atom<AuthSession | null>(null);
export const authHydratedAtom = atom(false);
