import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

/**
 * Low-level hook for managing socket.io connection
 * Handles ONLY connection lifecycle (connect/disconnect)
 * Business logic is handled in separate hooks
 */
export function useSocketConnection() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      const apiUrl =
        (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";

      const socket = io(apiUrl, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("[WebSocket] Connected");
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("[WebSocket] Disconnected");
        setIsConnected(false);
      });

      socketRef.current = socket;
    }

    // Keep socket alive - don't disconnect on unmount
    // Only close on app shutdown
    return () => {
      // Intentionally don't disconnect here
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
  };
}
