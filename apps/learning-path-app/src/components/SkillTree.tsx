import { SkillTreeNode } from "./SkillTreeNode";
import { LearningStep, UserProgress, SkillCategory } from "../types/learning";
import { categoryColors } from "../data/learningSteps";

interface SkillTreeProps {
  steps: LearningStep[];
  progress: UserProgress;
  onStepClick: (stepId: number) => void;
}

export function SkillTree({ steps, progress, onStepClick }: SkillTreeProps) {
  // Calculate positions for tree layout - organized by category to prevent crossing
  const getNodePosition = (step: LearningStep) => {
    const tierSpacing = 180; // Vertical spacing between tiers
    const baseY = 100;
    const y = baseY + (step.tier - 1) * tierSpacing;

    // Category-based horizontal positioning to prevent crossing
    const categoryPositions: Record<SkillCategory, number> = {
      foundation: 500, // Center
      reading: 200, // Far left
      speaking: 400, // Center-left
      writing: 600, // Center-right
      listening: 800, // Far right
    };

    let x = categoryPositions[step.category];

    // Handle branching paths in listening category
    // Step 9 (Cultural Context) goes slightly left, Step 15 (Accent Recognition) goes slightly right
    if (step.id === 9) {
      x = x - 60; // Shift left
    } else if (step.id === 15) {
      x = x + 60; // Shift right
    }

    return { x, y };
  };

  // Check if a step is unlocked (all prerequisites completed)
  const isStepUnlocked = (step: LearningStep) => {
    if (step.prerequisites.length === 0) return true;
    return step.prerequisites.every((prereqId) =>
      progress.completedSteps.includes(prereqId)
    );
  };

  // Generate SVG lines connecting prerequisites to steps
  const renderConnections = () => {
    const connections: JSX.Element[] = [];

    steps.forEach((step) => {
      const stepPos = getNodePosition(step);
      const isUnlocked = isStepUnlocked(step);
      const isCompleted = progress.completedSteps.includes(step.id);

      step.prerequisites.forEach((prereqId) => {
        const prereq = steps.find((s) => s.id === prereqId);
        if (!prereq) return;

        const prereqPos = getNodePosition(prereq);
        const prereqCompleted = progress.completedSteps.includes(prereqId);

        // Determine line color based on state and category
        let strokeColor = "#E5E7EB"; // gray for locked
        let strokeWidth = 3;
        let opacity = 0.3;

        if (prereqCompleted && isCompleted) {
          strokeColor = categoryColors[step.category].primary;
          strokeWidth = 4;
          opacity = 0.8;
        } else if (prereqCompleted && isUnlocked) {
          strokeColor = categoryColors[step.category].primary;
          strokeWidth = 4;
          opacity = 0.6;
        } else if (prereqCompleted) {
          strokeColor = categoryColors[step.category].primary;
          strokeWidth = 3;
          opacity = 0.4;
        }

        // Use quadratic curve for smoother connections
        const midX = (prereqPos.x + stepPos.x) / 2;
        const midY = (prereqPos.y + stepPos.y) / 2;

        connections.push(
          <path
            key={`${prereqId}-${step.id}`}
            d={`M ${prereqPos.x} ${prereqPos.y} Q ${midX} ${midY} ${stepPos.x} ${stepPos.y}`}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={opacity}
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        );
      });
    });

    return connections;
  };

  // Render category labels
  const renderCategoryLabels = () => {
    const categories: SkillCategory[] = [
      "reading",
      "speaking",
      "writing",
      "listening",
    ];

    return categories.map((category) => {
      const categorySteps = steps.filter((s) => s.category === category);
      if (categorySteps.length === 0) return null;

      const colors = categoryColors[category];
      const firstStep = categorySteps[0];
      const pos = getNodePosition(firstStep);

      const categoryNames = {
        reading: "📖 Reading Path",
        speaking: "🗣️ Speaking Path",
        writing: "✍️ Writing Path",
        listening: "👂 Listening Path",
      };

      return (
        <div
          key={category}
          className="absolute top-4 px-4 py-2 rounded-full border-2 shadow-lg backdrop-blur-sm"
          style={{
            left: `${pos.x - 60}px`,
            backgroundColor: colors.secondary,
            borderColor: colors.border,
            color: colors.text,
          }}
        >
          <span className="text-sm">{categoryNames[category]}</span>
        </div>
      );
    });
  };

  return (
    <div className="relative w-full h-full min-h-[1000px]">
      {/* SVG for connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          {/* Glow filter for active connections */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {renderConnections()}
      </svg>

      {/* Category labels */}
      {renderCategoryLabels()}

      {/* Skill nodes */}
      {steps.map((step) => {
        const isCompleted = progress.completedSteps.includes(step.id);
        const isUnlocked = isStepUnlocked(step);
        const isCurrent = !isCompleted && isUnlocked;
        const position = getNodePosition(step);

        return (
          <SkillTreeNode
            key={step.id}
            step={step}
            isCompleted={isCompleted}
            isUnlocked={isUnlocked}
            isCurrent={isCurrent}
            onClick={() => onStepClick(step.id)}
            position={position}
          />
        );
      })}
    </div>
  );
}
