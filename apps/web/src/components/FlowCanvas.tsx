import { useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { FlowCard } from "./FlowCard";
import { CardType } from "./CardSidebar";
import { CanvasControls } from "./CanvasControls";
import { CardContextMenu } from "./CardContextMenu";
import { NodePropertiesDrawer } from "./NodePropertiesDrawer";
import { Minimap } from "./Minimap";
import { SaveDesignDialog } from "./SaveDesignDialog";
import { toast } from "sonner";
import { useCanvas, Card, Connection } from "../contexts/CanvasContext";
import { useCanvasWebSocket } from "../hooks/useCanvasWebSocket";

interface TempConnection {
  fromId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

interface ContextMenu {
  x: number;
  y: number;
  canvasX: number;
  canvasY: number;
  fromCardId: string | null;
}

interface FlowCanvasProps {
  onSelectComponent?: (id: string) => void;
}

export function FlowCanvas({ onSelectComponent }: FlowCanvasProps) {
  const {
    state,
    addCard,
    moveCard,
    deleteCard,
    addConnection,
    deleteConnection,
    updateCard,
  } = useCanvasWebSocket();
  const { loadDesign } = useCanvas();
  const cards = state.cards;
  const connections = state.connections;
  const [tempConnection, setTempConnection] = useState<TempConnection | null>(
    null
  );
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(
    null
  );
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const connectionCompletedRef = useRef(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: { cardType: CardType }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const canvas = document.getElementById("flow-canvas");
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          // Convert screen coordinates to canvas coordinates
          const x = (offset.x - rect.left - panX) / zoom;
          const y = (offset.y - rect.top - panY) / zoom;

          handleAddCard(item.cardType, x, y);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleAddCard = (
    type: CardType,
    x: number,
    y: number,
    fromCardId?: string
  ) => {
    const newCard: Card = {
      id: `card-${Date.now()}-${Math.random()}`,
      type,
      x,
      y,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    };
    addCard(newCard);

    // If created from a connection, create the connection
    if (fromCardId) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        from: fromCardId,
        to: newCard.id,
      };
      addConnection(newConnection);
    }

    return newCard.id;
  };

  const handleUpdatePosition = (id: string, x: number, y: number) => {
    moveCard(id, x, y);
  };

  const handleConnectionStart = (
    fromId: string,
    fromX: number,
    fromY: number
  ) => {
    const canvas = document.getElementById("flow-canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = (fromX - rect.left - panX) / zoom;
    const canvasY = (fromY - rect.top - panY) / zoom;

    // Reset the completion flag
    connectionCompletedRef.current = false;

    setTempConnection({
      fromId,
      fromX: canvasX,
      fromY: canvasY,
      toX: canvasX,
      toY: canvasY,
    });

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - rect.left - panX) / zoom;
      const y = (e.clientY - rect.top - panY) / zoom;
      setTempConnection((prev) => (prev ? { ...prev, toX: x, toY: y } : null));
    };

    const handleMouseUp = (e: MouseEvent) => {
      // If connection was not completed (didn't hover over a card), show context menu
      if (!connectionCompletedRef.current) {
        const screenX = e.clientX;
        const screenY = e.clientY;
        const canvasX = (screenX - rect.left - panX) / zoom;
        const canvasY = (screenY - rect.top - panY) / zoom;

        setContextMenu({
          x: screenX,
          y: screenY,
          canvasX,
          canvasY,
          fromCardId: fromId,
        });
      }

      setTempConnection(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleConnectionEnd = (toId: string) => {
    if (tempConnection && tempConnection.fromId !== toId) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        from: tempConnection.fromId,
        to: toId,
      };
      addConnection(newConnection);
      // Mark connection as completed
      connectionCompletedRef.current = true;
    }
    setTempConnection(null);
  };

  const handleDeleteCard = (id: string) => {
    deleteCard(id);
    // Clear selection if deleted card was selected
    if (selectedCardId === id) {
      setSelectedCardId(null);
    }
  };

  const handleDeleteConnection = (id: string) => {
    deleteConnection(id);
    toast.success("Connection deleted");
  };

  const handleLabelChange = (id: string, label: string) => {
    updateCard(id, { label });
  };

  const handleSelectCard = (id: string) => {
    setSelectedCardId(id);
  };

  const handleCardDoubleClick = (id: string) => {
    // Call parent callback instead of dispatching event
    if (onSelectComponent) {
      onSelectComponent(id);
    }
  };

  const handleUpdateCard = (id: string, updates: Partial<Card>) => {
    updateCard(id, updates);
  };

  const getCardCenter = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    return card ? { x: card.x, y: card.y } : { x: 0, y: 0 };
  };

  // Zoom and pan handlers
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => Math.min(Math.max(0.1, prev * delta), 3));
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only handle left clicks
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;

    // Don't pan if clicking on interactive elements
    // Check if we're clicking on a card, button, input, or other interactive elements
    const isInteractiveElement =
      target.closest("[data-flow-card]") || // Cards
      target.closest("button") || // Buttons
      target.closest("input") || // Inputs
      target.closest('[role="dialog"]') || // Dialogs/modals
      target.closest(".minimap") || // Minimap
      target.closest("[data-interactive]"); // Other interactive elements

    // Only pan if we're clicking on the background (not on interactive elements)
    if (isInteractiveElement) return;

    // Deselect card when clicking on canvas background
    setSelectedCardId(null);

    e.preventDefault();
    e.stopPropagation();
    setIsPanning(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startPanX = panX;
    const startPanY = panY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setPanX(startPanX + dx);
      setPanY(startPanY + dy);
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev * 0.8, 0.1));
  };

  const handleResetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  // Export/Import handlers
  const handleExport = () => {
    const data = {
      cards,
      connections,
      version: "1.0",
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flowchart-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Flowchart exported successfully");
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        loadDesign(data.cards || [], data.connections || [], null);
        toast.success("Flowchart imported successfully");
      } catch (error) {
        toast.error("Failed to import flowchart");
      }
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = "";
  };

  // Track canvas size for minimap
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const handleContextMenuSelect = (type: CardType) => {
    if (contextMenu) {
      handleAddCard(
        type,
        contextMenu.canvasX,
        contextMenu.canvasY,
        contextMenu.fromCardId || undefined
      );
      setContextMenu(null);
    }
  };

  const handleSaveDesign = (name: string) => {
    try {
      const saved = localStorage.getItem("systemDesigns");
      const designs = saved ? JSON.parse(saved) : [];

      const designId = `design-${Date.now()}`;
      const designData = {
        id: designId,
        name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        nodesCount: cards.length,
        connectionsCount: connections.length,
        data: {
          cards,
          connections,
        },
      };

      designs.push(designData);
      localStorage.setItem("systemDesigns", JSON.stringify(designs));
      toast.success("Design saved successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save design");
    }
  };

  // Keyboard shortcuts

  return (
    <div className="w-full h-full relative flex-1 overflow-hidden">
      <div
        ref={(node: HTMLDivElement | null) => {
          drop(node);
          if (node) canvasRef.current = node;
        }}
        id="flow-canvas"
        role="application"
        tabIndex={0}
        aria-label="Flow canvas for designing workflows"
        className={`relative size-full bg-background ${
          isOver ? "bg-accent" : ""
        } ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 canvas-background-grid"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${panX}px ${panY}px`,
          }}
        />

        {/* Canvas content with transform */}
        <div
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: "0 0",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 connections-svg">
            {/* Render existing connections */}
            {connections.map((conn) => {
              const from = getCardCenter(conn.from);
              const to = getCardCenter(conn.to);
              const isHovered = hoveredConnection === conn.id;

              return (
                <g
                  key={conn.id}
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setHoveredConnection(conn.id)}
                  onMouseLeave={() => setHoveredConnection(null)}
                  onClick={() => handleDeleteConnection(conn.id)}
                >
                  {/* Invisible wider line for easier hovering */}
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="transparent"
                    strokeWidth="12"
                  />
                  {/* Visible line */}
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isHovered ? "#ef4444" : "#3b82f6"}
                    strokeWidth={isHovered ? "3" : "2"}
                    markerEnd={
                      isHovered ? "url(#arrowhead-hover)" : "url(#arrowhead)"
                    }
                  />
                </g>
              );
            })}

            {/* Render temporary connection */}
            {tempConnection && (
              <line
                x1={tempConnection.fromX}
                y1={tempConnection.fromY}
                x2={tempConnection.toX}
                y2={tempConnection.toY}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead)"
              />
            )}

            {/* Arrow marker definitions */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
              </marker>
              <marker
                id="arrowhead-hover"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
              </marker>
            </defs>
          </svg>

          {/* Render cards */}
          {cards.map((card) => (
            <FlowCard
              key={card.id}
              id={card.id}
              type={card.type}
              x={card.x}
              y={card.y}
              label={card.label}
              zoom={zoom}
              panX={panX}
              panY={panY}
              isSelected={selectedCardId === card.id}
              onUpdatePosition={handleUpdatePosition}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
              onDelete={handleDeleteCard}
              onLabelChange={handleLabelChange}
              onSelect={handleSelectCard}
              onDoubleClick={handleCardDoubleClick}
            />
          ))}
        </div>

        {/* Instructions overlay when empty */}
        {cards.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-muted-foreground">
              <p>Drag components from the sidebar to get started</p>
              <p className="mt-2">
                Click and drag to pan • Ctrl + Scroll to zoom
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Canvas controls */}
      <CanvasControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Minimap */}
      <Minimap
        cards={cards}
        connections={connections}
        zoom={zoom}
        panX={panX}
        panY={panY}
        canvasWidth={canvasSize.width}
        canvasHeight={canvasSize.height}
      />

      {/* Context menu */}
      {contextMenu && (
        <CardContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onSelectCard={handleContextMenuSelect}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Node Properties Drawer */}
      <NodePropertiesDrawer
        selectedCard={
          selectedCardId
            ? cards.find((c) => c.id === selectedCardId) || null
            : null
        }
        open={selectedCardId !== null}
        onClose={() => setSelectedCardId(null)}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onNavigateToDetail={handleCardDoubleClick}
      />

      {/* Save Design Dialog */}
      <SaveDesignDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSaveDesign}
      />
    </div>
  );
}
