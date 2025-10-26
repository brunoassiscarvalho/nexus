import { SkillTreeNode } from "./SkillTreeNode";
import { LearningStep, UserProgress, SkillCategory } from "../types/learning";
import { categoryColors } from "../data/learningSteps";
import { useMemo, useRef, useState, useEffect } from "react";

interface SkillTreeProps {
  steps: LearningStep[];
  progress: UserProgress;
  onStepClick: (stepId: number) => void;
}

interface BranchTierCell {
  category: SkillCategory;
  tier: number;
  nodes: LearningStep[];
}

export function SkillTree({ steps, progress, onStepClick }: SkillTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Nested Grid System: Branch (category) x Tier grid with subgrids
  const gridStructure = useMemo(() => {
    const orderedCategories: SkillCategory[] = [
      "foundation",
      "reading",
      "speaking",
      "writing",
      "listening",
    ];

    // Calculate depth (tier) for each node
    const getDepth = (nodeId: number, visited = new Set<number>()): number => {
      if (visited.has(nodeId)) return 0;
      visited.add(nodeId);

      const node = steps.find((s) => s.id === nodeId);
      if (!node || node.prerequisites.length === 0) return 0;

      const parentDepths = node.prerequisites.map((pid) =>
        getDepth(pid, new Set(visited))
      );
      return Math.max(...parentDepths) + 1;
    };

    // Calculate depth for all nodes
    const nodeDepths = new Map<number, number>();
    steps.forEach((step) => {
      nodeDepths.set(step.id, getDepth(step.id));
    });

    // Get max tier
    const maxTier = Math.max(...Array.from(nodeDepths.values()));

    // Group nodes by category (branch) and tier
    const branchTierCells: BranchTierCell[] = [];

    orderedCategories.forEach((category) => {
      for (let tier = 0; tier <= maxTier; tier++) {
        const nodesInCell = steps.filter(
          (step) =>
            step.category === category && nodeDepths.get(step.id) === tier
        );

        if (nodesInCell.length > 0) {
          branchTierCells.push({
            category,
            tier,
            nodes: nodesInCell.sort((a, b) => a.id - b.id),
          });
        }
      }
    });

    // Calculate node positions for connections
    const nodePositions = new Map<
      number,
      { x: number; y: number; category: SkillCategory; tier: number }
    >();

    // For each category, calculate its column index
    const categoryIndices = new Map<SkillCategory, number>();
    orderedCategories.forEach((cat, idx) => {
      categoryIndices.set(cat, idx);
    });

    // Position each node
    branchTierCells.forEach((cell) => {
      const categoryIndex = categoryIndices.get(cell.category) || 0;
      const branchWidth = containerWidth / orderedCategories.length;
      const branchStartX = categoryIndex * branchWidth;

      cell.nodes.forEach((node, nodeIndex) => {
        const subgridColumns = cell.nodes.length;
        const subColumnWidth = branchWidth / subgridColumns;
        const x =
          branchStartX + nodeIndex * subColumnWidth + subColumnWidth / 2;
        const y = cell.tier * 240 + 200; // 200 for top padding

        nodePositions.set(node.id, {
          x,
          y,
          category: cell.category,
          tier: cell.tier,
        });
      });
    });

    return {
      branchTierCells,
      nodePositions,
      orderedCategories,
      totalTiers: maxTier + 1,
      totalBranches: orderedCategories.length,
    };
  }, [steps, containerWidth]);

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

    type ConnectionData = {
      prereqId: number;
      stepId: number;
      prereqPos: { x: number; y: number };
      stepPos: { x: number; y: number };
      strokeColor: string;
      strokeWidth: number;
      opacity: number;
    };

    const connectionData: ConnectionData[] = [];

    steps.forEach((step) => {
      const stepPos = gridStructure.nodePositions.get(step.id);
      if (!stepPos) return;

      const isUnlocked = isStepUnlocked(step);
      const isCompleted = progress.completedSteps.includes(step.id);

      step.prerequisites.forEach((prereqId) => {
        const prereq = steps.find((s) => s.id === prereqId);
        if (!prereq) return;

        const prereqPos = gridStructure.nodePositions.get(prereqId);
        if (!prereqPos) return;

        const prereqCompleted = progress.completedSteps.includes(prereqId);

        // Determine line color based on state and category
        let strokeColor = "#D1D5DB"; // gray for locked
        let strokeWidth = 2.5;
        let opacity = 0.35;

        if (prereqCompleted && isCompleted) {
          strokeColor = categoryColors[step.category].primary;
          strokeWidth = 3.5;
          opacity = 0.85;
        } else if (prereqCompleted && isUnlocked) {
          strokeColor = categoryColors[step.category].primary;
          strokeWidth = 3.5;
          opacity = 0.65;
        } else if (prereqCompleted) {
          strokeColor = categoryColors[step.category].primary;
          strokeWidth = 2.5;
          opacity = 0.45;
        }

        connectionData.push({
          prereqId,
          stepId: step.id,
          prereqPos: { x: prereqPos.x, y: prereqPos.y },
          stepPos: { x: stepPos.x, y: stepPos.y },
          strokeColor,
          strokeWidth,
          opacity,
        });
      });
    });

    // Calculate routing offset to prevent overlaps
    const getRoutingOffset = (conn: ConnectionData): number => {
      const siblingConnections = connectionData.filter(
        (c) => c.stepId === conn.stepId && c.prereqId !== conn.prereqId
      );

      if (siblingConnections.length === 0) return 0;

      const allToSameChild = connectionData.filter(
        (c) => c.stepId === conn.stepId
      );
      const myIndex = allToSameChild.findIndex(
        (c) => c.prereqId === conn.prereqId
      );
      const totalSiblings = allToSameChild.length;

      if (totalSiblings === 1) return 0;

      const spreadRange = 30;
      const offset = (myIndex - (totalSiblings - 1) / 2) * spreadRange;

      return offset;
    };

    // Render each connection with smart routing
    connectionData.forEach((conn) => {
      const startX = conn.prereqPos.x;
      const startY = conn.prereqPos.y + 50; // Bottom of parent node
      const endX = conn.stepPos.x;
      const endY = conn.stepPos.y - 50; // Top of child node

      const routingOffset = getRoutingOffset(conn);
      const midY = (startY + endY) / 2 + routingOffset;

      // Create orthogonal path
      const path = `M ${startX},${startY} L ${startX},${midY} L ${endX},${midY} L ${endX},${endY}`;

      connections.push(
        <path
          key={`line-${conn.prereqId}-${conn.stepId}`}
          d={path}
          stroke={conn.strokeColor}
          strokeWidth={conn.strokeWidth}
          opacity={conn.opacity}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
      );

      // Add arrow head
      connections.push(
        <polygon
          key={`arrow-${conn.prereqId}-${conn.stepId}`}
          points={`${endX},${endY} ${endX - 6},${endY - 10} ${endX + 6},${endY - 10}`}
          fill={conn.strokeColor}
          opacity={conn.opacity}
          className="transition-all duration-300"
        />
      );
    });

    return connections;
  };

  // Render category labels
  const renderCategoryLabels = () => {
    return gridStructure.orderedCategories.map((category, index) => {
      const categorySteps = steps.filter((s) => s.category === category);
      if (categorySteps.length === 0) return null;

      const colors = categoryColors[category];
      const branchWidth = containerWidth / gridStructure.totalBranches;
      const labelX = index * branchWidth + branchWidth / 2;

      const categoryNames = {
        foundation: "⭐ Foundation",
        reading: "📖 Reading",
        speaking: "🗣️ Speaking",
        writing: "✍️ Writing",
        listening: "👂 Listening",
      };

      return (
        <div
          key={category}
          className="absolute top-4 px-5 py-2.5 rounded-full border-2 shadow-lg backdrop-blur-sm transition-all z-10"
          style={{
            left: `${labelX}px`,
            transform: "translateX(-50%)",
            backgroundColor: colors.secondary,
            borderColor: colors.border,
            color: colors.text,
          }}
        >
          <span className="text-sm whitespace-nowrap">
            {categoryNames[category]}
          </span>
        </div>
      );
    });
  };

  const gridHeight = gridStructure.totalTiers * 240 + 200;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ minHeight: `${gridHeight}px` }}
    >
      {/* SVG for connection lines */}
      <svg
        className="skill-tree-svg absolute inset-0 w-full pointer-events-none"
        style={{ height: `${gridHeight}px` }}
      >
        <defs>
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

      {/* Main Grid: Branches (columns) x Tiers (rows) */}
      <div
        className="grid gap-0 w-full relative"
        style={{
          gridTemplateColumns: `repeat(${gridStructure.totalBranches}, 1fr)`,
          gridTemplateRows: `repeat(${gridStructure.totalTiers}, 240px)`,
          paddingTop: "80px",
        }}
      >
        {/* Grid visual guides (optional, subtle) */}
        {Array.from({ length: gridStructure.totalBranches - 1 }, (_, i) => (
          <div
            key={`vline-${i}`}
            className="absolute top-0 bottom-0 border-l border-border/5 pointer-events-none"
            style={{
              left: `${((i + 1) / gridStructure.totalBranches) * 100}%`,
            }}
          />
        ))}
        {/* Render cells for each branch-tier combination */}
        {gridStructure.orderedCategories.map((category, categoryIndex) => {
          return Array.from(
            { length: gridStructure.totalTiers },
            (_, tierIndex) => {
              const cell = gridStructure.branchTierCells.find(
                (c) => c.category === category && c.tier === tierIndex
              );

              if (!cell || cell.nodes.length === 0) {
                // Empty cell
                return (
                  <div
                    key={`${category}-${tierIndex}`}
                    className="border-border/10"
                    style={{
                      gridColumn: categoryIndex + 1,
                      gridRow: tierIndex + 1,
                    }}
                  />
                );
              }

              // Cell with nodes - create subgrid
              return (
                <div
                  key={`${category}-${tierIndex}`}
                  className="grid gap-0"
                  style={{
                    gridColumn: categoryIndex + 1,
                    gridRow: tierIndex + 1,
                    gridTemplateColumns: `repeat(${cell.nodes.length}, 1fr)`,
                    gridTemplateRows: "1fr",
                  }}
                >
                  {cell.nodes.map((node, nodeIndex) => {
                    const isCompleted = progress.completedSteps.includes(
                      node.id
                    );
                    const isUnlocked = isStepUnlocked(node);
                    const isCurrent = !isCompleted && isUnlocked;

                    return (
                      <div
                        key={node.id}
                        className="flex items-center justify-center"
                        style={{
                          gridColumn: nodeIndex + 1,
                          gridRow: 1,
                        }}
                      >
                        <button
                          onClick={() => onStepClick(node.id)}
                          disabled={!isUnlocked}
                          data-step-id={node.id}
                          className="group relative"
                        >
                          <SkillTreeNode
                            step={node}
                            isCompleted={isCompleted}
                            isUnlocked={isUnlocked}
                            isCurrent={isCurrent}
                            onClick={() => {}}
                            position={{ x: 0, y: 0 }}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            }
          );
        })}
      </div>
    </div>
  );
}
