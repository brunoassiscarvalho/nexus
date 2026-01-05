import { io, Socket } from "socket.io-client";

// Use your NestJS server URL and port
const URL = "http://localhost:3010";

export const socket: Socket = io(URL, {
  autoConnect: false, // Recommended: manually connect when needed
  transports: ["websocket"], // Forces WebSocket for better performance in 2025
});
socket.on("connect", () => {
  console.log("[Socket] Connected:", socket.id);
});
socket.on("disconnect", (reason) => {
  console.log("[Socket] Disconnected:", reason);
});
socket.on("connect_error", (error) => {
  console.error("[Socket] Connection Error:", error);
});
