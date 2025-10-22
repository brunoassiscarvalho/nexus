import { useRef, useMemo, useState, useEffect } from "react";
import { LearningStep } from "../types/learning";
import { categoryColors } from "../data/learningSteps";
import { Plus, Star } from "lucide-react";
import { cn } from "@nexus/ui";

interface FlowchartEditorProps {
  steps: LearningStep[];
  selectedNodeId: number | null;
  onNodeSelect: (nodeId: number) => void;
  onAddChildNode: (parentId: number) => void;
  onAddNodeAtTier?: (tier: number, category?: string) => void;
}

export function FlowchartEditor({
  steps,
  selectedNodeId,
  onNodeSelect,
  onAddChildNode,
  onAddNodeAtTier,
}: FlowchartEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan/drag state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });

  // Pan/drag handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning || !containerRef.current) return;

      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;

      containerRef.current.scrollLeft = scrollStart.x - dx;
      containerRef.current.scrollTop = scrollStart.y - dy;
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isPanning, panStart, scrollStart]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start panning on background, not on nodes or buttons
    if (
      e.target === canvasRef.current ||
      (e.target as HTMLElement).tagName === "svg" ||
      (e.target as HTMLElement).tagName === "rect"
    ) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setScrollStart({
        x: containerRef.current?.scrollLeft || 0,
        y: containerRef.current?.scrollTop || 0,
      });
    }
  };

  // Advanced tree layout algorithm with proper spacing
  const nodePositions = useMemo(() => {
    const positions = new Map<number, { x: number; y: number }>();

    const HORIZONTAL_SPACING = 300;
    const VERTICAL_SPACING = 240; // Increased for better connection routing

    // Get children of a node
    const getChildren = (nodeId: number): LearningStep[] => {
      return steps.filter((s) => s.prerequisites.includes(nodeId));
    };

    // Use stored tier values instead of calculating
    const getTier = (nodeId: number): number => {
      const node = steps.find((s) => s.id === nodeId);
      return node ? node.tier : 0;
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

  // Calculate tier structure for empty tier detection
  // Use stored tier values instead of calculating them
  const tierStructure = useMemo(() => {
    const maxTier =
      steps.length > 0 ? Math.max(...steps.map((s) => s.tier)) : 0;
    const tierMap = new Map<number, LearningStep[]>();

    // Initialize all tiers from 0 to maxTier
    for (let i = 0; i <= maxTier; i++) {
      tierMap.set(i, []);
    }

    // Populate tiers with nodes using their stored tier values
    steps.forEach((step) => {
      if (!tierMap.has(step.tier)) {
        tierMap.set(step.tier, []);
      }
      tierMap.get(step.tier)?.push(step);
    });

    return { tierMap, maxTier };
  }, [steps]);

  const renderConnections = () => {
    const connections: JSX.Element[] = [];

    // Find the mastery node (final convergence point)
    const getTier = (nodeId: number): number => {
      const node = steps.find((s) => s.id === nodeId);
      if (!node || node.prerequisites.length === 0) return 0;
      const parentTiers = node.prerequisites.map((pid) => getTier(pid));
      return Math.max(...parentTiers) + 1;
    };

    const maxTier = Math.max(...steps.map((s) => getTier(s.id)));
    const masteryNode = steps.find(
      (s) =>
        getTier(s.id) === maxTier &&
        s.prerequisites.length > 1 &&
        steps.filter((child) => child.prerequisites.includes(s.id)).length === 0
    );

    const masteryPos = masteryNode ? nodePositions.get(masteryNode.id) : null;
    const masteryY = masteryPos?.y || null;

    // Calculate the convergence Y position - 2em (32px) above mastery node
    const convergenceY = masteryY !== null ? masteryY - 32 - 85 : null; // 85 is the node offset

    // Get all node positions to check for clearance
    const allNodePositions = Array.from(nodePositions.values());

    steps.forEach((step) => {
      const stepPos = nodePositions.get(step.id);
      if (!stepPos) return;

      // Check if this is a leaf node (no children)
      const hasChildren = steps.some((s) => s.prerequisites.includes(step.id));
      const isLeaf = !hasChildren;
      const isMastery = step.id === masteryNode?.id;

      step.prerequisites.forEach((prereqId) => {
        const prereqPos = nodePositions.get(prereqId);
        if (!prereqPos) return;

        const colors = categoryColors[step.category];

        const startX = prereqPos.x;
        const startY = prereqPos.y + 85; // Bottom of parent node
        const endX = stepPos.x;
        const endY = stepPos.y - 85; // Top of child node

        let path: string;

        // Special routing for connections to the mastery node
        if (isMastery && convergenceY !== null) {
          const prereqNode = steps.find((s) => s.id === prereqId);
          const prereqHasChildren = steps.some((s) =>
            s.prerequisites.includes(prereqId)
          );

          // All connections to mastery should go through convergence zone
          if (prereqNode && !prereqHasChildren) {
            // This is a leaf node connecting to mastery
            // Route DOWN past all nodes, then ACROSS at convergence level, then DOWN to mastery

            // Find the lowest Y position of any node between this leaf and mastery
            const nodesInPath = allNodePositions.filter((pos) => {
              const isBetween = pos.y > startY && pos.y < convergenceY;
              return isBetween;
            });

            let clearanceY = convergenceY;
            if (nodesInPath.length > 0) {
              const maxNodeY = Math.max(...nodesInPath.map((p) => p.y));
              // Go below the lowest node + node height + padding
              clearanceY = Math.max(clearanceY, maxNodeY + 85 + 60);
            }

            path = `M ${startX} ${startY} 
                    L ${startX} ${clearanceY} 
                    L ${endX} ${clearanceY} 
                    L ${endX} ${endY}`;
          } else {
            // Non-leaf parent to mastery - also use convergence routing
            path = `M ${startX} ${startY} 
                    L ${startX} ${convergenceY} 
                    L ${endX} ${convergenceY} 
                    L ${endX} ${endY}`;
          }
        } else {
          // Standard orthogonal routing for normal connections
          // Check if there are nodes in the path and route around them
          const midY = (startY + endY) / 2;

          // Find nodes that might be in the way
          const nodesInWay = allNodePositions.filter((pos) => {
            const isInVerticalRange = pos.y > startY && pos.y < endY;
            const isInHorizontalRange =
              (startX < endX && pos.x > startX && pos.x < endX) ||
              (startX > endX && pos.x < startX && pos.x > endX);
            return isInVerticalRange && isInHorizontalRange;
          });

          let routingY = midY;
          if (nodesInWay.length > 0) {
            // Route below the nodes
            const maxNodeY = Math.max(...nodesInWay.map((p) => p.y));
            routingY = Math.max(midY, maxNodeY + 85 + 40); // 85 for node offset, 40 for clearance
          }

          path = `M ${startX} ${startY} L ${startX} ${routingY} L ${endX} ${routingY} L ${endX} ${endY}`;
        }

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

  // Render add buttons for empty tiers
  const renderEmptyTierButtons = () => {
    const buttons: JSX.Element[] = [];
    const VERTICAL_SPACING = 240;

    tierStructure.tierMap.forEach((nodesInTier, tier) => {
      if (
        nodesInTier.length === 0 &&
        tier > 0 &&
        tier < tierStructure.maxTier
      ) {
        // This is an empty tier in the middle - show add button
        const y = 120 + tier * VERTICAL_SPACING;
        const x = 400; // Center position

        buttons.push(
          <div
            key={`empty-tier-${tier}`}
            className="absolute group"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <button
              onClick={() => onAddNodeAtTier?.(tier)}
              className="w-16 h-16 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110 border-4 border-white"
              title={`Add node at tier ${tier}`}
            >
              <Plus className="w-8 h-8 text-white" />
            </button>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-purple-600 text-white px-3 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Add Node at Tier {tier}
            </div>
          </div>
        );
      }
    });

    return buttons;
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
        {!isMasteryChallenge && (
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
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto"
      style={{ cursor: isPanning ? "grabbing" : "grab" }}
    >
      <div
        ref={canvasRef}
        className="relative bg-gradient-to-br from-slate-50 to-slate-100"
        onMouseDown={handleMouseDown}
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          userSelect: "none",
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
          <defs>
            {/* Gradient for convergence zone */}
            <linearGradient
              id="convergence-gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#9333EA" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#9333EA" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {renderConnections()}
        </svg>

        {/* Nodes */}
        <div className="relative" style={{ zIndex: 2 }}>
          {steps.map((step) => renderNode(step))}
          {renderEmptyTierButtons()}
        </div>
      </div>
    </div>
  );
}
