import { useSocketConnection } from "../hooks/useSocketConnection";

/**
 * Component that displays WebSocket connection status
 * Separated from canvas logic for cleaner architecture
 */
export function ConnectionIndicator() {
  const { isConnected } = useSocketConnection();

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-sm font-medium text-muted-foreground">
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}
