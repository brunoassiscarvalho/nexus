import { Lock, Check, Star, Zap } from "lucide-react";
import { cn } from "@nexus/ui";

import { LearningStep } from "../types/learning";
import { categoryColors } from "../data/learningSteps";

interface SkillTreeNodeProps {
  step: LearningStep;
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
  onClick: () => void;
  position: { x: number; y: number };
}

export function SkillTreeNode({
  step,
  isCompleted,
  isUnlocked,
  isCurrent,
  onClick,
  position,
}: SkillTreeNodeProps) {
  const colors = categoryColors[step.category];

  const getNodeStyle = () => {
    if (isCompleted) {
      return {
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 100%)`,
        borderColor: colors.border,
        boxShadow: `0 10px 40px ${colors.glow}80, 0 0 20px ${colors.glow}40`,
      };
    }
    if (isCurrent) {
      return {
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 100%)`,
        borderColor: colors.border,
        boxShadow: `0 10px 40px ${colors.glow}80, 0 0 30px ${colors.glow}60`,
      };
    }
    if (isUnlocked) {
      return {
        background: `linear-gradient(135deg, ${colors.primary}cc 0%, ${colors.primary}aa 100%)`,
        borderColor: colors.border,
        boxShadow: `0 10px 40px ${colors.glow}60, 0 0 20px ${colors.glow}30`,
      };
    }
    return {
      background: "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)",
      borderColor: "#D1D5DB",
      boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    };
  };

  const getIcon = () => {
    if (isCompleted)
      return <Check className="w-7 h-7 text-white" strokeWidth={3} />;
    if (!isUnlocked) return <Lock className="w-6 h-6 text-white/80" />;
    if (isCurrent) return <Star className="w-7 h-7 text-white" fill="white" />;
    return <Zap className="w-6 h-6 text-white" fill="white" />;
  };

  const nodeStyle = getNodeStyle();

  return (
    <div className="relative group inline-block">
      {/* Glow effect for unlocked nodes */}
      {isUnlocked && !isCompleted && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse pointer-events-none"
          style={{
            background: colors.glow,
            transform: "scale(1.5)",
          }}
        />
      )}

      {/* Pulsing ring for current step */}
      {isCurrent && (
        <div
          className="absolute inset-0 rounded-full animate-ping pointer-events-none"
          style={{
            border: `3px solid ${colors.border}`,
            transform: "scale(1.2)",
          }}
        />
      )}

      <div
        data-step-id={step.id}
        className={cn(
          "relative w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300",
          isUnlocked &&
            "cursor-pointer transform hover:scale-125 active:scale-110",
          !isUnlocked && "cursor-not-allowed"
        )}
        style={nodeStyle}
      >
        {getIcon()}

        {/* Skill points badge */}
        {isUnlocked && (
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 border-2 border-yellow-200 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xs text-yellow-900">{step.skillPoints}</span>
          </div>
        )}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
        <div
          className="px-4 py-2 rounded-lg border-2 shadow-xl backdrop-blur-sm"
          style={{
            backgroundColor: colors.secondary,
            borderColor: colors.border,
            color: colors.text,
          }}
        >
          <div className="text-sm">{step.title}</div>
          <div className="text-xs opacity-75">{step.description}</div>
          {!isUnlocked && step.prerequisites.length > 0 && (
            <div className="text-xs text-red-600 mt-1">
              🔒 Requires {step.prerequisites.length} skill
              {step.prerequisites.length > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
