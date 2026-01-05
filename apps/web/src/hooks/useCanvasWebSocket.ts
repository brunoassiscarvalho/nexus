import { useEffect, useCallback, useRef } from "react";
import { useSocketConnection } from "./useSocketConnection";
import { useCanvas } from "../contexts/CanvasContext";
import type { Card, Connection } from "../contexts/CanvasContext";

/**
 * High-level hook for canvas WebSocket business logic
 * Handles canvas-specific events and room management
 * Consumes useSocketConnection for the underlying socket
 */
export function useCanvasWebSocket() {
  const canvas = useCanvas();
  const { state } = canvas;
  const { designId } = state;

  // Get socket from connection layer
  const { socket, isConnected } = useSocketConnection();
  const previousDesignIdRef = useRef<string | null>(null);

  // Handle canvas events and room management
  useEffect(() => {
    if (!socket || !isConnected || !designId) return;

    // Join/leave room based on designId
    if (previousDesignIdRef.current !== designId) {
      if (previousDesignIdRef.current) {
        socket.emit("leave-design", { designId: previousDesignIdRef.current });
        console.log(`[Canvas] Left design: ${previousDesignIdRef.current}`);
      }
      previousDesignIdRef.current = designId;
      socket.emit("join-design", { designId });
      console.log(`[Canvas] Joined design: ${designId}`);
    }

    // Canvas event listeners
    const handleCardAdded = ({ card }: { card: Card }) => {
      canvas.addCard(card);
    };

    const handleCardUpdated = ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Card>;
    }) => {
      canvas.updateCard(id, updates);
    };

    const handleCardDeleted = ({ id }: { id: string }) => {
      canvas.deleteCard(id);
    };

    const handleCardMoved = ({
      id,
      x,
      y,
    }: {
      id: string;
      x: number;
      y: number;
    }) => {
      canvas.moveCard(id, x, y);
    };

    const handleConnectionAdded = ({
      connection,
    }: {
      connection: Connection;
    }) => {
      canvas.addConnection(connection);
    };

    const handleConnectionDeleted = ({ id }: { id: string }) => {
      canvas.deleteConnection(id);
    };

    const handleDesignSaved = ({ savedAt }: { savedAt: number }) => {
      console.log("[Canvas] Design saved at:", new Date(savedAt));
    };

    const handleCanvasCleared = () => {
      canvas.clearCanvas();
    };

    const handleUserJoined = ({
      userId,
      socketId,
    }: {
      userId?: string;
      socketId?: string;
    }) => {
      console.log(`[Canvas] User ${userId || socketId} joined`);
    };

    const handleUserLeft = ({
      userId,
      socketId,
    }: {
      userId?: string;
      socketId?: string;
    }) => {
      console.log(`[Canvas] User ${userId || socketId} left`);
    };

    const handleConnectedUsers = ({
      users,
    }: {
      users: Array<{ socketId: string; userId?: string }>;
    }) => {
      console.log("[Canvas] Connected users:", users);
    };

    const handleCursorMoved = ({
      socketId,
      userId,
      x,
      y,
    }: {
      socketId: string;
      userId?: string;
      x: number;
      y: number;
    }) => {
      console.log(`[Canvas] Cursor moved by ${userId || socketId}:`, x, y);
    };

    // Register all listeners
    socket.on("card-added", handleCardAdded);
    socket.on("card-updated", handleCardUpdated);
    socket.on("card-deleted", handleCardDeleted);
    socket.on("card-moved", handleCardMoved);
    socket.on("connection-added", handleConnectionAdded);
    socket.on("connection-deleted", handleConnectionDeleted);
    socket.on("design-saved", handleDesignSaved);
    socket.on("canvas-cleared", handleCanvasCleared);
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    socket.on("connected-users", handleConnectedUsers);
    socket.on("cursor-moved", handleCursorMoved);

    return () => {
      // Unsubscribe from all events when designId changes
      socket.off("card-added", handleCardAdded);
      socket.off("card-updated", handleCardUpdated);
      socket.off("card-deleted", handleCardDeleted);
      socket.off("card-moved", handleCardMoved);
      socket.off("connection-added", handleConnectionAdded);
      socket.off("connection-deleted", handleConnectionDeleted);
      socket.off("design-saved", handleDesignSaved);
      socket.off("canvas-cleared", handleCanvasCleared);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
      socket.off("connected-users", handleConnectedUsers);
      socket.off("cursor-moved", handleCursorMoved);

      if (previousDesignIdRef.current) {
        socket.emit("leave-design", { designId: previousDesignIdRef.current });
        console.log(
          `[Canvas] Left design on cleanup: ${previousDesignIdRef.current}`
        );
        previousDesignIdRef.current = null;
      }
    };
  }, [socket, isConnected, designId, canvas]);

  // Action emitters - dual local + remote
  const addCard = useCallback(
    (card: Card) => {
      canvas.addCard(card); // Local state
      socket?.emit("add-card", { card, designId });
    },
    [designId, canvas, socket]
  );

  const updateCard = useCallback(
    (id: string, updates: Partial<Card>) => {
      canvas.updateCard(id, updates); // Local state
      socket?.emit("update-card", { id, updates, designId });
    },
    [designId, canvas, socket]
  );

  const deleteCard = useCallback(
    (id: string) => {
      canvas.deleteCard(id); // Local state
      socket?.emit("delete-card", { id, designId });
    },
    [designId, canvas, socket]
  );

  const moveCard = useCallback(
    (id: string, x: number, y: number) => {
      canvas.moveCard(id, x, y); // Local state
      socket?.emit("move-card", { id, x, y, designId });
    },
    [designId, canvas, socket]
  );

  const addConnection = useCallback(
    (connection: Connection) => {
      canvas.addConnection(connection); // Local state
      socket?.emit("add-connection", { connection, designId });
    },
    [designId, canvas, socket]
  );

  const deleteConnection = useCallback(
    (id: string) => {
      canvas.deleteConnection(id); // Local state
      socket?.emit("delete-connection", { id, designId });
    },
    [designId, canvas, socket]
  );

  const saveDesign = useCallback(() => {
    canvas.saveDesign(); // Local state
    socket?.emit("save-design", { designId });
  }, [designId, canvas, socket]);

  const clearCanvas = useCallback(() => {
    canvas.clearCanvas(); // Local state
    socket?.emit("clear-canvas", { designId });
  }, [designId, canvas, socket]);

  const getConnectedUsers = useCallback(() => {
    socket?.emit("get-connected-users", { designId });
  }, [designId, socket]);

  const broadcastCursorMove = useCallback(
    (x: number, y: number) => {
      socket?.emit("cursor-move", { x, y, designId });
    },
    [designId, socket]
  );

  return {
    // State from context
    state: canvas.state,

    // Actions (dual local + WebSocket)
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    addConnection,
    deleteConnection,
    saveDesign,
    clearCanvas,
    getConnectedUsers,
    broadcastCursorMove,

    // WebSocket status
    isConnected,
  };
}
