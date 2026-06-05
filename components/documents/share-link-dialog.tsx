"use client";

import { useState } from "react";
import { createShareLink } from "@/actions/documents";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ShareLinkDialogProps = {
  documentId: string | null;
  documentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (shareUrl: string) => void;
};

export function ShareLinkDialog({
  documentId,
  documentName,
  open,
  onOpenChange,
  onCreated,
}: ShareLinkDialogProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [createdUrl, setCreatedUrl] = useState("");

  function reset() {
    setEmail("");
    setError("");
    setCreatedUrl("");
    setPending(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!documentId) return;

    setPending(true);
    setError("");

    try {
      const result = await createShareLink(documentId, email);
      setCreatedUrl(result.shareUrl);
      onCreated(result.shareUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create link");
    } finally {
      setPending(false);
    }
  }

  async function copyUrl() {
    if (!createdUrl) return;
    await navigator.clipboard.writeText(createdUrl);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share document</DialogTitle>
          <DialogDescription>
            Create a unique link for{" "}
            <span className="font-medium">{documentName}</span>. Each link can
            be revoked individually.
          </DialogDescription>
        </DialogHeader>

        {createdUrl ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-medium">Link created</p>
              <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
                {createdUrl}
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={copyUrl}>
                Copy link
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleOpenChange(false);
                  window.location.reload();
                }}
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient-email">Recipient email</Label>
              <Input
                id="recipient-email"
                type="email"
                placeholder="client@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={pending}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Creating…" : "Create link"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
