import { CardType } from './CardSidebar';

interface Card {
  id: string;
  type: CardType;
  x: number;
  y: number;
  label: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
}

interface MinimapProps {
  cards: Card[];
  connections: Connection[];
  zoom: number;
  panX: number;
  panY: number;
  canvasWidth: number;
  canvasHeight: number;
}

const typeColors: Record<CardType, string> = {
  api: '#3b82f6',
  database: '#22c55e',
  service: '#a855f7',
  frontend: '#06b6d4',
  backend: '#6366f1',
  queue: '#f97316',
  cache: '#ef4444',
  loadbalancer: '#eab308',
};

export function Minimap({ cards, connections, zoom, panX, panY, canvasWidth, canvasHeight }: MinimapProps) {
  if (cards.length === 0) return null;

  // Calculate bounds of all cards
  const padding = 50;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
  cards.forEach(card => {
    minX = Math.min(minX, card.x);
    maxX = Math.max(maxX, card.x);
    minY = Math.min(minY, card.y);
    maxY = Math.max(maxY, card.y);
  });

  minX -= padding;
  maxX += padding;
  minY -= padding;
  maxY += padding;

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;

  // Minimap dimensions
  const minimapWidth = 200;
  const minimapHeight = 150;

  // Scale to fit content in minimap
  const scale = Math.min(minimapWidth / contentWidth, minimapHeight / contentHeight);

  const getCardCenter = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    return card ? { x: card.x, y: card.y } : { x: 0, y: 0 };
  };

  return (
    <div className="absolute bottom-4 left-[160px] bg-white/90 backdrop-blur border-2 border-border rounded-lg shadow-lg p-2 z-20">
      <div 
        className="relative bg-muted/30"
        style={{ 
          width: `${minimapWidth}px`, 
          height: `${minimapHeight}px`,
        }}
      >
        <svg width={minimapWidth} height={minimapHeight} className="absolute inset-0">
          {/* Render connections */}
          {connections.map((conn) => {
            const from = getCardCenter(conn.from);
            const to = getCardCenter(conn.to);
            const x1 = (from.x - minX) * scale;
            const y1 = (from.y - minY) * scale;
            const x2 = (to.x - minX) * scale;
            const y2 = (to.y - minY) * scale;
            
            return (
              <line
                key={conn.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#3b82f6"
                strokeWidth="1"
              />
            );
          })}

          {/* Render cards */}
          {cards.map((card) => {
            const x = (card.x - minX) * scale;
            const y = (card.y - minY) * scale;
            
            return (
              <circle
                key={card.id}
                cx={x}
                cy={y}
                r={4}
                fill={typeColors[card.type]}
                stroke="white"
                strokeWidth="1"
              />
            );
          })}

          {/* Viewport indicator */}
          <rect
            x={(panX / zoom - minX) * scale}
            y={(panY / zoom - minY) * scale}
            width={(canvasWidth / zoom) * scale}
            height={(canvasHeight / zoom) * scale}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
        </svg>
      </div>
    </div>
  );
}