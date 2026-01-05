import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
  useMemo,
} from "react";

export type CardType =
  | "api"
  | "database"
  | "service"
  | "frontend"
  | "backend"
  | "queue"
  | "cache"
  | "loadbalancer";

export interface Card {
  id: string;
  type: CardType;
  x: number;
  y: number;
  label: string;
  description?: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}

export interface CanvasState {
  cards: Card[];
  connections: Connection[];
  isAutoSaving: boolean;
  designId: string | null;
}

type Action =
  | { type: "ADD_CARD"; payload: Card }
  | { type: "UPDATE_CARD"; payload: { id: string; updates: Partial<Card> } }
  | { type: "DELETE_CARD"; payload: string }
  | { type: "MOVE_CARD"; payload: { id: string; x: number; y: number } }
  | { type: "ADD_CONNECTION"; payload: Connection }
  | { type: "DELETE_CONNECTION"; payload: string }
  | { type: "SET_AUTO_SAVING"; payload: boolean }
  | {
      type: "LOAD_DESIGN";
      payload: {
        cards: Card[];
        connections: Connection[];
        designId: string | null;
      };
    }
  | { type: "CLEAR_CANVAS" }
  | { type: "DELETE_CARD_WITH_CONNECTIONS"; payload: string };

const initialState: CanvasState = {
  cards: [],
  connections: [],
  isAutoSaving: false,
  designId: null,
};

function canvasReducer(state: CanvasState, action: Action): CanvasState {
  switch (action.type) {
    case "ADD_CARD":
      return { ...state, cards: [...state.cards, action.payload] };

    case "UPDATE_CARD":
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.payload.id
            ? { ...card, ...action.payload.updates }
            : card
        ),
      };

    case "DELETE_CARD":
      return {
        ...state,
        cards: state.cards.filter((card) => card.id !== action.payload),
      };

    case "DELETE_CARD_WITH_CONNECTIONS":
      return {
        ...state,
        cards: state.cards.filter((card) => card.id !== action.payload),
        connections: state.connections.filter(
          (conn) => conn.from !== action.payload && conn.to !== action.payload
        ),
      };

    case "MOVE_CARD":
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.payload.id
            ? { ...card, x: action.payload.x, y: action.payload.y }
            : card
        ),
      };

    case "ADD_CONNECTION":
      return { ...state, connections: [...state.connections, action.payload] };

    case "DELETE_CONNECTION":
      return {
        ...state,
        connections: state.connections.filter(
          (conn) => conn.id !== action.payload
        ),
      };

    case "SET_AUTO_SAVING":
      return { ...state, isAutoSaving: action.payload };

    case "LOAD_DESIGN":
      return {
        ...state,
        cards: action.payload.cards,
        connections: action.payload.connections,
        designId: action.payload.designId,
      };

    case "CLEAR_CANVAS":
      return { ...state, cards: [], connections: [], designId: null };

    default:
      return state;
  }
}

interface CanvasContextType {
  state: CanvasState;
  addCard: (card: Card) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  moveCard: (id: string, x: number, y: number) => void;
  addConnection: (connection: Connection) => void;
  deleteConnection: (id: string) => void;
  loadDesign: (
    cards: Card[],
    connections: Connection[],
    designId: string | null
  ) => void;
  clearCanvas: () => void;
  saveDesign: () => Promise<void>;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

interface CanvasProviderProps {
  children: ReactNode;
}

export function CanvasProvider({ children }: CanvasProviderProps) {
  const [state, dispatch] = useReducer(canvasReducer, initialState);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save effect
  useEffect(() => {
    // Only auto-save if we have a design ID
    if (!state.designId) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer for 2 seconds after changes
    dispatch({ type: "SET_AUTO_SAVING", payload: true });

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const saved = localStorage.getItem("systemDesigns");
        const designs = saved ? JSON.parse(saved) : [];
        const designIndex = designs.findIndex(
          (d: any) => d.id === state.designId
        );

        if (designIndex >= 0) {
          designs[designIndex] = {
            ...designs[designIndex],
            data: {
              cards: state.cards,
              connections: state.connections,
            },
            updatedAt: Date.now(),
            nodesCount: state.cards.length,
            connectionsCount: state.connections.length,
          };
          localStorage.setItem("systemDesigns", JSON.stringify(designs));
        }
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        dispatch({ type: "SET_AUTO_SAVING", payload: false });
      }
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [state.cards, state.connections, state.designId]);

  const addCard = useCallback((card: Card) => {
    dispatch({ type: "ADD_CARD", payload: card });
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<Card>) => {
    dispatch({ type: "UPDATE_CARD", payload: { id, updates } });
  }, []);

  const deleteCard = useCallback((id: string) => {
    dispatch({ type: "DELETE_CARD_WITH_CONNECTIONS", payload: id });
  }, []);

  const moveCard = useCallback((id: string, x: number, y: number) => {
    dispatch({ type: "MOVE_CARD", payload: { id, x, y } });
  }, []);

  const addConnection = useCallback((connection: Connection) => {
    dispatch({ type: "ADD_CONNECTION", payload: connection });
  }, []);

  const deleteConnection = useCallback((id: string) => {
    dispatch({ type: "DELETE_CONNECTION", payload: id });
  }, []);

  const loadDesign = useCallback(
    (cards: Card[], connections: Connection[], designId: string | null) => {
      dispatch({
        type: "LOAD_DESIGN",
        payload: { cards, connections, designId },
      });
    },
    []
  );

  const clearCanvas = useCallback(() => {
    dispatch({ type: "CLEAR_CANVAS" });
  }, []);

  const saveDesign = useCallback(async () => {
    if (!state.designId) return;

    dispatch({ type: "SET_AUTO_SAVING", payload: true });
    try {
      const saved = localStorage.getItem("systemDesigns");
      const designs = saved ? JSON.parse(saved) : [];
      const designIndex = designs.findIndex(
        (d: any) => d.id === state.designId
      );

      if (designIndex >= 0) {
        designs[designIndex] = {
          ...designs[designIndex],
          data: {
            cards: state.cards,
            connections: state.connections,
          },
          updatedAt: Date.now(),
          nodesCount: state.cards.length,
          connectionsCount: state.connections.length,
        };
        localStorage.setItem("systemDesigns", JSON.stringify(designs));
      }
    } finally {
      dispatch({ type: "SET_AUTO_SAVING", payload: false });
    }
  }, [state.cards, state.connections, state.designId]);

  const value: CanvasContextType = useMemo(
    () => ({
      state,
      addCard,
      updateCard,
      deleteCard,
      moveCard,
      addConnection,
      deleteConnection,
      loadDesign,
      clearCanvas,
      saveDesign,
    }),
    [
      state,
      addCard,
      updateCard,
      deleteCard,
      moveCard,
      addConnection,
      deleteConnection,
      loadDesign,
      clearCanvas,
      saveDesign,
    ]
  );

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
}

export function useCanvas(): CanvasContextType {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within CanvasProvider");
  }
  return context;
}
