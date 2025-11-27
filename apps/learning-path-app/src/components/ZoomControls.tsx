import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "./ui/button";

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: ZoomControlsProps) {
  return (
    <div className="fixed bottom-4 right-5 bg-white rounded-lg shadow-2xl border-2 border-slate-200 p-2 z-50 flex flex-col gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomIn}
        disabled={zoom >= 2}
        className="h-9 w-9 p-0"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>

      <div className="flex items-center justify-center py-1 px-2 text-xs font-semibold text-slate-600 min-w-[36px]">
        {Math.round(zoom * 100)}%
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomOut}
        disabled={zoom <= 0.25}
        className="h-9 w-9 p-0"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>

      <div className="h-px bg-slate-200 my-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomReset}
        className="h-9 w-9 p-0"
        title="Reset Zoom (100%)"
      >
        <Maximize className="w-4 h-4" />
      </Button>
    </div>
  );
}
