export type ToastVariant = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  variant: ToastVariant;
  message: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration: number;
};

let toastState: ToastItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return toastState;
}

function genId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type ToastInput = {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

function addToast(variant: ToastVariant, message: string, input?: ToastInput) {
  const id = genId();
  const duration = input?.duration ?? 4000;
  const next: ToastItem = {
    id,
    variant,
    message,
    description: input?.description,
    action: input?.action,
    duration,
  };

  toastState = [next, ...toastState].slice(0, 5);
  emit();

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  return id;
}

export function dismissToast(id: string) {
  const next = toastState.filter((t) => t.id !== id);
  if (next.length === toastState.length) return;
  toastState = next;
  emit();
}

export const toast = {
  success: (message: string, input?: ToastInput) =>
    addToast("success", message, input),
  error: (message: string, input?: ToastInput) =>
    addToast("error", message, input),
  info: (message: string, input?: ToastInput) =>
    addToast("info", message, input),
  dismiss: (id: string) => dismissToast(id),
};
