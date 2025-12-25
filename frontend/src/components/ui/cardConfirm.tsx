import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ConfirmCardProps = {
  title: string;
  message: string;
  confirmText: string;
  expectedText: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmCard({
  title,
  message,
  confirmText,
  expectedText,
  onCancel,
  onConfirm,
}: ConfirmCardProps) {
  const [input, setInput] = useState("");

  const isValid = input === expectedText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <p>{message}</p>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type "${expectedText}" to confirm`}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={!isValid}
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
