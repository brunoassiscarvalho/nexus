import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CardSidebar } from "./components/CardSidebar";
import { FlowCanvas } from "./components/FlowCanvas";
import { ComponentDetailPage } from "./components/ComponentDetailPage";
import { ComponentEditPage } from "./components/ComponentEditPage";
import { DesignsListPage, Design } from "./components/DesignsListPage";
import { CardType } from "./components/CardSidebar";
import { Button, Toaster } from "@nexus/ui";
import { Home } from "lucide-react";

type Page = "list" | "canvas" | "detail" | "edit";

interface ComponentData {
  id: string;
  type: CardType;
  label: string;
  description?: string;
  x: number;
  y: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("list");
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);

  // Listen for component double-click events from FlowCanvas
  useEffect(() => {
    const handleOpenDetail = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      setSelectedComponentId(customEvent.detail.id);
      setCurrentPage("detail");
    };

    window.addEventListener("openComponentDetail", handleOpenDetail);
    return () =>
      window.removeEventListener("openComponentDetail", handleOpenDetail);
  }, []);

  // Get selected component data
  const selectedComponent = selectedComponentId
    ? components.find((c) => c.id === selectedComponentId)
    : null;

  const handleBackToCanvas = () => {
    setCurrentPage("canvas");
    setSelectedComponentId(null);
  };

  const handleBackToList = () => {
    setCurrentPage("list");
    setSelectedComponentId(null);
    setCurrentDesignId(null);
  };

  const handleCreateNew = () => {
    setCurrentDesignId(null);
    setCurrentPage("canvas");
    // Dispatch event to clear canvas
    window.dispatchEvent(new CustomEvent("clearCanvas"));
  };

  const handleSelectDesign = (design: Design) => {
    setCurrentDesignId(design.id);
    setCurrentPage("canvas");
    // Dispatch event to load design
    window.dispatchEvent(new CustomEvent("loadDesign", { detail: design }));
  };

  const handleEditComponent = () => {
    setCurrentPage("edit");
  };

  const handleBackToDetail = () => {
    setCurrentPage("detail");
  };

  const handleSaveComponent = (updates: Partial<ComponentData>) => {
    // This will be dispatched to FlowCanvas
    if (selectedComponentId) {
      const event = new CustomEvent("updateComponent", {
        detail: { id: selectedComponentId, updates },
      });
      window.dispatchEvent(event);
    }
    setCurrentPage("detail");
  };

  const handleDeleteComponent = () => {
    // This will be dispatched to FlowCanvas
    if (selectedComponentId) {
      const event = new CustomEvent("deleteComponent", {
        detail: { id: selectedComponentId },
      });
      window.dispatchEvent(event);
    }
    handleBackToCanvas();
  };

  // Sync components from FlowCanvas
  useEffect(() => {
    const handleComponentsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ components: ComponentData[] }>;
      setComponents(customEvent.detail.components);
    };

    window.addEventListener("componentsUpdated", handleComponentsUpdate);
    return () =>
      window.removeEventListener("componentsUpdated", handleComponentsUpdate);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="size-full flex flex-col">
        {/* Header with back button */}
        {currentPage !== "list" && (
          <div className="bg-background border-b border-border px-4 py-2 flex items-center gap-2 z-50">
            <Button variant="ghost" size="sm" onClick={handleBackToList}>
              <Home className="w-4 h-4 mr-2" />
              Back to Designs
            </Button>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {currentPage === "list" && (
            <DesignsListPage
              onSelectDesign={handleSelectDesign}
              onCreateNew={handleCreateNew}
            />
          )}

          {currentPage === "canvas" && (
            <>
              <CardSidebar />
              <FlowCanvas />
            </>
          )}

          {currentPage === "detail" && selectedComponent && (
            <ComponentDetailPage
              component={selectedComponent}
              onBack={handleBackToCanvas}
              onEdit={handleEditComponent}
            />
          )}

          {currentPage === "edit" && selectedComponent && (
            <ComponentEditPage
              component={selectedComponent}
              onBack={handleBackToDetail}
              onSave={handleSaveComponent}
              onDelete={handleDeleteComponent}
            />
          )}
        </div>
      </div>
      <Toaster />
    </DndProvider>
  );
}
