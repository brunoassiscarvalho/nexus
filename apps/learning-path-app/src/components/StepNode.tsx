import { Circle, Lock, Check, Star } from "lucide-react";
 { cn },

interface StepNodeProps {
  stepNumber: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
  onClick: () => void;
  position: { x: number; y: number };
}

export function StepNode({
  stepNumber,
  isCompleted,
  isUnlocked,
  isCurrent,
  onClick,
  position,
}: StepNodeProps) {
  const getNodeStyle = () => {
    if (isCompleted) return "bg-green-500 border-green-600 hover:bg-green-600";
    if (isCurrent)
      return "bg-blue-500 border-blue-600 hover:bg-blue-600 animate-pulse";
    if (isUnlocked)
      return "bg-purple-500 border-purple-600 hover:bg-purple-600";
    return "bg-gray-400 border-gray-500 cursor-not-allowed";
  };

  const getIcon = () => {
    if (isCompleted) return <Check className="w-8 h-8 text-white" />;
    if (!isUnlocked) return <Lock className="w-6 h-6 text-white" />;
    if (isCurrent) return <Star className="w-8 h-8 text-white" />;
    return <Circle className="w-6 h-6 text-white fill-white" />;
  };

  return (
    <div
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <button
        onClick={onClick}
        disabled={!isUnlocked}
        className={cn(
          "w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-lg",
          getNodeStyle(),
          isUnlocked && "cursor-pointer transform hover:scale-110"
        )}
      >
        {getIcon()}
      </button>
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span
          className={cn(
            "px-3 py-1 rounded-full text-sm",
            isCompleted && "bg-green-100 text-green-700",
            isCurrent && "bg-blue-100 text-blue-700",
            isUnlocked &&
              !isCurrent &&
              !isCompleted &&
              "bg-purple-100 text-purple-700",
            !isUnlocked && "bg-gray-100 text-gray-500"
          )}
        >
          Step {stepNumber}
        </span>
      </div>
    </div>
  );
}
