import { useRef, useMemo } from "react";
import { LearningStep } from "../types/learning";
import { ScrollArea } from "@nexus/ui";
import { categoryColors } from "../data/learningSteps";
import { Plus, Star } from "lucide-react";
import { cn } from "@nexus/ui";

interface FlowchartEditorProps {
  steps: LearningStep[];
  selectedNodeId: number | null;
  onNodeSelect: (nodeId: number) => void;
  onAddChildNode: (parentId: number) => void;
}

export function FlowchartEditor({
  steps,
  selectedNodeId,
  onNodeSelect,
  onAddChildNode,
}: FlowchartEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Advanced tree layout algorithm with proper spacing
  const nodePositions = useMemo(() => {
    const positions = new Map<number, { x: number; y: number }>();

    const HORIZONTAL_SPACING = 300;
    const VERTICAL_SPACING = 240; // Increased for better connection routing

    // Get children of a node
    const getChildren = (nodeId: number): LearningStep[] => {
      return steps.filter((s) => s.prerequisites.includes(nodeId));
    };

    // Calculate tier for each node (handle multiple parents)
    const getTier = (nodeId: number, visited = new Set<number>()): number => {
      if (visited.has(nodeId)) return 0;
      visited.add(nodeId);

      const node = steps.find((s) => s.id === nodeId);
      if (!node || node.prerequisites.length === 0) return 0;

      const parentTiers = node.prerequisites.map((pid) =>
        getTier(pid, new Set(visited))
      );
      return Math.max(...parentTiers) + 1;
    };

    // Get all nodes at a specific tier
    const getNodesAtTier = (tier: number): LearningStep[] => {
      return steps.filter((s) => getTier(s.id) === tier);
    };

    // Calculate subtree width
    const getSubtreeWidth = (
      nodeId: number,
      visited = new Set<number>()
    ): number => {
      if (visited.has(nodeId)) return HORIZONTAL_SPACING;
      visited.add(nodeId);

      const children = getChildren(nodeId);
      if (children.length === 0) return HORIZONTAL_SPACING;

      let totalWidth = 0;
      children.forEach((child) => {
        totalWidth += getSubtreeWidth(child.id, new Set(visited));
      });

      return Math.max(totalWidth, HORIZONTAL_SPACING);
    };

    // Position nodes recursively
    const positionNode = (
      nodeId: number,
      leftBound: number,
      visited = new Set<number>()
    ): number => {
      if (visited.has(nodeId)) {
        const existing = positions.get(nodeId);
        return existing ? existing.x + HORIZONTAL_SPACING / 2 : leftBound;
      }
      visited.add(nodeId);

      const tier = getTier(nodeId);
      const children = getChildren(nodeId);
      const y = 120 + tier * VERTICAL_SPACING;

      if (children.length === 0) {
        // Leaf node
        positions.set(nodeId, {
          x: leftBound + HORIZONTAL_SPACING / 2,
          y,
        });
        return leftBound + HORIZONTAL_SPACING;
      }

      // Position children first
      let currentX = leftBound;
      const childXPositions: number[] = [];

      children.forEach((child) => {
        const childStartX = currentX;
        currentX = positionNode(child.id, childStartX, new Set(visited));
        const childPos = positions.get(child.id);
        if (childPos) {
          childXPositions.push(childPos.x);
        }
      });

      // Center parent over children
      if (childXPositions.length > 0) {
        const minX = Math.min(...childXPositions);
        const maxX = Math.max(...childXPositions);
        const centerX = (minX + maxX) / 2;
        positions.set(nodeId, { x: centerX, y });
      } else {
        positions.set(nodeId, {
          x: leftBound + HORIZONTAL_SPACING / 2,
          y,
        });
      }

      return currentX;
    };

    // Find all root nodes
    const rootNodes = steps.filter((s) => s.prerequisites.length === 0);

    // Position each root tree
    let globalX = 150;
    rootNodes.forEach((root) => {
      globalX = positionNode(root.id, globalX);
      globalX += HORIZONTAL_SPACING * 0.5;
    });

    // Handle nodes with multiple parents - position them centered below all parents
    steps.forEach((step) => {
      if (step.prerequisites.length > 1) {
        const parentPositions = step.prerequisites
          .map((pid) => positions.get(pid))
          .filter((p) => p !== undefined) as {
          x: number;
          y: number;
        }[];

        if (parentPositions.length > 0) {
          const avgX =
            parentPositions.reduce((sum, p) => sum + p.x, 0) /
            parentPositions.length;
          const maxParentTier = Math.max(
            ...step.prerequisites.map((pid) => getTier(pid))
          );
          const y = 120 + (maxParentTier + 1) * VERTICAL_SPACING;

          positions.set(step.id, { x: avgX, y });
        }
      }
    });

    return positions;
  }, [steps]);

  const renderConnections = () => {
    const connections: JSX.Element[] = [];

    steps.forEach((step) => {
      const stepPos = nodePositions.get(step.id);
      if (!stepPos) return;

      step.prerequisites.forEach((prereqId) => {
        const prereqPos = nodePositions.get(prereqId);
        if (!prereqPos) return;

        const colors = categoryColors[step.category];

        const startX = prereqPos.x;
        const startY = prereqPos.y + 85;
        const endX = stepPos.x;
        const endY = stepPos.y - 85;

        const midY = (startY + endY) / 2;

        const path = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;

        connections.push(
          <path
            key={`line-${prereqId}-${step.id}`}
            d={path}
            stroke={colors.primary}
            strokeWidth={3}
            fill="none"
            opacity={0.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

        // Arrow head
        connections.push(
          <polygon
            key={`arrow-${prereqId}-${step.id}`}
            points={`${endX},${endY} ${endX - 7},${endY - 12} ${endX + 7},${endY - 12}`}
            fill={colors.primary}
            opacity={0.4}
          />
        );
      });
    });

    return connections;
  };

  const renderNode = (step: LearningStep) => {
    const position = nodePositions.get(step.id);
    if (!position) return null;

    const colors = categoryColors[step.category];
    const isSelected = selectedNodeId === step.id;
    const isRoot = step.prerequisites.length === 0;
    const children = steps.filter((s) => s.prerequisites.includes(step.id));
    const hasChildren = children.length > 0;

    // Check if this is the Mastery Challenge (final convergence)
    const currentMaxTier = Math.max(...steps.map((s) => s.tier));
    const isMasteryChallenge =
      step.tier === currentMaxTier &&
      step.prerequisites.length > 1 &&
      !hasChildren;

    return (
      <div
        key={step.id}
        className="absolute group"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Selection ring */}
        {isSelected && (
          <div
            className="absolute -inset-3 rounded-2xl border-4 pointer-events-none animate-pulse"
            style={{
              borderColor: colors.primary,
              boxShadow: `0 0 20px ${colors.primary}50`,
            }}
          />
        )}

        {/* Node Card */}
        <button
          onClick={() => onNodeSelect(step.id)}
          className={cn(
            "relative w-56 h-40 rounded-2xl border-4 flex flex-col items-center justify-center p-4 transition-all shadow-xl hover:shadow-2xl cursor-pointer hover:scale-105",
            "bg-white"
          )}
          style={{
            borderColor: colors.border,
          }}
        >
          {/* Color indicator bar */}
          <div
            className="absolute top-0 left-0 right-0 h-2 rounded-t-xl"
            style={{ backgroundColor: colors.primary }}
          />

          {/* Node Title - Inside the card */}
          <div className="flex-1 flex items-center justify-center w-full px-2">
            <h3
              className="text-center line-clamp-3 text-sm leading-tight"
              style={{ color: colors.text }}
            >
              {step.title}
            </h3>
          </div>

          {/* Bottom info */}
          <div
            className="flex items-center justify-between w-full mt-2 pt-2 border-t"
            style={{ borderColor: colors.border + "40" }}
          >
            <div
              className="px-2 py-1 rounded-lg text-xs"
              style={{
                backgroundColor: colors.secondary,
                color: colors.text,
              }}
            >
              Tier {step.tier}
            </div>
            <div
              className="px-2 py-1 rounded-lg text-xs flex items-center gap-1"
              style={{
                backgroundColor: colors.primary,
                color: "white",
              }}
            >
              <span>{step.skillPoints}</span>
              <span className="opacity-75">pts</span>
            </div>
          </div>

          {/* ID badge */}
          <div
            className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center text-xs shadow-md"
            style={{
              borderColor: colors.border,
              color: colors.text,
            }}
          >
            {step.id}
          </div>
        </button>

        {/* Add Child Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddChildNode(step.id);
          }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
          title="Add child node"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>

        {/* Mastery Challenge indicator */}
        {isMasteryChallenge && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs bg-purple-600 text-white px-3 py-1 rounded-full shadow-md pointer-events-none flex items-center gap-1">
            <Star className="w-3 h-3" />
            MASTERY CHALLENGE
          </div>
        )}

        {/* Root indicator */}
        {isRoot && !isMasteryChallenge && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs bg-amber-500 text-white px-3 py-1 rounded-full shadow-md pointer-events-none">
            ROOT
          </div>
        )}

        {/* Leaf indicator */}
        {!hasChildren && !isRoot && !isMasteryChallenge && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs bg-green-500 text-white px-3 py-1 rounded-full shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            LEAF
          </div>
        )}
      </div>
    );
  };

  // Calculate canvas size
  const canvasSize = useMemo(() => {
    let maxX = 0;
    let maxY = 0;

    nodePositions.forEach((pos) => {
      maxX = Math.max(maxX, pos.x);
      maxY = Math.max(maxY, pos.y);
    });

    return {
      width: Math.max(maxX + 500, 1400),
      height: Math.max(maxY + 400, 1200),
    };
  }, [nodePositions]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100">
      <ScrollArea className="w-full h-full">
        <div
          ref={canvasRef}
          className="relative bg-gradient-to-br from-slate-50 to-slate-100"
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
          }}
        >
          {/* Dot grid background */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <defs>
              <pattern
                id="dot-grid"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1.5" fill="#CBD5E1" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid)" />
          </svg>

          {/* Connection lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              width: `${canvasSize.width}px`,
              height: `${canvasSize.height}px`,
              zIndex: 1,
            }}
          >
            {renderConnections()}
          </svg>

          {/* Nodes */}
          <div className="relative" style={{ zIndex: 2 }}>
            {steps.map((step) => renderNode(step))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
