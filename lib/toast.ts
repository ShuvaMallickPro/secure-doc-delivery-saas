import { toast } from "sonner";

export function getActionErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error.trim()) {
    return error;
  }
  return "Something went wrong. Please try again.";
}

export function notifyError(title: string, error: unknown) {
  toast.error(title, { description: getActionErrorMessage(error) });
}

export function notifySuccess(title: string, description?: string) {
  toast.success(title, description ? { description } : undefined);
}
