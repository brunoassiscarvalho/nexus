import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import { useFlow, Card, Connection } from '../contexts/FlowContext';
import { FlowCard } from './FlowCard';
import { CardType } from './CardSidebar';
import { CanvasControls } from './CanvasControls';
import { CardContextMenu } from './CardContextMenu';
import { PropertiesPanel } from './PropertiesPanel';
import { ContextMenu } from './ContextMenu';
import { Minimap } from './Minimap';
import { toast } from 'sonner@2.0.3';

interface TempConnection {
  fromId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

interface ContextMenuState {
  x: number;
  y: number;
  canvasX: number;
  canvasY: number;
  fromCardId: string | null;
}

export function FlowCanvas() {
  const navigate = useNavigate();
  const { designId } = useParams<{ designId: string }>();
  const { currentDesign, updateCanvasData, autoSave } = useFlow();
  
  // Local state for canvas data
  const [cards, setCards] = useState<Card[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  
  // UI state
  const [tempConnection, setTempConnection] = useState<TempConnection | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [rightClickMenu, setRightClickMenu] = useState<{ x: number; y: number; type: 'node' | 'connection'; targetId: string } | null>(null);
  
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const connectionCompletedRef = useRef(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load data from context when design changes
  useEffect(() => {
    if (currentDesign) {
      setCards(currentDesign.data.cards || []);
      setConnections(currentDesign.data.connections || []);
    }
  }, [currentDesign?.id]); // Only reload when design ID changes

  // Auto-save to context when cards or connections change
  useEffect(() => {
    if (currentDesign && (cards.length > 0 || connections.length > 0 || currentDesign.data.cards.length > 0)) {
      // Clear any existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set timeout for auto-save (1 second after last change)
      autoSaveTimeoutRef.current = setTimeout(() => {
        updateCanvasData(cards, connections);
        autoSave();
      }, 1000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [cards, connections]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: { cardType: CardType }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const canvas = document.getElementById('flow-canvas');
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const x = (offset.x - rect.left - panX) / zoom;
          const y = (offset.y - rect.top - panY) / zoom;
          addCard(item.cardType, x, y);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const addCard = (type: CardType, x: number, y: number, fromCardId?: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}-${Math.random()}`,
      type,
      x,
      y,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    };
    setCards((prev) => [...prev, newCard]);
    
    if (fromCardId) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        from: fromCardId,
        to: newCard.id,
      };
      setConnections((prev) => [...prev, newConnection]);
    }
  };

  const handleUpdatePosition = (id: string, x: number, y: number) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, x, y } : card))
    );
  };

  const handleConnectionStart = (fromId: string, fromX: number, fromY: number) => {
    const canvas = document.getElementById('flow-canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const canvasX = (fromX - rect.left - panX) / zoom;
    const canvasY = (fromY - rect.top - panY) / zoom;
    
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
      setTempConnection((prev) => prev ? { ...prev, toX: x, toY: y } : null);
    };

    const handleMouseUp = (e: MouseEvent) => {
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
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleConnectionEnd = (toId: string) => {
    if (tempConnection && tempConnection.fromId !== toId) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        from: tempConnection.fromId,
        to: toId,
      };
      setConnections((prev) => [...prev, newConnection]);
      connectionCompletedRef.current = true;
    }
    setTempConnection(null);
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    setConnections((prev) => prev.filter((conn) => conn.from !== id && conn.to !== id));
    if (selectedCardId === id) {
      setSelectedCardId(null);
    }
  };

  const handleDeleteConnection = (id: string) => {
    setConnections((prev) => prev.filter((conn) => conn.id !== id));
    if (selectedConnectionId === id) {
      setSelectedConnectionId(null);
    }
    toast.success('Connection deleted');
  };

  const handleUpdateConnection = (id: string, updates: Partial<Connection>) => {
    setConnections((prev) =>
      prev.map((conn) => (conn.id === id ? { ...conn, ...updates } : conn))
    );
  };

  const handleLabelChange = (id: string, label: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, label } : card))
    );
  };

  const handleSelectCard = (id: string) => {
    setSelectedCardId(id);
    setSelectedConnectionId(null); // Deselect connection when selecting node
  };

  const handleSelectConnection = (id: string) => {
    setSelectedConnectionId(id);
    setSelectedCardId(null); // Deselect node when selecting connection
  };

  const handleCardDoubleClick = (id: string) => {
    if (designId) {
      navigate(`/designs/${designId}/component/${id}`);
    }
  };

  const handleUpdateCard = (id: string, updates: Partial<Card>) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
    );
  };

  const getCardCenter = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    return card ? { x: card.x, y: card.y } : { x: 0, y: 0 };
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => Math.min(Math.max(0.1, prev * delta), 3));
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    
    const target = e.target as HTMLElement;
    const isInteractiveElement = 
      target.closest('[data-flow-card]') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('[role="dialog"]') ||
      target.closest('.minimap') ||
      target.closest('[data-interactive]');
    
    if (isInteractiveElement) return;
    
    // Deselect both when clicking on canvas background
    setSelectedCardId(null);
    setSelectedConnectionId(null);
    
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
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev * 0.8, 0.1));
  const handleResetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleExport = () => {
    const data = { cards, connections, version: '1.0' };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowchart-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Flowchart exported successfully');
  };

  const handleImport = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setCards(data.cards || []);
        setConnections(data.connections || []);
        toast.success('Flowchart imported successfully');
      } catch (error) {
        toast.error('Failed to import flowchart');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleContextMenuSelect = (type: CardType) => {
    if (contextMenu) {
      addCard(type, contextMenu.canvasX, contextMenu.canvasY, contextMenu.fromCardId || undefined);
      setContextMenu(null);
    }
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
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        handleResetView();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={(node) => {
          drop(node);
          if (node) canvasRef.current = node;
        }}
        id="flow-canvas"
        className={`relative size-full bg-background ${ 
          isOver ? 'bg-accent' : ''
        } ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
        onContextMenu={(e) => e.preventDefault()}
      >
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

        <div
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 connections-svg">
            {connections.map((conn) => {
              const from = getCardCenter(conn.from);
              const to = getCardCenter(conn.to);
              const isHovered = hoveredConnection === conn.id;
              const isSelected = selectedConnectionId === conn.id;
              
              return (
                <g 
                  key={conn.id}
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setHoveredConnection(conn.id)}
                  onMouseLeave={() => setHoveredConnection(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectConnection(conn.id);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setRightClickMenu({
                      x: e.clientX,
                      y: e.clientY,
                      type: 'connection',
                      targetId: conn.id
                    });
                  }}
                >
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="transparent"
                    strokeWidth="12"
                  />
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isSelected ? '#10b981' : isHovered ? '#ef4444' : '#3b82f6'}
                    strokeWidth={isSelected ? '3' : isHovered ? '3' : '2'}
                    markerEnd={isSelected ? 'url(#arrowhead-selected)' : isHovered ? 'url(#arrowhead-hover)' : 'url(#arrowhead)'}
                  />
                </g>
              );
            })}
            
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
            
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
              </marker>
              <marker id="arrowhead-hover" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
              </marker>
              <marker id="arrowhead-selected" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
              </marker>
            </defs>
          </svg>

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
              onContextMenu={(id, x, y) => {
                setRightClickMenu({
                  x,
                  y,
                  type: 'node',
                  targetId: id
                });
              }}
            />
          ))}
        </div>

        {cards.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-muted-foreground">
              <p>Drag components from the sidebar to get started</p>
              <p className="mt-2">Click and drag to pan • Ctrl + Scroll to zoom</p>
            </div>
          </div>
        )}
      </div>

      <CanvasControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onExport={handleExport}
        onImport={handleImport}
      />

      <Minimap
        cards={cards}
        connections={connections}
        zoom={zoom}
        panX={panX}
        panY={panY}
        canvasWidth={canvasSize.width}
        canvasHeight={canvasSize.height}
      />

      {contextMenu && (
        <CardContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onSelectCard={handleContextMenuSelect}
          onClose={() => setContextMenu(null)}
        />
      )}

      {rightClickMenu && (
        <ContextMenu
          x={rightClickMenu.x}
          y={rightClickMenu.y}
          type={rightClickMenu.type}
          onDelete={() => {
            if (rightClickMenu.type === 'node') {
              handleDeleteCard(rightClickMenu.targetId);
            } else {
              handleDeleteConnection(rightClickMenu.targetId);
            }
            setRightClickMenu(null);
          }}
          onEdit={() => {
            if (rightClickMenu.type === 'node') {
              handleSelectCard(rightClickMenu.targetId);
            } else {
              handleSelectConnection(rightClickMenu.targetId);
            }
            setRightClickMenu(null);
          }}
          onViewDetails={rightClickMenu.type === 'node' ? () => {
            handleCardDoubleClick(rightClickMenu.targetId);
            setRightClickMenu(null);
          } : undefined}
          onClose={() => setRightClickMenu(null)}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      <PropertiesPanel
        selectedNode={selectedCardId ? cards.find(c => c.id === selectedCardId) || null : null}
        selectedConnection={selectedConnectionId ? connections.find(c => c.id === selectedConnectionId) || null : null}
        dashboardStats={{
          totalNodes: cards.length,
          totalConnections: connections.length,
          designName: currentDesign?.name
        }}
        onUpdateNode={handleUpdateCard}
        onUpdateConnection={handleUpdateConnection}
        onDeleteNode={handleDeleteCard}
        onDeleteConnection={handleDeleteConnection}
        onNavigateToDetail={handleCardDoubleClick}
        onDeselectNode={() => setSelectedCardId(null)}
        onDeselectConnection={() => setSelectedConnectionId(null)}
      />
    </div>
  );
}
