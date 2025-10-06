import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@nexus/ui";
import { Button } from "@nexus/ui";
import { LearningStep } from "../types/learning";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Trophy } from "lucide-react";

interface StepContentProps {
  step: LearningStep | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export function StepContent({
  step,
  isOpen,
  onClose,
  onComplete,
  isCompleted,
}: StepContentProps) {
  if (!step) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{step.title}</DialogTitle>
          <DialogDescription>{step.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={step.imageUrl}
              alt={step.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p>{step.content}</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span>Skill Points: {step.skillPoints}</span>
            </div>
            {isCompleted && (
              <span className="px-3 py-1 bg-green-500 text-white rounded-full">
                Completed!
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {!isCompleted && (
              <Button onClick={onComplete} className="flex-1">
                Complete Step
              </Button>
            )}
            <Button onClick={onClose} variant="outline" className="flex-1">
              {isCompleted ? "Close" : "Continue Later"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
