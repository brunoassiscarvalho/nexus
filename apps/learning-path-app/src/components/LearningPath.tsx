import { StepNode } from "./StepNode";
import { LearningStep, UserProgress } from "../types/learning";

interface LearningPathProps {
  steps: LearningStep[];
  progress: UserProgress;
  onStepClick: (stepId: number) => void;
}

export function LearningPath({ steps, progress, onStepClick }: LearningPathProps) {
  // Calculate S-curve positions for 10 steps
  const getStepPosition = (index: number) => {
    const totalSteps = steps.length;
    const verticalSpacing = 140; // Space between steps vertically
    const yPosition = index * verticalSpacing + 100;
    
    // Create S-curve effect by alternating x positions
    let xPosition: number;
    const segment = Math.floor(index / 3);
    
    if (segment % 2 === 0) {
      // Moving right
      const posInSegment = index % 3;
      xPosition = 20 + (posInSegment * 30);
    } else {
      // Moving left
      const posInSegment = index % 3;
      xPosition = 80 - (posInSegment * 30);
    }
    
    return { x: xPosition, y: yPosition };
  };

  // Generate path SVG for connecting lines
  const generatePathD = () => {
    let pathCommands = "";
    
    for (let i = 0; i < steps.length - 1; i++) {
      const current = getStepPosition(i);
      const next = getStepPosition(i + 1);
      
      // Convert percentage to pixel for path calculation
      const currentX = (current.x / 100) * 800; // Assuming container width
      const nextX = (next.x / 100) * 800;
      
      if (i === 0) {
        pathCommands += `M ${currentX} ${current.y} `;
      }
      
      // Create smooth curves between points
      const controlPointY = (current.y + next.y) / 2;
      pathCommands += `Q ${currentX} ${controlPointY}, ${nextX} ${next.y} `;
    }
    
    return pathCommands;
  };

  return (
    <div className="relative w-full" style={{ height: `${steps.length * 140 + 200}px` }}>
      {/* SVG Path connecting the steps */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d={generatePathD()}
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="8,8"
        />
      </svg>

      {/* Step Nodes */}
      {steps.map((step, index) => {
        const isCompleted = progress.completedSteps.includes(step.id);
        const isUnlocked =
          index === 0 ||
          progress.completedSteps.includes(steps[index - 1].id);
        const isCurrent = step.id === progress.currentStep;
        const position = getStepPosition(index);

        return (
          <StepNode
            key={step.id}
            stepNumber={step.id}
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
