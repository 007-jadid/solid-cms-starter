import { createEffect, createMemo, createSignal, Show } from "solid-js";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Input } from "./input";
import { Textarea } from "./textarea";

export function ConfirmActionDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  confirmationText?: string;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  requireReason?: boolean;
  onConfirm: (payload: { reason: string }) => void | Promise<void>;
}) {
  const [confirmationInput, setConfirmationInput] = createSignal("");
  const [reason, setReason] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);

  createEffect(() => {
    if (!props.open) {
      setConfirmationInput("");
      setReason("");
      setSubmitting(false);
    }
  });

  const canConfirm = createMemo(() => {
    const needsTypedConfirmation = Boolean(props.confirmationText);
    const typedOk = !needsTypedConfirmation || confirmationInput() === props.confirmationText;
    const reasonOk = !props.requireReason || reason().trim().length > 0;
    return typedOk && reasonOk && !submitting();
  });

  const handleConfirm = async () => {
    if (!canConfirm()) return;
    setSubmitting(true);
    try {
      await props.onConfirm({ reason: reason().trim() });
      props.onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <Show when={props.description}>
            <DialogDescription>{props.description}</DialogDescription>
          </Show>
        </DialogHeader>

        <div class="space-y-3">
          <Show when={props.confirmationText}>
            <div class="space-y-1.5">
              <p class="text-sm text-muted-foreground">
                Type <span class="font-medium text-foreground">{props.confirmationText}</span> to
                confirm.
              </p>
              <Input
                value={confirmationInput()}
                onInput={(event) => setConfirmationInput(event.currentTarget.value)}
                placeholder={props.confirmationText}
              />
            </div>
          </Show>

          <Show when={props.requireReason}>
            <div class="space-y-1.5">
              <p class="text-sm font-medium">{props.reasonLabel || "Reason"}</p>
              <Textarea
                rows={3}
                value={reason()}
                onInput={(event) => setReason(event.currentTarget.value)}
                placeholder={props.reasonPlaceholder || "Add a short reason"}
              />
            </div>
          </Show>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => props.onOpenChange(false)}>
            {props.cancelLabel || "Cancel"}
          </Button>
          <Button
            variant={props.variant === "destructive" ? "destructive" : "default"}
            disabled={!canConfirm()}
            onClick={handleConfirm}
          >
            {submitting() ? "Processing..." : props.confirmLabel || "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
