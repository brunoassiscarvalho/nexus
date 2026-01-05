import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFlow } from "../contexts/FlowContext";
import { CardSidebar } from "../components/CardSidebar";
import { FlowCanvas } from "../components/FlowCanvas";
import { Button } from "../components/ui/button";
import { Home } from "lucide-react";

export function CanvasPage() {
  const { designId } = useParams<{ designId: string }>();
  const navigate = useNavigate();
  const { loadDesign, currentDesign } = useFlow();

  useEffect(() => {
    if (designId) {
      loadDesign(designId);
    }
  }, [designId, loadDesign]);

  const handleBackToDesigns = () => {
    navigate("/designs");
  };

  if (!currentDesign) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading design...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-background border-b border-border px-4 py-2 flex items-center gap-2 z-50">
        <Button variant="ghost" size="sm" onClick={handleBackToDesigns}>
          <Home className="w-4 h-4 mr-2" />
          Back to Designs
        </Button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <CardSidebar />
        <FlowCanvas />
      </div>
    </>
  );
}
