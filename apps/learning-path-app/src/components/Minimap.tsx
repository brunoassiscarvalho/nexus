import { useEffect, useRef, useState } from "react";
import { LearningStep } from "../types/learning";
import { Maximize2, Minimize2 } from "lucide-react";

interface MinimapProps {
  steps: LearningStep[];
  nodePositions: Map<number, { x: number; y: number }>;
  canvasSize: { width: number; height: number };
  containerRef: React.RefObject<HTMLDivElement>;
  getBranchColor: (step: LearningStep) => string;
}

export function Minimap({
  steps,
  nodePositions,
  canvasSize,
  containerRef,
  getBranchColor,
}: MinimapProps) {
  const minimapRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Scale factor for minimap
  const minimapWidth = isExpanded ? 320 : 200;
  const minimapHeight = isExpanded ? 240 : 150;
  const scaleX = minimapWidth / canvasSize.width;
  const scaleY = minimapHeight / canvasSize.height;

  // Update viewport on scroll
  useEffect(() => {
    const updateViewport = () => {
      if (!containerRef.current) return;

      const scrollLeft = containerRef.current.scrollLeft;
      const scrollTop = containerRef.current.scrollTop;
      const clientWidth = containerRef.current.clientWidth;
      const clientHeight = containerRef.current.clientHeight;

      setViewport({
        x: scrollLeft * scaleX,
        y: scrollTop * scaleY,
        width: clientWidth * scaleX,
        height: clientHeight * scaleY,
      });
    };

    const container = containerRef.current;
    if (!container) return;

    updateViewport();
    container.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);

    return () => {
      container.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, [containerRef, scaleX, scaleY]);

  // Handle minimap click/drag to navigate
  const handleMinimapInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!minimapRef.current || !containerRef.current) return;

    const rect = minimapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert minimap coordinates to canvas coordinates
    const scrollX = x / scaleX - containerRef.current.clientWidth / 2;
    const scrollY = y / scaleY - containerRef.current.clientHeight / 2;

    containerRef.current.scrollTo({
      left: Math.max(0, scrollX),
      top: Math.max(0, scrollY),
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMinimapInteraction(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMinimapInteraction(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border-2 border-slate-200 overflow-hidden z-50 transition-all"
      style={{
        width: `${minimapWidth}px`,
        height: `${minimapHeight}px`,
      }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 flex items-center justify-between z-10">
        <span className="text-xs font-semibold">Map</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-white/20 rounded p-0.5 transition-colors"
          title={isExpanded ? "Minimize" : "Expand"}
        >
          {isExpanded ? (
            <Minimize2 className="w-3 h-3" />
          ) : (
            <Maximize2 className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Minimap Canvas */}
      <div
        ref={minimapRef}
        className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 cursor-pointer"
        style={{ paddingTop: "24px" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Render nodes as small rectangles */}
        {steps.map((step) => {
          const pos = nodePositions.get(step.id);
          if (!pos) return null;

          const color = getBranchColor(step);

          return (
            <div
              key={step.id}
              className="absolute rounded-sm"
              style={{
                left: `${pos.x * scaleX}px`,
                top: `${pos.y * scaleY}px`,
                width: `${256 * scaleX}px`,
                height: `${140 * scaleY}px`,
                backgroundColor: color,
                transform: "translate(-50%, -50%)",
                opacity: 0.7,
              }}
            />
          );
        })}

        {/* Viewport indicator */}
        <div
          className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
          style={{
            left: `${viewport.x}px`,
            top: `${viewport.y}px`,
            width: `${viewport.width}px`,
            height: `${viewport.height}px`,
          }}
        />
      </div>
    </div>
  );
}
