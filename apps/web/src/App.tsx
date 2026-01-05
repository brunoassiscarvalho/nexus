import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CardSidebar, CardType } from "./components/CardSidebar";
import { CanvasWithWebSocket } from "./components/CanvasWithWebSocket";
import { ComponentDetailPage } from "./components/ComponentDetailPage";
import { ComponentEditPage } from "./components/ComponentEditPage";
import { DesignsListPage, Design } from "./components/DesignsListPage";
import { CreateDesignDialog } from "./components/CreateDesignDialog";
import { ConnectionIndicator } from "./components/ConnectionIndicator";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Home } from "lucide-react";
import { toast } from "sonner";
import { CanvasProvider, useCanvas } from "./contexts/CanvasContext";

type Page = "list" | "canvas" | "detail" | "edit";

interface ComponentData {
  id: string;
  type: CardType;
  label: string;
  description?: string;
  x: number;
  y: number;
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("list");
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { state, loadDesign, clearCanvas, updateCard, deleteCard, saveDesign } =
    useCanvas();

  // Get selected component from canvas state
  const selectedComponent = selectedComponentId
    ? state.cards.find((c) => c.id === selectedComponentId)
    : null;

  const handleBackToCanvas = () => {
    setCurrentPage("canvas");
    setSelectedComponentId(null);
  };

  const handleBackToList = async () => {
    // Save current design before navigating away
    if (currentPage === "canvas" && state.designId) {
      await saveDesign();
    }
    setCurrentPage("list");
    setSelectedComponentId(null);
  };

  const handleCreateNew = () => {
    setCreateDialogOpen(true);
  };

  const handleConfirmCreate = (name: string, description: string) => {
    try {
      const saved = localStorage.getItem("systemDesigns");
      const designs = saved ? JSON.parse(saved) : [];

      const designId = `design-${Date.now()}`;
      const newDesign: Design = {
        id: designId,
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

      designs.push(newDesign);
      localStorage.setItem("systemDesigns", JSON.stringify(designs));

      toast.success("Design created successfully");
      setCreateDialogOpen(false);

      // Load the new design
      clearCanvas();
      loadDesign([], [], designId);
      setCurrentPage("canvas");
    } catch (error) {
      console.error("Failed to create design:", error);
      toast.error("Failed to create design");
    }
  };

  const handleSelectDesign = (design: Design) => {
    loadDesign(design.data.cards, design.data.connections, design.id);
    setCurrentPage("canvas");
  };

  const handleEditComponent = () => {
    setCurrentPage("edit");
  };

  const handleBackToDetail = () => {
    setCurrentPage("detail");
  };

  const handleSaveComponent = (updates: Partial<ComponentData>) => {
    if (selectedComponentId) {
      updateCard(selectedComponentId, updates);
    }
    setCurrentPage("detail");
  };

  const handleDeleteComponent = () => {
    if (selectedComponentId) {
      deleteCard(selectedComponentId);
    }
    handleBackToCanvas();
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-background">
      {/* Header */}
      {currentPage !== "list" && (
        <header className="flex items-center justify-between px-4 py-2 border-b border-border h-14 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={handleBackToList}>
            <Home className="w-4 h-4 mr-2" />
            Back to Designs
          </Button>
          {currentPage === "canvas" && <ConnectionIndicator />}
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {currentPage === "list" && (
          <DesignsListPage
            onSelectDesign={handleSelectDesign}
            onCreateNew={handleCreateNew}
          />
        )}

        {currentPage === "canvas" && (
          <div className="w-full h-full flex overflow-hidden">
            <CardSidebar />
            <CanvasWithWebSocket onSelectComponent={setSelectedComponentId} />
          </div>
        )}

        {currentPage === "detail" && selectedComponent && (
          <ComponentDetailPage
            component={selectedComponent}
            onBack={handleBackToCanvas}
            onEdit={handleEditComponent}
          />
        )}

        {currentPage === "edit" && selectedComponent && (
          <>
            <div className="flex-1 flex overflow-hidden">
              <CardSidebar />
              <CanvasWithWebSocket onSelectComponent={setSelectedComponentId} />
            </div>
            <aside className="w-80 border-l border-border flex flex-col overflow-hidden flex-shrink-0">
              <ComponentEditPage
                component={selectedComponent}
                onBack={handleBackToDetail}
                onSave={handleSaveComponent}
                onDelete={handleDeleteComponent}
              />
            </aside>
          </>
        )}
      </main>

      <Toaster />
      <CreateDesignDialog
        open={createDialogOpen}
        onConfirm={handleConfirmCreate}
        onCancel={() => setCreateDialogOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <CanvasProvider>
        <AppContent />
      </CanvasProvider>
    </DndProvider>
  );
}
