import { SkillTreeNode } from "./SkillTreeNode";
import { LearningStep, UserProgress, SkillCategory } from "../types/learning";
import { categoryColors } from "../data/learningSteps";
import { useMemo } from "react";

interface SkillTreeProps {
  steps: LearningStep[];
  progress: UserProgress;
  onStepClick: (stepId: number) => void;
}

export function SkillTree({ steps, progress, onStepClick }: SkillTreeProps) {
  // Dynamic tree layout algorithm - organized by category to prevent crossing
  const nodePositions = useMemo(() => {
    const positions = new Map<number, { x: number; y: number }>();

    const HORIZONTAL_SPACING = 280;
    const VERTICAL_SPACING = 220;
    const CATEGORY_SPACING = 100; // Extra space between category groups

    // Get children of a node
    const getChildren = (nodeId: number): LearningStep[] => {
      return steps.filter((s) => s.prerequisites.includes(nodeId));
    };

    // Calculate depth (tier) for each node
    const getDepth = (nodeId: number, visited = new Set<number>()): number => {
      if (visited.has(nodeId)) return 0;
      visited.add(nodeId);

      const node = steps.find((s) => s.id === nodeId);
      if (!node || node.prerequisites.length === 0) return 0;

      const parentDepths = node.prerequisites.map((pid) =>
        getDepth(pid, new Set(visited)),
      );
      return Math.max(...parentDepths) + 1;
    };

    // Group nodes by category and depth
    const categoryGroups = new Map<SkillCategory, LearningStep[]>();
    steps.forEach((step) => {
      if (!categoryGroups.has(step.category)) {
        categoryGroups.set(step.category, []);
      }
      categoryGroups.get(step.category)!.push(step);
    });

    // Sort categories for consistent layout
    const orderedCategories: SkillCategory[] = ["foundation", "reading", "speaking", "writing", "listening"];
    
    // Calculate subtree width
    const getSubtreeWidth = (nodeId: number, memo = new Map<number, number>()): number => {
      if (memo.has(nodeId)) return memo.get(nodeId)!;

      const children = getChildren(nodeId);
      if (children.length === 0) {
        memo.set(nodeId, 1);
        return 1;
      }

      const childWidths = children.map((c) => getSubtreeWidth(c.id, memo));
      const width = Math.max(childWidths.reduce((a, b) => a + b, 0), 1);
      memo.set(nodeId, width);
      return width;
    };

    // Position nodes recursively
    const positionNode = (nodeId: number, depth: number, leftBound: number, rightBound: number) => {
      const centerX = (leftBound + rightBound) / 2;
      const y = depth * VERTICAL_SPACING + 120;

      positions.set(nodeId, { x: centerX, y });

      const children = getChildren(nodeId);
      if (children.length === 0) return;

      // Sort children by category to keep them grouped
      const sortedChildren = [...children].sort((a, b) => {
        const aIndex = orderedCategories.indexOf(a.category);
        const bIndex = orderedCategories.indexOf(b.category);
        return aIndex - bIndex;
      });

      const childWidths = sortedChildren.map((c) => getSubtreeWidth(c.id));
      const totalWidth = childWidths.reduce((a, b) => a + b, 0);
      const availableWidth = rightBound - leftBound;
      const spacing = totalWidth > 1 ? availableWidth / totalWidth : 0;

      let currentX = leftBound;
      sortedChildren.forEach((child, i) => {
        const childWidth = childWidths[i];
        const childSpace = spacing * childWidth;
        positionNode(child.id, depth + 1, currentX, currentX + childSpace);
        currentX += childSpace;
      });
    };

    // Find root nodes and organize by category
    const rootNodes = steps.filter((s) => s.prerequisites.length === 0);
    
    if (rootNodes.length === 0 && steps.length > 0) {
      // Fallback: position all nodes in tier 0
      steps.forEach((node, i) => {
        positions.set(node.id, { x: i * HORIZONTAL_SPACING + 200, y: 120 });
      });
    } else {
      // Sort roots by category
      const sortedRoots = [...rootNodes].sort((a, b) => {
        const aIndex = orderedCategories.indexOf(a.category);
        const bIndex = orderedCategories.indexOf(b.category);
        return aIndex - bIndex;
      });

      const totalWidth = sortedRoots.reduce(
        (sum, root) => sum + getSubtreeWidth(root.id),
        0,
      );
      const canvasWidth = totalWidth * HORIZONTAL_SPACING;

      let currentX = 150;
      sortedRoots.forEach((root) => {
        const rootWidth = getSubtreeWidth(root.id);
        const rootSpace = (rootWidth / totalWidth) * canvasWidth;
        positionNode(root.id, 0, currentX, currentX + rootSpace);
        currentX += rootSpace;
      });
    }

    return positions;
  }, [steps]);

  // Get node position from the calculated positions map
  const getNodePosition = (step: LearningStep) => {
    return nodePositions.get(step.id) || { x: 0, y: 0 };
  };

  // Check if a step is unlocked (all prerequisites completed)
  const isStepUnlocked = (step: LearningStep) => {
    if (step.prerequisites.length === 0) return true;
    return step.prerequisites.every(prereqId => 
      progress.completedSteps.includes(prereqId)
    );
  };

  // Generate SVG lines connecting prerequisites to steps with smart routing
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    // Build connection data with routing information
    type ConnectionData = {
      prereqId: number;
      stepId: number;
      prereqPos: { x: number; y: number };
      stepPos: { x: number; y: number };
      strokeColor: string;
      strokeWidth: number;
      opacity: number;
      horizontalDistance: number;
    };
    
    const connectionData: ConnectionData[] = [];
    
    steps.forEach(step => {
      const stepPos = getNodePosition(step);
      const isUnlocked = isStepUnlocked(step);
      const isCompleted = progress.completedSteps.includes(step.id);
      
      step.prerequisites.forEach(prereqId => {
        const prereq = steps.find(s => s.id === prereqId);
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
        
        connectionData.push({
          prereqId,
          stepId: step.id,
          prereqPos,
          stepPos,
          strokeColor,
          strokeWidth,
          opacity,
          horizontalDistance: Math.abs(stepPos.x - prereqPos.x),
        });
      });
    });
    
    // Group connections by their vertical span and detect potential overlaps
    const getRoutingOffset = (conn: ConnectionData, index: number): number => {
      // For connections going to the same child from different parents,
      // route them at different heights to avoid overlap
      const siblingConnections = connectionData.filter(
        c => c.stepId === conn.stepId && c.prereqId !== conn.prereqId
      );
      
      if (siblingConnections.length === 0) return 0;
      
      // Find this connection's index among siblings
      const allToSameChild = connectionData.filter(c => c.stepId === conn.stepId);
      const myIndex = allToSameChild.findIndex(c => c.prereqId === conn.prereqId);
      const totalSiblings = allToSameChild.length;
      
      // Spread siblings vertically
      if (totalSiblings === 1) return 0;
      
      const spreadRange = 40; // pixels to spread
      const offset = (myIndex - (totalSiblings - 1) / 2) * spreadRange;
      
      return offset;
    };
    
    // Render each connection with smart routing
    connectionData.forEach((conn, index) => {
      const startX = conn.prereqPos.x;
      const startY = conn.prereqPos.y + 85; // Bottom of parent node
      const endX = conn.stepPos.x;
      const endY = conn.stepPos.y - 85; // Top of child node
      
      // Calculate routing offset to prevent overlaps
      const routingOffset = getRoutingOffset(conn, index);
      const midY = (startY + endY) / 2 + routingOffset;
      
      // Create orthogonal path with offset
      const path = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
      
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
          points={`${endX},${endY} ${endX - 7},${endY - 12} ${endX + 7},${endY - 12}`}
          fill={conn.strokeColor}
          opacity={conn.opacity}
          className="transition-all duration-300"
        />
      );
    });
    
    return connections;
  };

  // Render category labels - positioned at the top of each category's column
  const renderCategoryLabels = () => {
    const categories: SkillCategory[] = ["foundation", "reading", "speaking", "writing", "listening"];
    
    return categories.map(category => {
      const categorySteps = steps.filter(s => s.category === category);
      if (categorySteps.length === 0) return null;
      
      const colors = categoryColors[category];
      
      // Find all root nodes (nodes with no prerequisites) in this category
      const rootNodesInCategory = categorySteps.filter(s => s.prerequisites.length === 0);
      
      // If there are root nodes, use the average position of them
      // Otherwise use the topmost node in the category
      let labelX: number;
      
      if (rootNodesInCategory.length > 0) {
        const positions = rootNodesInCategory.map(s => getNodePosition(s).x);
        labelX = positions.reduce((a, b) => a + b, 0) / positions.length;
      } else {
        // Find the node with minimum Y position (topmost)
        const topNode = categorySteps.reduce((top, current) => {
          const topPos = getNodePosition(top);
          const currentPos = getNodePosition(current);
          return currentPos.y < topPos.y ? current : top;
        });
        labelX = getNodePosition(topNode).x;
      }
      
      const categoryNames = {
        foundation: "⭐ Foundation",
        reading: "📖 Reading",
        speaking: "🗣️ Speaking",
        writing: "✍️ Writing",
        listening: "👂 Listening"
      };
      
      return (
        <div
          key={category}
          className="absolute top-8 px-4 py-2 rounded-full border-2 shadow-lg backdrop-blur-sm transition-all"
          style={{ 
            left: `${labelX - 60}px`,
            backgroundColor: colors.secondary,
            borderColor: colors.border,
            color: colors.text
          }}
        >
          <span className="text-sm">
            {categoryNames[category]}
          </span>
        </div>
      );
    });
  };

  // Calculate canvas size based on node positions
  const canvasSize = useMemo(() => {
    let maxX = 0;
    let maxY = 0;
    let minX = Infinity;

    nodePositions.forEach((pos) => {
      maxX = Math.max(maxX, pos.x);
      maxY = Math.max(maxY, pos.y);
      minX = Math.min(minX, pos.x);
    });

    return {
      width: Math.max(maxX - minX + 600, 1400),
      height: Math.max(maxY + 500, 1200),
    };
  }, [nodePositions]);

  return (
    <div className="relative w-full h-full" style={{ minHeight: `${canvasSize.height}px`, minWidth: `${canvasSize.width}px` }}>
      {/* SVG for connection lines */}
      <svg 
        className="absolute inset-0 pointer-events-none" 
        style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}
      >
        <defs>
          {/* Glow filter for active connections */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {renderConnections()}
      </svg>

      {/* Category labels */}
      {renderCategoryLabels()}

      {/* Skill nodes */}
      {steps.map(step => {
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
