import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CardType } from '../components/CardSidebar';

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
  label?: string;
  description?: string;
  protocol?: string;
}

export interface Design {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  nodesCount: number;
  connectionsCount: number;
  data: {
    cards: Card[];
    connections: Connection[];
  };
}

interface FlowContextType {
  // Current design
  currentDesign: Design | null;
  setCurrentDesign: (design: Design | null) => void;
  
  // All designs
  designs: Design[];
  loadDesigns: () => void;
  
  // Design operations
  createDesign: (name: string, description?: string) => Promise<Design>;
  updateDesign: (id: string, updates: Partial<Design>) => Promise<void>;
  deleteDesign: (id: string) => Promise<void>;
  loadDesign: (id: string) => Promise<Design | null>;
  
  // Canvas data operations
  updateCanvasData: (cards: Card[], connections: Connection[]) => void;
  
  // Auto-save
  autoSave: () => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);

  // Load all designs from localStorage
  const loadDesigns = useCallback(() => {
    try {
      const saved = localStorage.getItem('systemDesigns');
      const loadedDesigns = saved ? JSON.parse(saved) : [];
      setDesigns(loadedDesigns);
    } catch (error) {
      console.error('Failed to load designs:', error);
      setDesigns([]);
    }
  }, []);

  // Load designs on mount
  useEffect(() => {
    loadDesigns();
  }, [loadDesigns]);

  // Create a new design
  const createDesign = useCallback(async (name: string, description?: string): Promise<Design> => {
    const newDesign: Design = {
      id: `design-${Date.now()}`,
      name,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      nodesCount: 0,
      connectionsCount: 0,
      data: {
        cards: [],
        connections: [],
      },
    };

    const saved = localStorage.getItem('systemDesigns');
    const allDesigns = saved ? JSON.parse(saved) : [];
    allDesigns.push(newDesign);
    localStorage.setItem('systemDesigns', JSON.stringify(allDesigns));

    setDesigns(allDesigns);
    setCurrentDesign(newDesign);

    return newDesign;
  }, []);

  // Update an existing design
  const updateDesign = useCallback(async (id: string, updates: Partial<Design>) => {
    const saved = localStorage.getItem('systemDesigns');
    const allDesigns = saved ? JSON.parse(saved) : [];
    
    const index = allDesigns.findIndex((d: Design) => d.id === id);
    if (index >= 0) {
      allDesigns[index] = {
        ...allDesigns[index],
        ...updates,
        updatedAt: Date.now(),
      };
      
      localStorage.setItem('systemDesigns', JSON.stringify(allDesigns));
      setDesigns(allDesigns);
      
      // Update current design if it's the one being updated
      if (currentDesign && currentDesign.id === id) {
        setCurrentDesign(allDesigns[index]);
      }
    }
  }, [currentDesign]);

  // Delete a design
  const deleteDesign = useCallback(async (id: string) => {
    const saved = localStorage.getItem('systemDesigns');
    const allDesigns = saved ? JSON.parse(saved) : [];
    
    const filteredDesigns = allDesigns.filter((d: Design) => d.id !== id);
    localStorage.setItem('systemDesigns', JSON.stringify(filteredDesigns));
    
    setDesigns(filteredDesigns);
    
    // Clear current design if it was deleted
    if (currentDesign && currentDesign.id === id) {
      setCurrentDesign(null);
    }
  }, [currentDesign]);

  // Load a specific design
  const loadDesign = useCallback(async (id: string): Promise<Design | null> => {
    const saved = localStorage.getItem('systemDesigns');
    const allDesigns = saved ? JSON.parse(saved) : [];
    
    const design = allDesigns.find((d: Design) => d.id === id);
    if (design) {
      setCurrentDesign(design);
      return design;
    }
    
    return null;
  }, []);

  // Update canvas data for current design
  const updateCanvasData = useCallback((cards: Card[], connections: Connection[]) => {
    if (currentDesign) {
      const updatedDesign = {
        ...currentDesign,
        data: { cards, connections },
        nodesCount: cards.length,
        connectionsCount: connections.length,
        updatedAt: Date.now(),
      };
      
      setCurrentDesign(updatedDesign);
    }
  }, [currentDesign]);

  // Auto-save current design
  const autoSave = useCallback(() => {
    if (currentDesign) {
      const saved = localStorage.getItem('systemDesigns');
      const allDesigns = saved ? JSON.parse(saved) : [];
      
      const index = allDesigns.findIndex((d: Design) => d.id === currentDesign.id);
      if (index >= 0) {
        allDesigns[index] = currentDesign;
        localStorage.setItem('systemDesigns', JSON.stringify(allDesigns));
        setDesigns(allDesigns);
      }
    }
  }, [currentDesign]);

  const value: FlowContextType = {
    currentDesign,
    setCurrentDesign,
    designs,
    loadDesigns,
    createDesign,
    updateDesign,
    deleteDesign,
    loadDesign,
    updateCanvasData,
    autoSave,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
}
