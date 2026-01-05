import { useCanvasWebSocket } from "../hooks/useCanvasWebSocket";
import { FlowCanvas } from "./FlowCanvas";

interface CanvasWithWebSocketProps {
  onSelectComponent?: (id: string) => void;
}

/**
 * CanvasWithWebSocket Component
 *
 * Simple wrapper that initializes the WebSocket hook
 * - Hook handles WebSocket connection + canvas events
 * - Component renders FlowCanvas
 */
export function CanvasWithWebSocket({
  onSelectComponent,
}: CanvasWithWebSocketProps) {
  // Initialize WebSocket connection and canvas events
  useCanvasWebSocket();

  return (
    <div className="w-full vh-full overflow-hidden">
      <FlowCanvas onSelectComponent={onSelectComponent} />
    </div>
  );
}
