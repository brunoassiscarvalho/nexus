import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FlowProvider } from "./contexts/FlowContext";
import { DesignsListPage } from "./pages/DesignsListPage";
import { CanvasPage } from "./pages/CanvasPage";
import { ComponentDetailPage } from "./pages/ComponentDetailPage";
import { ComponentEditPage } from "./pages/ComponentEditPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <BrowserRouter>
      <FlowProvider>
        <DndProvider backend={HTML5Backend}>
          <div className="size-full flex flex-col">
            <Routes>
              <Route path="/" element={<Navigate to="/designs" replace />} />
              <Route path="/designs" element={<DesignsListPage />} />
              <Route path="/designs/:designId" element={<CanvasPage />} />
              <Route
                path="/designs/:designId/component/:componentId"
                element={<ComponentDetailPage />}
              />
              <Route
                path="/designs/:designId/component/:componentId/edit"
                element={<ComponentEditPage />}
              />
            </Routes>
          </div>
          <Toaster />
        </DndProvider>
      </FlowProvider>
    </BrowserRouter>
  );
}
