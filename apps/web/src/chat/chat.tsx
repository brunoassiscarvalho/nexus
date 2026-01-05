import React, { useState, useEffect } from "react";
import { socket } from "./socket";

export default function Chat() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // 1. Connect the socket
    socket.connect();

    // 2. Setup connection listeners
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    // 3. Listen for server-emitted events
    function onMessageReceived(data: any) {
      setMessages((prev) => [...prev, `${data.sender}: ${data.message}`]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessageReceived);

    // Clean up listeners on unmount to prevent memory leaks
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessageReceived);
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (inputValue) {
      // Emit 'message' to match the @SubscribeMessage('message') in NestJS
      socket.emit("message", {
        username: "defaultUser",
        room: "defaultRoom",
        content: inputValue,
      });
      setInputValue("");
    }
  };

  return (
    <div className="size-full bg-background p-8 overflow-auto">
      <div style={{ padding: "20px" }}>
        <h1>
          WebSocket Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </h1>
        <div
          style={{
            border: "1px solid #ccc",
            height: "200px",
            overflowY: "scroll",
            marginBottom: "10px",
          }}
        >
          {messages.map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
        </div>

        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </div>
  );
}
