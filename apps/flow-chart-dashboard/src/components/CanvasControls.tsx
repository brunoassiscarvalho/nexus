import { ZoomIn, ZoomOut, Maximize2, Download, Upload } from 'lucide-react';
import { Button } from './ui/button';

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onExport: () => void;
  onImport: () => void;
}

export function CanvasControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onExport,
  onImport,
}: CanvasControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
      <div className="bg-card border border-border rounded-lg shadow-lg p-2 flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          title="Zoom in (Ctrl + Scroll)"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          title="Zoom out (Ctrl + Scroll)"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetView}
          title="Reset view"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <div className="px-2 py-1 text-center border-t border-border mt-1">
          <span className="text-muted-foreground">{Math.round(zoom * 100)}%</span>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg shadow-lg p-2 flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          title="Export flowchart"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onImport}
          title="Import flowchart"
        >
          <Upload className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}