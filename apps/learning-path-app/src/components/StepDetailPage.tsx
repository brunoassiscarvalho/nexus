import { LearningStep } from "../types/learning";
import { Button } from "@nexus/ui/button";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";
import { categoryColors } from "../data/learningSteps";
import { motion } from "motion/react";

interface StepDetailPageProps {
  step: LearningStep;
  isCompleted: boolean;
  onComplete: () => void;
  onBack: () => void;
}

export function StepDetailPage({
  step,
  isCompleted,
  onComplete,
  onBack,
}: StepDetailPageProps) {
  const colors = categoryColors[step.category];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Skill Tree
        </Button>

        {/* Step content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header card */}
          <div
            className="rounded-lg border-4 p-8 mb-6 shadow-xl"
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="px-3 py-1 rounded-full text-xs border-2"
                    style={{
                      backgroundColor: colors.primary + "20",
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  >
                    Tier {step.tier}
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs border-2"
                    style={{
                      backgroundColor: colors.primary + "20",
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  >
                    {step.category.charAt(0).toUpperCase() +
                      step.category.slice(1)}
                  </div>
                </div>
                <h1 style={{ color: colors.text }}>{step.title}</h1>
                <p className="text-muted-foreground mt-2">{step.description}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div
                  className="w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-lg"
                  style={{
                    backgroundColor: colors.primary,
                    borderColor: colors.border,
                  }}
                >
                  <Star className="w-8 h-8 text-white" fill="white" />
                </div>
                <div className="text-sm" style={{ color: colors.text }}>
                  +{step.skillPoints} SP
                </div>
              </div>
            </div>

            {isCompleted && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 mt-4"
                style={{
                  backgroundColor: "#10B98120",
                  borderColor: "#10B981",
                  color: "#065F46",
                }}
              >
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">
                  Completed! You've earned {step.skillPoints} skill points.
                </span>
              </div>
            )}
          </div>

          {/* Image */}
          <div className="rounded-lg overflow-hidden shadow-xl mb-6">
            <img
              src={step.imageUrl}
              alt={step.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border shadow-lg p-8 mb-6">
            <h2 className="mb-4">Lesson Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              {step.content}
            </p>
          </div>

          {/* Action button */}
          {!isCompleted && (
            <div className="flex justify-center">
              <Button
                onClick={onComplete}
                size="lg"
                className="text-white shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: colors.primary }}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Lesson
              </Button>
            </div>
          )}

          {isCompleted && (
            <div className="flex justify-center">
              <Button onClick={onBack} size="lg" variant="outline">
                Return to Skill Tree
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
